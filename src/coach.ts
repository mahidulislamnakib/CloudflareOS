export type ProjectCoachRequest = {
  message: string;
};

export const PROJECT_COACH_MODEL = "@cf/meta/llama-3.2-1b-instruct";
export const PROJECT_COACH_MAX_MESSAGE_CHARS = 600;

export function isProjectCoachRequest(value: unknown): value is ProjectCoachRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const record = value as Record<string, unknown>;
  return Object.keys(record).length === 1 && typeof record.message === "string";
}
