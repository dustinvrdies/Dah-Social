-- 0002_bookmarks.sql
-- Bookmarks and notifications

create table if not exists bookmarks (
  id varchar primary key default gen_random_uuid(),
  user_id varchar not null references users(id) on delete cascade,
  post_id varchar not null references posts(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists bookmarks_user_post_uq on bookmarks(user_id, post_id);
create index if not exists bookmarks_user_id_idx on bookmarks(user_id);
create index if not exists bookmarks_post_id_idx on bookmarks(post_id);
create index if not exists bookmarks_created_at_idx on bookmarks(created_at desc);

create table if not exists notifications (
  id varchar primary key default gen_random_uuid(),
  to_user_id varchar not null references users(id) on delete cascade,
  from_user_id varchar references users(id) on delete set null,
  type varchar(32) not null,
  entity_type varchar(32) not null,
  entity_id varchar not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_to_user_id_idx on notifications(to_user_id);
create index if not exists notifications_is_read_idx on notifications(is_read);
create index if not exists notifications_created_at_idx on notifications(created_at desc);
