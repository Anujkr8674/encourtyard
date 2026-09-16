# EnCourtyard Design System — MASTER.md

> **Visual Source of Truth for EnCourtyard Coworking Space**  
> Generated via UI/UX Pro Max Design Framework  
> Aesthetic Classification: *Warm Architectural Editorial & Modern Biophilic Coworking*

---

## 1. Visual Direction & Brand Personality

### Brand Identity
EnCourtyard provides premium, calm, natural, and architecturally thoughtful workspaces for ambitious startups, growing SMEs, and enterprise teams. The visual identity reflects craftsmanship, organic natural materials, sunlit spaces, serene productivity, and understated luxury.

### Core Brand Pillars
- **Architectural & Editorial**: Structured grid layouts, generous negative space, intentional asymmetry, and timeless serif typography.
- **Biophilic & Natural**: Grounded in deep olive greens, warm linen beiges, soft stone tones, and organic textures.
- **Calm & Focused**: Zero clutter, no distracting neon gradients, soft warm shadows, and readable typography.
- **Professional Hospitality**: Warm concierge-level welcoming tone, clear visual hierarchy, and straightforward calls to action.

---

## 2. Color System & Exact HEX Values

The color palette is built around **Olive Green** as the primary heritage brand tone, complemented by warm architectural neutrals and functional status accents.

```
       Primary Brand                  Warm Surfaces                   Functional Accents
┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
│ Deep Olive:    #263626    │   │ Sand Beige:    #F7F5F0    │   │ Success Green: #2E7D32    │
│ Forest Olive:  #3A4D3A    │   │ Warm Cream:    #FAF9F5    │   │ Warning Amber: #C05621    │
│ Olive Muted:   #5C665C    │   │ Pure White:    #FFFFFF    │   │ Luxury Gold:   #C29B38    │
│ Olive Light:   #EBF0EB    │   │ Stone Border:  #E5E1D8    │   │ Dark Charcoal: #181F18    │
└───────────────────────────┘   └───────────────────────────┘   └───────────────────────────┘
```

### Exact Color Tokens

| Token Name | Hex Code | RGB | Purpose & Usage |
|---|---|---|---|
| `--color-olive-900` | `#1A261A` | `26, 38, 26` | Deepest brand dark, dark card backgrounds, high-contrast footers |
| `--color-olive-800` | `#263626` | `38, 54, 38` | **Primary Brand Color**, primary buttons, active states, key banners |
| `--color-olive-700` | `#3A4D3A` | `58, 77, 58` | Button hover states, secondary icons, badge fills |
| `--color-olive-600` | `#4F634F` | `79, 99, 79` | Subtle brand accents, active filters |
| `--color-olive-500` | `#6A806A` | `106, 128, 106` | Secondary icons, subtle borders on dark |
| `--color-olive-100` | `#E3EBE3` | `227, 235, 227` | Light olive badge backgrounds, soft highlights |
| `--color-olive-50`  | `#F1F5F1` | `241, 245, 241` | Ultra-subtle olive tint for callouts |
| `--color-beige-200` | `#EAE5DB` | `234, 229, 219` | Warm divider lines, input borders |
| `--color-beige-100` | `#F2EEE7` | `242, 238, 231` | Warm card backgrounds, table headers |
| `--color-beige-50`  | `#F7F5F0` | `247, 245, 240` | **Warm Section Background**, alternating page stripes |
| `--color-cream`     | `#FAF9F5` | `250, 249, 245` | Primary page canvas, warm card fill |
| `--color-white`     | `#FFFFFF` | `255, 255, 255` | Crisp card containers, modal dialogs, pure contrast |
| `--color-charcoal`  | `#181F18` | `24, 31, 24` | **Primary Text**, headings, sharp labels |
| `--color-muted`     | `#5C665C` | `92, 102, 92` | **Secondary Body Text**, meta descriptions, captions |
| `--color-border`    | `#E5E1D8` | `229, 225, 216` | Default card & element border |
| `--color-success`   | `#2E7D32` | `46, 125, 50` | "Available Now" badges, verified checkmarks |
| `--color-warning`   | `#C05621` | `192, 86, 33` | "Limited Spaces" badges, caution notices |
| `--color-gold`      | `#C29B38` | `194, 155, 56` | Editorial ratings, curated star accents |

---

## 3. Typography Hierarchy

### Font Families
- **Headings (Editorial Serif)**: `Playfair Display`, `Georgia`, serif  
  *Characteristics*: High contrast, editorial sophistication, refined luxury, architectural poise.
