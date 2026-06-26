interface Env {
  CONFIG_KV: KVNamespace;
}

type ValueInput = {
  value?: unknown;
  ttl?: number;
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

async function readJson(request: Request): Promise<ValueInput | null> {
  try {
    return await request.json<ValueInput>();
  } catch {
    return null;
  }
}

function safeKey(prefix: string, key: string) {
  const cleaned = key.toLowerCase().replace(/[^a-z0-9:_-]/g, "-").slice(0, 100);
  return `${prefix}:${cleaned}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "kv-config-cache-starter" });
    }

    const configMatch = url.pathname.match(/^\/config\/([a-zA-Z0-9:_-]+)$/);
    const cacheMatch = url.pathname.match(/^\/cache\/([a-zA-Z0-9:_-]+)$/);

    if (configMatch && request.method === "GET") {
      const key = safeKey("config", configMatch[1]);
      const value = await env.CONFIG_KV.get(key, "json");
      return json({ ok: true, key, value });
    }

    if (configMatch && request.method === "POST") {
      const input = await readJson(request);
      if (!input || typeof input.value === "undefined") {
        return json({ ok: false, error: "value is required" }, { status: 400 });
      }

      const key = safeKey("config", configMatch[1]);
      await env.CONFIG_KV.put(key, JSON.stringify(input.value));
      return json({ ok: true, key });
    }

    if (cacheMatch && request.method === "GET") {
      const key = safeKey("cache", cacheMatch[1]);
      const value = await env.CONFIG_KV.get(key, "json");
      return json({ ok: true, key, value });
    }

    if (cacheMatch && request.method === "POST") {
      const input = await readJson(request);
      if (!input || typeof input.value === "undefined") {
        return json({ ok: false, error: "value is required" }, { status: 400 });
      }

      const key = safeKey("cache", cacheMatch[1]);
      const ttl = typeof input.ttl === "number" ? input.ttl : 300;

      await env.CONFIG_KV.put(key, JSON.stringify(input.value), {
        expirationTtl: ttl,
      });

      return json({ ok: true, key, ttl });
    }

    return json({ ok: false, error: "Not Found" }, { status: 404 });
  },
};
