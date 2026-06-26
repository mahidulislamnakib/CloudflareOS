interface Env {
  TURNSTILE_SECRET_KEY: string;
}

type FormInput = {
  name?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
};

function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

async function readJson(request: Request): Promise<FormInput | null> {
  try {
    return await request.json<FormInput>();
  } catch {
    return null;
  }
}

function validateInput(input: FormInput | null) {
  if (!input) return "Invalid JSON body";
  if (!input.name || input.name.trim().length < 2) return "name is required";
  if (!input.email || !input.email.includes("@")) return "valid email is required";
  if (!input.message || input.message.trim().length < 5) return "message is required";
  if (!input.turnstileToken) return "turnstileToken is required";
  return null;
}

async function verifyTurnstile(token: string, secret: string, ip?: string) {
  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });

  return response.json<{ success: boolean }>();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "turnstile-form-starter" });
    }

    if (url.pathname !== "/submit") {
      return json({ ok: false, error: "Not Found" }, { status: 404 });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method Not Allowed" }, { status: 405 });
    }

    const input = await readJson(request);
    const validationError = validateInput(input);

    if (validationError || !input) {
      return json({ ok: false, error: validationError }, { status: 400 });
    }

    const ip = request.headers.get("CF-Connecting-IP") || undefined;
    const verification = await verifyTurnstile(
      input.turnstileToken!,
      env.TURNSTILE_SECRET_KEY,
      ip,
    );

    if (!verification.success) {
      return json({ ok: false, error: "Turnstile verification failed" }, { status: 400 });
    }

    return json({
      ok: true,
      message: "Form submitted successfully",
    });
  },
};
