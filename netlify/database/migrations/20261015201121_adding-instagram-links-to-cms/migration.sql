CREATE TABLE instagram_posts (
    id SERIAL PRIMARY KEY,
    instagram_link TEXT NOT NULL UNIQUE
);