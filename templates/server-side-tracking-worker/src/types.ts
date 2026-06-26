export type TrackingEventName =
  | "page_view"
  | "lead_submit"
  | "signup"
  | "login"
  | "checkout_start"
  | "purchase";

export type TrackingEvent = {
  event_name: TrackingEventName;
  event_id: string;
  client_id?: string;
  user_id?: string;
  url?: string;
  referrer?: string;
  payload: Record<string, unknown>;
  user_agent?: string;
  ip?: string;
  created_at: string;
};
