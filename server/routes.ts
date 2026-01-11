import type { Express } from "express";
import { type Server } from "http";
import passport from "passport";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { requireAuth, registerUser } from "./auth";
import {
  createPostSchema,
  createCommentSchema,
  createListingSchema,
  listingFiltersSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
  reportSchema,
  verifyEmailSchema,
} from "@shared/schema";
import { z } from "zod";
import { sendVerificationEmail, sendWelcomeEmail } from "./email";

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface DummyJsonResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

let productsCache: DummyJsonProduct[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 30;

async function fetchProducts(): Promise<DummyJsonProduct[]> {
  const now = Date.now();
  if (productsCache && now - cacheTime < CACHE_TTL) {
    return productsCache;
  }

  const response = await fetch("https://dummyjson.com/products?limit=100");
  if (!response.ok) {
    throw new Error("Failed to fetch products from DummyJSON");
  }
  const data: DummyJsonResponse = await response.json();
  productsCache = data.products;
  cacheTime = now;
  return productsCache;
}

function parseLimit(raw: unknown, def: number, max: number) {
  const n = typeof raw === "string" ? parseInt(raw, 10) : def;
  if (!Number.isFinite(n) || n <= 0) return def;
  return Math.min(n, max);
}

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
      cb(null, `${Date.now()}_${Math.random().toString(16).slice(2)}_${safe}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype.startsWith("image/") ||
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/webm" ||
      file.mimetype === "video/quicktime";
    if (!ok) {
      cb(new Error("Unsupported file type"));
    } else {
      cb(null, true);
    }
  },
});

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      return res.json({ user: req.user });
    }
    return res.json({ user: null });
  });

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const body = registerSchema.parse(req.body);
      
      if (body.age >= 13 && body.age < 18 && !body.parentalConsentAcknowledged) {
        return res.status(400).json({ message: "Parental consent is required for users under 18" });
      }
      
      const user = await registerUser(body.username, body.password);
      
      await storage.createUserConsent(user.id, {
        termsAccepted: body.termsAccepted,
        privacyAccepted: body.privacyAccepted,
        parentalConsentAcknowledged: body.parentalConsentAcknowledged ?? false,
      });
      
      await storage.updateUserVerification(user.id, { email: body.email });
      
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await storage.createEmailVerification(user.id, body.email, code);
      
      const emailSent = await sendVerificationEmail(body.email, code, body.username);
      
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({ 
          user,
          emailVerificationRequired: true,
          emailSent,
        });
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", issues: err.issues });
      }
      if (err instanceof Error && err.message === "Username already taken") {
        return res.status(400).json({ message: err.message });
      }
      return next(err);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      loginSchema.parse(req.body);
      passport.authenticate("local", (err: unknown, user: Express.User | false, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message ?? "Invalid username or password" });
        req.login(user, (err2) => {
          if (err2) return next(err2);
          return res.json({ user });
        });
      })(req, res, next);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", issues: err.issues });
      }
      return next(err);
    }
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session?.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ ok: true });
      });
    });
  });

  app.post("/api/uploads", requireAuth, upload.array("files", 12), async (req, res, next) => {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      const out = files.map((f) => ({
        url: `/uploads/${path.basename(f.path)}`,
        type: f.mimetype.startsWith("image/") ? "image" : "video",
        name: f.originalname,
        size: f.size,
      }));
      res.json({ files: out });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/posts", async (req, res, next) => {
    try {
      const limit = parseLimit(req.query.limit, 30, 100);
      const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
      const viewerId = req.isAuthenticated?.() ? (req.user as any).id : undefined;
      const q = typeof req.query.q === "string" ? req.query.q : undefined;
      const sort = req.query.sort === "top" ? "top" : "new";
      const hasMedia = req.query.hasMedia === "1" || req.query.hasMedia === "true";
      const result = await storage.listPosts(limit, cursor, viewerId, { q, sort, hasMedia: req.query.hasMedia ? hasMedia : undefined });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/feed/following", requireAuth, async (req, res, next) => {
    try {
      const limit = parseLimit(req.query.limit, 30, 100);
      const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
      const viewerId = (req.user as any).id as string;
      const result = await storage.listFollowingPosts(viewerId, limit, cursor);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/posts", requireAuth, async (req, res, next) => {
    try {
      const body = createPostSchema.parse(req.body);
      const userId = req.user!.id;
      const post = await storage.createPost(userId, body.content, body.media);
      res.status(201).json({ post });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", issues: err.issues });
      }
      next(err);
    }
  });

  app.delete("/api/posts/:id", requireAuth, async (req, res, next) => {
    try {
      const ok = await storage.softDeletePost(req.params.id, req.user!.id);
      if (!ok) return res.status(404).json({ message: "Post not found" });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/posts/:id/like", requireAuth, async (req, res, next) => {
    try {
      await storage.likePost(req.params.id, req.user!.id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/posts/:id/unlike", requireAuth, async (req, res, next) => {
    try {
      await storage.unlikePost(req.params.id, req.user!.id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/posts/:id/bookmark", requireAuth, async (req, res, next) => {
    try {
      await storage.bookmarkPost(req.params.id, (req.user as any).id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/posts/:id/unbookmark", requireAuth, async (req, res, next) => {
    try {
      await storage.unbookmarkPost(req.params.id, (req.user as any).id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/bookmarks", requireAuth, async (req, res, next) => {
    try {
      const limit = parseLimit(req.query.limit, 30, 100);
      const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
      const userId = (req.user as any).id as string;
      const result = await storage.listBookmarkedPosts(userId, limit, cursor);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/listings", async (req, res, next) => {
    try {
      const limit = parseLimit(req.query.limit, 30, 100);
      const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
      const viewerId = req.isAuthenticated?.() ? (req.user as any).id : undefined;

      const parsed = listingFiltersSchema.safeParse({
        q: typeof req.query.q === "string" ? req.query.q : undefined,
        category: typeof req.query.category === "string" ? req.query.category : undefined,
        minPriceCents: typeof req.query.minPriceCents === "string" ? Number(req.query.minPriceCents) : undefined,
        maxPriceCents: typeof req.query.maxPriceCents === "string" ? Number(req.query.maxPriceCents) : undefined,
        condition: typeof req.query.condition === "string" ? req.query.condition : undefined,
        sort: typeof req.query.sort === "string" ? req.query.sort : undefined,
        hasMedia: typeof req.query.hasMedia === "string" ? req.query.hasMedia === "true" || req.query.hasMedia === "1" : undefined,
      });

      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid filters" });
      }

      const result = await storage.listListings(parsed.data, limit, cursor, viewerId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/listings", requireAuth, async (req, res, next) => {
    try {
      const userId = (req.user as any).id as string;
      const body = createListingSchema.parse(req.body);
      const listing = await storage.createListing(userId, {
        title: body.title,
        description: body.description ?? "",
        category: body.category,
        condition: body.condition ?? "used",
        priceCents: body.priceCents,
        currency: body.currency ?? "USD",
        location: body.location ?? null,
        media: body.media,
      });
      res.json({ listing });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", issues: err.issues });
      }
      next(err);
    }
  });

  app.get("/api/listings/:id", async (req, res, next) => {
    try {
      const viewerId = req.isAuthenticated?.() ? (req.user as any).id : undefined;
      const listing = await storage.getListingById(req.params.id, viewerId);
      if (!listing) return res.status(404).json({ error: "Not found" });
      res.json({ listing });
    } catch (err) {
      next(err);
    }
  });

  app.delete("/api/listings/:id", requireAuth, async (req, res, next) => {
    try {
      const userId = (req.user as any).id as string;
      const ok = await storage.deleteListing(userId, req.params.id);
      if (!ok) return res.status(404).json({ error: "Not found" });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/users/:username", async (req, res, next) => {
    try {
      const viewerId = req.isAuthenticated?.() ? (req.user as any).id : undefined;
      const u = await storage.getPublicUserByUsername(req.params.username, viewerId);
      if (!u) return res.status(404).json({ message: "User not found" });
      res.json(u);
    } catch (err) {
      next(err);
    }
  });

  app.put("/api/profile", requireAuth, async (req, res, next) => {
    try {
      const input = updateProfileSchema.parse(req.body);
      const p = await storage.upsertProfile(req.user!.id, input);
      res.json({ profile: p });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", issues: err.issues });
      }
      next(err);
    }
  });

  app.post("/api/users/:username/follow", requireAuth, async (req, res, next) => {
    try {
      const target = await storage.getUserByUsername(req.params.username);
      if (!target) return res.status(404).json({ message: "User not found" });
      await storage.followUser(target.id, req.user!.id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/users/:username/unfollow", requireAuth, async (req, res, next) => {
    try {
      const target = await storage.getUserByUsername(req.params.username);
      if (!target) return res.status(404).json({ message: "User not found" });
      await storage.unfollowUser(target.id, req.user!.id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/notifications", requireAuth, async (req, res, next) => {
    try {
      const limit = parseLimit(req.query.limit, 30, 100);
      const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
      const userId = (req.user as any).id as string;
      const result = await storage.listNotifications(userId, limit, cursor);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/notifications/:id/read", requireAuth, async (req, res, next) => {
    try {
      const userId = (req.user as any).id as string;
      const ok = await storage.markNotificationRead(userId, req.params.id);
      res.json({ ok });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/notifications/read-all", requireAuth, async (req, res, next) => {
    try {
      const userId = (req.user as any).id as string;
      const count = await storage.markAllNotificationsRead(userId);
      res.json({ ok: true, count });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/reports", requireAuth, async (req, res, next) => {
    try {
      const input = reportSchema.parse(req.body);
      await storage.createReport(req.user!.id, input.targetType, input.targetId, input.reason);
      res.status(201).json({ ok: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", issues: err.issues });
      }
      next(err);
    }
  });

  app.get("/api/posts/:id/comments", async (req, res, next) => {
    try {
      const limit = parseLimit(req.query.limit, 50, 100);
      const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
      const postId = req.params.id;
      const result = await storage.listComments(postId, limit, cursor);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/comments", requireAuth, async (req, res, next) => {
    try {
      const body = createCommentSchema.parse(req.body);
      const comment = await storage.createComment(body.postId, req.user!.id, body.content);
      res.status(201).json({ comment });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", issues: err.issues });
      }
      next(err);
    }
  });

  app.delete("/api/comments/:id", requireAuth, async (req, res, next) => {
    try {
      const ok = await storage.softDeleteComment(req.params.id, req.user!.id);
      if (!ok) return res.status(404).json({ message: "Comment not found" });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/dropship/products", async (req, res) => {
    try {
      const products = await fetchProducts();
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const limit = parseLimit(req.query.limit, 50, 100);
      const skip = parseLimit(req.query.skip, 0, 100000);

      let filtered = products;

      if (category) {
        filtered = filtered.filter((p) => p.category.toLowerCase().replace(/[^a-z0-9]/g, "-") === category.toLowerCase());
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
      }

      const paginated = filtered.slice(skip, skip + limit);

      res.json({
        products: paginated,
        total: filtered.length,
        skip,
        limit,
      });
    } catch (error) {
      console.error("Error fetching dropship products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/dropship/categories", async (_req, res) => {
    try {
      const products = await fetchProducts();
      const categories = Array.from(new Set(products.map((p) => p.category)));
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/dropship/products/:id", async (req, res) => {
    try {
      const products = await fetchProducts();
      const id = parseInt(req.params.id, 10);
      const product = products.find((p) => p.id === id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/verification/status", requireAuth, async (req, res, next) => {
    try {
      const userId = (req.user as any).id as string;
      const verification = await storage.getUserVerification(userId);
      const consent = await storage.getUserConsent(userId);
      res.json({
        verification: verification ?? { kycLevel: 0, emailVerified: false, phoneVerified: false, idVerified: false },
        consent: consent ?? null,
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/verification/email/send", requireAuth, async (req, res, next) => {
    try {
      const userId = (req.user as any).id as string;
      const username = (req.user as any).username as string;
      const verification = await storage.getUserVerification(userId);
      
      if (verification?.emailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }
      
      const email = verification?.email;
      if (!email) {
        return res.status(400).json({ message: "No email on file" });
      }
      
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await storage.createEmailVerification(userId, email, code);
      const sent = await sendVerificationEmail(email, code, username);
      
      res.json({ ok: true, sent });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/verification/email/verify", requireAuth, async (req, res, next) => {
    try {
      const body = verifyEmailSchema.parse(req.body);
      const userId = (req.user as any).id as string;
      const username = (req.user as any).username as string;
      
      const verification = await storage.getEmailVerificationByCode(userId, body.code);
      
      if (!verification) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      
      if (verification.expiresAt < new Date()) {
        return res.status(400).json({ message: "Verification code expired" });
      }
      
      if (verification.attempts >= 5) {
        return res.status(400).json({ message: "Too many attempts. Please request a new code." });
      }
      
      await storage.incrementVerificationAttempts(verification.id);
      
      await storage.markEmailVerified(verification.id);
      await storage.updateUserVerification(userId, {
        email: verification.email,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        kycLevel: 1,
      });
      
      await sendWelcomeEmail(verification.email, username);
      
      res.json({ ok: true, message: "Email verified successfully" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", issues: err.issues });
      }
      next(err);
    }
  });

  return httpServer;
}
