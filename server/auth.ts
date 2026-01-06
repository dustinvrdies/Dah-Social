import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import { hashPassword, comparePasswords } from "./password";
import type { Express, RequestHandler } from "express";
import session from "express-session";
import type { User } from "@shared/schema";
import pgSession from "connect-pg-simple";
import pg from "pg";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
    }
  }
}

const PgStore = pgSession(session);

export function setupAuth(app: Express) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dah-social-secret-key-change-in-prod",
    resave: false,
    saveUninitialized: false,
    store: new PgStore({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        const isMatch = await comparePasswords(password, user.passwordHash);
        if (!isMatch) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, { id: user.id, username: user.username });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      if (!user) {
        return done(null, false);
      }
      done(null, { id: user.id, username: user.username });
    } catch (err) {
      done(err);
    }
  });
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

export async function registerUser(username: string, password: string): Promise<Express.User> {
  const existing = await storage.getUserByUsername(username);
  if (existing) {
    throw new Error("Username already taken");
  }
  const passwordHash = await hashPassword(password);
  const user = await storage.createUser(username, passwordHash);
  return { id: user.id, username: user.username };
}
