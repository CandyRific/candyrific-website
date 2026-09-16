ALTER TABLE products
DROP COLUMN IF EXISTS brand_id,
DROP COLUMN IF EXISTS season_id;


CREATE TABLE product_seasons (
  product_id INTEGER NOT NULL,
  season_id INTEGER NOT NULL,

  PRIMARY KEY (product_id, season_id),

  CONSTRAINT fk_product_seasons_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_product_seasons_season
    FOREIGN KEY (season_id)
    REFERENCES seasons(id)
    ON DELETE CASCADE
);


CREATE INDEX idx_product_seasons_product_id
  ON product_seasons(product_id);


CREATE INDEX idx_product_seasons_season_id
  ON product_seasons(season_id);