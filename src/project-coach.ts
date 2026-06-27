export type ProjectCoachEnv = {
  AI: Ai;
  AI_PREVIEW_ENABLED?: string;
};

const MODEL = "@cf/meta/llama-3.2-1b-instruct";
const MAX_MESSAGE_CHARACTERS = 600;
const MAX_REQUEST_BYTES = 4096;

function response(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function failure(code: string, message: string, status: number): Response {
  return response({ error: { code, message } }, status);
}

function textFromResult(result: unknown): string | null {
  if (!result || typeof result !== "object") return null;
  const text = (result as Record<string, unknown>).response;
  return typeof text === "string" ? text.trim() : null;
}

export async function projectCoach(request: Request, env: ProjectCoachEnv): Promise<Response> {
  if (env.AI_PREVIEW_ENABLED !== "true") {
    return failure("AI_PREVIEW_DISABLED", "DeveloperB Guide is disabled until the private preview is protected and explicitly enabled.", 503);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return failure("UNSUPPORTED_MEDIA_TYPE", "Send application/json.", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return failure("PAYLOAD_TOO_LARGE", "Keep the request under 4 KB.", 413);
  }

  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return failure("INVALID_JSON", "Send valid JSON.", 400);
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return failure("VALIDATION_FAILED", "Send one message field.", 422);
  }

  const record = value as Record<string, unknown>;
  const message = typeof record.message === "string" ? record.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_CHARACTERS || Object.keys(record).length !== 1) {
    return failure("VALIDATION_FAILED", "Message must be between 1 and 600 characters.", 422);
  }

  const prompt = [
    "You are DeveloperB Guide. You help people turn a real-world problem into a clear next decision before they spend money on software.",
    "Do not assume a custom app is needed. Consider: do not build yet, use an existing tool, improve a manual process, automate one workflow, build a small internal tool, or build a software product.",
    "Answer in these short sections: What I understood; Confirmed facts; Assumptions; Questions still unanswered; Solution options; Recommended next step; What not to build yet.",
    "Use simple English. Keep the answer under 180 words. State uncertainty clearly. Do not ask for passwords, secret values, or private account access. Do not claim that a plan is complete or production-ready.",
    "User message:",
    message,
  ].join("\n\n");

  try {
    const result = await env.AI.run(MODEL, { prompt });
    const text = textFromResult(result);
    if (!text) return failure("AI_RESPONSE_INVALID", "No usable response. Try again later.", 502);
    return response({ data: { response: text, model: MODEL } });
  } catch {
    return failure("AI_UNAVAILABLE", "DeveloperB Guide is unavailable. Try again later.", 503);
  }
}
