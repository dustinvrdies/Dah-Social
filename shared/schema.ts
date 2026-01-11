import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Core tables for DAH Social.
 */

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const posts = pgTable(
  "posts",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdIdx: index("posts_user_id_idx").on(t.userId),
    createdAtIdx: index("posts_created_at_idx").on(t.createdAt),
  }),
);

export const comments = pgTable(
  "comments",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    postId: varchar("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    postIdIdx: index("comments_post_id_idx").on(t.postId),
    userIdIdx: index("comments_user_id_idx").on(t.userId),
    createdAtIdx: index("comments_created_at_idx").on(t.createdAt),
  }),
);

export const profiles = pgTable(
  "profiles",
  {
    userId: varchar("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name"),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdIdx: index("profiles_user_id_idx").on(t.userId),
  }),
);

export const postMedia = pgTable(
  "post_media",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    postId: varchar("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    type: varchar("type", { length: 16 }).notNull(),
    width: varchar("width", { length: 16 }),
    height: varchar("height", { length: 16 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    postIdIdx: index("post_media_post_id_idx").on(t.postId),
  }),
);

export const listings = pgTable(
  "listings",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    category: varchar("category", { length: 64 }).notNull(),
    condition: varchar("condition", { length: 32 }).notNull().default("used"),
    priceCents: integer("price_cents").notNull().default(0),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    location: text("location"),
    isSold: boolean("is_sold").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdIdx: index("listings_user_id_idx").on(t.userId),
    createdAtIdx: index("listings_created_at_idx").on(t.createdAt),
    categoryIdx: index("listings_category_idx").on(t.category),
    priceIdx: index("listings_price_cents_idx").on(t.priceCents),
  }),
);

export const listingMedia = pgTable(
  "listing_media",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    listingId: varchar("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    type: varchar("type", { length: 16 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    listingIdIdx: index("listing_media_listing_id_idx").on(t.listingId),
  }),
);

export const postLikes = pgTable(
  "post_likes",
  {
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: varchar("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    likeUniq: uniqueIndex("post_likes_user_post_uniq").on(t.userId, t.postId),
    postIdIdx: index("post_likes_post_id_idx").on(t.postId),
    userIdIdx: index("post_likes_user_id_idx").on(t.userId),
  }),
);

export const follows = pgTable(
  "follows",
  {
    followerId: varchar("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: varchar("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    followUniq: uniqueIndex("follows_follower_following_uniq").on(t.followerId, t.followingId),
    followerIdx: index("follows_follower_id_idx").on(t.followerId),
    followingIdx: index("follows_following_id_idx").on(t.followingId),
  }),
);

export const reports = pgTable(
  "reports",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    reporterId: varchar("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: text("target_type").notNull(),
    targetId: varchar("target_id").notNull(),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    reporterIdx: index("reports_reporter_id_idx").on(t.reporterId),
    targetIdx: index("reports_target_idx").on(t.targetType, t.targetId),
    createdIdx: index("reports_created_at_idx").on(t.createdAt),
  }),
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: varchar("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userPostUnique: uniqueIndex("bookmarks_user_post_uq").on(t.userId, t.postId),
    userIdIdx: index("bookmarks_user_id_idx").on(t.userId),
    postIdIdx: index("bookmarks_post_id_idx").on(t.postId),
    createdAtIdx: index("bookmarks_created_at_idx").on(t.createdAt),
  })
);

export const notifications = pgTable(
  "notifications",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    toUserId: varchar("to_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fromUserId: varchar("from_user_id").references(() => users.id, { onDelete: "set null" }),
    type: varchar("type", { length: 32 }).notNull(),
    entityType: varchar("entity_type", { length: 32 }).notNull(),
    entityId: varchar("entity_id").notNull(),
    message: text("message").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    toUserIdx: index("notifications_to_user_id_idx").on(t.toUserId),
    readIdx: index("notifications_is_read_idx").on(t.isRead),
    createdAtIdx: index("notifications_created_at_idx").on(t.createdAt),
  })
);

