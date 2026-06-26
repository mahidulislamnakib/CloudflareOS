import type { TrackingEvent } from "../types";

export async function sendToMeta(event: TrackingEvent) {
  // Add Meta Conversions API delivery here.
  // Keep provider-specific mapping separate from your internal event names.
  console.log("Meta placeholder", event.event_name, event.event_id);
}
