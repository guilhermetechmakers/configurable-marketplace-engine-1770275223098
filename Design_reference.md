# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations


### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Elevated surfaces for depth

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast
- Respect reduced motion preferences

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

# Configurable Marketplace Engine - Development Blueprint

A reusable, configuration-first two-sided marketplace engine that enables rapid launches of niche marketplaces by defining a central configuration layer (categories, dynamic listing schemas, fees, policies, and feature flags). Supports buyer/seller roles, seller onboarding/KYC, dynamic listing forms, multi-mode transactions (checkout, booking, inquiry/quote), Stripe Connect payouts, moderation, disputes, messaging, analytics, and admin tooling—all driven by versioned configuration so the same codebase adapts to many verticals.

## 1. Pages (UI Screens)

- Landing Page (Public marketing)
  - Purpose: Explain product, use-case templates, pricing, CTAs to sign up or demo marketplace.
  - Key sections/components: Hero (headline, subheadline, primary/secondary CTAs, supporting image), Use-case Templates cards, How it Works 3-step diagram, Feature Grid, Pricing & Plans cards, Testimonials/Logos, Footer (Docs, Contact, Legal), Social icons.

- Login / Signup Page
  - Purpose: Authenticate users (email/password/social) and create accounts with role selection.
  - Key sections/components: Auth Tabs (Login/Signup), Form Fields (email, password, confirm password, full name, role selector, company), Social Login Buttons, Remember Me, Terms Checkbox, Continue as Guest, Forgot Password link, inline validation/toasts.

- Password Reset Page
  - Purpose: Request and complete secure password reset via time-limited token.
  - Key sections/components: Request Reset Form (email), Reset Form (token, new password, confirm), validation messages, token expiry handling, success confirmation with link to login.

- Email Verification Page
  - Purpose: Verify account emails and guide next steps.
  - Key sections/components: Verification Status spinner, Success/Failure card, Resend Verification (rate-limited), Next Steps CTA (complete profile, go to dashboard).

- User Profile Page
  - Purpose: Account management, verification/KYC status, payment methods, preferences, seller controls.
  - Key sections/components: Profile Overview (avatar, name, badges), Edit Profile Form, KYC/Verification Section (start, upload docs, status), Payment Methods (cards, bank accounts), Notification Preferences toggles, Seller Tools (storefront, payout schedule), Danger Zone (delete account with audit).

- Buyer Dashboard
  - Purpose: Centralized buyer view: orders, messages, saved items, recommendations.
  - Key sections/components: Summary Cards (Orders, Messages, Saved), Recent Orders list (status + actions), Messages preview, Saved Listings, Recommendations.

- Seller Dashboard
  - Purpose: Seller operations: manage listings, orders, payouts, performance.
  - Key sections/components: Performance Metrics (earnings, views, conversion), Listings Management (status, edit, duplicate, archive), Orders Queue (state badges, actions), Payouts & Balances, Notifications & Messages, Quick Actions (create listing, onboarding).

- Listings Browse / Search Page
  - Purpose: Discovery with search + dynamic filters and sorting.
  - Key sections/components: Search bar (keyword, location, date), Category pills, Dynamic Filters Panel (generated from schema), Sort options, Listings grid/list, Map toggle with pins and clustering, Pagination/Infinite scroll.

- Listing Detail Page
  - Purpose: Full listing presentation and transaction entry point.
  - Key sections/components: Media Gallery (images/video), Title & summary, Price & booking panel (calendar if booking), Dynamic attributes (schema fields), Seller Card, Transaction CTA (Add to cart/Book/Request quote), Messaging widget, Reviews, Policies & FAQs, Price breakdown.

- Create / Edit Listing Page
  - Purpose: Multi-step dynamic listing builder generated from category schema.
  - Key sections/components: Progress wizard (Category → Details → Media → Pricing → Availability → Policies → Preview), Dynamic form renderer, Media uploader (drag/drop, crop, validation), Pricing module, Availability calendar, Preview panel (live), Publish controls (save draft, publish, schedule).

