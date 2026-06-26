interface Env {
  COUNTER_OBJECT: DurableObjectNamespace<CounterObject>;
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

export class CounterObject implements DurableObject {
  constructor(private state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET") {
      const count = (await this.state.storage.get<number>("count")) || 0;
      return json({ ok: true, count });
    }

    if (request.method === "POST" && url.pathname.endsWith("/increment")) {
      const current = (await this.state.storage.get<number>("count")) || 0;
      const next = current + 1;
      await this.state.storage.put("count", next);
      return json({ ok: true, count: next });
    }

    return json({ ok: false, error: "Not Found" }, { status: 404 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "durable-object-starter" });
    }

    const match = url.pathname.match(/^\/counter\/([a-zA-Z0-9_-]+)(\/increment)?$/);

    if (!match) {
      return json({ ok: false, error: "Not Found" }, { status: 404 });
    }

    const objectName = match[1];
    const objectId = env.COUNTER_OBJECT.idFromName(objectName);
    const object = env.COUNTER_OBJECT.get(objectId);

    return object.fetch(request);
  },
};
