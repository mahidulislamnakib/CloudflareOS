interface Env {
  DB: D1Database;
}

type ItemInput = {
  title?: string;
  body?: string;
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

async function readJson(request: Request): Promise<ItemInput> {
  try {
    return await request.json<ItemInput>();
  } catch {
    return {};
  }
}

function validateItem(input: ItemInput) {
  if (!input.title || input.title.trim().length < 2) {
    return "title is required";
  }

  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "d1-crud-starter" });
    }

    if (url.pathname === "/api/items" && request.method === "GET") {
      const items = await env.DB.prepare(
        "SELECT id, title, body, created_at, updated_at FROM items ORDER BY id DESC LIMIT 50",
      ).all();

      return json({ ok: true, items: items.results });
    }

    if (url.pathname === "/api/items" && request.method === "POST") {
      const input = await readJson(request);
      const error = validateItem(input);

      if (error) {
        return json({ ok: false, error }, { status: 400 });
      }

      const result = await env.DB.prepare(
        "INSERT INTO items (title, body) VALUES (?, ?) RETURNING id, title, body, created_at, updated_at",
      )
        .bind(input.title?.trim(), input.body || null)
        .first();

      return json({ ok: true, item: result }, { status: 201 });
    }

    const itemMatch = url.pathname.match(/^\/api\/items\/(\d+)$/);

    if (itemMatch && request.method === "GET") {
      const item = await env.DB.prepare(
        "SELECT id, title, body, created_at, updated_at FROM items WHERE id = ?",
      )
        .bind(Number(itemMatch[1]))
        .first();

      if (!item) {
        return json({ ok: false, error: "Item not found" }, { status: 404 });
      }

      return json({ ok: true, item });
    }

    if (itemMatch && request.method === "PUT") {
      const input = await readJson(request);
      const error = validateItem(input);

      if (error) {
        return json({ ok: false, error }, { status: 400 });
      }

      const item = await env.DB.prepare(
        "UPDATE items SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, title, body, created_at, updated_at",
      )
        .bind(input.title?.trim(), input.body || null, Number(itemMatch[1]))
        .first();

      if (!item) {
        return json({ ok: false, error: "Item not found" }, { status: 404 });
      }

      return json({ ok: true, item });
    }

    return json({ ok: false, error: "Not Found" }, { status: 404 });
  },
};
