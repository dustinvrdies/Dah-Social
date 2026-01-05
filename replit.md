# DAH Social

## Overview

DAH Social is a dark-themed social media platform built with React and Vite. The application is a **purely frontend app using localStorage** for all data persistence - no backend or external services required. It combines features from Instagram, Twitter, and LinkedIn - focusing on content discovery, social interaction, and user-generated content. Key features include a social feed with text/video/listing posts, a marketplace ("DAH Mall"), user profiles with customizable themes (MySpace-style), a virtual currency system ("DAH Coins"), follow/notification system, native ads, and direct messaging.

## Recent Changes (January 2026)

- Ported from Next.js to Vite/React with wouter routing
- **Dark theme** - Deep blue-black background with pink (#E85D8C) and blue (#3B82F6) gradient accents
- **Native Ads System** - Non-intrusive ads that blend into feed/video streams looking like normal posts
- **DAH Inbox** - Direct messaging system for users to send letters to each other
- **Revenue System** - Platform tracks ad revenue with capped user payouts (daily: 100, monthly: 2000 DAH Coins)
- **Imagination Bubbles** - Creative content bubbles at top of feed (renamed from stories to be unique)
- Profile themes: Midnight, Neon, Ocean, Sunset, Aurora, Minimal
- All color tokens use HSL format (H S% L%) per design guidelines

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React Context for auth/session
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration

### Data Storage (localStorage Only)
- **No Backend Required**: All data stored in browser localStorage
- **Storage Keys**: 
  - `dah.session` - User session (username, age)
  - `dah.posts` - User-created posts
  - `dah.coins.wallet.{username}` - DAH Coins wallet
  - `dah.coins.ledger` - Transaction history
  - `dah.notifications.{username}` - User notifications
  - `dah.following.{username}` - Following list
  - `dah.rep.{username}` - Reputation score
  - `dah.hidden.{username}` - Hidden posts
  - `dah.reports` - Reported posts
  - `dah.profile.theme` - Profile theme preferences
  - `dah.inbox.{username}` - Inbox letters (received)
  - `dah.inbox.{username}:sent` - Sent letters
  - `dah.ads.state` - Ad impressions/clicks/revenue tracking
  - `dah.revenue.state` - Platform revenue and payout caps

### Authentication
- **Current Implementation**: Client-side session management via localStorage
- **Session Data**: Username and age stored in browser
- **Auth Context**: React Context provider wrapping the app

### Key Design Patterns
- **Shared Types**: Common schemas in `shared/` directory used by both client and server
- **Component Composition**: Feature components composed from shadcn/ui primitives
- **Path Aliases**: `@/` for client source, `@shared/` for shared code

### Post System
- **Post Types**: Text posts, video posts, marketplace listings, and ads
- **Feed Management**: localStorage-backed with initial seed data
- **Moderation**: Hide and report functionality per user
- **Ad Integration**: Ads appear every 5 posts in feed, every 4 videos in video stream

### Virtual Currency (DAH Coins)
- **Earning**: Users earn coins through actions (posting, liking, sales)
- **Minor Protection**: Users 13-17 have coins split (50% available, 50% locked for college)
- **Wallet**: Per-user wallet with available and locked balances
- **Ledger**: Transaction history stored in localStorage
- **Caps**: Daily (100 coins) and monthly (2000 coins) earning limits per user
- **Platform Reserve**: 40% of ad revenue kept as platform reserve

### Native Ads System
- **Ad Types**: Image ads and video ads that look like normal posts
- **Tracking**: Impressions and clicks tracked per ad
- **Revenue Model**: CPM ($2.50/1000 impressions) + CPC ($0.25/click)
- **Blending**: Ads appear naturally in feed with "Sponsored" badge

### DAH Inbox (Messaging)
- **Letters**: Users can send subject + body messages to other users
- **Instant Delivery**: Letters appear immediately in recipient's inbox
- **Features**: Reply, delete, mark as read, unread count badges
- **Organization**: Inbox tab (received) and Sent tab

## External Dependencies

### UI Components
- **Radix UI**: Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-styled component library built on Radix
- **Lucide React**: Icon library

### Database
- **Drizzle ORM**: SQL toolkit with TypeScript support
- **PostgreSQL**: Target database (requires `DATABASE_URL` environment variable)
- **drizzle-zod**: Schema validation integration

### Build & Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **TSX**: TypeScript execution for development

### Utilities
- **date-fns**: Date manipulation
- **clsx/tailwind-merge**: Class name utilities
- **zod**: Runtime type validation

## Pages
- `/` - Home feed with story bubbles, tabs, and posts
- `/video` - TikTok-style vertical video feed
- `/mall` - Marketplace with categories and listings
- `/profile/:username` - User profile with customizable themes
- `/notifications` - Notification center
- `/inbox` - Direct messaging (DAH Inbox)
- `/login` - Account creation/login
