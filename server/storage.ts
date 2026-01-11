import { db } from "./db";
import {
  users,
  profiles,
  posts,
  comments,
  postLikes,
  postMedia,
  listings,
  listingMedia,
  follows,
  reports,
  bookmarks,
  notifications,
  userConsents,
  emailVerifications,
  userVerifications,
  type User,
  type Profile,
  type Post,
  type Comment,
  type Notification,
  type UserConsent,
  type EmailVerification,
  type UserVerification,
} from "@shared/schema";
import { and, desc, eq, sql, asc, lt } from "drizzle-orm";

export interface PublicUser {
  id: string;
  username: string;
  profile: Profile | null;
  counts: {
    followers: number;
    following: number;
    posts: number;
  };
  viewer?: {
    isFollowing: boolean;
  };
}

export interface PostWithMeta extends Post {
  username: string;
  profile: Profile | null;
  likeCount: number;
  commentCount: number;
  media?: { url: string; type: string }[];
  viewer?: { liked: boolean; bookmarked?: boolean };
}

export interface CommentWithMeta extends Comment {
  username: string;
  profile: Profile | null;
}

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(username: string, passwordHash: string): Promise<User>;
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  upsertProfile(userId: string, data: { displayName?: string; bio?: string; avatarUrl?: string }): Promise<Profile>;
  getPublicUserByUsername(username: string, viewerId?: string): Promise<PublicUser | undefined>;
  listPosts(limit: number, cursor?: string, viewerId?: string, filters?: { q?: string; sort?: "new" | "top"; hasMedia?: boolean }): Promise<{ posts: PostWithMeta[]; nextCursor: string | null }>;
  listFollowingPosts(viewerId: string, limit: number, cursor?: string): Promise<{ posts: any[]; nextCursor: string | null }>;
  createPost(userId: string, content: string, media?: { url: string; type: "image" | "video" }[]): Promise<Post>;
  softDeletePost(postId: string, userId: string): Promise<boolean>;
  likePost(postId: string, userId: string): Promise<void>;
  unlikePost(postId: string, userId: string): Promise<void>;
  bookmarkPost(postId: string, userId: string): Promise<void>;
  unbookmarkPost(postId: string, userId: string): Promise<void>;
  listBookmarkedPosts(userId: string, limit: number, cursor?: string): Promise<{ posts: any[]; nextCursor: string | null }>;
  listComments(postId: string, limit: number, cursor?: string): Promise<{ comments: CommentWithMeta[]; nextCursor: string | null }>;
  createComment(postId: string, userId: string, content: string): Promise<Comment>;
  softDeleteComment(commentId: string, userId: string): Promise<boolean>;
  followUser(targetUserId: string, followerId: string): Promise<void>;
  unfollowUser(targetUserId: string, followerId: string): Promise<void>;
  createReport(reporterId: string, targetType: "post" | "comment" | "user", targetId: string, reason: string): Promise<void>;
  listNotifications(userId: string, limit: number, cursor?: string): Promise<{ notifications: Notification[]; nextCursor: string | null }>;
  markNotificationRead(userId: string, notificationId: string): Promise<boolean>;
  markAllNotificationsRead(userId: string): Promise<number>;
  listListings(filters: { q?: string; category?: string; minPriceCents?: number; maxPriceCents?: number; condition?: string; sort?: "new" | "price-asc" | "price-desc"; hasMedia?: boolean }, limit: number, cursor?: string, viewerId?: string): Promise<{ listings: any[]; nextCursor: string | null }>;
  createListing(userId: string, input: { title: string; description: string; category: string; condition: string; priceCents: number; currency: string; location?: string | null; media?: { url: string; type: "image" | "video" }[] }): Promise<any>;
  deleteListing(userId: string, listingId: string): Promise<boolean>;
  getListingById(listingId: string, viewerId?: string): Promise<any | null>;
}

class DbStorage implements IStorage {
  async getUserById(id: string) {
    const [u] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return u;
  }

  async getUserByUsername(username: string) {
    const [u] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return u;
  }

  async createUser(username: string, passwordHash: string) {
    const [u] = await db.insert(users).values({ username, passwordHash }).returning();
    return u;
  }

  async getProfileByUserId(userId: string) {
    const [p] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    return p;
  }

