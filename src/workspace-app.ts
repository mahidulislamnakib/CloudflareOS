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
  product: "DeveloperB",
  repository: "DeveloperB private source",
  branch: "main",
  environment: "private alpha",
  stage: "Problem-to-product foundation",
  currentTaskId: "B-001",
  currentTask: "DeveloperB problem discovery foundation",
  tasks: [
    { id: "B-001", title: "Problem discovery foundation", status: "in_progress", description: "Make natural-language problem discovery the first product journey and define its persistent control plane.", verification: "Review discovery states, solution options, blueprint lifecycle, and the no-project-before-blueprint rule." },
    { id: "B-002", title: "Preview D1 rehearsal", status: "not_started", description: "Bind a dedicated preview database, apply migrations, seed synthetic fixtures, and verify tenant isolation.", verification: "Run migration rehearsal and first queries with synthetic data only." },
    { id: "B-003", title: "Protected identity and membership", status: "not_started", description: "Resolve approved preview users into organizations, memberships, and project roles on the server.", verification: "Verify unauthenticated and cross-organization requests cannot access records." },
    { id: "B-004", title: "Discovery conversation workspace", status: "not_started", description: "Let a user explain a problem in natural language and create an editable discovery record.", verification: "Check facts, assumptions, unanswered questions, solution options, and teaching output." },
    { id: "B-005", title: "Blueprint to project conversion", status: "not_started", description: "Create a build-ready project only after an accepted solution and blueprint exist.", verification: "Verify a blueprint links to exactly one generated project and keeps its version history." },
  ] satisfies WorkspaceTask[],
  verification: [
    { label: "Read-only preview", status: "ready", detail: "No private D1 route is exposed yet" },
    { label: "Problem-first model", status: "ready", detail: "Discovery, solution option, and blueprint migrations are prepared" },
    { label: "Connected preview", status: "pending", detail: "Review the updated DeveloperB interface in the Worker preview" },
    { label: "D1 rehearsal", status: "pending", detail: "Apply migrations to a dedicated preview database only" },
  ],
  bindings: [
    { name: "ASSETS", type: "Static Assets", state: "configured" },
    { name: "AI", type: "Workers AI", state: "gated" },
    { name: "D1", type: "Private alpha database", state: "planned" },
    { name: "R2", type: "Build artifacts", state: "planned" },
  ],
  nextSafeTask: "Review the DeveloperB preview, then provision a dedicated non-production D1 database for the discovery and project control plane.",
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" } });
}

function apiError(code: string, message: string, status: number): Response {
  return json({ error: { code, message } }, status);
}

function enhanceWorkspace(request: Request, response: Response): Response {
  const url = new URL(request.url);
  const isDocument = request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html");
  if (!isDocument || !response.headers.get("content-type")?.includes("text/html")) return response;

  return new HTMLRewriter()
    .on("head", {
      element(element) {
        element.append('<link rel="stylesheet" href="/preview.css">', { html: true });
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
      return json({ data: { ok: true, service: "developerb-workspace", timestamp: new Date().toISOString() } });
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
