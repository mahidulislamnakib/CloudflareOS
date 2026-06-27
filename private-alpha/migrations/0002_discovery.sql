PRAGMA foreign_keys = ON;

BEGIN;

CREATE TABLE discovery_intakes (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  title TEXT,
  input_text TEXT NOT NULL,
  problem_summary TEXT,
  language_code TEXT NOT NULL DEFAULT 'en',
  channel TEXT NOT NULL DEFAULT 'conversation' CHECK (channel IN ('conversation', 'note', 'import')),
  status TEXT NOT NULL DEFAULT 'discovery' CHECK (status IN ('draft', 'discovery', 'needs_clarification', 'solution_review', 'blueprint_ready', 'not_building', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX discovery_intakes_by_organization
  ON discovery_intakes(organization_id, status, updated_at DESC);

CREATE TABLE discovery_sessions (
  id TEXT PRIMARY KEY,
  discovery_intake_id TEXT NOT NULL REFERENCES discovery_intakes(id) ON DELETE RESTRICT,
  membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  provider_route_id TEXT REFERENCES ai_provider_routes(id) ON DELETE SET NULL,
  model_profile_id TEXT REFERENCES ai_model_profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  transcript_artifact_key TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  ended_at TEXT
);

CREATE INDEX discovery_sessions_by_intake
  ON discovery_sessions(discovery_intake_id, status, updated_at DESC);

CREATE TABLE discovery_findings (
  id TEXT PRIMARY KEY,
  discovery_intake_id TEXT NOT NULL REFERENCES discovery_intakes(id) ON DELETE RESTRICT,
  discovery_session_id TEXT REFERENCES discovery_sessions(id) ON DELETE SET NULL,
  finding_type TEXT NOT NULL CHECK (finding_type IN ('confirmed_fact', 'assumption', 'unanswered_question', 'pain_point', 'stakeholder', 'constraint', 'success_metric', 'risk')),
  statement TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'medium' CHECK (confidence IN ('low', 'medium', 'high')),
  review_status TEXT NOT NULL DEFAULT 'open' CHECK (review_status IN ('open', 'confirmed', 'rejected', 'resolved')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX discovery_findings_by_intake
  ON discovery_findings(discovery_intake_id, finding_type, review_status, created_at ASC);

CREATE TABLE solution_options (
  id TEXT PRIMARY KEY,
  discovery_intake_id TEXT NOT NULL REFERENCES discovery_intakes(id) ON DELETE RESTRICT,
  option_type TEXT NOT NULL CHECK (option_type IN ('do_not_build_yet', 'use_existing_tool', 'improve_manual_process', 'automate_workflow', 'lightweight_internal_tool', 'full_software_product')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  benefits TEXT,
  tradeoffs TEXT,
  complexity TEXT NOT NULL CHECK (complexity IN ('low', 'medium', 'high')),
  cost_direction TEXT NOT NULL CHECK (cost_direction IN ('low', 'medium', 'high')),
  recommended_rank INTEGER CHECK (recommended_rank IS NULL OR recommended_rank > 0),
  recommendation_reason TEXT,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'recommended', 'selected', 'rejected', 'deferred')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX solution_options_by_intake
  ON solution_options(discovery_intake_id, status, recommended_rank, created_at ASC);

CREATE TABLE project_blueprints (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  discovery_intake_id TEXT NOT NULL REFERENCES discovery_intakes(id) ON DELETE RESTRICT,
  selected_solution_option_id TEXT REFERENCES solution_options(id) ON DELETE SET NULL,
  membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  recommended_solution TEXT NOT NULL,
  mvp_scope TEXT NOT NULL,
  non_goals TEXT,
  user_roles_summary TEXT,
  technical_direction TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'accepted', 'converted_to_project', 'archived')),
  accepted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX project_blueprints_by_organization
  ON project_blueprints(organization_id, status, updated_at DESC);

CREATE TABLE blueprint_versions (
  id TEXT PRIMARY KEY,
  project_blueprint_id TEXT NOT NULL REFERENCES project_blueprints(id) ON DELETE RESTRICT,
  version_number INTEGER NOT NULL CHECK (version_number > 0),
  change_summary TEXT NOT NULL,
  content_artifact_key TEXT,
  membership_id TEXT REFERENCES memberships(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (project_blueprint_id, version_number)
);

CREATE INDEX blueprint_versions_by_blueprint
  ON blueprint_versions(project_blueprint_id, version_number DESC);

ALTER TABLE projects ADD COLUMN source_blueprint_id TEXT REFERENCES project_blueprints(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX projects_source_blueprint_unique_when_present
  ON projects(source_blueprint_id)
  WHERE source_blueprint_id IS NOT NULL;

COMMIT;
