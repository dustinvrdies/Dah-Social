# DAH Social

## Overview

DAH Social is a dark-themed social media platform built with React and Vite. The application is a **purely frontend app using localStorage** for all data persistence - no backend or external services required. It combines features from Instagram, Twitter, and LinkedIn - focusing on content discovery, social interaction, and user-generated content. Key features include a social feed with text/video/listing posts, a marketplace ("DAH Mall"), user profiles with customizable themes (MySpace-style), a virtual currency system ("DAH Coins"), follow/notification system, native ads, and direct messaging.

## Recent Changes (January 2026)

- Ported from Next.js to Vite/React with wouter routing
- **Dark theme** - Deep blue-black background with pink (#E85D8C) and blue (#3B82F6) gradient accents
- **Native Ads System** - Non-intrusive ads that blend into feed/video streams looking like normal posts
- **DAH Inbox** - Direct messaging system for users to send letters to each other
- **Revenue System** - Platform tracks ad revenue with capped user payouts (daily: 100, monthly: 2000 DAH Coins)
- **Stories** - Instagram/TikTok-style stories with full-screen viewer, progress bars, and auto-advance
- Profile themes: Midnight, Neon, Ocean, Sunset, Aurora, Minimal
- All color tokens use HSL format (H S% L%) per design guidelines

### New TikTok/Facebook-Style Features (January 2026)

- **Stories/Reels** - Full-screen vertical stories with auto-play, progress indicators, and reply functionality
- **DAH Live** - Live streaming page with simulated streams, viewer counts, and gift sending (8 gift types from 1-500 coins)
- **Groups/Communities** - Create and join groups with categories (Hobbies, Marketplace, Fashion, Creator, Business, Art, etc.)
- **Events** - Upcoming events with RSVPs, location types (online/in-person/hybrid), and category filters
- **Discover/Trending** - Explore trending hashtags, creators, sounds, and media grid
- **Quests/Missions** - Daily, weekly, and achievement quests that reward DAH Coins
- **Creator Dashboard** - Analytics, earnings tracking, transaction history, and performance charts
- **Reactions** - 8 reaction types (like, love, haha, wow, sad, angry, fire, money) beyond simple likes
- **Enhanced Navigation** - Horizontal scrollable mobile nav with all pages accessible
- **DAH Avenues** - Reddit-style topic-based discussion forums with upvotes/downvotes, threaded comments, awards, karma, and moderation tools

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
  - `dah.stories` - User stories with media and captions
  - `dah.quests.{username}` - Quest progress and completion state
  - `dah.groups` - Groups/communities data
  - `dah.groups.memberships.{username}` - User group memberships
  - `dah.groups.posts.{groupId}` - Posts within groups
  - `dah.events` - Events data with RSVPs
  - `dah.events.rsvps.{username}` - User RSVP statuses
  - `dah.live.streams` - Live streaming data
  - `dah.live.gifts.{streamId}` - Gift transaction history
  - `dah.reactions.{postId}` - Post reactions
  - `dah.avenues` - Avenue communities
  - `dah.avenues.posts.{avenueId}` - Posts within avenues
  - `dah.avenues.comments.{postId}` - Comments on avenue posts
  - `dah.avenues.votes.post.{postId}` - Post votes
  - `dah.avenues.votes.comment.{commentId}` - Comment votes
  - `dah.avenues.awards.{postId}` - Awards given to posts
  - `dah.avenues.subs.{username}` - User avenue subscriptions
  - `dah.avenues.karma.{username}` - User karma breakdown

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
- `/` - Home feed with Stories at top, tabs, and posts
- `/video` - TikTok-style vertical video feed with swipe navigation
- `/avenues` - Browse topic-based discussion forums (Reddit-style)
- `/av/:name` - Individual avenue with posts, voting, and rules
- `/av/:name/post/:postId` - Post detail with threaded comments and awards
- `/live` - Live streaming with gifting and viewer counts
- `/mall` - Marketplace with categories and listings
- `/discover` - Trending hashtags, creators, sounds, and media
- `/groups` - Communities with categories and membership
- `/events` - Upcoming events with RSVPs
- `/quests` - Daily/weekly quests and achievements for earning coins
- `/dashboard` - Creator analytics and earnings tracking
- `/profile/:username` - User profile with customizable themes
- `/notifications` - Notification center
- `/inbox` - Direct messaging (DAH Inbox)
- `/login` - Account creation/login

### DAH Avenues (Reddit-Style Forums)
- **Avenues**: Topic-based open communities for discussions
- **Post Types**: Text, image, video, link, and poll posts with flairs
- **Voting**: Upvote/downvote system with hot/new/top/rising/controversial sorting
- **Comments**: Unlimited nesting depth with collapse/expand, inline replies
- **Awards**: 8 award types (Silver 10, Gold 50, Platinum 100, Diamond 500, Fire 25, Mindblown 75, Helpful 30, Wholesome 40 coins)
- **Karma**: Separate post/comment/award karma tracked per user
- **Moderation**: Pin/lock/remove posts, moderator roles (owner/mod/steward)
- **Rules**: Customizable per-avenue rules displayed in sidebar
- **Categories**: Technology, Gaming, Crypto, Memes, News, Music, Fitness, Art, Discussion, Lifestyle, Entertainment, Sports, Business, Science, Education, Fashion, Food, Travel, Photography, DIY
- **Seed Data**: 8 pre-built avenues with sample posts and comments
