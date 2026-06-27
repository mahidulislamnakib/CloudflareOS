(() => {
  const fallbackWorkspace = {
    product: "DeveloperB",
    repository: "mahidulislamnakib/CloudflareOS",
    branch: "main",
    environment: "private alpha",
    stage: "Problem-to-product foundation",
    currentTaskId: "B-001",
    currentTask: "DeveloperB problem discovery foundation",
    tasks: [
      {
        id: "B-001",
        title: "Problem discovery foundation",
        status: "in_progress",
        description: "Make natural-language problem discovery the first product journey and define its persistent control plane.",
        verification: "Review discovery states, solution options, blueprint lifecycle, and the no-project-before-blueprint rule.",
      },
      {
        id: "B-002",
        title: "Preview D1 rehearsal",
        status: "not_started",
        description: "Bind a dedicated preview database, apply migrations, seed synthetic fixtures, and verify tenant isolation.",
        verification: "Run migration rehearsal and first queries with synthetic data only.",
      },
      {
        id: "B-003",
        title: "Protected identity and membership",
        status: "not_started",
        description: "Resolve approved preview users into organizations, memberships, and project roles on the server.",
        verification: "Verify unauthenticated and cross-organization requests cannot access records.",
      },
      {
        id: "B-004",
        title: "Discovery conversation workspace",
        status: "not_started",
        description: "Let a user explain a problem in natural language and create an editable discovery record.",
        verification: "Check facts, assumptions, unanswered questions, solution options, and teaching output.",
      },
      {
        id: "B-005",
        title: "Blueprint to project conversion",
        status: "not_started",
        description: "Create a build-ready project only after an accepted solution and blueprint exist.",
        verification: "Verify one accepted blueprint creates one linked project and retains version history.",
      },
    ],
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

  const statusLabels = {
    complete: "Complete",
    in_progress: "In progress",
    ready_for_verification: "Ready for verification",
    not_started: "Not started",
  };

  const statusColumns = [
    ["in_progress", "In progress"],
    ["ready_for_verification", "Ready for verification"],
    ["not_started", "Not started"],
    ["complete", "Complete"],
  ];

  const state = { workspace: fallbackWorkspace, activeView: "discovery", toastTimer: null };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function showToast(message) {
    const toast = $("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3400);
  }

  async function copyText(value, successMessage) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(successMessage);
      return;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      showToast(successMessage);
    }
  }

  function buildPrompt() {
    const { workspace } = state;
    return `You are working on DeveloperB in ${workspace.repository} on branch ${workspace.branch}.\n\nRead BUILD-STATUS.md, WORKSPACE-STATUS.md, AGENTS.md, private-alpha/README.md, and the relevant files before editing.\n\nCurrent task: ${workspace.currentTaskId} — ${workspace.currentTask}.\n\nProduct rule: start from a real-world problem, separate confirmed facts from assumptions and unanswered questions, compare build/buy/automate/process-change options, and create a project only after an accepted blueprint.\n\nEngineering rules:\n- Keep one small task In Progress.\n- Keep private preview access and data boundaries intact.\n- Do not add a live D1 binding, private write route, provider credential, or history store unless the active task explicitly requires it.\n- Record files changed, commands run, verification evidence, risks, and the next smallest safe task.\n\nFirst inspect the repository, then report the smallest safe implementation step.`;
  }

  function renderText(selector, value) {
    $$(selector).forEach((element) => { element.textContent = value; });
  }

  function renderTasks(tasks) {
    const list = $("[data-task-list]");
    if (list) {
      list.innerHTML = tasks.map((task) => `<div class="task-row"><span class="task-state-dot ${escapeHtml(task.status)}" aria-hidden="true"></span><div><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.description)}</small></div><span class="task-id">${escapeHtml(task.id)}</span></div>`).join("");
    }

    const board = $("[data-task-board]");
    if (!board) return;
    board.innerHTML = statusColumns.map(([status, label]) => {
      const inColumn = tasks.filter((task) => task.status === status);
      const cards = inColumn.length ? inColumn.map((task) => `<article class="board-card ${status === "in_progress" ? "is-active" : ""}"><strong>${escapeHtml(task.id)} — ${escapeHtml(task.title)}</strong><p>${escapeHtml(task.description)}</p><div class="board-card-footer"><span>${escapeHtml(task.verification)}</span><span>${escapeHtml(statusLabels[task.status])}</span></div></article>`).join("") : '<p class="empty-state">No task in this state.</p>';
      return `<section class="task-column"><header class="task-column-header"><span>${escapeHtml(label)}</span><span class="task-count">${inColumn.length}</span></header>${cards}</section>`;
    }).join("");
  }

  function renderVerification(items) {
    const compact = $("[data-verification-list]");
    const wide = $("[data-verification-list-wide]");
    const markup = (wideLayout) => items.map((item, index) => `<div class="verification-row"><span class="verification-symbol" aria-hidden="true">${item.status === "ready" ? "✓" : index + 1}</span><div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></div>${wideLayout ? '<span class="verification-description">Check this before moving work to complete.</span>' : ""}<span class="verification-state ${item.status === "ready" ? "ready" : ""}">${item.status === "ready" ? "Ready" : "Pending"}</span></div>`).join("");
    if (compact) compact.innerHTML = markup(false);
    if (wide) wide.innerHTML = markup(true);
  }

  function renderBindings(items) {
    const list = $("[data-binding-list]");
    if (!list) return;
    list.innerHTML = items.map((binding) => `<div class="binding-item"><div><span class="binding-name">${escapeHtml(binding.name)}</span><span class="binding-type">${escapeHtml(binding.type)}</span></div><span class="binding-state ${escapeHtml(binding.state)}">${escapeHtml(binding.state)}</span></div>`).join("");
  }

  function renderWorkspace() {
    const { workspace } = state;
    renderText("[data-product]", workspace.product);
    renderText("[data-repository]", workspace.repository);
    renderText("[data-branch]", workspace.branch);
    renderText("[data-stage]", workspace.stage);
    renderText("[data-current-task]", workspace.currentTaskId);
    renderText("[data-environment]", workspace.environment.charAt(0).toUpperCase() + workspace.environment.slice(1));
    renderText("[data-next-task]", workspace.nextSafeTask);
    renderTasks(workspace.tasks);
    renderVerification(workspace.verification);
    renderBindings(workspace.bindings);
  }

  function setView(nextView) {
    const panel = $(`[data-panel="${nextView}"]`);
    if (!panel) return;
    state.activeView = nextView;
    $$("[data-panel]").forEach((item) => item.classList.toggle("is-visible", item === panel));
    $$(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === nextView));
    document.body.classList.remove("menu-open");
    panel.querySelector("h1, h2, button")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindNavigation() {
    $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
    $$('[data-view-target]').forEach((button) => button.addEventListener("click", () => setView(button.dataset.viewTarget)));
    $('[data-action="toggle-menu"]')?.addEventListener("click", () => document.body.classList.toggle("menu-open"));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") document.body.classList.remove("menu-open"); });
  }

  function bindActions() {
    $$('[data-action="copy-prompt"]').forEach((button) => button.addEventListener("click", () => copyText(buildPrompt(), "DeveloperB implementation prompt copied.")));
    $('[data-action="copy-command"]')?.addEventListener("click", () => copyText("npm install\nnpm run typecheck\nnpm run dev\ncurl http://127.0.0.1:8787/api/health\ncurl http://127.0.0.1:8787/api/workspace", "Preview verification commands copied."));
    $('[data-action="start-discovery"]')?.addEventListener("click", () => {
      setView("discovery");
      window.setTimeout(() => $("#ai-coach-message")?.focus(), 0);
    });
    $('[data-action="show-help"]')?.addEventListener("click", () => showToast("Read BUILD-STATUS.md and private-alpha/README.md before starting the next task."));
  }

  async function loadWorkspace() {
    try {
      const response = await fetch("/api/workspace", { headers: { accept: "application/json" } });
      if (!response.ok) throw new Error(`workspace API returned ${response.status}`);
      const payload = await response.json();
      if (!payload?.data || !Array.isArray(payload.data.tasks)) throw new Error("workspace API returned an invalid payload");
      state.workspace = payload.data;
    } catch (error) {
      console.warn("Using local workspace fallback data.", error);
      showToast("Workspace API is unavailable; showing local preview data.");
    }
    renderWorkspace();
  }

  bindNavigation();
  bindActions();
  loadWorkspace();
})();
