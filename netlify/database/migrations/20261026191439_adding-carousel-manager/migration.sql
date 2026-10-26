-- ========================================
-- VIEWPORT DISPLAY
-- ========================================

CREATE TABLE viewport_display (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

INSERT INTO viewport_display (id, name)
VALUES
    (1, 'Mobile'),
    (2, 'Desktop');


-- ========================================
-- CAROUSEL ITEMS
-- ========================================

CREATE TABLE carousel_items (
    id SERIAL PRIMARY KEY,
    hyperlink TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ========================================
-- CAROUSEL IMAGES
-- ========================================

CREATE TABLE carousel_images (
    id SERIAL PRIMARY KEY,

    carousel_item_id INTEGER NOT NULL
        REFERENCES carousel_items(id)
        ON DELETE CASCADE,

    image_key TEXT NOT NULL,

    viewport_id INTEGER NOT NULL
        REFERENCES viewport_display(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_carousel_item_viewport
        UNIQUE (carousel_item_id, viewport_id)
);


-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX idx_carousel_items_display_order
    ON carousel_items(display_order);

CREATE INDEX idx_carousel_images_carousel_item
    ON carousel_images(carousel_item_id);