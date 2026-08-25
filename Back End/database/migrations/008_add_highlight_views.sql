CREATE TABLE highlight_views (
    highlight_id UUID NOT NULL
        REFERENCES highlights(id)
        ON DELETE CASCADE,

    viewer_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (highlight_id, viewer_id)
);

CREATE INDEX idx_highlight_views_viewer_id
    ON highlight_views(viewer_id);