  async upsertProfile(userId: string, data: { displayName?: string; bio?: string; avatarUrl?: string }) {
    const [p] = await db
      .insert(profiles)
      .values({
        userId,
        displayName: data.displayName,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          displayName: data.displayName,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return p;
  }

  async getPublicUserByUsername(username: string, viewerId?: string) {
    const u = await this.getUserByUsername(username);
    if (!u) return undefined;

    const [p] = await db.select().from(profiles).where(eq(profiles.userId, u.id)).limit(1);

    const [{ c: followerCount }] = await db
      .select({ c: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followingId, u.id));

    const [{ c: followingCount }] = await db
      .select({ c: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followerId, u.id));

    const [{ c: postCount }] = await db
      .select({ c: sql<number>`count(*)` })
      .from(posts)
      .where(and(eq(posts.userId, u.id), eq(posts.isDeleted, false)));

    let isFollowing = false;
    if (viewerId) {
      const [row] = await db
        .select({ one: sql<number>`1` })
        .from(follows)
        .where(and(eq(follows.followerId, viewerId), eq(follows.followingId, u.id)))
        .limit(1);
      isFollowing = !!row;
    }

    return {
      id: u.id,
      username: u.username,
      profile: p ?? null,
      counts: {
        followers: Number(followerCount ?? 0),
        following: Number(followingCount ?? 0),
        posts: Number(postCount ?? 0),
      },
      viewer: viewerId ? { isFollowing } : undefined,
    };
  }

  async listPosts(limit: number, cursor?: string, viewerId?: string, filters?: { q?: string; sort?: "new" | "top"; hasMedia?: boolean }) {
    let cursorCreatedAt: Date | null = null;
    if (cursor) {
      const [c] = await db.select({ createdAt: posts.createdAt }).from(posts).where(eq(posts.id, cursor)).limit(1);
      cursorCreatedAt = c?.createdAt ?? null;
    }

    const baseWhere = cursorCreatedAt
      ? and(eq(posts.isDeleted, false), sql`(${posts.createdAt}, ${posts.id}) < (${cursorCreatedAt}, ${cursor})`)
      : eq(posts.isDeleted, false);

    const clauses: any[] = [baseWhere];

    if (filters?.q) {
      const q = `%${filters.q.replace(/%/g, "")}%`;
      clauses.push(sql`${posts.content} ilike ${q}`);
    }

    if (filters?.hasMedia) {
      clauses.push(sql`exists (select 1 from post_media pm where pm.post_id = ${posts.id})`);
    }

    const where = clauses.length === 1 ? clauses[0] : and(...clauses);

    const rows = await db
      .select({
        post: posts,
        username: users.username,
        profile: profiles,
        likeCount: sql<number>`coalesce((select count(*)::int from post_likes pl where pl.post_id = ${posts.id}), 0)`,
        commentCount: sql<number>`coalesce((select count(*)::int from comments c where c.post_id = ${posts.id} and c.is_deleted = false), 0)`,
        viewerLiked: viewerId ? sql<number>`case when exists(select 1 from post_likes vl where vl.post_id = ${posts.id} and vl.user_id = ${viewerId}) then 1 else 0 end` : sql<number>`0`,
      })
      .from(posts)
      .innerJoin(users, eq(users.id, posts.userId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(where)
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(limit);

    const mapped: PostWithMeta[] = rows.map((r: any) => ({
      ...r.post,
      username: r.username,
      profile: r.profile ?? null,
      likeCount: Number(r.likeCount ?? 0),
      commentCount: Number(r.commentCount ?? 0),
      viewer: viewerId ? { liked: Number(r.viewerLiked) === 1 } : undefined,
    }));

    const ids = mapped.map((p) => p.id);
    const mediaRows = ids.length
      ? await db.select({ postId: postMedia.postId, url: postMedia.url, type: postMedia.type }).from(postMedia).where(sql`${postMedia.postId} = any(${ids})`)
      : [];
    const mediaByPost = new Map<string, { url: string; type: string }[]>();
    for (const mr of mediaRows as any[]) {
      const arr = mediaByPost.get(mr.postId) ?? [];
      arr.push({ url: mr.url, type: mr.type });
      mediaByPost.set(mr.postId, arr);
    }
    for (const p of mapped) {
      p.media = mediaByPost.get(p.id) ?? [];
    }

    const nextCursor = mapped.length === limit ? mapped[mapped.length - 1].id : null;
    return { posts: mapped, nextCursor };
  }

  async listFollowingPosts(viewerId: string, limit: number, cursor?: string) {
    let cursorCreatedAt: Date | null = null;
    if (cursor) {
      const [p] = await db.select({ createdAt: posts.createdAt }).from(posts).where(eq(posts.id, cursor)).limit(1);
      cursorCreatedAt = p?.createdAt ?? null;
    }

    const baseWhere = cursorCreatedAt
      ? and(
          eq(posts.isDeleted, false),
          sql`${posts.userId} IN (SELECT ${follows.followingId} FROM ${follows} WHERE ${follows.followerId} = ${viewerId})`,
          sql`(${posts.createdAt}, ${posts.id}) < (${cursorCreatedAt}, ${cursor})`
        )
      : and(
          eq(posts.isDeleted, false),
          sql`${posts.userId} IN (SELECT ${follows.followingId} FROM ${follows} WHERE ${follows.followerId} = ${viewerId})`
        );

    const rows = await db
      .select({
        post: posts,
        username: users.username,
        profile: profiles,
        likeCount: sql<number>`(SELECT COUNT(*)::int FROM ${postLikes} pl WHERE pl.post_id = ${posts.id})`,
        commentCount: sql<number>`(SELECT COUNT(*)::int FROM ${comments} c WHERE c.post_id = ${posts.id} AND c.is_deleted = false)`,
        viewerLiked: sql<boolean>`EXISTS(SELECT 1 FROM ${postLikes} vpl WHERE vpl.post_id = ${posts.id} AND vpl.user_id = ${viewerId})`,
        viewerBookmarked: sql<boolean>`EXISTS(SELECT 1 FROM ${bookmarks} b WHERE b.post_id = ${posts.id} AND b.user_id = ${viewerId})`,
      })
      .from(posts)
      .innerJoin(users, eq(users.id, posts.userId))
      .leftJoin(profiles, eq(profiles.userId, posts.userId))
      .where(baseWhere)
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    const out = page.map((r) => ({
      ...r.post,
      author: { username: r.username, profile: r.profile ?? null },
      meta: { likeCount: r.likeCount, commentCount: r.commentCount, viewerLiked: r.viewerLiked, viewerBookmarked: r.viewerBookmarked },
    }));

    return { posts: out, nextCursor: hasMore ? page[page.length - 1]?.post.id ?? null : null };
  }

  async createPost(userId: string, content: string, media?: { url: string; type: "image" | "video" }[]) {
    const [p] = await db.insert(posts).values({ userId, content }).returning();
    if (media?.length) {
      const rows = media.slice(0, 10).map((m) => ({ postId: p.id, url: m.url, type: m.type }));
      await db.insert(postMedia).values(rows as any);
    }
    return p;
  }

  async softDeletePost(postId: string, userId: string) {
    const res = await db.update(posts).set({ isDeleted: true }).where(and(eq(posts.id, postId), eq(posts.userId, userId), eq(posts.isDeleted, false))).returning({ id: posts.id });
    return res.length > 0;
  }

  async likePost(postId: string, userId: string) {
    await db.insert(postLikes).values({ postId, userId }).onConflictDoNothing();
  }

  async unlikePost(postId: string, userId: string) {
    await db.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
  }

  async bookmarkPost(postId: string, userId: string) {
    await db.insert(bookmarks).values({ postId, userId }).onConflictDoNothing();
  }

  async unbookmarkPost(postId: string, userId: string) {
    await db.delete(bookmarks).where(and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)));
  }

  async listBookmarkedPosts(userId: string, limit: number, cursor?: string) {
    let cursorCreatedAt: Date | null = null;
    if (cursor) {
      const [b] = await db.select({ createdAt: bookmarks.createdAt }).from(bookmarks).where(eq(bookmarks.id, cursor)).limit(1);
      cursorCreatedAt = b?.createdAt ?? null;
    }

    const where = cursorCreatedAt
      ? and(sql`(${bookmarks.createdAt}, ${bookmarks.id}) < (${cursorCreatedAt}, ${cursor})`, eq(bookmarks.userId, userId))
      : eq(bookmarks.userId, userId);

    const rows = await db
      .select({
        bookmark: bookmarks,
        post: posts,
        username: users.username,
        profile: profiles,
        likeCount: sql<number>`(SELECT COUNT(*)::int FROM ${postLikes} pl WHERE pl.post_id = ${posts.id})`,
        commentCount: sql<number>`(SELECT COUNT(*)::int FROM ${comments} c WHERE c.post_id = ${posts.id} AND c.is_deleted = false)`,
      })
      .from(bookmarks)
      .innerJoin(posts, eq(posts.id, bookmarks.postId))
      .innerJoin(users, eq(users.id, posts.userId))
      .leftJoin(profiles, eq(profiles.userId, posts.userId))
      .where(where)
      .orderBy(desc(bookmarks.createdAt), desc(bookmarks.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    const out = page.map((r) => ({
      ...r.post,
      author: { username: r.username, profile: r.profile ?? null },
      meta: { likeCount: r.likeCount, commentCount: r.commentCount, viewerLiked: true, viewerBookmarked: true },
    }));

    return { posts: out, nextCursor: hasMore ? page[page.length - 1]?.bookmark.id ?? null : null };
  }

  async listComments(postId: string, limit: number, cursor?: string) {
    let cursorCreatedAt: Date | null = null;
    if (cursor) {
      const [c] = await db.select({ createdAt: comments.createdAt }).from(comments).where(eq(comments.id, cursor)).limit(1);
      cursorCreatedAt = c?.createdAt ?? null;
    }

    const where = cursorCreatedAt
      ? and(eq(comments.isDeleted, false), eq(comments.postId, postId), sql`(${comments.createdAt}, ${comments.id}) < (${cursorCreatedAt}, ${cursor})`)
      : and(eq(comments.isDeleted, false), eq(comments.postId, postId));

    const rows = await db
      .select({ comment: comments, username: users.username, profile: profiles })
      .from(comments)
      .innerJoin(users, eq(users.id, comments.userId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(where)
      .orderBy(desc(comments.createdAt), desc(comments.id))
      .limit(limit);

    const mapped: CommentWithMeta[] = rows.map((r: any) => ({
      ...r.comment,
      username: r.username,
      profile: r.profile ?? null,
    }));

    const nextCursor = mapped.length === limit ? mapped[mapped.length - 1].id : null;
    return { comments: mapped, nextCursor };
  }

  async createComment(postId: string, userId: string, content: string) {
    const [c] = await db.insert(comments).values({ postId, userId, content }).returning();
    return c;
  }

  async softDeleteComment(commentId: string, userId: string) {
    const res = await db.update(comments).set({ isDeleted: true }).where(and(eq(comments.id, commentId), eq(comments.userId, userId), eq(comments.isDeleted, false))).returning({ id: comments.id });
    return res.length > 0;
  }

  async followUser(targetUserId: string, followerId: string) {
    if (targetUserId === followerId) return;
    await db.insert(follows).values({ followerId, followingId: targetUserId }).onConflictDoNothing();
  }

  async unfollowUser(targetUserId: string, followerId: string) {
    await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, targetUserId)));
  }

  async createReport(reporterId: string, targetType: "post" | "comment" | "user", targetId: string, reason: string) {
    await db.insert(reports).values({ reporterId, targetType, targetId, reason });
  }

  async listNotifications(userId: string, limit: number, cursor?: string) {
    let cursorCreatedAt: Date | null = null;
    if (cursor) {
      const [n] = await db.select({ createdAt: notifications.createdAt }).from(notifications).where(eq(notifications.id, cursor)).limit(1);
      cursorCreatedAt = n?.createdAt ?? null;
    }

    const where = cursorCreatedAt
      ? and(eq(notifications.toUserId, userId), sql`(${notifications.createdAt}, ${notifications.id}) < (${cursorCreatedAt}, ${cursor})`)
      : eq(notifications.toUserId, userId);

    const rows = await db.select().from(notifications).where(where).orderBy(desc(notifications.createdAt), desc(notifications.id)).limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    return { notifications: page, nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null };
  }

  async markNotificationRead(userId: string, notificationId: string) {
    const res = await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.id, notificationId), eq(notifications.toUserId, userId))).returning({ id: notifications.id });
    return res.length > 0;
  }