- **Body & UI (Clean Modern Sans)**: `Plus Jakarta Sans`, system-ui, sans-serif  
  *Characteristics*: Geometric clarity, tall x-height, pristine legibility across device scales.
- **Meta / Numeric (Monospace)**: `Geist Mono` / monospace  
  *Characteristics*: Clean numbers, capacity badges, floor-plan metrics, prices.

### Typography Scale & Style Matrix

| Element | Font Family | Size (Mobile / Desktop) | Weight | Line Height | Tracking |
|---|---|---|---|---|---|
| **Display Hero** | Playfair Display | `2.5rem (40px)` / `4.25rem (68px)` | Bold (700) | `1.1` | `-0.02em` |
| **H1 (Page Title)** | Playfair Display | `2.25rem (36px)` / `3.25rem (52px)` | SemiBold (600) | `1.15` | `-0.015em` |
| **H2 (Section)** | Playfair Display | `1.75rem (28px)` / `2.5rem (40px)` | SemiBold (600) | `1.2` | `-0.01em` |
| **H3 (Card Title)** | Playfair Display | `1.35rem (22px)` / `1.65rem (26px)` | Medium (500) | `1.3` | `0` |
| **H4 (Subheader)** | Plus Jakarta Sans | `1.125rem (18px)` / `1.25rem (20px)` | SemiBold (600) | `1.4` | `0` |
| **Body Large** | Plus Jakarta Sans | `1.125rem (18px)` | Regular (400) | `1.65` | `0` |
| **Body Default** | Plus Jakarta Sans | `1rem (16px)` | Regular (400) / Medium (500) | `1.6` | `0` |
| **Body Small** | Plus Jakarta Sans | `0.875rem (14px)` | Regular (400) | `1.5` | `+0.01em` |
| **Caption / Meta** | Plus Jakarta Sans | `0.75rem (12px)` | Medium (500) | `1.4` | `+0.05em` uppercase |
| **Numeric Highlight**| Playfair Display | `2rem (32px)` / `2.75rem (44px)` | Bold (700) | `1.1` | `-0.02em` |

---

## 4. Spacing, Layout & Container Rules

### Spacing System (8pt Grid)
- `space-1`: `4px` (subtle gap)
- `space-2`: `8px` (icon-text gap, compact padding)
- `space-3`: `12px` (input padding, badge padding)
- `space-4`: `16px` (card inner padding compact, standard gap)
- `space-6`: `24px` (card inner padding standard, grid gap)
- `space-8`: `32px` (section subgroup gap)
- `space-12`: `48px` (section inner separation)
- `space-16`: `64px` (section standard padding)
- `space-24`: `96px` (major section top/bottom padding)
- `space-32`: `128px` (hero vertical breathing room)

### Container Max Widths
- `container-sm`: `640px` (reading column, compact contact forms)
- `container-md`: `896px` (focused narrative content, FAQ accordions)
- `container-lg`: `1152px` (standard card grids)
- `container-xl`: `1280px` (main content container width with `px-4 sm:px-6 lg:px-8`)
- `container-full`: `100%` (hero architectural image frames)

---

## 5. UI Components & Tokens

### Border Radius
- `rounded-sm`: `4px` (badges, small tags)
- `rounded-md`: `8px` (inputs, buttons, select menus)
- `rounded-lg`: `12px` (standard cards, modal dialogs)
- `rounded-xl`: `16px` (featured hero media frames, bento blocks)
- `rounded-full`: `9999px` (pill badges, avatar circles)

### Elevation & Shadows
- `shadow-sm`: `0 1px 2px 0 rgba(24, 31, 24, 0.04)` (subtle element resting state)
- `shadow-warm`: `0 4px 20px -2px rgba(38, 54, 38, 0.06), 0 2px 6px -1px rgba(38, 54, 38, 0.03)` (standard card elevation)
- `shadow-warm-lg`: `0 12px 32px -4px rgba(38, 54, 38, 0.10), 0 4px 12px -2px rgba(38, 54, 38, 0.05)` (card hover elevation & modal dropdowns)
- `shadow-none`: `none` (bordered minimalist cards)

---

## 6. Component Guidelines

### Buttons
1. **Primary Button (`btn-primary`)**:
   - Background: `#263626` (Deep Olive)
   - Text: `#FFFFFF`
   - Padding: `px-6 py-3.5`
   - Font: `Plus Jakarta Sans`, font-medium (500), `text-sm`
   - Hover: Background `#3A4D3A`, translateY(-1px), `shadow-warm`
   - Border Radius: `rounded-md`