- Checkout / Payment Page
  - Purpose: Secure checkout/booking with fee breakdown and Stripe Connect integration.
  - Key sections/components: Order summary, Promo code input, Fee & payout summary (platform fee, seller payout, taxes), Payment methods (Stripe Elements), Billing & shipping forms, Place order CTA, Confirmation/receipt screen.

- Order / Transaction History Page
  - Purpose: Buyers/sellers view and manage orders, refunds, disputes.
  - Key sections/components: Orders table/list (filters, search), Order detail modal (breakdown, messages, invoice), Refund/dispute initiation, Export CSV.

- Messaging / Inbox Page
  - Purpose: In-app buyer↔seller threaded communication.
  - Key sections/components: Conversations list (unread count), Conversation pane (thread, attachments), Input box, Moderation actions (flag/escalate), Presence/typing indicators, Search within conversation.

- Reviews & Moderation Page
  - Purpose: Manage reviews and moderation of flagged content.
  - Key sections/components: Reviews list (filters), Moderation queue (flagged items), Review detail (transaction link, moderator notes), Bulk actions, Appeal workflow.

- Admin Dashboard
  - Purpose: Platform administration and configuration editing.
  - Key sections/components: Config editor (taxonomy, schemas, fees, policies, feature flags), User management (search, impersonate, suspend), Listings moderation tools, Orders & payouts control, Dispute center, Analytics & reports, Audit logs.

- Settings / Preferences Page
  - Purpose: Account and application settings, integrations, developer tools.
  - Key sections/components: Account settings (email, password, 2FA), Notifications, Billing & subscription, Integrations (webhooks, analytics), Developer tools (API keys, sandbox).

- About / Help Page
  - Purpose: Documentation, help center, contact support.
  - Key sections/components: FAQ/help articles (searchable), Contact form (file attachments), Developer docs link, Company info.

- Privacy & Legal Pages
  - Purpose: Host legal text and capture acceptance.
  - Key sections/components: Markdown-rendered legal text, Acceptance checkbox at signup, Admin version history.

- Error & Status Pages
  - Purpose: Friendly error/maintenance states.
  - Key sections/components: 404 with search, 500 with report button, Maintenance with ETA, Loading skeletons/success modals.

## 2. Features

- User Authentication & Security
  - Technical details: users table (bcrypt/argon2), roles, email_verified flag, JWT access + refresh tokens (HttpOnly secure cookies), refresh token rotation and revocation, social OAuth (Google/Facebook/Apple), email workflows (verification/password reset tokens with TTL and rate limits), optional 2FA (TOTP), brute-force protection, CSRF/CSP headers.
  - Implementation notes: Use refresh token rotation, store revocation list in Redis/DB, enforce strong password policy and server-side validation.

- Configuration Layer (Category & Schema Editor)
  - Technical details: Versioned config store (DB + object store), JSON Schema or DSL for field types/validations/conditional logic/UI hints, feature flags per tenant, fee engine (fixed/percent/tiered), preview generator and validator.
  - Implementation notes: Expose read-optimized runtime API with caching (Redis/edge) and publish lifecycle (draft → publish), ACL for admin roles, include migration tooling for schema changes.

- Listing CRUD & Dynamic Form Renderer
  - Technical details: Listings model with JSONB attributes, form renderer mapping schema to client components, server-side schema revalidation, drafts autosave, media uploads to S3 with presigned URLs and thumbnails/transcoding.
  - Implementation notes: Use optimistic locking for concurrent edits, autosave debounce, conflict resolution UI, and moderate uploads for content policy.

- Search & Discovery
  - Technical details: Use Elasticsearch/OpenSearch with dynamic mapping for attributes, indexing pipeline to materialize computed fields (price, availability), geo queries for proximity, facets generated from schema metadata, cursor-based pagination, CDN caching.
  - Implementation notes: Provide reindex endpoint, incremental index updates on listing changes, support pinned/promoted listings via boosts.

