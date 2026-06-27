# DeveloperB Brand Boundary

## Product name

**DeveloperB** is the product name.

> **From real problems to build-ready products.**

Use DeveloperB in product UI, public copy, workspace titles, package names, Worker names, generated documents, and onboarding material.

## Provider references

Cloudflare may be named only as a factual technical provider or integration, for example:

- Built with Cloudflare Workers
- Uses Cloudflare D1 or R2
- Cloudflare Access protects the internal preview
- Cloudflare AI Gateway is an optional model-control layer

Do not use a provider name as part of the DeveloperB product name, logo, badge, navigation label, or marketing identity. Do not imply affiliation, sponsorship, endorsement, certification, or partnership unless one exists in writing.

## Independent visual identity

DeveloperB uses its own name, DB mark, copy, colors, and layouts. Do not copy provider logos, proprietary marks, or a provider's product identity into the DeveloperB UI.

## Naming migration

The following implementation names should use DeveloperB:

- npm package: `developerb-workspace`
- Worker configuration: `developerb-workspace`
- Worker health service name: `developerb-workspace`
- UI title and metadata: DeveloperB

The existing source-repository name is a separate GitHub migration because renaming it can affect Git remotes, GitHub App connections, deployment configuration, and existing links. Complete that platform migration after the DeveloperB Worker preview is verified.

## Verification

Before a release, check:

```text
- Product UI says DeveloperB.
- No old product brand appears in metadata, package name, Worker name, API service name, or generated output.
- Provider names appear only in factual infrastructure contexts.
- No provider logo or affiliation claim appears in the UI.
- GitHub repository and Cloudflare Worker migration steps are recorded before changing live integrations.
```
