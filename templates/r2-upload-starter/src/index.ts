interface Env {
  BUCKET: R2Bucket;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

function getExtension(filename: string) {
  const lastPart = filename.split(".").pop();
  if (!lastPart || lastPart === filename) return "bin";
  return lastPart.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
}

function createObjectKey(filename: string) {
  const extension = getExtension(filename);
  const id = crypto.randomUUID();
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  return `uploads/${year}/${month}/${id}.${extension}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "r2-upload-starter" });
    }

    if (url.pathname !== "/upload") {
      return json({ ok: false, error: "Not Found" }, { status: 404 });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method Not Allowed" }, { status: 405 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return json({ ok: false, error: "file is required" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return json({ ok: false, error: "file is too large" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return json({ ok: false, error: "file type is not allowed" }, { status: 400 });
    }

    const key = createObjectKey(file.name);

    await env.BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    return json({
      ok: true,
      key,
      size: file.size,
      type: file.type,
    });
  },
};
