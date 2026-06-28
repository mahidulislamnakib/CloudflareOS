import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

import { projectCoach, type ProjectCoachEnv } from "../src/project-coach";

type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

const enabledCoachEnv = {
  AI_PREVIEW_ENABLED: "true",
  AI: {
    run: async () => {
      throw new Error("AI must not run for rejected input.");
    },
  },
} as unknown as ProjectCoachEnv;

describe("DeveloperB workspace API", () => {
  it("returns an operational health response", async () => {
    const response = await SELF.fetch("https://developerb.test/api/health");
    const payload = (await response.json()) as {
      data: { ok: boolean; service: string; timestamp: string };
    };

    expect(response.status).toBe(200);
    expect(payload.data.ok).toBe(true);
    expect(payload.data.service).toBe("developerb-workspace");
    expect(Number.isNaN(Date.parse(payload.data.timestamp))).toBe(false);
  });

  it("keeps the AI guide closed until preview protection is explicitly enabled", async () => {
    const response = await SELF.fetch("https://developerb.test/api/ai/coach", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "I need a tool for my daily work." }),
    });
    const payload = (await response.json()) as ApiError;

    expect(response.status).toBe(503);
    expect(payload.error.code).toBe("AI_PREVIEW_DISABLED");
  });

  it("rejects unexpected AI request fields before calling Workers AI", async () => {
    const response = await projectCoach(
      new Request("https://developerb.test/api/ai/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: "I need a tool for my daily work.",
          unapprovedField: true,
        }),
      }),
      enabledCoachEnv,
    );
    const payload = (await response.json()) as ApiError;

    expect(response.status).toBe(422);
    expect(payload.error.code).toBe("VALIDATION_FAILED");
  });

  it("rejects oversized AI requests before parsing or calling Workers AI", async () => {
    const response = await projectCoach(
      new Request("https://developerb.test/api/ai/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "a".repeat(5000) }),
      }),
      enabledCoachEnv,
    );
    const payload = (await response.json()) as ApiError;

    expect(response.status).toBe(413);
    expect(payload.error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("returns a stable JSON error for unknown API routes", async () => {
    const response = await SELF.fetch("https://developerb.test/api/unknown");
    const payload = (await response.json()) as ApiError;

    expect(response.status).toBe(404);
    expect(payload.error.code).toBe("NOT_FOUND");
  });
});
