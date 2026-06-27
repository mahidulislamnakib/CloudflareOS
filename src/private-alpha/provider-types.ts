export const providerKinds = [
  "workers_ai",
  "ai_gateway_native",
  "openrouter_via_gateway",
  "openai_compatible",
  "external_coding_agent",
  "custom_https",
] as const;

export type AiProviderKind = (typeof providerKinds)[number];

export const integrationModes = ["binding", "gateway", "openai_compatible", "agent_protocol", "custom_https"] as const;
export type AiIntegrationMode = (typeof integrationModes)[number];

export const aiCapabilities = ["fast_chat", "planning", "code_reasoning", "embedding", "vision", "tool_use"] as const;
export type AiCapability = (typeof aiCapabilities)[number];

export type ProviderRoute = {
  id: string;
  scope: "platform" | "organization";
  organizationId: string | null;
  slug: string;
  displayName: string;
  providerKind: AiProviderKind;
  integrationMode: AiIntegrationMode;
  secretReference: string | null;
  endpointReference: string | null;
  defaultModel: string | null;
  capabilities: AiCapability[];
  status: "disabled" | "active" | "degraded" | "retired";
};

export type ModelProfile = {
  id: string;
  providerRouteId: string;
  modelIdentifier: string;
  displayName: string;
  intendedUse: AiCapability;
  maxInputTokens: number | null;
  maxOutputTokens: number | null;
  status: "disabled" | "active" | "deprecated";
};
