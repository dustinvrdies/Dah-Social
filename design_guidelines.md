# DAH SOCIAL - Design Guidelines

## Design Approach
**Reference-Based**: Inspired by Instagram's visual clarity + Twitter's information density + LinkedIn's professional polish. Focus on content discovery, social interaction, and user-generated content presentation.

## Typography System

**Font Family**: Inter (Google Fonts) for UI, Lexend for headings
- Headings: 600-700 weight, 24-40px
- Body text: 400 weight, 14-16px  
- Captions/metadata: 400 weight, 12-14px
- Usernames/actions: 500-600 weight, 14-16px

## Layout & Spacing

**Tailwind Unit System**: Primarily use 2, 3, 4, 6, 8, 12, 16 units
- Component padding: p-4 to p-6
- Section spacing: gap-4 to gap-8
- Container max-widths: max-w-2xl (feed), max-w-7xl (explore/discover)

**Grid System**: 
- Main feed: Single column (max-w-2xl centered)
- Explore/Discover: 3-column grid (md:grid-cols-2 lg:grid-cols-3)
- Profile pages: 3-column post grid

## Core Components

### Navigation
**Top Bar**: Fixed header with logo left, search center, icons right (notifications, messages, profile)
- Height: h-16
- Border bottom for separation
- Sticky positioning

**Mobile Navigation**: Bottom tab bar (Home, Search, Create, Notifications, Profile)

### Feed Components

**Post Card**:
- Full-width content area
- User header: Avatar (40px), username, timestamp, menu
- Image/media area: Aspect ratio 4:3 or 1:1
- Action bar: Like, comment, share icons with counts
- Caption: Username bold + text
- Comments preview: Show 2-3 top comments
- Spacing: p-4 for content, gap-3 between sections

**Story/Highlights Bar**:
- Horizontal scroll
- Circular avatars (72px) with gradient rings
- Username labels below
- Positioned at top of feed

### Profile Components

**Profile Header**:
- Avatar: 96px (mobile), 150px (desktop)
- Stats row: Posts, Followers, Following (clickable)
- Bio section: max 150 characters
- Action buttons: Follow/Edit Profile (prominent)
- Highlight circles below bio

**Post Grid**:
- Square thumbnails
- gap-1 for tight grid aesthetic
- Hover overlay shows likes/comments count

### Interaction Components

**Create Post Modal**:
- Full-screen overlay on mobile
- Centered modal (max-w-4xl) on desktop
- Image preview + caption input
- Filter/edit options
- Location/tag inputs

**Comments Section**:
- Nested threading (1 level)
- Like button per comment
- Reply action
- Time stamps
- Load more trigger

**Search/Explore**:
- Search bar with recent/suggested
- Category tabs (Top, People, Tags, Places)
- Masonry or grid layout for results

## Images

**Profile Photos**: Require 1:1 square cropping, circular display
**Post Images**: Support 1:1, 4:5, 16:9 aspect ratios
**Story Content**: Vertical 9:16 format
**Cover/Banner**: 3:1 ratio for profile covers (optional feature)

Place images prominently throughout:
- Feed posts (primary content)
- Profile grids (visual portfolio)
- Story highlights (circular previews)
- Explore page (dense visual discovery)

## Accessibility
- Minimum touch targets: 44px
- Clear focus states on all interactive elements
- Alt text support for images
- Keyboard navigation for modals/dropdowns
- Color contrast ratios: 4.5:1 minimum

## Platform-Specific Patterns

**Feed Behavior**:
- Infinite scroll with "Load More" trigger
- Pull-to-refresh on mobile
- Optimistic UI updates (instant like/follow)

**Notifications**:
- Badge counts on icons
- Grouped by type (likes, comments, follows)
- Mark all read action

**Messaging** (if included):
- Chat list with unread indicators
- Conversation threads
- Media sharing within chats

## Performance Considerations
- Lazy load images below fold
- Virtualize long feeds
- Cache user data in localStorage
- Optimistic updates for social actions

This creates a modern, familiar social experience optimized for content discovery and engagement.