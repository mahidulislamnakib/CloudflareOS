export interface Env {
  DB: D1Database;
  ADMIN_API_TOKEN?: string;
}

type PostStatus = "draft" | "published";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: PostStatus;
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "no-store",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function apiError(code: string, message: string, status: number, fields?: Record<string, string>): Response {
  return json(
    {
      error: {
        code,
        message,
        ...(fields ? { fields } : {}),
      },
    },
    status,
  );
}

function serializePost(post: PostRow) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    status: post.status,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    publishedAt: post.published_at,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwn(input: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(input, key);
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

function isAdmin(request: Request, env: Env): boolean {
  const expected = env.ADMIN_API_TOKEN;
  const header = request.headers.get("authorization");
  if (!expected || !header?.startsWith("Bearer ")) return false;

  return safeEqual(header.slice("Bearer ".length), expected);
}

function parseLimit(value: string | null, fallback: number, max: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

function validSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function readText(
  input: Record<string, unknown>,
  key: string,
  options: { required: boolean; max: number },
  fields: Record<string, string>,
): string | undefined {
  const value = input[key];
  if (value === undefined && !options.required) return undefined;

  if (typeof value !== "string") {
    fields[key] = "Enter text for this field.";
    return undefined;
  }

  const cleaned = value.trim();
  if (options.required && !cleaned) {
    fields[key] = "This field is required.";
    return undefined;
  }

  if (cleaned.length > options.max) {
    fields[key] = `Use ${options.max} characters or fewer.`;
    return undefined;
  }

  return cleaned;
}

function readStatus(input: Record<string, unknown>, required: boolean, fields: Record<string, string>): PostStatus | undefined {
  const value = input.status;
  if (value === undefined && !required) return undefined;
  if (value !== "draft" && value !== "published") {
    fields.status = "Status must be draft or published.";
    return undefined;
  }
  return value;
}

function validatePostInput(input: Record<string, unknown>, required: boolean): { value?: Partial<PostInput>; fields: Record<string, string> } {
  const fields: Record<string, string> = {};
  const value: Partial<PostInput> = {};

  const allowedKeys = new Set(["title", "slug", "excerpt", "body", "status"]);
  for (const key of Object.keys(input)) {
    if (!allowedKeys.has(key)) fields[key] = "This field cannot be changed through this endpoint.";
  }

  const title = readText(input, "title", { required, max: 160 }, fields);
  const slug = readText(input, "slug", { required, max: 160 }, fields);
  const excerpt = readText(input, "excerpt", { required: false, max: 500 }, fields);
  const body = readText(input, "body", { required, max: 100_000 }, fields);
  const status = readStatus(input, required, fields);

  if (title !== undefined) value.title = title;
  if (slug !== undefined) {
    if (!validSlug(slug)) fields.slug = "Use lowercase letters, numbers, and single hyphens only.";
    else value.slug = slug;
  }
  if (excerpt !== undefined) value.excerpt = excerpt;
  if (body !== undefined) value.body = body;
  if (status !== undefined) value.status = status;

  return { value, fields };
}

async function readJsonBody(request: Request): Promise<Record<string, unknown> | Response> {
  try {
    const body: unknown = await request.json();
    if (!isRecord(body)) return apiError("VALIDATION_FAILED", "Send a JSON object.", 400);
    return body;
  } catch {
    return apiError("INVALID_JSON", "Send valid JSON.", 400);
  }
}

async function listPublicPosts(url: URL, env: Env): Promise<Response> {
  const limit = parseLimit(url.searchParams.get("limit"), 20, 50);
  const result = await env.DB.prepare(
    `SELECT id, slug, title, excerpt, body, status, created_at, updated_at, published_at
     FROM posts
     WHERE status = 'published'
     ORDER BY published_at DESC, id DESC
     LIMIT ?`,
  )
    .bind(limit)
    .all<PostRow>();

  return json({
    data: result.results.map((post) => {
      const { body: _body, ...summary } = serializePost(post);
      return summary;
    }),
    meta: { limit },
  });
}

async function getPublicPost(slug: string, env: Env): Promise<Response> {
  const post = await env.DB.prepare(
    `SELECT id, slug, title, excerpt, body, status, created_at, updated_at, published_at
     FROM posts
     WHERE slug = ? AND status = 'published'
     LIMIT 1`,
  )
    .bind(slug)
    .first<PostRow>();

  if (!post) return apiError("NOT_FOUND", "The requested post was not found.", 404);
  return json({ data: serializePost(post) });
}

async function listAdminPosts(url: URL, env: Env): Promise<Response> {
  const limit = parseLimit(url.searchParams.get("limit"), 50, 100);
  const result = await env.DB.prepare(
    `SELECT id, slug, title, excerpt, body, status, created_at, updated_at, published_at
     FROM posts
     ORDER BY updated_at DESC, id DESC
     LIMIT ?`,
  )
    .bind(limit)
    .all<PostRow>();

  return json({ data: result.results.map(serializePost), meta: { limit } });
}

async function createPost(request: Request, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  if (body instanceof Response) return body;

  const { value, fields } = validatePostInput(body, true);
  if (Object.keys(fields).length > 0 || !value.title || !value.slug || !value.body || !value.status) {
    return apiError("VALIDATION_FAILED", "Please correct the highlighted fields.", 400, fields);
  }

  const now = new Date().toISOString();
  const post: PostRow = {
    id: crypto.randomUUID(),
    title: value.title,
    slug: value.slug,
    excerpt: value.excerpt ?? "",
    body: value.body,
    status: value.status,
    created_at: now,
    updated_at: now,
    published_at: value.status === "published" ? now : null,
  };

  try {
    await env.DB.prepare(
      `INSERT INTO posts (id, slug, title, excerpt, body, status, created_at, updated_at, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        post.id,
        post.slug,
        post.title,
        post.excerpt,
        post.body,
        post.status,
        post.created_at,
        post.updated_at,
        post.published_at,
      )
      .run();
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return apiError("CONFLICT", "A post already uses this slug.", 409, { slug: "Choose a unique slug." });
    }
    throw error;
  }

  return json({ data: serializePost(post) }, 201);
}

async function updatePost(id: string, request: Request, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  if (body instanceof Response) return body;

  const existing = await env.DB.prepare(
    `SELECT id, slug, title, excerpt, body, status, created_at, updated_at, published_at
     FROM posts
     WHERE id = ?
     LIMIT 1`,
  )
    .bind(id)
    .first<PostRow>();

  if (!existing) return apiError("NOT_FOUND", "The requested post was not found.", 404);

  const { value, fields } = validatePostInput(body, false);
  if (Object.keys(fields).length > 0) {
    return apiError("VALIDATION_FAILED", "Please correct the highlighted fields.", 400, fields);
  }

  if (Object.keys(value).length === 0) {
    return apiError("VALIDATION_FAILED", "Provide at least one editable field.", 400);
  }

  const status = value.status ?? existing.status;
  const now = new Date().toISOString();
  const updated: PostRow = {
    ...existing,
    title: value.title ?? existing.title,
    slug: value.slug ?? existing.slug,
    excerpt: value.excerpt ?? existing.excerpt,
    body: value.body ?? existing.body,
    status,
    updated_at: now,
    published_at: status === "published" ? existing.published_at ?? now : null,
  };

  try {
    await env.DB.prepare(
      `UPDATE posts
       SET slug = ?, title = ?, excerpt = ?, body = ?, status = ?, updated_at = ?, published_at = ?
       WHERE id = ?`,
    )
      .bind(
        updated.slug,
        updated.title,
        updated.excerpt,
        updated.body,
        updated.status,
        updated.updated_at,
        updated.published_at,
        updated.id,
      )
      .run();
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return apiError("CONFLICT", "A post already uses this slug.", 409, { slug: "Choose a unique slug." });
    }
    throw error;
  }

  return json({ data: serializePost(updated) });
}

async function deletePost(id: string, env: Env): Promise<Response> {
  const result = await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  if (!result.meta.changes) return apiError("NOT_FOUND", "The requested post was not found.", 404);
  return new Response(null, { status: 204 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: { allow: "GET, POST, PATCH, DELETE, OPTIONS" } });
      }

      if (request.method === "GET" && path === "/health") {
        return json({ data: { ok: true } });
      }

      if (request.method === "GET" && path === "/api/posts") {
        return listPublicPosts(url, env);
      }

      const publicPostMatch = /^\/api\/posts\/([^/]+)$/.exec(path);
      if (request.method === "GET" && publicPostMatch) {
        return getPublicPost(decodeURIComponent(publicPostMatch[1]), env);
      }

      if (!path.startsWith("/api/admin/")) {
        return apiError("NOT_FOUND", "Route not found.", 404);
      }

      if (!isAdmin(request, env)) {
        return apiError("UNAUTHENTICATED", "A valid admin token is required.", 401);
      }

      if (path === "/api/admin/posts") {
        if (request.method === "GET") return listAdminPosts(url, env);
        if (request.method === "POST") return createPost(request, env);
      }

      const adminPostMatch = /^\/api\/admin\/posts\/([^/]+)$/.exec(path);
      if (adminPostMatch) {
        const id = decodeURIComponent(adminPostMatch[1]);
        if (request.method === "PATCH") return updatePost(id, request, env);
        if (request.method === "DELETE") return deletePost(id, env);
      }

      return apiError("METHOD_NOT_ALLOWED", "This method is not allowed for the requested route.", 405);
    } catch (error) {
      console.error("mini_cms_request_failed", {
        path,
        method: request.method,
        message: error instanceof Error ? error.message : "unknown error",
      });
      return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500);
    }
  },
};
