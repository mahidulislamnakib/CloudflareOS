import type { TrackingEvent } from "../types";

export async function sendToGa4(event: TrackingEvent) {
  // Add GA4 Measurement Protocol delivery here.
  // Keep provider-specific mapping separate from your internal event names.
  console.log("GA4 placeholder", event.event_name, event.event_id);
}
