-- 0001_social.sql
-- Social features: likes, follows, reports

create table if not exists post_likes (
  user_id varchar not null references users(id) on delete cascade,
  post_id varchar not null references posts(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists post_likes_user_post_uniq on post_likes(user_id, post_id);
create index if not exists post_likes_post_id_idx on post_likes(post_id);
create index if not exists post_likes_user_id_idx on post_likes(user_id);

create table if not exists follows (
  follower_id varchar not null references users(id) on delete cascade,
  following_id varchar not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists follows_follower_following_uniq on follows(follower_id, following_id);
create index if not exists follows_follower_id_idx on follows(follower_id);
create index if not exists follows_following_id_idx on follows(following_id);

create table if not exists reports (
  id varchar primary key default gen_random_uuid(),
  reporter_id varchar not null references users(id) on delete cascade,
  target_type text not null,
  target_id varchar not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists reports_reporter_id_idx on reports(reporter_id);
create index if not exists reports_target_idx on reports(target_type, target_id);
create index if not exists reports_created_at_idx on reports(created_at desc);
