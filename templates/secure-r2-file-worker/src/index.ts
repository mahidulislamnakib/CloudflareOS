export interface Env {
  FILES: R2Bucket;
  ADMIN_API_TOKEN?: string;
}

type Visibility = "private" | "public";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const SAFE_INLINE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
    },
  });
}

function apiError(code: string, message: string, status: number): Response {
  return json({ error: { code, message } }, status);
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
  const authorization = request.headers.get("authorization");

  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  return safeEqual(authorization.slice("Bearer ".length), expected);
}

function parseKey(rawKey: string): string | null {
  let key: string;
  try {
    key = decodeURIComponent(rawKey);
  } catch {
    return null;
  }

  if (!key || key.length > 512 || !/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(key)) return null;

  const segments = key.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) return null;

  return key;
}

function parseVisibility(value: string | null): Visibility | null {
  if (!value) return "private";
  if (value === "private" || value === "public") return value;
  return null;
}

function parseContentLength(request: Request): number | null {
  const raw = request.headers.get("content-length");
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > MAX_UPLOAD_BYTES) return null;
  return value;
}

function filenameFromKey(key: string): string {
  const source = key.split("/").at(-1) ?? "download";
  return source.replace(/["\\\r\n]/g, "_").slice(0, 180) || "download";
}

function objectVisibility(object: R2Object | R2ObjectBody): Visibility {
  return object.customMetadata?.visibility === "public" ? "public" : "private";
}

function createFileHeaders(object: R2Object | R2ObjectBody, key: string, inline: boolean): Headers {
  const headers = new Headers();
  object.writeHttpMetadata(headers);

  const contentType = object.httpMetadata?.contentType?.toLowerCase() ?? "application/octet-stream";
  const shouldInline = inline && SAFE_INLINE_TYPES.has(contentType);

  headers.set("content-type", contentType);
  headers.set("content-length", String(object.size));
  headers.set("content-disposition", `${shouldInline ? "inline" : "attachment"}; filename="${filenameFromKey(key)}"`);
  headers.set("x-content-type-options", "nosniff");
  headers.set("cache-control", "no-store");
  headers.set("etag", object.httpEtag);
  return headers;
}

async function uploadFile(key: string, request: Request, url: URL, env: Env): Promise<Response> {
  const contentLength = parseContentLength(request);
  if (!contentLength) {
    return apiError(
      "INVALID_UPLOAD_SIZE",
      `Provide a valid Content-Length between 1 byte and ${MAX_UPLOAD_BYTES} bytes.`,
      400,
    );
  }

  if (!request.body) return apiError("EMPTY_UPLOAD", "Upload a non-empty request body.", 400);

  const visibility = parseVisibility(url.searchParams.get("visibility"));
  if (!visibility) return apiError("VALIDATION_FAILED", "Visibility must be private or public.", 400);

  const contentType = request.headers.get("content-type")?.slice(0, 200) || "application/octet-stream";
  const uploadedAt = new Date().toISOString();

  await env.FILES.put(key, request.body, {
    httpMetadata: { contentType },
    customMetadata: { visibility, uploadedAt },
  });

  return json(
    {
      data: {
        key,
        size: contentLength,
        contentType,
        visibility,
        uploadedAt,
      },
    },
    201,
  );
}

async function getAdminFile(key: string, url: URL, env: Env): Promise<Response> {
  const object = await env.FILES.get(key);
  if (!object) return apiError("NOT_FOUND", "The requested file was not found.", 404);

  const inline = url.searchParams.get("inline") === "1";
  return new Response(object.body, { headers: createFileHeaders(object, key, inline) });
}

async function headAdminFile(key: string, env: Env): Promise<Response> {
  const object = await env.FILES.head(key);
  if (!object) return apiError("NOT_FOUND", "The requested file was not found.", 404);

  const headers = createFileHeaders(object, key, false);
  headers.set("x-file-key", key);
  headers.set("x-file-visibility", objectVisibility(object));
  headers.set("x-file-uploaded-at", object.customMetadata?.uploadedAt ?? object.uploaded.toISOString());
  return new Response(null, { status: 200, headers });
}

async function getPublicFile(key: string, url: URL, env: Env): Promise<Response> {
  const object = await env.FILES.get(key);
  if (!object || objectVisibility(object) !== "public") {
    return apiError("NOT_FOUND", "The requested file was not found.", 404);
  }

  const inline = url.searchParams.get("inline") === "1";
  return new Response(object.body, { headers: createFileHeaders(object, key, inline) });
}

async function deleteFile(key: string, env: Env): Promise<Response> {
  const object = await env.FILES.head(key);
  if (!object) return apiError("NOT_FOUND", "The requested file was not found.", 404);

  await env.FILES.delete(key);
  return new Response(null, { status: 204 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: { allow: "GET, HEAD, PUT, DELETE, OPTIONS" },
        });
      }

      if (request.method === "GET" && path === "/health") {
        return json({ data: { ok: true } });
      }

      const publicMatch = /^\/files\/(.+)$/.exec(path);
      if (request.method === "GET" && publicMatch) {
        const key = parseKey(publicMatch[1]);
        if (!key) return apiError("VALIDATION_FAILED", "The file key is invalid.", 400);
        return getPublicFile(key, url, env);
      }

      const adminMatch = /^\/api\/admin\/files\/(.+)$/.exec(path);
      if (!adminMatch) return apiError("NOT_FOUND", "Route not found.", 404);

      if (!isAdmin(request, env)) {
        return apiError("UNAUTHENTICATED", "A valid admin token is required.", 401);
      }

      const key = parseKey(adminMatch[1]);
      if (!key) return apiError("VALIDATION_FAILED", "The file key is invalid.", 400);

      if (request.method === "PUT") return uploadFile(key, request, url, env);
      if (request.method === "HEAD") return headAdminFile(key, env);
      if (request.method === "GET") return getAdminFile(key, url, env);
      if (request.method === "DELETE") return deleteFile(key, env);

      return apiError("METHOD_NOT_ALLOWED", "This method is not allowed for the requested route.", 405);
    } catch (error) {
      console.error("secure_r2_file_request_failed", {
        method: request.method,
        message: error instanceof Error ? error.message : "unknown error",
      });
      return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500);
    }
  },
};
