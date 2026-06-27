CREATE TABLE IF NOT EXISTS background_jobs (
  job_id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('email', 'report', 'image')),
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN ('queued', 'processing', 'completed', 'retrying', 'dead_lettered', 'enqueue_failed')
  ),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT,
  dead_lettered_at TEXT,
  last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_background_jobs_status_updated
  ON background_jobs(status, updated_at DESC, job_id DESC);

CREATE INDEX IF NOT EXISTS idx_background_jobs_kind_created
  ON background_jobs(kind, created_at DESC, job_id DESC);
