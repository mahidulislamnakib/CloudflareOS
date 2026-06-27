PRAGMA foreign_keys = ON;

BEGIN;

CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL COLLATE NOCASE UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  identity_subject TEXT NOT NULL UNIQUE,
  email TEXT COLLATE NOCASE,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE UNIQUE INDEX users_email_unique_when_present
  ON users(email)
  WHERE email IS NOT NULL;

CREATE TABLE memberships (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'developer', 'reviewer', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'removed')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (organization_id, user_id)
);

CREATE INDEX memberships_by_user ON memberships(user_id, status);
CREATE INDEX memberships_by_organization ON memberships(organization_id, status, role);

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (organization_id, slug)
);

CREATE INDEX projects_by_organization ON projects(organization_id, status, updated_at DESC);

CREATE TABLE project_memberships (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  membership_id TEXT NOT NULL REFERENCES memberships(id) ON DELETE RESTRICT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'maintainer', 'developer', 'reviewer', 'viewer')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (project_id, membership_id)
);

CREATE INDEX project_memberships_by_membership ON project_memberships(membership_id, project_id);

CREATE TABLE repositories (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  provider TEXT NOT NULL CHECK (provider IN ('github', 'gitlab', 'bitbucket', 'other')),
  external_repository_id TEXT,
  owner_name TEXT NOT NULL,
  repository_name TEXT NOT NULL,
  default_branch TEXT NOT NULL DEFAULT 'main',
  integration_reference TEXT,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'ready', 'syncing', 'failed', 'archived')),
  last_indexed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (project_id, provider, owner_name, repository_name)
);

CREATE UNIQUE INDEX repositories_external_id_unique_when_present
  ON repositories(provider, external_repository_id)
  WHERE external_repository_id IS NOT NULL;

CREATE TABLE workspaces (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  owner_membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  workspace_type TEXT NOT NULL CHECK (workspace_type IN ('planning', 'coding', 'review', 'debug')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  branch_name TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX workspaces_by_project ON workspaces(project_id, status, updated_at DESC);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  workspace_id TEXT REFERENCES workspaces(id) ON DELETE SET NULL,
  parent_task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  assigned_membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('plan', 'feature', 'bug', 'migration', 'security', 'verification', 'deploy')),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'blocked', 'ready_for_verification', 'complete', 'deferred')),
  approval_status TEXT NOT NULL DEFAULT 'not_required' CHECK (approval_status IN ('not_required', 'pending', 'approved', 'rejected')),
  priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  acceptance_criteria TEXT,
  verification_reference TEXT,
  risk_level TEXT NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX tasks_by_project_status ON tasks(project_id, status, priority, updated_at DESC);
CREATE INDEX tasks_by_workspace_status ON tasks(workspace_id, status, updated_at DESC);
CREATE INDEX tasks_by_assignee ON tasks(assigned_membership_id, status, updated_at DESC);

CREATE TABLE ai_provider_routes (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id) ON DELETE RESTRICT,
  scope TEXT NOT NULL CHECK (scope IN ('platform', 'organization')),
  slug TEXT NOT NULL COLLATE NOCASE,
  display_name TEXT NOT NULL,
  provider_kind TEXT NOT NULL CHECK (provider_kind IN ('workers_ai', 'ai_gateway_native', 'openrouter_via_gateway', 'openai_compatible', 'external_coding_agent', 'custom_https')),
  integration_mode TEXT NOT NULL CHECK (integration_mode IN ('binding', 'gateway', 'openai_compatible', 'agent_protocol', 'custom_https')),
  secret_reference TEXT,
  endpoint_reference TEXT,
  default_model TEXT,
  capability_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'disabled' CHECK (status IN ('disabled', 'active', 'degraded', 'retired')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK ((scope = 'platform' AND organization_id IS NULL) OR (scope = 'organization' AND organization_id IS NOT NULL))
);

CREATE UNIQUE INDEX ai_provider_routes_platform_slug
  ON ai_provider_routes(slug)
  WHERE organization_id IS NULL;
CREATE UNIQUE INDEX ai_provider_routes_organization_slug
  ON ai_provider_routes(organization_id, slug)
  WHERE organization_id IS NOT NULL;

