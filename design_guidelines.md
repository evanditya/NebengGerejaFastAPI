# Design Guidelines: Nebeng Gereja Church Carpooling App

## Design Approach

**Selected Approach**: Design System (Material Design) with community app influences

**Justification**: This is a utility-focused, mobile-first application for church community coordination. The primary goals are clarity, ease of use, and efficient ride booking. Material Design provides excellent mobile patterns, clear information hierarchy, and accessibility - perfect for a diverse church community including varying age groups and technical comfort levels.

**Reference Influences**: WhatsApp (for familiar, trustworthy communication feel), ride-sharing apps (for booking patterns), and church community apps (for warmth and inclusivity)

**Core Principle**: Clear, accessible, and respectful design that serves the community without unnecessary complexity.

---

## Typography

**Font Family**: 
- Primary: Inter or Roboto (Google Fonts via CDN)
- Fallback: system-ui, sans-serif

**Hierarchy**:
- Page Titles: text-3xl (30px), font-semibold
- Section Headers: text-xl (20px), font-semibold  
- Card Titles/Ride Info: text-lg (18px), font-medium
- Body Text: text-base (16px), font-normal
- Secondary Info/Metadata: text-sm (14px), font-normal
- Bottom Nav Labels: text-xs (12px), font-medium

---

## Layout System

**Spacing Units**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4, p-6
- Section spacing: space-y-4, space-y-6
- Card spacing: gap-3, gap-4
- Bottom nav height: h-16
- Safe area bottom: pb-20 (accounts for bottom nav)

**Container Strategy**:
- Mobile: px-4, max-w-full
- Desktop: max-w-4xl mx-auto (centered, readable width)
- Content should breathe - never cramped

---

## Component Library

### Navigation
**Bottom Navigation Bar** (fixed, mobile-primary):
- 4 items: Home, Rides, Post Ride (driver only), Profile
- Icons with labels, active state with filled icon
- Fixed position bottom with slight elevation shadow
- Height: h-16, safe padding consideration

**Top Bar** (simple):
- Church name/logo left
- Admin link (admin only), Logout right
- Minimal, doesn't compete with content

### Cards (Primary Pattern)

**Ride Card** (most important component):
- Elevated card with rounded corners (rounded-lg)
- Structure top-to-bottom:
  - Mass name and datetime (prominent, text-lg font-semibold)
  - Driver name with small avatar placeholder
  - Pickup point with location icon
  - Seats available (prominent badge/pill showing X/Y seats)
  - Notes preview (if exists, truncated)
  - WhatsApp contact button (primary action, full width)
- Spacing: p-4, space-y-3
- Clear visual separation between cards: gap-4

**Mass Schedule Card**:
- Compact design showing date/time prominently
- Mass name and special indicator (if applicable)
- Quick "See Rides" action button
- Spacing: p-3

### Forms

**Input Fields**:
- Labels above inputs (text-sm, font-medium, mb-2)
- Inputs with clear borders, rounded-md, px-4 py-3
- Focus states with border emphasis
- Helper text below (text-sm)
- Full width on mobile

**Buttons**:
- Primary Action: Full width on mobile, px-6 py-3, rounded-lg, font-medium
- Secondary Action: Outlined style
- WhatsApp Button: Distinct treatment (slight icon integration)
- Spacing between button groups: space-y-3

### Lists & Data Display

**Rides List**:
- Filterable by mass schedule (dropdown/select at top)
- Card-based layout (not table on mobile)
- Empty state: Friendly message with illustration placeholder
- Loading state: Simple skeleton cards

**Booking List** (passenger view):
- Shows user's bookings with ride details
- Cancel action clearly available
- Past vs upcoming visual distinction

### Admin Dashboard

**Management Sections**:
- Clear section headers with add buttons
- Simple table/list for mass schedules
- Simple list for lingkungan/environments
- Edit/delete actions inline, subtle until hover
- Mobile: Cards instead of tables

---

## Interaction Patterns

**Booking Flow**:
1. Browse rides list → Tap ride card
2. View full ride details
3. Input number of seats (number input, default 1)
4. Confirm booking button
5. Success feedback → Redirect to bookings

**WhatsApp Integration**:
- Template message: "Halo [Driver Name], saya tertarik dengan tumpangan Anda untuk [Mass Name] pada [DateTime]"
- Opens in new window/tab

**Seat Counter Display**:
- Visual indicator: "3/5 kursi tersedia" or badge style
- Red/warning treatment when low (≤2 seats)

---

## Mobile-First Specifics

**Bottom Sheet Pattern** (optional enhancement):
- Ride details could slide up as bottom sheet instead of new page
- Booking confirmation as bottom sheet modal

**Touch Targets**:
- Minimum 44x44px for all interactive elements
- Generous padding in cards for easy tapping

**Safe Areas**:
- Account for bottom nav: Content ends with pb-20
- Top bar: minimal height (h-14)

---

## Images

**Hero Section** (Homepage):
- Small hero banner showing church community or people carpooling together
- Height: ~200px on mobile, 300px on desktop  
- Not full-screen - positioned above mass schedule list
- Overlay text: "Nebeng Gereja - Berbagi Perjalanan, Berbagi Berkat" (or similar welcoming message)

**Supporting Images**:
- Small church/community icons in empty states
- Driver avatars: Placeholder initials if no photo
- No images needed in: Forms, ride listings (keep information-focused)

---

## Accessibility & Quality

- High contrast text throughout
- Form labels always visible
- Error messages clear and contextual
- Loading states for all async actions
- Success confirmations visible and reassuring
- Logout and critical actions require confirmation
- Indonesian language throughout (no English mixing unless technical terms)