2. **Secondary / Sand Button (`btn-secondary`)**:
   - Background: `#F7F5F0` (Sand Beige)
   - Text: `#263626`
   - Border: `1px solid #E5E1D8`
   - Hover: Background `#EAE5DB`, border `#DCD7CA`
3. **Outline Button (`btn-outline`)**:
   - Background: `transparent`
   - Border: `1.5px solid #263626`
   - Text: `#263626`
   - Hover: Background `#263626`, Text `#FFFFFF`
4. **Ghost / Link Button (`btn-ghost`)**:
   - Text: `#263626`
   - Style: Inline with animated right arrow transition on hover

### Cards (Workspaces, Meeting Rooms, Pricing)
- Structure:
  - Upper: 16:10 or 4:3 high-resolution architectural image with category & availability badge overlays.
  - Middle: Room/Desk title (Playfair Display), Capacity & Location meta tags, brief curated description.
  - Lower: Key amenities list (icons with checkmarks), starting price in large serif, and dual action CTAs (*View Details* & *Book/Enquire*).
- Background: `#FFFFFF` on `#F7F5F0` surfaces, or `#FAF9F5` on `#FFFFFF` surfaces.
- Border: `1px solid #E5E1D8` with `rounded-xl`.
- Transition: `transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-warm-lg hover:border-olive-300`.

### Status Badges
- **Available Now**: `bg-[#EAF5EA] text-[#2E7D32] border border-[#C8E6C9]` with green pulsing status dot.
- **Limited Desks**: `bg-[#FEF3EB] text-[#C05621] border border-[#FCD9BD]` with amber status dot.
- **Recommended / Popular**: `bg-[#263626] text-[#FFFFFF]` with subtle luxury gold star icon.

### Form Inputs
- Background: `#FFFFFF`
- Border: `1px solid #E5E1D8` (Focus: `border-[#263626] ring-2 ring-[#263626]/10`)
- Label: `text-xs font-semibold uppercase tracking-wider text-[#5C665C]`
- Placeholder: `text-[#9EA89E]`

### Navigation Bar
- Position: Sticky top with subtle warm blur (`backdrop-blur-md bg-[#FAF9F5]/90 border-b border-[#E5E1D8]/80`)
- Brand: Clean typographic wordmark `EnCourtyard` in `Playfair Display` with olive geometric accent mark.
- Links: 5 main page navigation links with active olive underline indicator.
- Action: "Schedule a Visit" high-contrast primary CTA.
- Mobile: Smooth sliding disclosure drawer.

### Footer
- Background: `#1A261A` (Deep Olive Charcoal)
- Text: `#FAF9F5` with muted links `#A3B0A3` (Hover `#FFFFFF`)
- Layout: Brand bio column, Quick Links, Workspace Collections, Amenities & Contact info, Newsletter subscription mock.

---

## 7. Responsive Breakpoints

- **Mobile (`< 640px`)**: Single column stack, compact headers (36px), full-width action buttons, touch-friendly tap targets (min 44px).
- **Tablet (`640px – 1024px`)**: 2-column workspace cards, side-by-side metric badges, collapsible navigation.
- **Desktop (`1024px – 1280px`)**: 3-column workspace & pricing grids, asymmetric hero balance with split narrative.
- **Wide Desktop (`1280px+`)**: Full 1280px constrained layout with comfortable horizontal breathing room.

---

## 8. UX Rules & Anti-Patterns

### Strict UX Rules
1. **Clear Visual Scannability**: Every card must present price, capacity, and status within 1.5 seconds of scan time.
2. **Intentional Hierarchy**: One dominant H1 per page, high-contrast serif headlines followed by high-legibility sans body.
3. **Realistic Business Framing**: Always present EnCourtyard as a real physical space with real amenities (espresso bar, fiber optic internet, ergonomic Herman Miller seating, phone booths, sunlit courtyard).
4. **Accessible Contrast Ratio**: Minimum 4.5:1 for body copy and 3:1 for large display headers against all backgrounds.

### Anti-Patterns Strictly Prohibited
- ❌ **No AI Purple / Violet Neon Gradients**
- ❌ **No heavy frosted glassmorphism** that reduces text legibility
- ❌ **No centered boilerplate alignment** across all sections
- ❌ **No meaningless floating bubbles or random decorative widgets**
- ❌ **No SaaS dashboard widgets** on a public coworking hospitality website
- ❌ **No broken links, missing images, or placeholder 'Lorem Ipsum'**

---

*This document is the authoritative visual and UX blueprint for EnCourtyard across all routes and components.*