  async markAllNotificationsRead(userId: string) {
    const res = await db.update(notifications).set({ isRead: true }).where(eq(notifications.toUserId, userId)).returning({ id: notifications.id });
    return res.length;
  }

  async listListings(
    filters: { q?: string; category?: string; minPriceCents?: number; maxPriceCents?: number; condition?: string; sort?: "new" | "price-asc" | "price-desc"; hasMedia?: boolean },
    limit: number,
    cursor?: string,
    _viewerId?: string
  ) {
    let cursorCreatedAt: Date | null = null;
    if (cursor) {
      const [c] = await db.select({ createdAt: listings.createdAt }).from(listings).where(eq(listings.id, cursor)).limit(1);
      cursorCreatedAt = c?.createdAt ?? null;
    }

    const baseWhere = cursorCreatedAt ? sql`(${listings.createdAt}, ${listings.id}) < (${cursorCreatedAt}, ${cursor})` : sql`true`;

    const clauses: any[] = [baseWhere, sql`${listings.isSold} = false`];

    if (filters?.q) {
      const q = `%${filters.q.replace(/%/g, "")}%`;
      clauses.push(sql`(${listings.title} ilike ${q} or ${listings.description} ilike ${q})`);
    }
    if (filters?.category) clauses.push(eq(listings.category, filters.category));
    if (filters?.condition) clauses.push(eq(listings.condition, filters.condition));
    if (typeof filters?.minPriceCents === "number") clauses.push(sql`${listings.priceCents} >= ${filters.minPriceCents}`);
    if (typeof filters?.maxPriceCents === "number") clauses.push(sql`${listings.priceCents} <= ${filters.maxPriceCents}`);
    if (filters?.hasMedia) clauses.push(sql`exists (select 1 from listing_media lm where lm.listing_id = ${listings.id})`);

    const where = and(...clauses);

    let orderBy;
    if (filters?.sort === "price-asc") {
      orderBy = [asc(listings.priceCents), desc(listings.createdAt)];
    } else if (filters?.sort === "price-desc") {
      orderBy = [desc(listings.priceCents), desc(listings.createdAt)];
    } else {
      orderBy = [desc(listings.createdAt), desc(listings.id)];
    }

    const rows = await db
      .select({
        listing: listings,
        username: users.username,
        profile: profiles,
      })
      .from(listings)
      .innerJoin(users, eq(users.id, listings.userId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(where)
      .orderBy(...orderBy)
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    const ids = page.map((r) => r.listing.id);
    const mediaRows = ids.length
      ? await db.select({ listingId: listingMedia.listingId, url: listingMedia.url, type: listingMedia.type }).from(listingMedia).where(sql`${listingMedia.listingId} = any(${ids})`)
      : [];
    const mediaByListing = new Map<string, { url: string; type: string }[]>();
    for (const mr of mediaRows as any[]) {
      const arr = mediaByListing.get(mr.listingId) ?? [];
      arr.push({ url: mr.url, type: mr.type });
      mediaByListing.set(mr.listingId, arr);
    }

    const out = page.map((r) => ({
      ...r.listing,
      username: r.username,
      profile: r.profile ?? null,
      media: mediaByListing.get(r.listing.id) ?? [],
    }));

    return { listings: out, nextCursor: hasMore ? page[page.length - 1]?.listing.id ?? null : null };
  }

  async createListing(
    userId: string,
    input: { title: string; description: string; category: string; condition: string; priceCents: number; currency: string; location?: string | null; media?: { url: string; type: "image" | "video" }[] }
  ) {
    const [l] = await db
      .insert(listings)
      .values({
        userId,
        title: input.title,
        description: input.description,
        category: input.category,
        condition: input.condition,
        priceCents: input.priceCents,
        currency: input.currency,
        location: input.location ?? null,
      })
      .returning();

    if (input.media?.length) {
      const rows = input.media.slice(0, 12).map((m) => ({ listingId: l.id, url: m.url, type: m.type }));
      await db.insert(listingMedia).values(rows as any);
    }

    const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, userId)).limit(1);
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    return {
      ...l,
      username: user?.username ?? "",
      profile: profile ?? null,
      media: input.media ?? [],
    };
  }

