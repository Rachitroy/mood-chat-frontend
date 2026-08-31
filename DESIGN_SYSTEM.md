# 🎨 Mood Chat - Design System & Visual Reference

## Color Palette

### Mood Colors
```
┌─────────────────────────────────────────────────────┐
│ FLIRTY                                              │
│ #ff6b9d ███████ (Primary)                           │
│ #ff8fb8 ███████ (Light)                             │
│ #e94d7d ███████ (Dark)                              │
│ Usage: Messages with flirty mood, primary accent   │
├─────────────────────────────────────────────────────┤
│ HAPPY                                               │
│ #ffc857 ███████ (Primary)                           │
│ #ffd977 ███████ (Light)                             │
│ #e6b347 ███████ (Dark)                              │
│ Usage: Messages with happy mood, positive actions  │
├─────────────────────────────────────────────────────┤
│ SAD                                                 │
│ #6b8cff ███████ (Primary)                           │
│ #8fa7ff ███████ (Light)                             │
│ #4b6cdf ███████ (Dark)                              │
│ Usage: Messages with sad mood, rain effects        │
├─────────────────────────────────────────────────────┤
│ ANGRY                                               │
│ #ff4f4f ███████ (Primary)                           │
│ #ff7070 ███████ (Light)                             │
│ #df2f2f ███████ (Dark)                              │
│ Usage: Messages with angry mood, shake effects     │
├─────────────────────────────────────────────────────┤
│ NEUTRAL                                             │
│ #8c86a0 ███████ (Default)                           │
│ Usage: Default message styling, inactive elements  │
└─────────────────────────────────────────────────────┘
```

### Background Colors
```
┌──────────────────────────────────────────────┐
│ Primary Gradient                             │
│ #0a0812 → #1a0f2e → #0f1520                 │
│ Deep purple to blue gradient (Full page)     │
├──────────────────────────────────────────────┤
│ Solid Background: #0a0812                    │
│ Warm Tone: #1a1622                           │
│ Surface: #1f1b29                             │
│ Elevated Surface: #262032                    │
│ Border: #322c40                              │
└──────────────────────────────────────────────┘
```

### Text Colors
```
┌──────────────────────────────────────────────┐
│ Primary: #f1ede4   Light cream (headings)    │
│ Light: #bfb8cc     Soft lavender (secondary) │
│ Muted: #9a93a8     Gray lavender (tertiary)  │
│ High Contrast: Used for critical info        │
└──────────────────────────────────────────────┘
```

---

## Typography System

### Font Families
```
┌────────────────────────────────────────────────────┐
│ DISPLAY FONT                                       │
│ Fraunces (Serif)                                   │
│ Usage: Page titles, major headings                 │
│ Weights: 600-700 (bold)                            │
│ Example: "Welcome back", Room names                │
├────────────────────────────────────────────────────┤
│ BODY FONT                                          │
│ Inter (Sans-serif)                                 │
│ Usage: All content text, UI labels                 │
│ Weights: 400 (regular), 500 (medium), 600 (semi)   │
│ Example: Messages, buttons, inputs                 │
├────────────────────────────────────────────────────┤
│ MONOSPACE FONT                                     │
│ IBM Plex Mono                                      │
│ Usage: Timestamps, usernames, technical text      │
│ Weights: 400 (regular)                             │
│ Example: "@username", "14:32"                      │
└────────────────────────────────────────────────────┘
```

### Font Sizes
```
11px   Tiny       (Timestamps, muted labels)
12px   Small      (Metadata, UI hints)
13px   Base       (Small content, secondary info)
14px   Body       (Primary content)
15px   Large      (Input, message text)
16px   XL         (iOS zoom prevention)
18px   Heading3   (Chat room name)
20px   Heading2   (Sidebar title)
22px   Heading1   (Incoming call name)
24-28px Title     (Auth screen title)
32-36px Display   (Auth screen title)
```

### Letter Spacing
```
Global: 0.02em    Standard readable spacing
Upper:  0.05em    Buttons, labels (uppercase)
Upper:  0.15em    Eyebrow text (very tight)
```

---

## Spacing Scale

