-- 0003_marketplace_media.sql
-- Adds media tables for posts and marketplace listings.

create table if not exists post_media (
  id varchar primary key default gen_random_uuid(),
  post_id varchar not null references posts(id) on delete cascade,
  url text not null,
  type varchar(16) not null,
  width varchar(16),
  height varchar(16),
  created_at timestamptz not null default now()
);

create index if not exists post_media_post_id_idx on post_media(post_id);

create table if not exists listings (
  id varchar primary key default gen_random_uuid(),
  user_id varchar not null references users(id) on delete cascade,
  title text not null,
  description text not null default '',
  category varchar(64) not null,
  condition varchar(32) not null default 'used',
  price_cents integer not null default 0,
  currency varchar(8) not null default 'USD',
  location text,
  is_sold boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists listings_user_id_idx on listings(user_id);
create index if not exists listings_created_at_idx on listings(created_at desc);
create index if not exists listings_category_idx on listings(category);
create index if not exists listings_price_cents_idx on listings(price_cents);

create table if not exists listing_media (
  id varchar primary key default gen_random_uuid(),
  listing_id varchar not null references listings(id) on delete cascade,
  url text not null,
  type varchar(16) not null,
  created_at timestamptz not null default now()
);

create index if not exists listing_media_listing_id_idx on listing_media(listing_id);
