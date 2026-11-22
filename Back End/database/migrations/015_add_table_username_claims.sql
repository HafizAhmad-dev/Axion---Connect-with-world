CREATE TABLE username_claims (
    username VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    claim_type VARCHAR(10) NOT NULL
        CHECK (claim_type IN ('current', 'previous')),
    expires_at TIMESTAMPTZ,

    CHECK (
        (claim_type = 'current' AND expires_at IS NULL)
        OR
        (claim_type = 'previous' AND expires_at IS NOT NULL)
    )
);