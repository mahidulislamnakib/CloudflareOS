# Beginner Glossary

This page explains common words in simple English.

## Cloudflare

A platform that helps you build, host, protect, and speed up websites and apps.

## Cloudflare dashboard

The website where you manage your Cloudflare account, domains, Workers, databases, storage, and settings.

## Wrangler

The command-line tool for Cloudflare projects.

Simple meaning: it lets your computer talk to Cloudflare.

Example jobs:

- Start local development
- Create D1 databases
- Deploy Workers
- Manage secrets

## Worker

Small backend code that runs on Cloudflare.

Use it for APIs, forms, webhooks, and app logic.

## Pages

A Cloudflare product for hosting websites.

Use it when you have a frontend like a React, Next.js, or static website.

## D1

Cloudflare's SQL database.

Use it for structured data like:

- Users
- Articles
- Products
- Orders
- Categories

## R2

Cloudflare's file storage.

Use it for:

- Images
- PDFs
- Videos
- Backups
- Uploads

Do not put big files inside D1.

## KV

Fast key-value storage.

Simple meaning: store small pieces of data by name.

Good for cache, settings, and feature flags.

Do not use it as your main database for important transactions.

## Queue

A waiting line for background work.

Example: user uploads an image, and the image resize job runs later.

## Workflow

A step-by-step process that can continue over time.

Example: article submitted → editor reviews → article publishes → newsletter sends.

## Durable Object

A special Cloudflare tool for one shared live thing.

Example:

- One chat room
- One live document
- One game room
- One inventory lock

## Binding

A connection between your Worker code and a Cloudflare service.

Example: your Worker needs a D1 binding to talk to your D1 database.

## Secret

A private value your app needs but nobody should see.

Examples:

- API key
- Password
- Token

Never write secrets directly in GitHub.

## Migration

A database change file.

Example: create an `articles` table or add a `slug` column.

## Deploy

Send your project from your computer to Cloudflare so people can use it online.

## Production

The real live version of your app.

Be careful with production. Always check before changing data, secrets, or deployment settings.

## Staging

A test version of your app before production.

Use staging to test safely.

## Rollback

Go back to the previous working version after a problem.

## API

A way for frontend and backend to talk.

Example: the admin page sends article data to the API, and the API saves it to D1.

## Cache

Saved data that helps your site load faster.

Be careful: do not cache private admin pages or user-specific data by mistake.

## Rate limit

A rule that stops too many requests from one person or bot.

Useful for login, forms, and APIs.

## Turnstile

Cloudflare's human check for forms.

It helps reduce spam without a traditional captcha.

## Access

Cloudflare's way to protect private pages or tools.

Good for admin areas and internal dashboards.
