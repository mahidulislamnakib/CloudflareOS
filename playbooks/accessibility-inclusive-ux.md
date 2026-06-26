# Accessibility & Inclusive UX Playbook

A practical playbook for building Cloudflare-first products that work well for more people: mobile users, keyboard users, people using screen readers, users with low vision, people with temporary injuries, users on slow networks, and readers using more than one language.

## Goal

Make the main journey understandable, usable, and recoverable without relying on a specific device, mouse, color perception, fast connection, or advanced technical knowledge.

Accessibility is not a final visual QA step. It is part of product design, frontend implementation, content workflow, testing, and release approval.

---

## Start with the critical journey

Choose the task that users most need to complete.

```text
visitor reads a page → understands the offer → submits a form
member signs in → finds their dashboard → completes a task
customer searches → compares options → completes payment
staff opens admin → reviews a record → safely approves or rejects it
```

For each journey, confirm that a user can:

- understand what the page is for
- navigate without a mouse
- read text at a comfortable size
- complete fields with clear instructions
- notice errors and status changes
- recover after a mistake
- finish the task on a small screen

---

## Inclusive product rules

- Use plain language for labels, errors, buttons, and instructions.
- Make the most important action obvious.
- Do not hide essential meaning only in color, icons, sound, hover, or animation.
- Do not require precision gestures for a normal task.
- Keep forms short and explain why sensitive information is needed.
- Preserve user input after a validation error whenever it is safe.
- Let users pause, dismiss, or avoid distracting motion.
- Design empty, loading, success, and error states as carefully as the ideal state.

---

## Page structure and navigation

Use a predictable structure across public pages and admin tools.

```text
skip link
  ↓
header and primary navigation
  ↓
page title and purpose
  ↓
main content
  ↓
related actions or help
  ↓
footer
```

### Good page structure

- Use one clear page title.
- Keep headings in a meaningful order.
- Group related controls under a visible label.
- Use descriptive link text.
- Keep navigation labels consistent across routes.
- Make the current page or section clear.
- Do not make a card entirely clickable when it contains several separate actions.

### Avoid

- heading levels chosen only for visual size
- links named only “click here” or “read more”
- duplicate navigation with unclear purpose
- icons without text or accessible names
- menus that work only on hover

---

## Keyboard and focus

A keyboard-only user must be able to reach, understand, and operate every essential control.

### Required behavior

- Every interactive item can receive focus.
- Focus order follows the visual and task order.
- Focus remains visible at all times.
- Opening a dialog moves focus into it.
- Closing a dialog returns focus to the triggering control.
- A user can close overlays without a mouse.
- The focused item never becomes hidden behind a sticky header, cookie banner, or loading overlay.

### Test sequence

```text
Reload page
  ↓
Use Tab and Shift+Tab only
  ↓
Open every menu, dialog, dropdown, filter, and modal
  ↓
Submit a form with an error
  ↓
Confirm focus moves to useful feedback
  ↓
Close controls and confirm focus returns logically
```

Do not remove focus outlines unless you provide an equally clear replacement.

---

## Buttons, links, and controls

Use the control type that matches the action.

| User intention | Better control |
| --- | --- |
| Go to another page or document | Link |
| Submit, save, delete, open, close, or change state | Button |
| Select one option from a small group | Radio inputs or clear segmented control |
| Select multiple options | Checkboxes |
| Enter a value | Labelled input with help text where needed |

### Clear labels

Prefer:

```text
Save profile
Download invoice PDF
Remove team member
Apply filters
Send verification code
```

Avoid:

```text
Submit
Click here
Continue
More
Icon-only action without a name
```

Use confirmation only for destructive or difficult-to-reverse actions. The confirmation must explain what will happen.

---

## Forms and validation

Forms are often the highest-risk accessibility area because they combine instructions, fields, errors, uploads, and payment or identity data.

### Form design

