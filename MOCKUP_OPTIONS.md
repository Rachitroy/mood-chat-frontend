# Mood Chat - Visual Mockup Descriptions

**Date:** 2026-09-02  
**Purpose:** Detailed visual design references for 3 redesign options

---

## OPTION 1: Modern Glassmorphism Premium 💎

### Overall Aesthetic
- Premium, sleek, high-end feel
- Frosted glass effects throughout
- Deep dark base with vibrant emotion accents
- Smooth gradients and glows
- Floating, layered depth

### Color Palette
```css
/* Base */
--bg-primary: #0a0d1a;
--bg-secondary: #141829;
--bg-glass: rgba(30, 34, 52, 0.7);

/* Emotion Colors - Vibrant */
--emotion-flirty: #ff3d81;
--emotion-happy: #ffd700;
--emotion-sad: #5b9cff;
--emotion-angry: #ff4040;
--emotion-neutral: #a0a8c0;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-accent: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### Main Chat Interface Description

**Sidebar (280px width):**
- Background: Frosted glass effect (rgba(30, 34, 52, 0.7)) with backdrop-filter: blur(20px)
- Border-right: 1px solid rgba(255, 255, 255, 0.1)
- Header section:
  - "Mood Chat" logo with gradient text (purple to pink)
  - Subtle glow effect underneath
  - 24px padding all around
- Room list:
  - Each room item: rounded-xl (16px), padding 14px
  - Hover state: slight glow, background rgba(99, 102, 241, 0.1)
  - Active room: gradient background, white text, shadow
  - Room names in clean sans-serif, 15px
  - 8px gap between items
- Bottom section:
  - User profile with avatar (40px circle) and username
  - Subtle gradient border around avatar

**Main Chat Area:**
- Background: Deep dark gradient (#0a0d1a to #141829)
- Header:
  - Height: 64px
  - Frosted glass background
  - Room name (20px, bold) on left
  - Call buttons on right (glass buttons with icons)
- Message area:
  - Padding: 24px
  - Messages with 16px gap between
  - Each message bubble:
    - Glass background (rgba(255, 255, 255, 0.05))
    - Backdrop blur: 10px
    - Border: 2px solid with emotion color
    - Border-radius: 16px
    - Padding: 14px 18px
    - Soft glow matching emotion (box-shadow)
    - Text: 14px, line-height 1.5
    - Metadata: 11px, opacity 0.6, monospace
- Own messages:
  - Align right
  - Gradient background (purple to pink)
  - No border
  - White text
- Composer:
  - Height: 72px
  - Frosted glass background
  - Input field: glass style, rounded-full (9999px)
  - Buttons: circular, glass effect, 44px size
  - Send button: gradient background when active

---

## OPTION 2: Clean Minimalist Light ☀️

### Overall Aesthetic
- Clean, spacious, breathable
- Soft colors with emotion accents
- Lots of white space
- Subtle shadows, no heavy effects
- Content-first, distraction-free

### Color Palette
```css
/* Base */
--bg-primary: #ffffff;
--bg-secondary: #f8f9fa;
--bg-surface: #ffffff;

/* Emotion Colors - Soft */
--emotion-flirty: #ff94b8;
--emotion-happy: #ffda6a;
--emotion-sad: #81b4ff;
--emotion-angry: #ff8080;
--emotion-neutral: #a8b2c1;

/* Text */
--text-primary: #1a1d29;
--text-secondary: #6b7280;
--text-muted: #9ca3af;

/* Borders */
--border-color: #e5e7eb;
```

### Main Chat Interface Description

**Sidebar (280px width):**
- Background: Pure white (#ffffff)
- Border-right: 1px solid #e5e7eb
- Header section:
  - "Mood Chat" in clean sans-serif, 24px, bold
  - Subtle colored dot as logo accent
  - 24px padding
- Room list:
  - Each room: minimal style, padding 12px 16px
  - Border-radius: 8px
  - Hover: background #f8f9fa
  - Active: background #f3f4f6, left border (3px) with brand color
  - 4px gap between items
- Bottom:
  - Simple user section with avatar and name
  - Logout text button

**Main Chat Area:**
- Background: #f8f9fa (soft gray)
- Header:
  - Height: 60px
  - Background: white
  - Simple layout, no effects
  - Bottom border: 1px solid #e5e7eb
- Message area:
  - Padding: 32px
  - Very spacious (20px gap between messages)
  - Message bubbles:
    - Background: white
    - Border: 1px solid #e5e7eb
    - Border-radius: 12px
    - Padding: 12px 16px
    - Small colored left-border (4px) indicating emotion
    - Shadow: subtle, 0 1px 3px rgba(0,0,0,0.1)
- Own messages:
  - Light colored background (based on brand)
  - No border
  - Align right
- Composer:
  - Background: white
  - Border-top: 1px solid #e5e7eb
  - Simple input with border
  - Minimal buttons
  - Clean, focused design

---

## OPTION 3: Dark Immersive Emotional 🌙

### Overall Aesthetic
- Deep, rich blacks
- Vibrant emotion colors that pop
- Cinematic, dramatic feel
- Strong visual hierarchy
- Emotion-forward design

### Color Palette
```css
/* Base */
--bg-primary: #000000;
--bg-secondary: #0d0d0d;
--bg-surface: #1a1a1a;

