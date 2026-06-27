(() => {
  const root = document.querySelector('[data-panel="discovery"]');
  if (!root) return;

  const panel = document.createElement("section");
  panel.className = "panel ai-coach-panel";
  panel.setAttribute("aria-labelledby", "developerb-guide-title");
  panel.innerHTML = `
    <div class="ai-coach-header">
      <div>
        <p class="muted-label">GUIDED DISCOVERY</p>
        <h2 id="developerb-guide-title">Tell DeveloperB what happened.</h2>
        <p>Describe the real situation in Bangla or English. We will separate what is known, what is assumed, and what needs to be decided.</p>
      </div>
      <span class="status-badge ai-preview-badge">Private preview</span>
    </div>
    <form class="ai-coach-form">
      <label class="ai-coach-label" for="ai-coach-message">What problem are you facing today?</label>
      <textarea class="ai-coach-input" id="ai-coach-message" name="message" maxlength="600" required placeholder="Example: Customers contact us from Facebook, WhatsApp, and phone. We forget follow-ups and lose sales. My team needs a simple way to see what happens next."></textarea>
      <div class="ai-coach-actions">
        <span class="ai-coach-hint">600 characters max. The guide is disabled until the private preview is protected and enabled.</span>
        <button class="primary-button" type="submit">Analyze my problem</button>
      </div>
    </form>
    <div class="ai-coach-output" hidden aria-live="polite">
      <strong>DeveloperB Guide</strong>
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
    submit.textContent = "Analyzing…";
    setOutput("Looking for the real problem before suggesting any software.");

    try {
      const response = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setOutput(payload?.error?.message || "DeveloperB Guide is unavailable. Try again later.", true);
        return;
      }

      setOutput(payload?.data?.response || "DeveloperB Guide returned an empty answer.", !payload?.data?.response);
    } catch {
      setOutput("Could not reach DeveloperB Guide. Check the Worker preview and try again.", true);
    } finally {
      submit.disabled = false;
      submit.textContent = "Analyze my problem";
    }
  });
})();