export const userConsents = pgTable(
  "user_consents",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    termsAccepted: boolean("terms_accepted").notNull().default(false),
    termsAcceptedAt: timestamp("terms_accepted_at", { withTimezone: true }),
    privacyAccepted: boolean("privacy_accepted").notNull().default(false),
    privacyAcceptedAt: timestamp("privacy_accepted_at", { withTimezone: true }),
    parentalConsentAcknowledged: boolean("parental_consent_acknowledged").notNull().default(false),
    parentalConsentAt: timestamp("parental_consent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdIdx: uniqueIndex("user_consents_user_id_idx").on(t.userId),
  })
);

export const emailVerifications = pgTable(
  "email_verifications",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    code: varchar("code", { length: 6 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    verified: boolean("verified").notNull().default(false),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdIdx: index("email_verifications_user_id_idx").on(t.userId),
    codeIdx: index("email_verifications_code_idx").on(t.code),
  })
);

export const userVerifications = pgTable(
  "user_verifications",
  {
    userId: varchar("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    email: text("email"),
    emailVerified: boolean("email_verified").notNull().default(false),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    phone: text("phone"),
    phoneVerified: boolean("phone_verified").notNull().default(false),
    phoneVerifiedAt: timestamp("phone_verified_at", { withTimezone: true }),
    realName: text("real_name"),
    idVerified: boolean("id_verified").notNull().default(false),
    idVerifiedAt: timestamp("id_verified_at", { withTimezone: true }),
    kycLevel: integer("kyc_level").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: index("user_verifications_email_idx").on(t.email),
    kycLevelIdx: index("user_verifications_kyc_level_idx").on(t.kycLevel),
  })
);

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username too long")
    .regex(/^[a-z0-9_]+$/i, "Username may contain letters, numbers, underscore"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  email: z.string().email("Invalid email address"),
  age: z.number().int().min(13, "Must be at least 13 years old").max(120),
  termsAccepted: z.boolean().refine(v => v === true, "You must accept the Terms of Service"),
  privacyAccepted: z.boolean().refine(v => v === true, "You must accept the Privacy Policy"),
  parentalConsentAcknowledged: z.boolean().optional(),
});

export const verifyEmailSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

export const sendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const kycSubmitSchema = z.object({
  realName: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().min(10).max(20).optional(),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const createPostSchema = z.object({
  content: z.string().trim().min(1, "Post cannot be empty").max(5000, "Post too long"),
  media: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.enum(["image", "video"]),
      })
    )
    .max(10, "Too many attachments")
    .optional(),
});

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().trim().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
});

export const createListingSchema = z.object({
  title: z.string().trim().min(2, "Title too short").max(120, "Title too long"),
  description: z.string().trim().max(5000, "Description too long").optional().default(""),
  category: z.string().trim().min(2).max(64),
  condition: z.enum(["new", "like-new", "used", "for-parts"]).optional().default("used"),
  priceCents: z.number().int().min(0).max(1_000_000_00),
  currency: z.string().trim().min(3).max(8).optional().default("USD"),
  location: z.string().trim().max(140).optional(),
  media: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.enum(["image", "video"]),
      })
    )
    .max(12, "Too many attachments")
    .optional(),
});

export const listingFiltersSchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(64).optional(),
  minPriceCents: z.number().int().min(0).optional(),
  maxPriceCents: z.number().int().min(0).optional(),
  condition: z.enum(["new", "like-new", "used", "for-parts"]).optional(),
  sort: z.enum(["new", "price-asc", "price-desc"]).optional().default("new"),
  hasMedia: z.boolean().optional(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  passwordHash: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  postId: true,
  userId: true,
  content: true,
});

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(60).optional(),
  bio: z.string().trim().max(280).optional(),
  avatarUrl: z.string().url().max(500).optional(),
});

export const reportSchema = z.object({
  targetType: z.enum(["post", "comment", "user"]),
  targetId: z.string().min(1),
  reason: z.string().trim().min(3).max(500),
});

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type PostLike = typeof postLikes.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type PostMedia = typeof postMedia.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type ListingMedia = typeof listingMedia.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type UserConsent = typeof userConsents.$inferSelect;
export type EmailVerification = typeof emailVerifications.$inferSelect;
export type UserVerification = typeof userVerifications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type ListingFiltersInput = z.infer<typeof listingFiltersSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type SendVerificationInput = z.infer<typeof sendVerificationSchema>;
export type KycSubmitInput = z.infer<typeof kycSubmitSchema>;
