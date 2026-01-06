-- 0000_init.sql
-- Core tables for DAH Social

create table if not exists users (
  id varchar primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  user_id varchar primary key references users(id) on delete cascade,
  display_name text,
  bio text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on profiles(user_id);

create table if not exists posts (
  id varchar primary key default gen_random_uuid(),
  user_id varchar not null references users(id) on delete cascade,
  content text not null,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists posts_user_id_idx on posts(user_id);
create index if not exists posts_created_at_idx on posts(created_at desc);

create table if not exists comments (
  id varchar primary key default gen_random_uuid(),
  post_id varchar not null references posts(id) on delete cascade,
  user_id varchar not null references users(id) on delete cascade,
  content text not null,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_id_idx on comments(post_id);
create index if not exists comments_user_id_idx on comments(user_id);
create index if not exists comments_created_at_idx on comments(created_at desc);