- Give every input a visible label.
- Put instructions close to the relevant field.
- Clearly mark required information using text, not color alone.
- Match keyboard and mobile input types to the expected data where practical.
- Explain accepted file types, size limits, and what happens after upload.
- Keep error messages specific and actionable.
- Preserve safe user input after validation errors.
- Show a clear submission state so users do not submit repeatedly.

### Error pattern

```text
What happened
  ↓
Which field needs attention
  ↓
How to fix it
  ↓
Where focus should go next
```

Example:

```text
We could not save your profile.
Phone number: enter a valid number including country code.
```

Do not show a red border with no explanation.

### Sensitive forms

For payment, identity, medical, account-recovery, or private-document forms:

- explain why data is requested
- reduce fields to what is genuinely needed
- avoid exposing sensitive values in URLs or client-side logs
- show a clear success or next-step message
- provide a safe recovery path when verification fails

---

## Color, contrast, and visual hierarchy

Color should support meaning, not carry it alone.

Use at least two cues for important state changes:

```text
color + label
color + icon + text
status badge + descriptive text
chart color + pattern or direct label
```

### Check every state

- default text
- muted text
- links
- focused controls
- disabled controls
- error, warning, success, and information messages
- selected navigation items
- data visualizations
- text over images or gradients
- light and dark appearance modes if supported

Do not rely on low-contrast “modern” styling that makes content hard to read.

---

## Images, icons, video, and audio

### Images

- Write alt text for images that add information.
- Use empty alt text only for decorative images.
- Describe the information or purpose, not every visual detail.
- Do not place important text only inside an image.
- Keep image crops from removing meaningful content on mobile.

### Icons

- Pair unfamiliar icons with text.
- Give icon-only controls an accessible name.
- Do not use an icon as the only indication of a destructive action.

### Video and audio

- Provide captions for speech content.
- Provide a text summary or transcript for important material.
- Do not autoplay audio.
- Give users control over playback and motion.

### File downloads

Tell users what they are downloading:

```text
Download annual report (PDF)
Download invoice (PDF, 240 KB)
```

---

## Motion, loading, and time limits

Motion and automatic updates can confuse or overwhelm users.

- Avoid essential information that appears only briefly.
- Let users stop or reduce non-essential animation.
- Do not use flashing or rapidly changing content for attention.
- Keep loading states informative without blocking the whole page unnecessarily.
- Explain session expiry or timed actions before data is lost.
- Warn before a user’s draft, upload, or form state will expire.

### Loading pattern

```text
Action started
  ↓
Visible progress or loading message
  ↓
Success, next step, or precise failure message
```

---

## Responsive and mobile UX

Accessibility includes users on small screens, older phones, zoomed views, and slow networks.

- Keep critical actions within a simple vertical flow.
- Do not require horizontal scrolling for normal content.
- Keep touch targets separated enough to avoid accidental taps.
- Avoid fixed overlays that cover form controls or content.
- Test text resizing and browser zoom.
- Make tables usable on mobile through summaries, cards, responsive layouts, or horizontal-scroll cues when needed.
- Do not hide essential desktop actions on mobile without another path.

For mobile forms, test with the virtual keyboard open.

---

## Language, localization, and readable content

Use language that fits the reader, not the internal team.

- Set the correct page language in the document structure.
- Keep mixed-language labels intentional and understandable.
- Avoid text baked into images.
- Let translated content expand without breaking buttons, cards, or menus.
- Use clear date, currency, phone, and address formatting for the audience.
- Explain technical or legal terms in simple language when they affect user action.
- Keep error messages, status labels, and empty states translated with the rest of the product.

For bilingual products, test the whole journey in each supported language—not only the homepage.

---

## Data tables, dashboards, and admin tools

Admin users need accessible, fast ways to review dense data.

- Give every table a descriptive title or nearby heading.
- Keep column names clear.
- Do not rely on color-only status dots.
- Make filters, sort controls, and bulk actions reachable by keyboard.
- Explain selected-row counts and bulk action effects.
- Provide an empty state, loading state, and error state for every important table.
- Ensure exports respect permission and tenant boundaries.
- Keep destructive actions separate from everyday navigation.

