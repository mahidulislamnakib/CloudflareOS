# External API, Environment, and Dependency Standard

Professional projects often need third-party APIs, environment variables, and package dependencies.

These can make a project powerful, but they can also make it unsafe, expensive, or fragile if handled badly.

## Simple rule

Do not connect an external service until you know:

- Why it is needed
- What data it sends or receives
- Where private configuration is stored
- What happens when it fails
- How much it may cost
- How to replace or remove it later

## External API checklist

Before adding an external API, document:

| Question | Why it matters |
| --- | --- |
| What does this API do? | Avoid unnecessary services |
| Is there a Cloudflare-native option? | Reduce complexity |
| What data leaves our system? | Privacy and compliance |
| Does it need private credentials? | Security |
| What are the rate limits? | Reliability |
| What does it cost? | Budget control |
| What happens if it is down? | User experience |
| How do we log failures safely? | Debugging |
| Can we retry safely? | Reliability |
| Can we remove it later? | Long-term maintainability |

## External API best practices

- Keep API calls server-side when private credentials are required.
- Never expose private credentials in frontend code.
- Use environment variables or Wrangler-managed secrets.
- Add timeout handling.
- Add useful error messages.
- Avoid logging full request bodies if they contain private data.
- Respect rate limits.
- Cache safe responses where appropriate.
- Document the provider and purpose.

## Environment and secret best practices

### Never commit real private values

Do not commit files or values that contain real credentials, tokens, passwords, or private database connection strings.

### Commit examples only

Use safe example files:

```text
.env.example
.dev.vars.example
secrets.example.md
```

Example placeholder format:

```text
SERVICE_NAME_PUBLIC_VALUE="replace-with-public-value"
SERVICE_NAME_PRIVATE_VALUE="replace-with-private-value"
```

### Cloudflare Workers secrets

Use Wrangler for production private values:

```powershell
npx wrangler secret put NAME_OF_PRIVATE_VALUE
npx wrangler secret list
```

### Local development

For local Workers development, use `.dev.vars` for local-only values.

Do not commit `.dev.vars`.

## Environment naming

Use clear environment names:

- `local`
- `preview`
- `staging`
- `production`

Document which services and private values each environment needs. Use [`environment-variable-checklist.md`](environment-variable-checklist.md) before adding, rotating, deploying, or removing configuration values.

## Dependency best practices

Dependencies can introduce bugs, security issues, and breaking changes.

Before adding a package, ask:

- Do we really need this dependency?
- Is the package maintained?
- Does it work with the Cloudflare Workers runtime?
- Is it too large for the use case?
- Does it require unsupported runtime APIs?
- Are there known vulnerabilities?

## Keeping dependencies current

Recommended habits:

- Check outdated packages regularly.
- Update small safe packages often.
- Review major version updates carefully.
- Read changelogs for framework/runtime packages.
- Test locally after updates.
- Do not update everything blindly before production deployment.

Useful commands:

```powershell
npm outdated
npm audit
npm update
```

For pnpm:

```powershell
pnpm outdated
pnpm audit
pnpm update
```

## Lockfiles

Commit the lockfile:

- `package-lock.json`
- `pnpm-lock.yaml`
- `yarn.lock`

Lockfiles help teammates, CI, and deployment use the same dependency versions.

## AI agent instruction

When adding an API or dependency, the AI agent must explain:

1. Why it is needed
2. Whether Cloudflare has a native alternative
3. Where private values are stored
4. What environment variables are required
5. What happens when the API fails
6. How to test it locally
7. Any security or cost risk

Do not add packages or APIs silently.
