
WITH ordered_products AS (
    SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY item_number ASC) AS position
    FROM products
)
UPDATE products
SET display_order = ordered_products.position
FROM ordered_products
WHERE products.id = ordered_products.id;