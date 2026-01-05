# DAH Social

## Overview

DAH Social is a dark-themed social media platform built with React and Vite. The application is a **purely frontend app using localStorage** for all data persistence - no backend or external services required. It combines features from Instagram, Twitter, and LinkedIn - focusing on content discovery, social interaction, and user-generated content. Key features include a social feed with text/video/listing posts, a marketplace ("DAH Mall"), user profiles with customizable themes (MySpace-style), a virtual currency system ("DAH Coins"), and a follow/notification system.

## Recent Changes (January 2026)

- Ported from Next.js to Vite/React with wouter routing
- **NEW: Sunset aesthetic** - Light pink and sky blue color palette, soft gradients, cleaner design
- **NEW: Real dropshipping integration** - Backend API routes for product catalog (CJDropshipping setup pending)
- Mall categories now clickable with filtering
- Profile customization expanded (bio, links, interests, favorite song)
- Profile themes updated: Sunset, Ocean, Twilight, Peach
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

### Authentication
- **Current Implementation**: Client-side session management via localStorage
- **Session Data**: Username and age stored in browser
- **Auth Context**: React Context provider wrapping the app

### Key Design Patterns
- **Shared Types**: Common schemas in `shared/` directory used by both client and server
- **Component Composition**: Feature components composed from shadcn/ui primitives
- **Path Aliases**: `@/` for client source, `@shared/` for shared code

### Post System
- **Post Types**: Text posts, video posts, and marketplace listings
- **Feed Management**: localStorage-backed with initial seed data
- **Moderation**: Hide and report functionality per user

### Virtual Currency (DAH Coins)
- **Earning**: Users earn coins through actions (posting, liking, sales)
- **Minor Protection**: Users 13-17 have coins split (50% available, 50% locked for college)
- **Wallet**: Per-user wallet with available and locked balances
- **Ledger**: Transaction history stored in localStorage

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