```
┌──────────────────────────────────────┐
│ PADDING VALUES (in pixels)           │
├──────────────────────────────────────┤
│ xs:  4px                             │
│ sm:  8px                             │
│ md:  12px                            │
│ lg:  16px                            │
│ xl:  20px                            │
│ 2xl: 24px                            │
│ 3xl: 28px                            │
│ 4xl: 36px                            │
│ 5xl: 40px                            │
│ 6xl: 48px                            │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ GAP VALUES (between elements)         │
├──────────────────────────────────────┤
│ Tight:   6px   (Compact layouts)     │
│ Normal:  8px   (Standard)            │
│ Medium:  12px  (Comfortable)         │
│ Large:   14px  (Spacious)            │
│ XL:      16px  (Very spacious)       │
└──────────────────────────────────────┘
```

---

## Border Radius

```
┌──────────────────────────────────────┐
│ STANDARD BORDER RADIUS               │
├──────────────────────────────────────┤
│ Compact:  8px    (Small buttons)     │
│ Standard: 16px   (Most elements)     │
│ Large:    20px   (Major components)  │
│ Round:    999px  (Circles/pills)     │
└──────────────────────────────────────┘
```

---

## Shadow System

### Shadow Depths
```
┌────────────────────────────────────────────────────┐
│ SMALL (Subtle elevation)                           │
│ 0 2px 8px rgba(0, 0, 0, 0.15)                      │
│ Usage: Hover states, slight lifts                  │
├────────────────────────────────────────────────────┤
│ MEDIUM (Noticeable depth)                          │
│ 0 8px 24px rgba(0, 0, 0, 0.25)                     │
│ Usage: Floating elements, modals                   │
├────────────────────────────────────────────────────┤
│ LARGE (Maximum depth)                              │
│ 0 16px 48px rgba(0, 0, 0, 0.35)                    │
│ Usage: Prominent overlays, important cards        │
├────────────────────────────────────────────────────┤
│ GLOW FLIRTY (Pink accent)                          │
│ 0 0 20px rgba(255, 107, 157, 0.2)                  │
│ Usage: Flirty elements, primary accent glow       │
├────────────────────────────────────────────────────┤
│ GLOW HAPPY (Yellow accent)                         │
│ 0 0 20px rgba(255, 200, 87, 0.2)                   │
│ Usage: Happy elements, success states              │
└────────────────────────────────────────────────────┘
```

---

## Animation System

### Animation Durations
```
Fast:       200ms   Interactions, hovers, quick feedback
Medium:     300ms   UI entries, medium transitions
Slow:       400ms   Message entries, important changes
X-Slow:     600ms   Modal opens, major transitions
```

### Easing Function
```
Primary: cubic-bezier(0.4, 0, 0.2, 1)
- Smooth and natural motion
- Fast start, controlled end
- Perfect for UI animations
```

### Keyframe Animations
```
┌────────────────────────────────────────────────────┐
│ slideIn (400ms)                                    │
│ From: opacity 0, translateY(20px)                  │
│ To:   opacity 1, translateY(0)                     │
│ Used: Messages, cards, modals                      │
├────────────────────────────────────────────────────┤
│ fadeIn (300ms)                                     │
│ From: opacity 0                                    │
│ To:   opacity 1                                    │
│ Used: Overlays, backgrounds                        │
├────────────────────────────────────────────────────┤
│ pulse-dot (1.2s infinite)                          │
│ 0-100%: opacity 1, scale(1)                        │
│ 50%:    opacity 0.3, scale(0.8)                    │
│ Used: Recording indicator                          │
├────────────────────────────────────────────────────┤
│ pulse-avatar (2s infinite)                         │
│ 0-100%: scale(1)                                   │
│ 50%:    scale(1.05)                                │
│ Used: Incoming call avatar                         │
├────────────────────────────────────────────────────┤
│ shake (420ms)                                      │
│ Alternating translateX: -2px, 3px, -4px, 4px       │
│ Used: Angry messages                               │
├────────────────────────────────────────────────────┤
│ fall (linear infinite)                             │
│ From: translateY(-20px)                            │
│ To:   translateY(110vh)                            │
│ Used: Sad message raindrops                        │
└────────────────────────────────────────────────────┘
```

---

## Interactive States

