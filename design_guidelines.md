# DAH SOCIAL - Design Guidelines (Dark Theme with Pink/Blue Accents)

## Design Approach
**Reference-Based**: TikTok's vertical video experience + Instagram's engagement patterns + Facebook Marketplace integration, wrapped in a sleek dark theme with vibrant pink and blue accents. Focus on content discovery, social interaction, and seamless buying/selling experiences.

## Color Palette - Dark Theme

**Base Colors**:
- Background: Deep blue-black (#0A0D14) - HSL: 225 15% 6%
- Card: Slightly elevated (#14181F) - HSL: 225 15% 9%
- Border: Subtle (#1E242E) - HSL: 225 15% 15%

**Primary Accents**:
- Pink Primary: #E85D8C (330 85% 60%) - CTAs, active states, hearts
- Blue Secondary: #3B82F6 (210 80% 50%) - links, secondary actions
- Gradient: Pink to Blue (135deg)

**Supporting Colors**:
- Muted text: #8B8B9A - HSL: 210 15% 55%
- Foreground: #F0F2F5 - HSL: 210 20% 95%

**Semantic Colors**:
- Success: Emerald #10B981
- Warning: Amber #F59E0B  
- Error: Red #EF4444
- Info: Blue #3B82F6

**Gradient Applications**:
- Primary buttons: Pink to blue (bg-dah-gradient-strong)
- Cards subtle glow: bg-dah-gradient (15% opacity)
- Logo text: text-gradient-dah
- Avatar rings: ring-gradient-dah (pink-purple-blue)

## Typography System

**Font Family**: Inter (UI), Lexend (headings) via Google Fonts
- H1 (Hero): Lexend 700, 40-48px
- H2 (Section): Lexend 600, 32px
- H3 (Card titles): Lexend 600, 24px
- Body: Inter 400, 16px
- Captions: Inter 400, 14px
- Small text: Inter 400, 12px
- Username/links: Inter 600, 14-16px

## Layout & Spacing

**Tailwind Units**: 2, 3, 4, 6, 8, 12, 16
- Component padding: p-6 (desktop), p-4 (mobile)
- Card spacing: gap-4 to gap-6
- Section margins: my-8 to my-12
- Grid gaps: gap-4 (feed), gap-1 (profile grids)

**Container Widths**:
- Feed: max-w-2xl centered
- Video: max-w-lg centered (full-height vertical)
- Mall: max-w-5xl (wider for product grids)
- Profile: max-w-4xl

## Core Components

### Navigation
**Top Bar** (h-14, bg-card/98 with backdrop-blur):
- Left: Logo (text-gradient-dah) + Desktop nav items
- Center: Search bar (bg-muted/50, rounded)
- Right: Messages, Notifications, Profile avatar with gradient ring
- Mobile: Compact nav bar below with icons only

**Story Bubbles**:
- Horizontal scroll at top of feed
- 64px circular avatars with 3px gradient ring
- "Add Story" as first item with dashed border
- Type indicators (LIVE red, Video blue, Shop pink)

### Feed Components

**Post Card**:
- Dark card background, rounded-xl
- User header: 40px avatar with gradient ring, username, timestamp, menu
- Media: Full-width, aspect-square or 4:5
- Action bar: Heart, comment, share, bookmark (right-aligned)
- Engagement: Like count, username + caption inline
- Comments preview: clickable "View all X comments"

**Tabs**:
- For You / Following / Trending
- Pills style with bg-muted/50 TabsList
- Icons + text on desktop, icons only on mobile

### Video Components

**Video Post** (TikTok-style):
- Full-height vertical (aspect 9:16, max 80vh)
- Tap to play/pause
- Right sidebar: Avatar, heart, comments, share, bookmark
- Bottom overlay: Username, caption (line-clamp-2)
- Top: Mute/unmute button

### Marketplace Components

**Mall Hero**:
- Gradient banner (bg-dah-gradient-strong)
- Title with Sparkles icon
- Quick action badges (Trending, Deals, Flash Sale)
- Decorative circles for visual interest

**Category Cards**:
- Icon with gradient background (unique per category)
- Flea Market: orange-rose, Thrift: purple-pink, Tech: blue-cyan, Trade: emerald-teal
- Active state: ring-2 ring-primary

**Product Listing Card**:
- Square thumbnail with heart overlay
- Price badge (gradient, bottom-left)
- Seller info with avatar, verified badge, rating
- Action buttons: Buy Now (gradient), Message, Share

### Profile Components

**Profile Header**:
- Banner gradient overlay (32px height)
- Large avatar (128px) with gradient ring, overlapping banner
- Stats row: Posts, Followers, Following, Rating
- Action buttons: Follow (gradient), Message, Settings

**Profile Themes** (user customizable):
- Midnight: slate-900 to blue-950
- Neon: purple-950 to pink-950
- Ocean: blue-950 to cyan-950
- Sunset: rose-950 to amber-950
- Aurora: emerald-950 to cyan-950
- Minimal: neutral-950

**Content Tabs**:
- Posts / Videos / Shop / Saved
- Underline indicator style
- Grid layouts: 3-col for posts, 2-3 col for shop

### Interactive Elements

**Buttons**:
- Primary: bg-dah-gradient-strong (pink to blue)
- Secondary: bg-secondary (blue)
- Ghost: transparent with hover elevation
- Icon buttons: size="icon" with h-9 w-9

**Cards**:
- bg-card with border-border
- Use hover-elevate for interactive cards
- Never nest cards inside cards

**Badges**:
- Small size for status indicators
- Use with icons for context
- bg-white/20 for overlay badges

## Animations

- Subtle transitions (200-300ms)
- Heart fill animation on like
- Gradient ring rotation on stories
- Smooth modal/sheet transitions
- Skeleton loaders for loading states

## Accessibility

- 4.5:1 contrast minimum maintained
- Touch targets: 44px minimum
- Focus indicators: ring-primary
- Alt text for all images
- Keyboard navigation support

## Platform Patterns

**Feed**: Infinite scroll, optimistic updates, tab filtering
**Video**: Vertical swipe navigation, tap controls
**Mall**: Grid/list toggle, category filters, search
**Profile**: Customizable themes, tabbed content
**Notifications**: Grouped by type, actionable items

This creates an engaging, polished dark theme experience that feels like a premium social platform - comfortable for hours of browsing while maintaining visual interest through the pink and blue accent system.
