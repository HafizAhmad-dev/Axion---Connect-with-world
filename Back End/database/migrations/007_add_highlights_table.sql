CREATE TABLE highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    type VARCHAR(10) NOT NULL
        CHECK (type IN ('text', 'image', 'video')),

    media_url TEXT,

    caption TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    expires_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT highlights_content_check
        CHECK (
            (type = 'text' AND caption IS NOT NULL AND media_url IS NULL)
            OR
            (type IN ('image', 'video') AND media_url IS NOT NULL)
        ),

    CONSTRAINT highlights_expiration_check
        CHECK (expires_at > created_at)
);

CREATE INDEX idx_highlights_user_id
    ON highlights(user_id);

CREATE INDEX idx_highlights_expires_at
    ON highlights(expires_at);