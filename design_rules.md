# Design Rules for This Project

## Project Design Pattern: ---

## Visual Style

### Color Palette:
- Primary background: #F9FAFB (almost white, used for main backgrounds)
- Accent/primary green: #3AB54A (used for buttons, icons, and active elements)
- Soft mint green: #E6F9ED (backgrounds for cards/sections, subtle highlights)
- Black: #181818 (main headline and primary text)
- Medium gray: #A1A1AA (secondary text, descriptions)
- White: #FFFFFF (card and section backgrounds for clarity and separation)
- Yellow: #F6C244 (icon accents and visual highlights)
- Red: #F86B6B (secondary accent, rarely used for alerts/attention)
- Colorful imagery: Realistic food/produce images add pops of natural color

### Typography & Layout:
- Font family: Sans-serif, geometric and clean (e.g., Inter, Poppins or similar)
- Headings: Bold, large, clear hierarchy (e.g., 700 weight)
- Body text: Regular weight, ample line height for readability
- Section titles and labels: Medium weight, uppercase or small caps for clarity
- Spacing: Generous padding and margin; consistent 24-32px outer gutters, 16-24px internal spacing
- Alignment: Left-aligned text, centered elements for key actions (e.g., search bar, buttons)
- Layout: Multi-column grid for product cards, clear modular separation between sections

### Key Design Elements
#### Card Design:
- Card background: #FFFFFF or #E6F9ED with soft shadows (0 2px 8px rgba(60, 80, 120, 0.07))
- Rounded corners: 16px radius for all cards and containers
- Minimal border, subtle shadow for elevation
- Visual hierarchy: Product image on top, bold product name, smaller price/details, clear call-to-action (add button) at bottom
- Hover state: Slight elevation and intensified shadow, button color fill

#### Navigation:
- Top navigation bar: White with minimal drop shadow, left logo, right-aligned links and user actions
- Category navigation: Icon buttons with rounded corners, monochrome icons, clear active state (primary green fill or border)
- Sticky navigation for important actions (e.g., cart, search)
- Mobile-responsive: Collapsible sidebar or hamburger menu on small screens

#### Data Visualization:
- Ratings and reviews: Star icons in yellow (#F6C244), simple and uncluttered
- Minimal use of charts; focus on icons and badges for quant data (e.g., item count, price)
- Clean, icon-based visual cues for categories

#### Interactive Elements:
- Buttons: Rounded, bold, primary green (#3AB54A) fill or outline, white text, medium size
- Secondary buttons: Outlined, primary green border with white background
- Form elements: Rounded inputs, subtle shadows, clear focus states (green border highlight)
- Hover: Scale up, shadow deepen, slight color shift for interactive feedback
- Micro-interactions: Smooth transitions on button press, card hover, category selection

### Design Philosophy
This interface embodies:
- A modern, minimalist, and approachable aesthetic with a fresh, healthy vibe
- Design principles: clarity, accessibility, and ease of navigation; maximize whitespace for focus and calmness
- User experience goals: Fast comprehension, low cognitive load, visually lightweight; primary actions always prominent and easily accessible
- Visual strategy: Use of soft colors and large imagery to create a welcoming, trustworthy, and professional feel while maintaining a friendly, consumer-centric tone

---

This project follows the "---

## Visual Style

### Color Palette:
- Primary background: #F9FAFB (almost white, used for main backgrounds)
- Accent/primary green: #3AB54A (used for buttons, icons, and active elements)
- Soft mint green: #E6F9ED (backgrounds for cards/sections, subtle highlights)
- Black: #181818 (main headline and primary text)
- Medium gray: #A1A1AA (secondary text, descriptions)
- White: #FFFFFF (card and section backgrounds for clarity and separation)
- Yellow: #F6C244 (icon accents and visual highlights)
- Red: #F86B6B (secondary accent, rarely used for alerts/attention)
- Colorful imagery: Realistic food/produce images add pops of natural color

### Typography & Layout:
- Font family: Sans-serif, geometric and clean (e.g., Inter, Poppins or similar)
- Headings: Bold, large, clear hierarchy (e.g., 700 weight)
- Body text: Regular weight, ample line height for readability
- Section titles and labels: Medium weight, uppercase or small caps for clarity
- Spacing: Generous padding and margin; consistent 24-32px outer gutters, 16-24px internal spacing
- Alignment: Left-aligned text, centered elements for key actions (e.g., search bar, buttons)
- Layout: Multi-column grid for product cards, clear modular separation between sections

### Key Design Elements
#### Card Design:
- Card background: #FFFFFF or #E6F9ED with soft shadows (0 2px 8px rgba(60, 80, 120, 0.07))
- Rounded corners: 16px radius for all cards and containers
- Minimal border, subtle shadow for elevation
- Visual hierarchy: Product image on top, bold product name, smaller price/details, clear call-to-action (add button) at bottom
- Hover state: Slight elevation and intensified shadow, button color fill

#### Navigation:
- Top navigation bar: White with minimal drop shadow, left logo, right-aligned links and user actions
- Category navigation: Icon buttons with rounded corners, monochrome icons, clear active state (primary green fill or border)
- Sticky navigation for important actions (e.g., cart, search)
- Mobile-responsive: Collapsible sidebar or hamburger menu on small screens

#### Data Visualization:
- Ratings and reviews: Star icons in yellow (#F6C244), simple and uncluttered
- Minimal use of charts; focus on icons and badges for quant data (e.g., item count, price)
- Clean, icon-based visual cues for categories

#### Interactive Elements:
- Buttons: Rounded, bold, primary green (#3AB54A) fill or outline, white text, medium size
- Secondary buttons: Outlined, primary green border with white background
- Form elements: Rounded inputs, subtle shadows, clear focus states (green border highlight)
- Hover: Scale up, shadow deepen, slight color shift for interactive feedback
- Micro-interactions: Smooth transitions on button press, card hover, category selection

### Design Philosophy
This interface embodies:
- A modern, minimalist, and approachable aesthetic with a fresh, healthy vibe
- Design principles: clarity, accessibility, and ease of navigation; maximize whitespace for focus and calmness
- User experience goals: Fast comprehension, low cognitive load, visually lightweight; primary actions always prominent and easily accessible
- Visual strategy: Use of soft colors and large imagery to create a welcoming, trustworthy, and professional feel while maintaining a friendly, consumer-centric tone

---" design pattern.
All design decisions should align with this pattern's best practices.

## General Design Principles

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Dark mode with elevated surfaces

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)
- Test colors in both light and dark modes

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
- Adjust shadow intensity based on theme (lighter in dark mode)

---

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
- Sufficient color contrast (both themes)
- Respect reduced motion preferences

---

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
9. **Be Themeable** - Support both dark and light modes seamlessly

---

