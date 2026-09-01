
alter table products
drop column image_key;

create table product_images (
    id bigserial primary key,
    product_id bigint not null references products(id) on delete cascade,
    image_key text not null,
    display_order integer not null default 0,
    created_at timestamptz not null default now()
);