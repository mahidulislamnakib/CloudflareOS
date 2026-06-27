interface Env {
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
  branch: "ui-foundation",
  environment: "preview",
  stage: "Foundation",
  currentTaskId: "UI-001",
  currentTask: "Create the developer workspace shell",
  tasks: [
    {
      id: "UI-001",
      title: "Workspace foundation",
      status: "in_progress",
      description: "Serve a developer-project style workspace with a small Worker API and Static Assets.",
      verification: "Open /, check /api/health, check /api/workspace, then inspect mobile layout.",
    },
    {
      id: "UI-002",
      title: "Project planning wizard",
      status: "not_started",
      description: "Generate a local-only project brief, version-one scope, and task plan in the browser.",
      verification: "Complete the wizard and verify generated data never leaves the browser.",
    },
    {
      id: "UI-003",
      title: "Knowledge library browser",
      status: "not_started",
      description: "Browse architectures, templates, prompts, and checklists from the handbook.",
      verification: "Open each library section and verify empty/loading/error states.",
    },
    {
      id: "UI-004",
      title: "Saved workspaces",
      status: "ready_for_verification",
      description: "Deferred until users need persistence, identity, authorization, and D1 schema decisions.",
      verification: "Validate the user need before adding D1, authentication, or user data.",
    },
  ] satisfies WorkspaceTask[],
  verification: [
    { label: "Worker configuration", status: "ready", detail: "Static Assets with API-first routing" },
    { label: "Local typecheck", status: "pending", detail: "Run npm run typecheck" },
    { label: "Local browser check", status: "pending", detail: "Run npm run dev and open /" },
    { label: "Cloudflare preview", status: "pending", detail: "Deploy the branch through the connected Worker" },
  ],
  bindings: [
    { name: "ASSETS", type: "Static Assets", state: "configured" },
    { name: "D1", type: "Database", state: "deferred" },
    { name: "AUTH", type: "Identity", state: "deferred" },
  ],
  nextSafeTask: "Verify the workspace foundation locally, then build a local-only project planning wizard.",
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

    if (url.pathname.startsWith("/api/")) {
      return json(
        {
          error: {
            code: "NOT_FOUND",
            message: "The requested API route does not exist.",
          },
        },
        404,
      );
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
