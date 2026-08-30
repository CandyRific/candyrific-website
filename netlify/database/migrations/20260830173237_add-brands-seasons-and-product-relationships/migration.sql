CREATE TABLE brands (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    image_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE seasons (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    image_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE products
ADD COLUMN item_number TEXT UNIQUE,
ADD COLUMN brand_id BIGINT,
ADD COLUMN season_id BIGINT;

ALTER TABLE products
ADD CONSTRAINT fk_products_brand
FOREIGN KEY (brand_id)
REFERENCES brands(id);

ALTER TABLE products
ADD CONSTRAINT fk_products_season
FOREIGN KEY (season_id)
REFERENCES seasons(id);