CREATE TABLE ai_model_profiles (
  id TEXT PRIMARY KEY,
  provider_route_id TEXT NOT NULL REFERENCES ai_provider_routes(id) ON DELETE RESTRICT,
  model_identifier TEXT NOT NULL,
  display_name TEXT NOT NULL,
  intended_use TEXT NOT NULL CHECK (intended_use IN ('fast_chat', 'planning', 'code_reasoning', 'embedding', 'vision', 'tool_use')),
  max_input_tokens INTEGER,
  max_output_tokens INTEGER,
  status TEXT NOT NULL DEFAULT 'disabled' CHECK (status IN ('disabled', 'active', 'deprecated')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (provider_route_id, model_identifier)
);

CREATE INDEX ai_model_profiles_by_use ON ai_model_profiles(intended_use, status);

CREATE TABLE agent_sessions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  workspace_id TEXT REFERENCES workspaces(id) ON DELETE SET NULL,
  initiated_by_membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  provider_route_id TEXT REFERENCES ai_provider_routes(id) ON DELETE SET NULL,
  model_profile_id TEXT REFERENCES ai_model_profiles(id) ON DELETE SET NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('chat', 'plan', 'coding', 'review', 'debug')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed', 'cancelled')),
  context_artifact_key TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  ended_at TEXT
);

CREATE INDEX agent_sessions_by_project ON agent_sessions(project_id, status, updated_at DESC);

CREATE TABLE agent_runs (
  id TEXT PRIMARY KEY,
  agent_session_id TEXT NOT NULL REFERENCES agent_sessions(id) ON DELETE RESTRICT,
  task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  run_type TEXT NOT NULL CHECK (run_type IN ('plan', 'read', 'write', 'test', 'index', 'review', 'deploy_check')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'waiting_approval', 'succeeded', 'failed', 'cancelled')),
  provider_route_id TEXT REFERENCES ai_provider_routes(id) ON DELETE SET NULL,
  model_profile_id TEXT REFERENCES ai_model_profiles(id) ON DELETE SET NULL,
  input_summary TEXT,
  output_summary TEXT,
  started_at TEXT,
  finished_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX agent_runs_by_session ON agent_runs(agent_session_id, created_at DESC);
CREATE INDEX agent_runs_by_task ON agent_runs(task_id, status, created_at DESC);

CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  agent_run_id TEXT REFERENCES agent_runs(id) ON DELETE SET NULL,
  requested_by_membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  reviewed_by_membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('code_write', 'migration', 'external_request', 'deployment', 'secret_change', 'repository_write')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'expired')),
  request_summary TEXT NOT NULL,
  decision_note TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  decided_at TEXT
);

CREATE INDEX approvals_pending_by_project ON approvals(project_id, status, created_at DESC);
CREATE INDEX approvals_by_run ON approvals(agent_run_id, status);

CREATE TABLE artifacts (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  agent_run_id TEXT REFERENCES agent_runs(id) ON DELETE SET NULL,
  artifact_type TEXT NOT NULL CHECK (artifact_type IN ('plan', 'diff', 'test_log', 'build_log', 'review_report', 'index', 'export')),
  storage_key TEXT NOT NULL UNIQUE,
  content_type TEXT,
  byte_size INTEGER CHECK (byte_size IS NULL OR byte_size >= 0),
  sha256 TEXT,
  retention_until TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX artifacts_by_project ON artifacts(project_id, created_at DESC);
CREATE INDEX artifacts_by_run ON artifacts(agent_run_id, created_at DESC);

CREATE TABLE deployment_records (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  repository_id TEXT REFERENCES repositories(id) ON DELETE SET NULL,
  initiated_by_membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  environment TEXT NOT NULL CHECK (environment IN ('preview', 'staging', 'production')),
  provider TEXT NOT NULL CHECK (provider IN ('cloudflare', 'other')),
  external_deployment_id TEXT,
  source_reference TEXT,
  status TEXT NOT NULL CHECK (status IN ('queued', 'building', 'succeeded', 'failed', 'rolled_back', 'cancelled')),
  verification_summary TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  finished_at TEXT
);

CREATE INDEX deployment_records_by_project ON deployment_records(project_id, environment, created_at DESC);

CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('user', 'agent', 'system')),
  actor_reference TEXT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX audit_events_by_organization ON audit_events(organization_id, created_at DESC);
CREATE INDEX audit_events_by_project ON audit_events(project_id, created_at DESC);

COMMIT;
