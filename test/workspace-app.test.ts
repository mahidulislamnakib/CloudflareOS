import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

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

  it("returns a stable JSON error for unknown API routes", async () => {
    const response = await SELF.fetch("https://developerb.test/api/unknown");
    const payload = (await response.json()) as ApiError;

    expect(response.status).toBe(404);
    expect(payload.error.code).toBe("NOT_FOUND");
  });
});
