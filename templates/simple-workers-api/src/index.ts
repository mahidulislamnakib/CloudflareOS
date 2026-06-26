type Env = Record<string, never>;

function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

function notFound() {
  return json(
    {
      ok: false,
      error: "Not Found",
    },
    { status: 404 },
  );
}

function methodNotAllowed() {
  return json(
    {
      ok: false,
      error: "Method Not Allowed",
    },
    { status: 405 },
  );
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      if (request.method !== "GET") return methodNotAllowed();

      return json({
        ok: true,
        service: "simple-workers-api",
      });
    }

    if (url.pathname === "/api/example") {
      if (request.method !== "GET") return methodNotAllowed();

      return json({
        ok: true,
        message: "Hello from Cloudflare Workers",
      });
    }

    return notFound();
  },
};
