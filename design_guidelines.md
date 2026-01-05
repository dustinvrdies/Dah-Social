# DAH SOCIAL - Design Guidelines (Sunset Aesthetic)

## Design Approach
**Reference-Based**: Instagram's visual clarity + Twitter's information density + Poshmark's marketplace integration, wrapped in a soft, calming sunset aesthetic. Focus on content discovery, social interaction, and seamless buying/selling experiences.

## Color Palette - Sunset Aesthetic

**Primary Gradient**: Soft pink (#FFE5EC) to sky blue (#E3F2FD)
**Accent Colors**:
- Coral: #FFB3BA (CTAs, active states)
- Peach: #FFDFBA (highlights, badges)
- Light Blue: #BAE1FF (links, secondary actions)
- Lavender: #E8D5F2 (tertiary accents)

**Neutrals**:
- Pure white: #FFFFFF (cards, backgrounds)
- Soft cream: #FFF9F5 (page backgrounds)
- Warm gray: #F5F0ED (dividers, borders)
- Text gray: #6B6B6B (body text)
- Charcoal: #3D3D3D (headings)

**Semantic Colors**:
- Success: Soft mint #C4E5D4
- Warning: Warm peach #FFE4CC
- Error: Blush pink #FFD4D9

**Gradient Applications**:
- Headers: Linear gradient pink-to-blue (horizontal)
- Buttons: Subtle coral-to-peach
- Cards: Soft glow overlays
- Story rings: Animated pink-blue rotation

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
- Card spacing: gap-6
- Section margins: my-12 to my-16
- Grid gaps: gap-4 (feed), gap-1 (tight grids)

**Container Widths**:
- Feed: max-w-2xl centered
- Marketplace grid: max-w-7xl
- Modals: max-w-4xl

## Core Components

### Navigation
**Top Bar** (h-16, gradient background):
- Left: Logo + wordmark
- Center: Search bar (rounded-full, white bg, subtle shadow)
- Right: Icons (Notifications bell, Messages, Cart badge, Profile avatar)
- Sticky with soft shadow on scroll

**Mobile Bottom Tab** (5 icons):
- Home, Search, Sell/Create (gradient circle, prominent), Activity, Profile
- Active state: Gradient underline + icon color shift

### Feed Components

**Post Card**:
- White background, rounded-2xl, shadow-sm
- User header: 48px avatar, username (bold), timestamp, menu dots
- Media: Full-width, rounded-xl within card, 4:3 or 1:1 ratio
- Action bar: Heart, comment bubble, share, bookmark (right-aligned)
- Engagement counts below icons
- Caption: Username bold + text, max 3 lines with "more" expansion
- Comments preview: 2 top comments with avatars
- Product tag indicator (if marketplace item)
- Spacing: p-6, gap-4 between sections

**Story Bar**:
- Horizontal scroll, pb-6
- 80px circular avatars with gradient ring (2px)
- "Add yours" as first item
- Username labels below (12px)

### Marketplace Components

**Product Listing Card**:
- Square thumbnail (1:1)
- Gradient overlay on hover
- Price tag (top-right, gradient badge)
- Product name + seller info below
- Like/save heart icon (top-left)
- Condition badge (new/used)

**Marketplace Grid**:
- 3-4 columns (responsive)
- gap-4, masonry option for varied heights
- Category filters (sticky horizontal scroll)

**Product Detail Modal**:
- Full-screen mobile, max-w-5xl desktop
- Left: Image carousel with thumbnails
- Right: Title, price (large coral), seller profile, description, size/condition, buy/message buttons
- Related items carousel at bottom

### Profile Components

**Profile Header**:
- Banner area: Gradient pink-to-blue (16:9 ratio, optional cover image)
- Avatar: 128px, white ring, overlapping banner
- Stats row: Posts, Followers, Following, Items Sold (clickable)
- Bio: max-w-md, 150 chars
- Action buttons: Follow (gradient), Message, Shop (if seller)
- Highlights/Collections row (circular)

**Tabs**:
- Posts, Shop, Tagged, Saved
- Underline indicator (gradient)

**Post/Product Grid**:
- 3 columns, square thumbnails
- gap-1 aesthetic
- Hover: Engagement metrics overlay

### Interaction Components

**Create Modal**:
- Toggle: Post / List Item
- Image upload area (dashed border, gradient on drag)
- Caption/description field
- For listings: Price, category, condition, shipping options
- Preview pane (right side desktop)
- Post/List button (gradient)

**Comment Section**:
- Nested replies (1 level)
- Avatar + username + text
- Like count + reply link
- Timestamp (light gray)
- Input field at bottom (gradient border on focus)

**Search/Explore**:
- Tabs: For You, Following, Marketplace, People
- Grid + list view toggle
- Filters sidebar (price range, categories, location)

## Images

**Placement Strategy**:
- Feed posts: Primary content (user-generated)
- Marketplace listings: Product photos (high quality, multiple angles)
- Profile banners: Optional gradient overlays
- Story highlights: Circular previews
- Explore page: Dense masonry grid

**Specifications**:
- Profile photos: 1:1 square, circular display
- Posts: 1:1, 4:5 ratios preferred
- Products: 1:1 square mandatory
- Stories: 9:16 vertical
- Banners: 16:9 landscape

**Hero Section**: No traditional hero - platform opens directly to feed. Marketing pages use gradient headers with product imagery.

## Animations (Minimal)

- Gradient color shifts on hover (subtle)
- Heart fill animation on like
- Smooth modal/sheet transitions
- Pull-to-refresh indicator
- Skeleton loaders (gradient shimmer)

## Accessibility

- 4.5:1 contrast minimums maintained
- Touch targets: 48px minimum
- Keyboard navigation for all modals
- Focus indicators: Gradient outline
- Alt text required for all images
- Screen reader labels on icon buttons

## Platform Patterns

**Feed**: Infinite scroll, pull-to-refresh, optimistic updates
**Marketplace**: Quick buy flow, saved searches, price alerts
**Messaging**: In-app chat for transactions, media sharing
**Notifications**: Grouped by type (social, sales, messages), badges
**Payments**: Integrated checkout modal, seller payouts dashboard

This creates a soothing, visually cohesive experience that makes extended browsing comfortable while maintaining social engagement and commerce functionality.