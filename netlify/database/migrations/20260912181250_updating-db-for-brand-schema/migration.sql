ALTER TABLE brands
DROP COLUMN products;


CREATE TABLE product_brands (
  product_id BIGINT NOT NULL,
  brand_id BIGINT NOT NULL,

  PRIMARY KEY (
    product_id,
    brand_id
  ),

  CONSTRAINT product_brands_product_fk
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,

  CONSTRAINT product_brands_brand_fk
    FOREIGN KEY (brand_id)
    REFERENCES brands(id)
    ON DELETE CASCADE
);