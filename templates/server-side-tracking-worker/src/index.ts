import type { TrackingEvent, TrackingEventName } from "./types";
import { sendToGa4 } from "./providers/ga4";
import { sendToMeta } from "./providers/meta";

interface Env {
  TRACKING_QUEUE: Queue<TrackingEvent>;
}

const ALLOWED_EVENTS = new Set<TrackingEventName>([
  "page_view",
  "lead_submit",
  "signup",
  "login",
  "checkout_start",
  "purchase",
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

async function readJson(request: Request) {
  try {
    return await request.json<Partial<TrackingEvent>>();
  } catch {
    return null;
  }
}

function isAllowedEventName(value: unknown): value is TrackingEventName {
  return typeof value === "string" && ALLOWED_EVENTS.has(value as TrackingEventName);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "server-side-tracking-worker" });
    }

    if (url.pathname !== "/track") {
      return json({ ok: false, error: "Not Found" }, { status: 404 });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method Not Allowed" }, { status: 405 });
    }

    const input = await readJson(request);

    if (!input || !isAllowedEventName(input.event_name)) {
      return json({ ok: false, error: "Invalid event_name" }, { status: 400 });
    }

    const event: TrackingEvent = {
      event_name: input.event_name,
      event_id: input.event_id || crypto.randomUUID(),
      client_id: input.client_id,
      user_id: input.user_id,
      url: input.url,
      referrer: input.referrer,
      payload: input.payload || {},
      user_agent: request.headers.get("User-Agent") || undefined,
      ip: request.headers.get("CF-Connecting-IP") || undefined,
      created_at: new Date().toISOString(),
    };

    await env.TRACKING_QUEUE.send(event);

    return json({ ok: true, event_id: event.event_id });
  },

  async queue(batch: MessageBatch<TrackingEvent>): Promise<void> {
    for (const message of batch.messages) {
      await sendToGa4(message.body);
      await sendToMeta(message.body);
      message.ack();
    }
  },
};