- Transaction Lifecycle & Order State Machine
  - Technical details: Immutable events log plus current state, distinct state machines per transaction mode, reservation/hold mechanism for bookings, server-side enforcement of transitions, hooks for policy automation.
  - Implementation notes: Implement using durable state machine library (or DB-enforced state transitions), optimistic/pessimistic locking for reservations, configurable timeouts/expiry.

- Payments & Payouts (Stripe Connect)
  - Technical details: Stripe Connect (Express/Custom), create Payment Intents, application fees/transfers to connected accounts, manage KYC/onboarding status, webhook handlers for payment_intent and payout events, ledger for reconciliation.
  - Implementation notes: Implement payout schedules, reserve/hold logic, and dispute handling automation. Test SCA/off-session flows and webhook retry handling.

- In-App Messaging
  - Technical details: WebSocket (Socket.IO) or pub/sub (Pusher) for real-time, messages stored encrypted in DB, attachments via presigned S3 URLs, rate limits, auto-flag heuristics.
  - Implementation notes: Sanitize and escape message content, notify via email/push, provide moderation and export capabilities.

- Reviews & Ratings
  - Technical details: Reviews tied to completed transactions, one review per role/per order, moderation queue, aggregated rating cached and recalculated on events.
  - Implementation notes: Delay review visibility until order completion; expose APIs to recalc aggregates; support review appeals.

- Moderation, Reporting & Dispute Resolution
  - Technical details: Moderation queue with priorities and SLA tracking, reports stored with metadata, dispute center linking evidence to orders, append-only audit log.
  - Implementation notes: Expose moderator UI with bulk actions, escalation paths, and audit trails for compliance.

- Notifications & Communication
  - Technical details: Transactional email (SendGrid/Mailgun) templates, push via FCM/APNs, in-app notification center, retry/queueing via RabbitMQ or Redis streams.
  - Implementation notes: Store preferences per user; rate-limit notifications; support templating and localization.

- Analytics & Reporting
  - Technical details: Event pipeline (structured events), ETL to data warehouse, dashboards for GMV, revenue, dispute rates, per-seller reports, CSV/PDF exports.
  - Implementation notes: Use incremental exports and pre-aggregations; enforce RBAC for report access.

- Performance, Caching & Backup
  - Technical details: CDN for static assets, Redis for session/cache/rate limiting, DB backups with point-in-time recovery, monitoring with Prometheus/Sentry.
  - Implementation notes: Implement TTLs for caches, incremental search reindexing, and high-availability DB configuration.

## 3. User Journeys

- Visitor → Browse → Purchase (Buyer)
  1. Land on Landing Page; click Explore Demo or Listings.
  2. Use Search/Filters to discover listings; open Listing Detail.
  3. If purchase mode: choose quantity/dates, click primary CTA.
  4. If not authenticated: prompt to Login/Signup or Continue as Guest (guest creates ephemeral session).
  5. Proceed to Checkout; apply promo codes; enter payment (Stripe Elements).
  6. Confirm payment → receive order confirmation and email receipt; order enters state machine.
  7. Post-completion: leave review (allowed only after state = completed).

- Visitor → Booking Flow (Buyer)
  1. Search with date range; select listing with availability calendar.
  2. Reserve dates (hold) → proceed to payment if required or request booking.
  3. Booking confirmation triggers calendar updates and seller notification.
  4. After experience: transaction completes → review allowed.

- Visitor → Inquiry / Quote (Buyer)
  1. On Listing Detail, choose Request Quote/Inquire.
  2. Fill inquiry form (custom fields from schema) → sends message to seller and creates inquiry record.
  3. Seller responds via messages, may convert to order.

