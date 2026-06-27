export type ProjectCoachEnv = {
  AI: Ai;
  AI_PREVIEW_ENABLED?: string;
};

const MODEL = "@cf/meta/llama-3.2-1b-instruct";
const MAX_MESSAGE_CHARACTERS = 600;

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
    return failure("AI_PREVIEW_DISABLED", "Project coach is disabled until the developer preview is protected and enabled.", 503);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return failure("UNSUPPORTED_MEDIA_TYPE", "Send application/json.", 415);
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
    "You are the CloudflareOS Project Coach for developers.",
    "Answer in five short parts: Goal, Smallest next task, Files or settings, Verification, Risk.",
    "Keep it under 140 words and state uncertainty clearly.",
    "Question:",
    message,
  ].join("\n\n");

  try {
    const result = await env.AI.run(MODEL, { prompt });
    const text = textFromResult(result);
    if (!text) return failure("AI_RESPONSE_INVALID", "No usable response. Try again later.", 502);
    return response({ data: { response: text, model: MODEL } });
  } catch {
    return failure("AI_UNAVAILABLE", "Project coach is unavailable. Try again later.", 503);
  }
}