For complex charts, provide a text summary of the main conclusion and an accessible data alternative when the chart is important to decisions.

---

## Authentication and account recovery

Authentication flows must be simple, secure, and recoverable.

- Label sign-in, sign-up, reset, verification, and logout actions clearly.
- Do not reveal whether an account exists in a way that creates avoidable privacy risk.
- Explain password or code requirements before submission.
- Provide clear recovery when a code expires or a browser loses state.
- Make authentication challenges keyboard accessible.
- Ensure abuse protection does not create an impossible path for legitimate users.
- Confirm the active account, workspace, or tenant when it affects user actions.

---

## Cloudflare-first implementation notes

Cloudflare services do not replace accessible interface design, but architecture affects user experience.

- Keep public content fast and lightweight.
- Move non-essential work such as email, reports, image processing, and analytics off the critical request path when safe.
- Cache only content that is truly public and stable.
- Do not cache private, tenant-scoped, or user-specific responses in a shared way.
- Return clear API errors that the frontend can present accessibly.
- Keep uploaded private files behind server-side authorization checks.
- Use reliable audit logs for staff actions that affect users, permissions, payments, or content visibility.

---

## Accessibility testing workflow

Test with a combination of manual checks and automated checks.

### Manual checks

```text
keyboard-only navigation
screen-reader spot checks on core flows
mobile device and virtual keyboard
text zoom and browser zoom
slow-network loading behavior
light/dark appearance if supported
bilingual or multilingual flow
form errors and recovery
```

### Automated checks

Use automated tools to catch obvious issues, then manually test the user journey. Automated checks do not prove that a flow is understandable or complete.

### Test the risk areas

- sign in, reset password, and account recovery
- checkout, booking, or payment confirmation
- upload and download flows
- search, filters, pagination, and sorting
- dialogs and confirmation modals
- admin approval, rejection, and delete actions
- private files and tenant switching

---

## Accessibility acceptance criteria

A feature is not ready when the visual result looks correct but a user cannot complete the core task independently.

Before marking a feature complete, confirm:

- [ ] Page title and headings explain the purpose.
- [ ] All essential actions work with keyboard only.
- [ ] Focus is visible and managed in dialogs.
- [ ] Forms have labels, useful help text, and actionable errors.
- [ ] Important state is not conveyed by color alone.
- [ ] Images, icons, and media have appropriate alternatives.
- [ ] Mobile and zoomed views preserve the core journey.
- [ ] Loading, empty, success, and error states are understandable.
- [ ] Translated or long text does not break the interface.
- [ ] Private and destructive actions have clear confirmation and recovery paths.

---

## Production checklist

- [ ] Core public and authenticated journeys have manual keyboard testing.
- [ ] Critical forms preserve safe input after error states.
- [ ] Dialog focus and close behavior are verified.
- [ ] Image and icon alternatives are reviewed.
- [ ] Important video or audio has captions or equivalent text.
- [ ] Color is not the only status indicator.
- [ ] Mobile, zoom, and slow-network behavior are tested.
- [ ] Bilingual/localized core flows are tested where applicable.
- [ ] Accessibility regressions are included in release QA.
- [ ] A clear channel exists for users to report accessibility barriers.

---

## Common mistakes

- treating accessibility as only a color-contrast exercise
- removing visible focus styles for a cleaner design
- using clickable `div` elements instead of proper controls
- using placeholder text as the only form label
- showing validation only through color
- opening a modal without moving focus into it
- losing all form input after a small error
- placing critical text inside an image
- hiding essential actions on mobile
- using auto-playing motion or sound
- translating page content but leaving errors and status messages untranslated
- relying only on automated checks

---

## Related guides

- [`./testing-strategy.md`](./testing-strategy.md)
- [`./performance-optimization.md`](./performance-optimization.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`../architectures/internationalization-localization.md`](../architectures/internationalization-localization.md)
- [`../architectures/security-threat-modeling.md`](../architectures/security-threat-modeling.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