  async deleteListing(userId: string, listingId: string) {
    const res = await db.delete(listings).where(and(eq(listings.id, listingId), eq(listings.userId, userId))).returning({ id: listings.id });
    return res.length > 0;
  }

  async getListingById(listingId: string, _viewerId?: string) {
    const [row] = await db
      .select({ listing: listings, username: users.username, profile: profiles })
      .from(listings)
      .innerJoin(users, eq(users.id, listings.userId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(eq(listings.id, listingId))
      .limit(1);

    if (!row) return null;

    const mediaRows = await db.select({ url: listingMedia.url, type: listingMedia.type }).from(listingMedia).where(eq(listingMedia.listingId, listingId));

    return {
      ...row.listing,
      username: row.username,
      profile: row.profile ?? null,
      media: mediaRows,
    };
  }

  async createUserConsent(userId: string, data: { termsAccepted: boolean; privacyAccepted: boolean; parentalConsentAcknowledged?: boolean }): Promise<UserConsent> {
    const now = new Date();
    const [consent] = await db.insert(userConsents).values({
      userId,
      termsAccepted: data.termsAccepted,
      termsAcceptedAt: data.termsAccepted ? now : null,
      privacyAccepted: data.privacyAccepted,
      privacyAcceptedAt: data.privacyAccepted ? now : null,
      parentalConsentAcknowledged: data.parentalConsentAcknowledged ?? false,
      parentalConsentAt: data.parentalConsentAcknowledged ? now : null,
    }).returning();
    return consent;
  }

  async getUserConsent(userId: string): Promise<UserConsent | undefined> {
    const [consent] = await db.select().from(userConsents).where(eq(userConsents.userId, userId)).limit(1);
    return consent;
  }

  async createEmailVerification(userId: string, email: string, code: string): Promise<EmailVerification> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const [verification] = await db.insert(emailVerifications).values({
      userId,
      email,
      code,
      expiresAt,
    }).returning();
    return verification;
  }

  async getEmailVerificationByCode(userId: string, code: string): Promise<EmailVerification | undefined> {
    const [verification] = await db.select()
      .from(emailVerifications)
      .where(and(
        eq(emailVerifications.userId, userId),
        eq(emailVerifications.code, code),
        eq(emailVerifications.verified, false)
      ))
      .limit(1);
    return verification;
  }

  async incrementVerificationAttempts(verificationId: string): Promise<void> {
    await db.update(emailVerifications)
      .set({ attempts: sql`${emailVerifications.attempts} + 1` })
      .where(eq(emailVerifications.id, verificationId));
  }

  async markEmailVerified(verificationId: string): Promise<void> {
    await db.update(emailVerifications)
      .set({ verified: true, verifiedAt: new Date() })
      .where(eq(emailVerifications.id, verificationId));
  }

  async getOrCreateUserVerification(userId: string): Promise<UserVerification> {
    const [existing] = await db.select().from(userVerifications).where(eq(userVerifications.userId, userId)).limit(1);
    if (existing) return existing;
    const [verification] = await db.insert(userVerifications).values({ userId }).returning();
    return verification;
  }

  async updateUserVerification(userId: string, data: Partial<{
    email: string;
    emailVerified: boolean;
    emailVerifiedAt: Date;
    phone: string;
    phoneVerified: boolean;
    phoneVerifiedAt: Date;
    realName: string;
    idVerified: boolean;
    idVerifiedAt: Date;
    kycLevel: number;
  }>): Promise<UserVerification> {
    await this.getOrCreateUserVerification(userId);
    const [updated] = await db.update(userVerifications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userVerifications.userId, userId))
      .returning();
    return updated;
  }

  async getUserVerification(userId: string): Promise<UserVerification | undefined> {
    const [verification] = await db.select().from(userVerifications).where(eq(userVerifications.userId, userId)).limit(1);
    return verification;
  }

  async deleteExpiredVerifications(): Promise<number> {
    const result = await db.delete(emailVerifications)
      .where(and(
        lt(emailVerifications.expiresAt, new Date()),
        eq(emailVerifications.verified, false)
      ))
      .returning({ id: emailVerifications.id });
    return result.length;
  }
}

export const storage = new DbStorage();
