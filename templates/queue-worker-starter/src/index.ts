export interface Env {
  DB: D1Database;
  JOBS: Queue<BackgroundJob>;
  ADMIN_API_TOKEN?: string;
}

type JobKind = "email" | "report" | "image";
type JobStatus = "queued" | "processing" | "completed" | "retrying" | "dead_lettered" | "enqueue_failed";

type BackgroundJob = {
  jobId: string;
  kind: JobKind;
  payload: Record<string, unknown>;
  createdAt: string;
};

type JobRow = {
  job_id: string;
  kind: JobKind;
  status: JobStatus;
  attempts: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  dead_lettered_at: string | null;
  last_error: string | null;
};

type QueueJobMessage = MessageBatch<BackgroundJob>["messages"][number];

const PRIMARY_QUEUE_NAME = "background-jobs";
const DEAD_LETTER_QUEUE_NAME = "background-jobs-dlq";
const MAX_JOB_PAYLOAD_BYTES = 16 * 1024;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
    },
  });
}

function apiError(
  code: string,
  message: string,
  status: number,
  fields?: Record<string, string>,
): Response {
  return json(
    {
      error: {
        code,
        message,
        ...(fields ? { fields } : {}),
      },
    },
    status,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

function isAdmin(request: Request, env: Env): boolean {
  const expected = env.ADMIN_API_TOKEN;
  const authorization = request.headers.get("authorization");

  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  return safeEqual(authorization.slice("Bearer ".length), expected);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isJobKind(value: unknown): value is JobKind {
  return value === "email" || value === "report" || value === "image";
}

function isBackgroundJob(value: unknown): value is BackgroundJob {
  if (!isRecord(value)) return false;

  return (
    typeof value.jobId === "string" &&
    isUuid(value.jobId) &&
    isJobKind(value.kind) &&
    isRecord(value.payload) &&
    typeof value.createdAt === "string"
  );
}

function serializeJob(row: JobRow) {
  return {
    jobId: row.job_id,
    kind: row.kind,
    status: row.status,
    attempts: row.attempts,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    deadLetteredAt: row.dead_lettered_at,
    lastError: row.last_error,
  };
}

function safeErrorSummary(): string {
  return "Background job handler failed. Review structured Worker logs and job configuration.";
}

function retryDelay(attempts: number): number {
  const exponent = Math.min(Math.max(attempts - 1, 0), 6);
  return Math.min(5 * 2 ** exponent, 300);
}

async function readJsonBody(request: Request): Promise<Record<string, unknown> | Response> {
  try {
    const body: unknown = await request.json();
    if (!isRecord(body)) return apiError("VALIDATION_FAILED", "Send a JSON object.", 400);
    return body;
  } catch {
    return apiError("INVALID_JSON", "Send valid JSON.", 400);
  }
}

function validateJobInput(input: Record<string, unknown>): {
  value?: Pick<BackgroundJob, "kind" | "payload">;
  fields: Record<string, string>;
} {
  const fields: Record<string, string> = {};
  const allowedKeys = new Set(["kind", "payload"]);

  for (const key of Object.keys(input)) {
    if (!allowedKeys.has(key)) fields[key] = "This field cannot be set through this endpoint.";
  }

  if (!isJobKind(input.kind)) {
    fields.kind = "Kind must be email, report, or image.";
  }

  if (!isRecord(input.payload)) {
    fields.payload = "Payload must be a JSON object.";
  }

  if (Object.keys(fields).length > 0 || !isJobKind(input.kind) || !isRecord(input.payload)) {
    return { fields };
  }

  try {
    const byteLength = new TextEncoder().encode(JSON.stringify(input.payload)).byteLength;
    if (byteLength > MAX_JOB_PAYLOAD_BYTES) {
      return {
        fields: {
          payload: `Payload must be ${MAX_JOB_PAYLOAD_BYTES} bytes or smaller. Store large inputs elsewhere and queue a reference.`,
        },
      };
    }
  } catch {
    return { fields: { payload: "Payload must be JSON serializable." } };
  }

  return {
    value: {
      kind: input.kind,
      payload: input.payload,
    },
    fields,
  };
}

async function enqueueJob(request: Request, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  if (body instanceof Response) return body;

  const { value, fields } = validateJobInput(body);
  if (!value || Object.keys(fields).length > 0) {
    return apiError("VALIDATION_FAILED", "Please correct the highlighted fields.", 400, fields);
  }

  const now = new Date().toISOString();
  const job: BackgroundJob = {
    jobId: crypto.randomUUID(),
    kind: value.kind,
    payload: value.payload,
    createdAt: now,
  };
  const payloadJson = JSON.stringify(job.payload);

  await env.DB.prepare(
    `INSERT INTO background_jobs
      (job_id, kind, payload_json, status, attempts, created_at, updated_at)
     VALUES (?, ?, ?, 'queued', 0, ?, ?)`,
  )
    .bind(job.jobId, job.kind, payloadJson, now, now)
    .run();

  try {
    await env.JOBS.send(job);
  } catch (error) {
    console.error("background_job_enqueue_failed", {
      jobId: job.jobId,
      kind: job.kind,
      message: error instanceof Error ? error.message : "unknown error",
    });

    await env.DB.prepare(
      `UPDATE background_jobs
       SET status = 'enqueue_failed', updated_at = ?, last_error = ?
       WHERE job_id = ?`,
    )
      .bind(now, "Queue publishing failed. Review configuration before manual recovery.", job.jobId)
      .run();

    return apiError(
      "QUEUE_UNAVAILABLE",
      "The job was recorded but could not be queued. Review configuration before retrying.",
      503,
    );
  }

  return json(
    {
      data: {
        jobId: job.jobId,
        kind: job.kind,
        status: "queued",
        createdAt: job.createdAt,
      },
    },
    202,
  );
}

async function getJob(jobId: string, env: Env): Promise<Response> {
  const row = await env.DB.prepare(
    `SELECT job_id, kind, status, attempts, created_at, updated_at, completed_at, dead_lettered_at, last_error
     FROM background_jobs
     WHERE job_id = ?
     LIMIT 1`,
  )
    .bind(jobId)
    .first<JobRow>();

  if (!row) return apiError("NOT_FOUND", "The requested job was not found.", 404);
  return json({ data: serializeJob(row) });
}

async function ensureJobRecord(job: BackgroundJob, env: Env): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO background_jobs
      (job_id, kind, payload_json, status, attempts, created_at, updated_at)
     VALUES (?, ?, ?, 'queued', 0, ?, ?)
     ON CONFLICT(job_id) DO NOTHING`,
  )
    .bind(job.jobId, job.kind, JSON.stringify(job.payload), job.createdAt, job.createdAt)
    .run();
}

async function performJob(job: BackgroundJob): Promise<void> {
  if (job.payload.simulateFailure === true) {
    throw new Error("Intentional local retry and dead-letter simulation.");
  }

  // Replace this switch with one explicitly validated provider integration at a time.
  // Do not log raw private payload values or secrets.
  console.log("background_job_placeholder_completed", {
    jobId: job.jobId,
    kind: job.kind,
    payloadKeys: Object.keys(job.payload).slice(0, 20),
  });
}

async function processPrimaryMessage(message: QueueJobMessage, env: Env): Promise<void> {
  if (!isBackgroundJob(message.body)) {
    console.error("background_job_invalid_message", { queueMessageId: message.id });
    message.ack();
    return;
  }

  const job = message.body;

  try {
    const existing = await env.DB.prepare(
      `SELECT job_id, kind, status, attempts, created_at, updated_at, completed_at, dead_lettered_at, last_error
       FROM background_jobs
       WHERE job_id = ?
       LIMIT 1`,
    )
      .bind(job.jobId)
      .first<JobRow>();

    if (existing?.status === "completed" || existing?.status === "dead_lettered") {
      message.ack();
      return;
    }

    await ensureJobRecord(job, env);

    const processingAt = new Date().toISOString();
    await env.DB.prepare(
      `UPDATE background_jobs
       SET status = 'processing', attempts = ?, updated_at = ?, last_error = NULL
       WHERE job_id = ?`,
    )
      .bind(message.attempts, processingAt, job.jobId)
      .run();

    await performJob(job);

    const completedAt = new Date().toISOString();
    await env.DB.prepare(
      `UPDATE background_jobs
       SET status = 'completed', attempts = ?, updated_at = ?, completed_at = ?, last_error = NULL
       WHERE job_id = ?`,
    )
      .bind(message.attempts, completedAt, completedAt, job.jobId)
      .run();

    message.ack();
  } catch (error) {
    console.error("background_job_attempt_failed", {
      jobId: job.jobId,
      kind: job.kind,
      attempt: message.attempts,
      message: error instanceof Error ? error.message : "unknown error",
    });

    try {
      const retryAt = new Date().toISOString();
      await ensureJobRecord(job, env);
      await env.DB.prepare(
        `UPDATE background_jobs
         SET status = 'retrying', attempts = ?, updated_at = ?, last_error = ?
         WHERE job_id = ?`,
      )
        .bind(message.attempts, retryAt, safeErrorSummary(), job.jobId)
        .run();
    } catch (trackingError) {
      console.error("background_job_retry_tracking_failed", {
        jobId: job.jobId,
        message: trackingError instanceof Error ? trackingError.message : "unknown error",
      });
    }

    message.retry({ delaySeconds: retryDelay(message.attempts) });
  }
}

async function processDeadLetterMessage(message: QueueJobMessage, env: Env): Promise<void> {
  if (!isBackgroundJob(message.body)) {
    console.error("background_job_invalid_dead_letter_message", { queueMessageId: message.id });
    message.ack();
    return;
  }

  const job = message.body;

  try {
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO background_jobs
        (job_id, kind, payload_json, status, attempts, created_at, updated_at, dead_lettered_at, last_error)
       VALUES (?, ?, ?, 'dead_lettered', ?, ?, ?, ?, ?)
       ON CONFLICT(job_id) DO UPDATE SET
         status = 'dead_lettered',
         attempts = excluded.attempts,
         updated_at = excluded.updated_at,
         dead_lettered_at = excluded.dead_lettered_at,
         last_error = excluded.last_error`,
    )
      .bind(
        job.jobId,
        job.kind,
        JSON.stringify(job.payload),
        message.attempts,
        job.createdAt,
        now,
        now,
        "Primary queue retry budget exhausted. Review before requeueing.",
      )
      .run();

    console.warn("background_job_dead_lettered", {
      jobId: job.jobId,
      kind: job.kind,
      attempts: message.attempts,
    });
    message.ack();
  } catch (error) {
    console.error("background_job_dead_letter_tracking_failed", {
      jobId: job.jobId,
      message: error instanceof Error ? error.message : "unknown error",
    });
    message.retry({ delaySeconds: 60 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: { allow: "GET, POST, OPTIONS" } });
      }

      if (request.method === "GET" && path === "/health") {
        return json({ data: { ok: true, service: "queue-worker-starter" } });
      }

      if (!path.startsWith("/api/admin/")) {
        return apiError("NOT_FOUND", "Route not found.", 404);
      }

      if (!isAdmin(request, env)) {
        return apiError("UNAUTHENTICATED", "A valid admin token is required.", 401);
      }

      if (request.method === "POST" && path === "/api/admin/jobs") {
        return enqueueJob(request, env);
      }

      const jobMatch = /^\/api\/admin\/jobs\/([^/]+)$/.exec(path);
      if (request.method === "GET" && jobMatch) {
        const jobId = decodeURIComponent(jobMatch[1]);
        if (!isUuid(jobId)) return apiError("VALIDATION_FAILED", "The job ID is invalid.", 400);
        return getJob(jobId, env);
      }

      return apiError("METHOD_NOT_ALLOWED", "This method is not allowed for the requested route.", 405);
    } catch (error) {
      console.error("background_job_http_request_failed", {
        method: request.method,
        message: error instanceof Error ? error.message : "unknown error",
      });
      return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500);
    }
  },

  async queue(batch, env): Promise<void> {
    if (batch.queue === PRIMARY_QUEUE_NAME) {
      for (const message of batch.messages) {
        await processPrimaryMessage(message, env);
      }
      return;
    }

    if (batch.queue === DEAD_LETTER_QUEUE_NAME) {
      for (const message of batch.messages) {
        await processDeadLetterMessage(message, env);
      }
      return;
    }

    console.error("background_job_unknown_queue", { queue: batch.queue });
    batch.ackAll();
  },
} satisfies ExportedHandler<Env, BackgroundJob>;
