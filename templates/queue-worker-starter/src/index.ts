type JobType = "example";

type JobMessage = {
  type: JobType;
  payload: Record<string, unknown>;
  createdAt: string;
};

interface Env {
  JOB_QUEUE: Queue<JobMessage>;
}

function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

async function readJson(request: Request) {
  try {
    return await request.json<Partial<JobMessage>>();
  } catch {
    return null;
  }
}

function isValidJob(input: Partial<JobMessage> | null): input is JobMessage {
  return Boolean(
    input &&
      input.type === "example" &&
      input.payload &&
      typeof input.payload === "object",
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "queue-worker-starter" });
    }

    if (url.pathname !== "/jobs") {
      return json({ ok: false, error: "Not Found" }, { status: 404 });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method Not Allowed" }, { status: 405 });
    }

    const input = await readJson(request);

    if (!isValidJob(input)) {
      return json({ ok: false, error: "Invalid job payload" }, { status: 400 });
    }

    const message: JobMessage = {
      type: input.type,
      payload: input.payload,
      createdAt: new Date().toISOString(),
    };

    await env.JOB_QUEUE.send(message);

    return json({ ok: true });
  },

  async queue(batch: MessageBatch<JobMessage>): Promise<void> {
    for (const message of batch.messages) {
      console.log("Processing job", message.body);
      message.ack();
    }
  },
};
