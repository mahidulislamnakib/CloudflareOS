(() => {
  const fallbackWorkspace = {
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
    ],
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

  const state = {
    workspace: fallbackWorkspace,
    activeView: "overview",
    toastTimer: null,
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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
    return `You are working in ${workspace.repository} on branch ${workspace.branch}.\n\nRead WORKSPACE-STATUS.md, BUILD-STATUS.md, AGENTS.md, and the relevant files before editing.\n\nCurrent task: ${workspace.currentTaskId} — ${workspace.currentTask}.\n\nRules:\n- Keep one task In Progress.\n- Make only focused changes for the active task.\n- Run typecheck and local dev verification before marking work complete.\n- Record files changed, commands run, verification evidence, risks, and the next smallest safe task.\n- Do not add D1, authentication, secrets, or user data until a real saved-workspace journey is approved.\n\nFirst inspect the repository, then report the smallest safe implementation step.`;
  }

  function renderText(selector, value) {
    $$(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function renderTasks(tasks) {
    const list = $("[data-task-list]");
    if (list) {
      list.innerHTML = tasks
        .map(
          (task) => `
            <div class="task-row">
              <span class="task-state-dot ${escapeHtml(task.status)}" aria-hidden="true"></span>
              <div>
                <strong>${escapeHtml(task.title)}</strong>
                <small>${escapeHtml(task.description)}</small>
              </div>
              <span class="task-id">${escapeHtml(task.id)}</span>
            </div>`,
        )
        .join("");
    }

    const board = $("[data-task-board]");
    if (!board) return;

    board.innerHTML = statusColumns
      .map(([status, label]) => {
        const inColumn = tasks.filter((task) => task.status === status);
        const cards = inColumn.length
          ? inColumn
              .map(
                (task) => `
                  <article class="board-card ${status === "in_progress" ? "is-active" : ""}">
                    <strong>${escapeHtml(task.id)} — ${escapeHtml(task.title)}</strong>
                    <p>${escapeHtml(task.description)}</p>
                    <div class="board-card-footer"><span>${escapeHtml(task.verification)}</span><span>${escapeHtml(statusLabels[task.status])}</span></div>
                  </article>`,
              )
              .join("")
          : '<p class="empty-state">No task in this state.</p>';

        return `
          <section class="task-column">
            <header class="task-column-header"><span>${escapeHtml(label)}</span><span class="task-count">${inColumn.length}</span></header>
            ${cards}
          </section>`;
      })
      .join("");
  }

  function renderVerification(items) {
    const compact = $("[data-verification-list]");
    const wide = $("[data-verification-list-wide]");

    const markup = (wideLayout) =>
      items
        .map(
          (item, index) => `
            <div class="verification-row">
              <span class="verification-symbol" aria-hidden="true">${item.status === "ready" ? "✓" : index + 1}</span>
              <div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></div>
              ${wideLayout ? `<span class="verification-description">Check this before moving work to complete.</span>` : ""}
              <span class="verification-state ${item.status === "ready" ? "ready" : ""}">${item.status === "ready" ? "Ready" : "Pending"}</span>
            </div>`,
        )
        .join("");

    if (compact) compact.innerHTML = markup(false);
    if (wide) wide.innerHTML = markup(true);
  }

  function renderBindings(items) {
    const list = $("[data-binding-list]");
    if (!list) return;

    list.innerHTML = items
      .map(
        (binding) => `
          <div class="binding-item">
            <div><span class="binding-name">${escapeHtml(binding.name)}</span><span class="binding-type">${escapeHtml(binding.type)}</span></div>
            <span class="binding-state ${escapeHtml(binding.state)}">${escapeHtml(binding.state)}</span>
          </div>`,
      )
      .join("");
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
    $$(".nav-item").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.view));
    });

    $$('[data-view-target]').forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.viewTarget));
    });

    $('[data-action="toggle-menu"]')?.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") document.body.classList.remove("menu-open");
    });
  }

  function bindActions() {
    $$('[data-action="copy-prompt"]').forEach((button) => {
      button.addEventListener("click", () => copyText(buildPrompt(), "Codex prompt copied."));
    });

    $('[data-action="copy-command"]')?.addEventListener("click", () => {
      copyText("npm install\nnpm run typecheck\nnpm run dev\ncurl http://127.0.0.1:8787/api/health\ncurl http://127.0.0.1:8787/api/workspace", "Local verification commands copied.");
    });

    $('[data-action="open-task"]')?.addEventListener("click", () => setView("tasks"));

    $$('[data-action="show-template"]').forEach((button) => {
      button.addEventListener("click", () => showToast("Template browser is the next library task. Use the repository templates folder for now."));
    });

    $('[data-action="show-help"]')?.addEventListener("click", () => {
      showToast("Read AGENTS.md and WORKSPACE-STATUS.md before starting the next task.");
    });
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
