# AI Chatbot Architecture

A Cloudflare-first architecture for building an AI chatbot with safe prompts, user sessions, retrieval, file knowledge, analytics, rate limits, and production controls.

---

## Goal

Build an AI chatbot that starts simple, avoids unnecessary complexity, and can grow into a reliable product.

This architecture is designed for:

- website chat assistants
- support bots
- internal copilots
- document Q&A tools
- course/resource assistants
- product recommendation assistants
- SaaS AI helpers

---

## Recommended starting stack

| Need | Service |
| --- | --- |
| Frontend | Pages or Workers |
| Chat API | Workers |
| AI model | Workers AI or AI Gateway |
| Conversations | D1 |
| Source files | R2 |
| Semantic search | Vectorize or AutoRAG |
| Background jobs | Queues |
| Multi-step ingestion | Workflows |
| Public abuse protection | Turnstile / rate limits |
| Admin protection | Access |
| Usage analytics | Analytics Engine |

Start with Workers, D1, and Workers AI. Add Vectorize or AutoRAG only when the bot needs knowledge retrieval.

---

## Architecture overview

```text
User
  ↓
Chat UI on Pages or Workers
  ↓
Workers API
  ├── D1 conversations and settings
  ├── Workers AI or AI Gateway model call
  ├── Vectorize or AutoRAG retrieval when needed
  ├── R2 source documents
  ├── Queues for slow jobs
  └── Analytics Engine usage events

Admin
  ↓
Cloudflare Access
  ↓
Knowledge/admin dashboard
```

---

## Simple chatbot flow

```text
User sends message
  ↓
Worker validates request
  ↓
Worker checks rate limits and permissions
  ↓
Worker loads recent conversation from D1
  ↓
Worker calls model
  ↓
Worker stores answer in D1
  ↓
User receives answer
```

---

## Retrieval chatbot flow

Use retrieval when the chatbot must answer from approved documents.

```text
User asks question
  ↓
Worker checks access
  ↓
Query is embedded or passed to retrieval service
  ↓
Vectorize or AutoRAG finds relevant content
  ↓
Worker sends grounded context to model
  ↓
Answer returns with source references when possible
```

---

## Suggested D1 tables

```text
users
chatbots
conversations
messages
knowledge_sources
source_documents
retrieval_logs
model_runs
usage_limits
feedback
audit_logs
settings
```

Minimum message fields:

```text
id
conversation_id
role
content
model
status
created_at
```

Minimum knowledge source fields:

```text
id
chatbot_id
name
type
status
created_at
updated_at
```

---

## Source document model

Store source files in R2 and metadata in D1.

```text
R2:
ai-chatbot/{chatbot_id}/sources/{document_id}.pdf

D1 source_documents table:
id
chatbot_id
object_key
content_type
status
indexed_at
created_at
```

Do not store large source files directly in D1.

---

## Model choice

Use Workers AI when:

- you want Cloudflare-native model inference
- the model fits the task
- the feature is simple or early-stage

Use AI Gateway when:

- you use external AI providers
- you need provider observability
- you want caching, rate control, or provider switching
- multiple products share AI traffic

---

## Retrieval choice

Use Vectorize when:

- you need control over chunking
- you manage your own embeddings
- you need metadata filtering
- you want custom retrieval behavior

Use AutoRAG when:

- you want a managed retrieval path
- you want to move faster
- document Q&A is the primary goal
- you do not need full retrieval control yet

---

## Security model

Every AI request should check:

```text
Authenticated or allowed user
  ↓
Usage limit
  ↓
Bot/project permission
  ↓
Input validation
  ↓
Retrieval access rules
  ↓
Model call
  ↓
Output handling
```

Important rules:

- never expose provider keys in the frontend
- do not use model output as an authorization decision
- do not send secrets to the model
- filter retrieved documents by user permission
- add rate limits for public chat
- keep admin tools protected

---

## Prompt management

Treat prompts like product code.

Minimum prompt fields:

```text
id
chatbot_id
name
version
system_prompt
status
created_at
updated_at
```

Prompt rules:

- keep prompts short and clear
- version important prompts
- test with real examples
- keep private instructions out of client code
- review prompts after production incidents

---

## Background jobs

Use Queues for:

- document indexing
- embedding generation
- transcript summary
- email notification
- usage report generation
- feedback processing

Use Workflows for:

- multi-step ingestion
- large document processing
- scheduled knowledge refresh
- review and approval processes

---

## Analytics

Use Analytics Engine for:

- chat started
- message sent
- model run completed
- retrieval used
- feedback submitted
- limit reached
- error occurred

Do not store sensitive prompt content in analytics events.

---

## Production checklist

Before launch:

- [ ] Public chat endpoint has rate limits
- [ ] Provider keys are stored as secrets
- [ ] Conversation storage policy is defined
- [ ] Knowledge source permissions are enforced
- [ ] Source files are stored in R2
- [ ] Message records are stored in D1
- [ ] Prompt versions are tracked
- [ ] AI output has safe fallback behavior
- [ ] Admin tools are protected
- [ ] Usage limits exist
- [ ] Sensitive data rules are documented
- [ ] Retrieval quality is tested
- [ ] Rollback plan exists

---

## Common mistakes

- allowing unlimited anonymous chat
- exposing provider keys in frontend code
- assuming AI answers are always correct
- using model output for permissions
- indexing private documents without access rules
- storing large documents in D1
- skipping prompt versioning
- running slow ingestion inside user requests
- not defining data retention rules

---

## Related docs

- [`catalog/workers-ai.md`](../catalog/workers-ai.md)
- [`catalog/ai-gateway.md`](../catalog/ai-gateway.md)
- [`catalog/vectorize.md`](../catalog/vectorize.md)
- [`catalog/autorag.md`](../catalog/autorag.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
