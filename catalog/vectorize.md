# Cloudflare Vectorize

Cloudflare Vectorize is a vector database for AI search and retrieval use cases.

Use Vectorize when your application needs to find content by meaning instead of exact keywords.

---

## Simple explanation

Vectorize stores embeddings: numeric representations of text, images, or other content.

When someone searches, your app converts the question into an embedding and finds the closest matching stored vectors.

```text
Document or content
  ↓
Create embedding
  ↓
Store vector in Vectorize

User question
  ↓
Create query embedding
  ↓
Vectorize finds similar content
```

---

## What problem it solves

Vectorize helps applications perform semantic search and retrieval.

It is useful for:

- knowledge-base search
- AI chat with company documents
- FAQ retrieval
- similar-content recommendations
- semantic product search
- document matching
- retrieval-augmented generation patterns
- content clustering

---

## When to use Vectorize

Use Vectorize when:

- keyword search is not enough
- users ask natural-language questions
- you need to retrieve relevant document chunks for AI
- you want similarity search across content
- you are building a knowledge base or AI assistant

Good examples:

- search internal policy documents by meaning
- retrieve course content for a learner question
- find related news articles
- power an AI support assistant
- recommend similar products or resources

---

## When not to use Vectorize

Vectorize may not be the best fit when:

- exact filtering or SQL reporting is the main need
- you only need simple keyword search
- you need transactional business records
- you need file storage
- you have no embedding generation step

Use:

- D1 for relational records and SQL filtering
- R2 for source documents and files
- Workers AI or another model provider for embeddings
- KV for lightweight cache/config

---

## Beginner example

A knowledge-base assistant flow:

```text
Upload document
  ↓
Store source file in R2
  ↓
Split content into chunks
  ↓
Create embeddings
  ↓
Store vectors in Vectorize

User asks question
  ↓
Create question embedding
  ↓
Find relevant chunks in Vectorize
  ↓
Use results in an AI answer
```

---

## Production notes

For production projects:

- define a chunking strategy before indexing content
- store source documents in R2
- store metadata and ownership in D1
- include metadata for filtering and access rules
- version embedding models and index strategy
- re-index content when source documents change
- keep a deletion process for removed content
- use queues for large indexing jobs
- test search relevance with real user questions

---

## Security notes

Do:

- preserve document ownership and access metadata
- filter retrieval results by user permissions
- keep private source content in protected storage
- validate documents before indexing
- log indexing failures without exposing sensitive text

Do not:

- return private chunks to unauthorized users
- assume semantic search automatically enforces permissions
- index sensitive data without a retention and access plan
- expose write/index endpoints publicly
- store secrets in metadata

---

## Cost awareness

Vector search cost and performance can be affected by:

- number of vectors
- embedding dimensions
- indexing volume
- query volume
- repeated re-indexing
- source document size

Keep chunks useful, avoid duplicate indexing, and index only content that users need to search.

---

## Common mistakes

- using Vectorize as a replacement for D1
- storing source files only in the vector index
- indexing whole documents as one giant chunk
- ignoring permissions in retrieval
- changing embedding models without a migration plan
- not deleting vectors when source content is removed
- expecting semantic search to replace all filters

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers AI | Creates embeddings or generates answers |
| AI Gateway | Adds controls around external AI model calls |
| R2 | Stores source documents and files |
| D1 | Stores metadata, ownership, and document records |
| Queues | Handles async indexing jobs |
| Workflows | Coordinates multi-step ingestion processes |
| Workers | Runs search and authorization logic |
| AutoRAG | Provides a more managed retrieval option |

---

## Good starter use cases

- AI knowledge-base search
- Internal document assistant
- Semantic resource search
- Related-content recommendations
- Support chatbot retrieval layer

---

## Official sources

- Cloudflare Vectorize documentation
- Vectorize indexes documentation
- Vectorize query and metadata documentation

---

## Freshness

Last checked: 2026-06-26
Risk level: high

Vectorize features, limits, index behavior, and pricing can change. Always verify current official documentation before production use.
