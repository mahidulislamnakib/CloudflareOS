import { projectCoach, type ProjectCoachEnv } from "./project-coach";

interface Env extends ProjectCoachEnv {
  ASSETS: Fetcher;
}

type TaskStatus = "complete" | "in_progress" | "ready_for_verification" | "not_started";

type WorkspaceTask = {
  id: string;
  title: string;
  status: TaskStatus;
  description: string;
  verification: string;
};

const workspace = {
  product: "CloudflareOS Workspace",
  repository: "mahidulislamnakib/CloudflareOS",
  branch: "main",
  environment: "preview",
  stage: "Developer preview",
  currentTaskId: "UI-002",
  currentTask: "Add a guarded Workers AI project coach",
  tasks: [
    {
      id: "UI-001",
      title: "Workspace foundation",
      status: "ready_for_verification",
      description: "Serve a developer-project style workspace with a small Worker API and Static Assets.",
      verification: "Open /, check /api/health, check /api/workspace, then inspect mobile layout.",
    },
    {
      id: "UI-002",
      title: "Guarded Workers AI project coach",
      status: "in_progress",
      description: "Offer concise project-planning guidance through a Workers AI binding, disabled until the preview is explicitly enabled.",
      verification: "Enable the preview, send a short request, then test disabled and invalid-request paths.",
    },
    {
      id: "UI-003",
      title: "Project planning wizard",
      status: "not_started",
      description: "Generate a local-only project brief, version-one scope, and task plan in the browser.",
      verification: "Complete the wizard and verify generated data never leaves the browser.",
    },
    {
      id: "UI-004",
      title: "Knowledge library browser",
      status: "not_started",
      description: "Browse architectures, templates, prompts, and checklists from the handbook.",
      verification: "Open each library section and verify empty, loading, and error states.",
    },
    {
      id: "UI-005",
      title: "Saved workspaces",
      status: "ready_for_verification",
      description: "Deferred until users need persistence, identity, authorization, and D1 schema decisions.",
      verification: "Validate the user need before adding D1, authentication, or user data.",
    },
  ] satisfies WorkspaceTask[],
  verification: [
    { label: "Worker configuration", status: "ready", detail: "Static Assets, API-first routing, and an AI binding" },
    { label: "Local typecheck", status: "pending", detail: "Run npm run typecheck" },
    { label: "Workspace browser check", status: "pending", detail: "Run npm run dev and open /" },
    { label: "Workers AI preview", status: "pending", detail: "Enable AI_PREVIEW_ENABLED and send one bounded request" },
  ],
  bindings: [
    { name: "ASSETS", type: "Static Assets", state: "configured" },
    { name: "AI", type: "Workers AI", state: "gated" },
    { name: "D1", type: "Database", state: "deferred" },
    { name: "AUTH", type: "Identity", state: "deferred" },
  ],
  nextSafeTask: "Protect the preview, verify the AI coach with one short request, then build the local-only project planning wizard.",
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function apiError(code: string, message: string, status: number): Response {
  return json({ error: { code, message } }, status);
}

function enhanceWorkspace(request: Request, response: Response): Response {
  const url = new URL(request.url);
  const isDocument = request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html");

  if (!isDocument || !response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  return new HTMLRewriter()
    .on("head", {
      element(element) {
        element.append('<link rel="stylesheet" href="/cloudflare-vibe.css">', { html: true });
      },
    })
    .on("body", {
      element(element) {
        element.append('<script src="/ai-coach.js"></script>', { html: true });
      },
    })
    .transform(response);
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({
        data: {
          ok: true,
          service: "cloudflareos-workspace",
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (request.method === "GET" && url.pathname === "/api/workspace") {
      return json({ data: workspace });
    }

    if (request.method === "POST" && url.pathname === "/api/ai/coach") {
      return projectCoach(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return apiError("NOT_FOUND", "The requested API route does not exist.", 404);
    }

    return enhanceWorkspace(request, await env.ASSETS.fetch(request));
  },
} satisfies ExportedHandler<Env>;