/* Emotion Colors - Vibrant & Bold */
--emotion-flirty: #ff0066;
--emotion-happy: #ffcc00;
--emotion-sad: #0088ff;
--emotion-angry: #ff3333;
--emotion-neutral: #888899;

/* Accent */
--accent-glow: #7c3aed;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
```

### Main Chat Interface Description

**Sidebar (300px width):**
- Background: Pure black (#000000)
- Border-right: 1px solid #1a1a1a
- Header:
  - "Mood Chat" with subtle neon glow
  - Gradient underline
  - 28px padding
- Room list:
  - Dark surface (#1a1a1a)
  - Each room: padding 16px
  - Border-radius: 12px
  - Hover: subtle glow effect
  - Active: strong emotion-colored left border (4px), bright glow
  - 10px gap
- Bottom:
  - User profile with glowing avatar border
  - Status indicator

**Main Chat Area:**
- Background: Very dark gradient (#000000 to #0d0d0d)
- Header:
  - Height: 70px
  - Background: #0d0d0d
  - Strong contrast
  - Call buttons with icon glow
- Message area:
  - Padding: 28px
  - 18px gap between messages
  - Message bubbles:
    - Background: #1a1a1a
    - Strong emotion-colored border (2px)
    - Border-radius: 14px
    - Padding: 16px 20px
    - Emotion-colored glow (strong box-shadow)
    - Text: crisp white, 15px
- Own messages:
  - Solid emotion color background
  - Strong glow effect
  - White text
  - Bold presence
- Composer:
  - Background: #0d0d0d
  - Input: dark with subtle border glow on focus
  - Buttons: glowing when active
  - Dramatic, cinematic feel

---

## Emotion Effect Visualizations

### For All Options:

**Flirty Emotion:**
- Pink/magenta color scheme
- Soft romantic glow
- Subtle heart particles (confetti)
- Warm tint overlay

**Happy Emotion:**
- Yellow/gold color scheme
- Bright, energetic glow
- Celebration confetti
- Warm brightness pulse

**Sad Emotion:**
- Blue color scheme
- Cool, calming glow
- Gentle rain effect
- Blue tint overlay

**Angry Emotion:**
- Red color scheme
- Intense glow
- Screen shake effect
- Red flash overlay

**Neutral Emotion:**
- Gray/purple color scheme
- Minimal effect
- Subtle pulse

---

## Typography Specifications

### Option 1 (Glassmorphism):
- **Headings:** Inter or SF Pro Display (700 weight)
- **Body:** Inter (400-500 weight)
- **Monospace:** JetBrains Mono
- Scale: 11px, 13px, 15px, 18px, 24px, 32px

### Option 2 (Minimalist):
- **Headings:** System font stack (600-700 weight)
- **Body:** System font stack (400-500 weight)
- **Monospace:** SF Mono / Consolas
- Scale: 12px, 14px, 16px, 20px, 24px, 32px

### Option 3 (Dark Immersive):
- **Headings:** Inter or Helvetica (700-800 weight)
- **Body:** Inter (400-500 weight)
- **Monospace:** Fira Code
- Scale: 12px, 14px, 15px, 18px, 28px, 36px

---

## Spacing & Layout

### Option 1:
- Base unit: 8px
- Padding scale: 12px, 16px, 24px, 32px
- Gap scale: 8px, 12px, 16px, 24px
- Border radius: 12px, 16px, 20px, 24px

### Option 2:
- Base unit: 8px
- Padding scale: 12px, 16px, 24px, 32px, 40px
- Gap scale: 4px, 8px, 12px, 20px, 32px
- Border radius: 6px, 8px, 12px, 16px

### Option 3:
- Base unit: 8px
- Padding scale: 16px, 20px, 28px, 36px
- Gap scale: 10px, 14px, 18px, 28px
- Border radius: 10px, 12px, 14px, 18px

---

## Animation Specifications

### Option 1 (Smooth & Premium):
- Duration: 200ms (fast), 350ms (medium), 500ms (slow)
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Transitions on: background, transform, opacity, box-shadow

### Option 2 (Subtle & Clean):
- Duration: 150ms (fast), 250ms (medium)
- Easing: ease-out
- Minimal animations, focus on clarity

### Option 3 (Dramatic):
- Duration: 250ms (fast), 400ms (medium), 600ms (slow)
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (bounce)
- Strong transitions, glow effects, dramatic presence

---

**Next Steps:**
1. Review these three options
2. User selects preferred direction
3. Refine selected option
4. Extract complete design system
5. Document in UI_REDESIGN_DECISIONS.md
6. Implement in code

---

**Status:** Mockup descriptions complete, awaiting user selection
