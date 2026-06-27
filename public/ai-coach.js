(() => {
  const root = document.querySelector('[data-panel="debug"]');
  if (!root) return;

  const panel = document.createElement("section");
  panel.className = "panel ai-coach-panel";
  panel.setAttribute("aria-labelledby", "ai-coach-title");
  panel.innerHTML = `
    <div class="ai-coach-header">
      <div>
        <p class="muted-label">WORKERS AI PREVIEW</p>
        <h2 id="ai-coach-title">Project Coach</h2>
        <p>Turn a short developer question into one small, Cloudflare-first next step.</p>
      </div>
      <span class="status-badge ai-preview-badge">Gated preview</span>
    </div>
    <form class="ai-coach-form">
      <label class="ai-coach-label" for="ai-coach-message">What are you trying to build, verify, or fix?</label>
      <textarea class="ai-coach-input" id="ai-coach-message" name="message" maxlength="600" required placeholder="Example: I need a private upload flow for a small team. What is the smallest safe Cloudflare-first version?"></textarea>
      <div class="ai-coach-actions">
        <span class="ai-coach-hint">600 characters max. Preview uses a low-cost Workers AI model.</span>
        <button class="primary-button" type="submit">Ask Project Coach</button>
      </div>
    </form>
    <div class="ai-coach-output" hidden aria-live="polite">
      <strong>Project Coach</strong>
      <p></p>
    </div>
  `;

  root.append(panel);

  const form = panel.querySelector("form");
  const input = panel.querySelector("textarea");
  const submit = panel.querySelector("button[type=submit]");
  const output = panel.querySelector(".ai-coach-output");
  const outputText = output.querySelector("p");

  function setOutput(message, isError = false) {
    output.hidden = false;
    outputText.textContent = message;
    outputText.classList.toggle("ai-coach-error", isError);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    submit.disabled = true;
    submit.textContent = "Thinking…";
    setOutput("Preparing a small, verification-first answer.");

    try {
      const response = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setOutput(payload?.error?.message || "Project Coach is unavailable. Try again later.", true);
        return;
      }

      setOutput(payload?.data?.response || "Project Coach returned an empty answer.", !payload?.data?.response);
    } catch {
      setOutput("Could not reach Project Coach. Check the Worker preview and try again.", true);
    } finally {
      submit.disabled = false;
      submit.textContent = "Ask Project Coach";
    }
  });
})();
