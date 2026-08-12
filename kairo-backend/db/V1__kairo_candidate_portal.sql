-- Reference schema for the Kairo candidate portal (also auto-created by Hibernate ddl-auto=update).
-- Apply to the LOCAL cloned database. Separate from QuikHire's recruiter-side tables.

CREATE TABLE IF NOT EXISTS kairo_candidate_accounts (
    id                     SERIAL PRIMARY KEY,
    candidate_id           VARCHAR(255) UNIQUE NOT NULL,
    username               VARCHAR(255) UNIQUE NOT NULL,
    email                  VARCHAR(255) UNIQUE NOT NULL,
    password               VARCHAR(255) NOT NULL,
    enabled                BOOLEAN NOT NULL DEFAULT TRUE,
    name                   VARCHAR(255),
    status                 VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    onboarding_source      VARCHAR(20),
    reset_token            VARCHAR(255),
    reset_token_expires_at TIMESTAMP,
    created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kairo_candidate_profiles (
    id                    SERIAL PRIMARY KEY,
    candidate_id          VARCHAR(255) UNIQUE NOT NULL,
    name                  VARCHAR(255),
    email                 VARCHAR(255),
    headline              VARCHAR(255),
    years_of_experience   NUMERIC(4,1),
    preferred_locations   TEXT[],
    preferred_roles       TEXT[],
    skills                TEXT[],
    priorities            TEXT[],
    seniority             VARCHAR(50),
    work_mode             VARCHAR(30),
    salary_target         INTEGER,
    availability          VARCHAR(50),
    source                VARCHAR(20),
    profile_completeness  INTEGER DEFAULT 0,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kairo_candidate_memories (
    id               BIGSERIAL PRIMARY KEY,
    candidate_id     VARCHAR(255) NOT NULL,
    preference_key   VARCHAR(100) NOT NULL,
    preference_value TEXT NOT NULL,
    source           VARCHAR(30) DEFAULT 'screening',
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidate_id, preference_key)
);