- Seller Onboarding & Listing Creation (Seller)
  1. Signup as Seller; complete email verification.
  2. Start Seller Onboarding: provide company data, KYC via provider, bank account for Stripe Connect.
  3. Create Listing: choose category (drives dynamic schema), fill multi-step wizard, upload media, set pricing/availability, save draft, preview, publish.
  4. Published listing may enter moderation queue; once approved, appears in search.
  5. Manage orders in Seller Dashboard, update fulfillment, communicate via messaging, and view payouts.

- Admin Configuration & Operations (Admin)
  1. Login to Admin Dashboard; open Config Editor.
  2. Edit category taxonomy, modify listing schema fields/validations, adjust fee rules and publish config changes (draft → publish).
  3. Monitor moderation queue, disputes, payouts; perform manual adjustments if needed.
  4. Use Audit Logs to review actions and compliance.

- Moderator Workflow (Moderator)
  1. Receive flagged content in Moderation Queue.
  2. Review details (listing/review/message), take actions (approve/remove/escalate), add moderator notes.
  3. Notify affected users; record action in audit log.

- Dispute & Refund Flow (Buyer or Seller)
  1. Buyer raises dispute from Order Detail with evidence.
  2. System creates dispute record, places hold on payout, notifies seller and admin.
  3. Admin/Support reviews evidence, decides (refund/partial/refuse), action recorded, payouts adjusted accordingly.

## 4. UI Guide

Implementation notes: Apply the Visual Style section below exactly for all UI components. Ensure accessibility (WCAG AA), responsive behavior, and consistent component spacing.

- Global layout: 24–32px outer gutters, 16–24px internal spacing, left-aligned content with centered CTAs.
- Buttons: Primary fill #3AB54A (white text), secondary outlined with #3AB54A border. Corner radius 12–16px.
- Cards: Background #FFFFFF or #E6F9ED; radius 16px; shadow 0 2px 8px rgba(60,80,120,0.07).
- Inputs: Rounded, subtle shadow, focus state with green border highlight.
- Icons/Accents: Yellow #F6C244 for rating stars and small highlights; Red #F86B6B for error/alerts.
- Typography: Sans-serif (Inter/Poppins), headings bold (700), body regular, generous line-height.

---

Visual Style

### Color Palette:
- Primary background: #F9FAFB
- Accent/primary green: #3AB54A
- Soft mint green: #E6F9ED
- Black: #181818
- Medium gray: #A1A1AA
- White: #FFFFFF
- Yellow: #F6C244
- Red: #F86B6B
- Colorful imagery: realistic food/produce images for accents

### Typography & Layout:
- Font family: Inter or Poppins (sans-serif)
- Headings: Bold (700), clear hierarchy
- Body text: Regular, ample line height
- Section titles: Medium, uppercase/small caps optional
- Spacing: 24–32px outer gutters; 16–24px internal spacing
- Alignment: Left-aligned text; center key CTAs
- Layout: Multi-column grid for product cards

### Key Design Elements
- Card Design: #FFFFFF or #E6F9ED, radius 16px, shadow 0 2px 8px rgba(60,80,120,0.07)
- Navigation: Top nav white with drop shadow; category nav icon pills; sticky important actions
- Data Visualization: Star icons in #F6C244; minimal charts; icon badges for counts
- Interactive Elements: Rounded buttons (primary #3AB54A), outlined secondary; hover = slight scale + deeper shadow
- Micro-interactions: Smooth transitions on hover, button press, card interactions

### Design Philosophy
- Modern, minimalist, approachable, fresh/healthy vibe
- Focus on clarity, accessibility, whitespace, and prominent primary actions

---

Implementation Notes:
- Use the design system consistently across pages and components.
- After each development step, verify against this blueprint: pages, features, flows, and UI Guide.
- Ensure configuration layer drives dynamic UI generation (forms/filters/state machine).
- Implement role-based access control for admin/moderation features and secure all sensitive endpoints.

Instructions to AI Development Tool:
- After every development step, refer back to this blueprint to ensure correct implementation. Verify all features and pages are built according to specifications before completing the project. Pay special attention to the UI Guide section and ensure all visual elements follow the design system exactly.

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in RGB format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
