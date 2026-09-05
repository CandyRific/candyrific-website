ALTER TABLE products
ADD COLUMN amazon_link TEXT UNIQUE,
ADD COLUMN amazon_link_selection_count INT;