### Button States
```
┌────────────────────────────────────────────────────┐
│ DEFAULT                                            │
│ ■ Solid color or gradient                         │
│ ■ Box shadow applied                              │
│ ■ Cursor pointer                                  │
├────────────────────────────────────────────────────┤
│ HOVER                                              │
│ ■ Transform: translateY(-2px) [lift]               │
│ ■ Enhanced shadow (larger, darker)                 │
│ ■ Color shift (lighter variant)                    │
├────────────────────────────────────────────────────┤
│ ACTIVE/CLICK                                       │
│ ■ Transform: scale(0.98) [press]                   │
│ ■ Shadow reduced                                  │
│ ■ Immediate response                              │
├────────────────────────────────────────────────────┤
│ DISABLED                                           │
│ ■ Opacity: 0.5                                     │
│ ■ Cursor: not-allowed                              │
│ ■ No hover effects                                │
│ ■ Shadow removed                                  │
└────────────────────────────────────────────────────┘
```

### Input States
```
┌────────────────────────────────────────────────────┐
│ DEFAULT                                            │
│ ■ Background: rgba(26, 22, 34, 0.6)                │
│ ■ Border: rgba(255, 107, 157, 0.15)                │
│ ■ Border radius: 12px                              │
│ ■ Padding: 12px 16px                               │
├────────────────────────────────────────────────────┤
│ FOCUS                                              │
│ ■ Border color: var(--mood-flirty)                 │
│ ■ Background: rgba(26, 22, 34, 0.9)                │
│ ■ Box shadow: 0 0 16px rgba(255, 107, 157, 0.15)   │
│ ■ Smooth 200ms transition                          │
└────────────────────────────────────────────────────┘
```

---

## Component Specs

### Message Bubble
```
┌────────────────────────────────┐
│ Padding:       12px 16px       │
│ Border-left:   4px (mood color)│
│ Border-radius: 14px            │
│ Font-size:     15px            │
│ Line-height:   1.5             │
│ Max-width:     60% (desktop)    │
│ Shadow:        0 4px 12px      │
│ Backdrop blur: 5px             │
│ Transition:    200ms all       │
└────────────────────────────────┘
```

### Composer
```
┌────────────────────────────────┐
│ Padding:       20px 28px       │
│ Gap:           12px            │
│ Border-top:    1px subtle      │
│ Background:    Gradient        │
│ Backdrop blur: 5px             │
│ Input height:  ~44px (touch)   │
│ Button width:  auto (min 44px) │
└────────────────────────────────┘
```

### Call Avatar
```
┌────────────────────────────────┐
│ Size:          80px (diameter) │
│ Border-radius: 50% (circle)    │
│ Background:    Gradient        │
│ Font-size:     32px (bold)     │
│ Shadow:        Glow effect     │
│ Animation:     Pulse 2s        │
└────────────────────────────────┘
```

---

## Responsive Design

### Breakpoints
```
Mobile   <400px    Small phones, optimization focus
Tablet   400-720px Medium devices, transition layout
Desktop  >720px    Full two-column layout
```

### Mobile Optimizations
```
✓ Font sizes 16px+ on inputs (prevent iOS zoom)
✓ Touch targets 44x44px minimum
✓ Full-width inputs and buttons
✓ Reduced padding and gaps
✓ Mobile-specific UI (back button, etc.)
✓ Optimized modal widths
```

---

## Accessibility

### Color Contrast
```
Text on Background: WCAG AA (4.5:1 minimum)
Large Text (18px+): WCAG AA (3:1 minimum)
UI Components: WCAG AA standard
```

### Motion
```
✓ prefers-reduced-motion support
✓ Animation durations: 0.01ms when reduced
✓ No auto-playing animations
✓ Pause option for interactive effects
```

### Focus States
```
✓ Visible focus ring on all interactive elements
✓ Color: Primary mood color (high contrast)
✓ Outline offset: 2px
✓ Keyboard navigable
```

---

## Usage Guidelines

### Do's ✅
- Use color tokens for consistency
- Maintain animation timings
- Follow spacing scale
- Use appropriate font sizes
- Apply shadows for depth
- Test hover/focus states

### Don'ts ❌
- Don't use direct color values (use variables)
- Don't create custom animations
- Don't break spacing consistency
- Don't mix font families unnecessarily
- Don't remove focus states
- Don't use animations for reduced-motion users

---

## Future Enhancement Ideas

1. **Dark mode variant** (already optimized for dark)
2. **Custom themes** (change primary color)
3. **Font size accessibility** (user-adjustable)
4. **Animation intensity** (user preference)
5. **High contrast mode** (WCAG AAA compliance)
6. **Custom accent colors** (branding flexibility)

---

**Design System Version**: 1.0  
**Last Updated**: August 31, 2026  
**Status**: Production Ready ✅
