# Mood Chat - UI Redesign Decisions

**Date:** 2026-09-02  
**Status:** Continued and implemented  
**Design direction:** Dark Immersive Glass + emotion-first reactions  
**Stack:** React 18, Vite, vanilla CSS

---

## Design philosophy

1. **Emotion-first design** — the interface stays calm by default, then uses color, motion, audio, and particles only when mood reactions happen.
2. **Premium dark surface** — deep navy/black base, glass panels, soft ambient gradients, and restrained shadows.
3. **Readable chat hierarchy** — room, sender, message, reply, call, upload, and recording states should be visually distinct.
4. **Mobile-first behavior** — existing list/chat split is preserved and polished for small screens.
5. **Accessible interaction** — visible focus states, 44px touch targets, reduced-motion support, and direct error copy.

---

## Overall design direction

### Selected style

**Dark Immersive Glass**

A custom mix of:

- Modern glassmorphism for auth, shell, sidebar, composer, and call overlays
- Dark immersive background with subtle mesh glow and grain texture
- Premium typography with a display serif for headings and rounded sans for UI text
- Emotion colors reserved for mood feedback instead of using many accents everywhere

### Why this direction

Mood Chat is a communication product, so the base UI should feel calm and trustworthy. The emotional moments should be the expressive layer. This avoids the previous issue where gradients and saturated colors appeared everywhere, making the emotion system feel less special.

---

## Design system decisions

### Primary palette

```css
--primary: #7c86ff;
--primary-light: #aab0ff;
--primary-dark: #5962dc;

--bg-darker: #050914;
--bg-dark: #0b1624;
--bg-card: #121d2d;
--bg-card-hover: #1b2b40;

--text-primary: #f7f2ea;
--text-secondary: #d3c9bd;
--text-muted: #8f9aaa;
```

### Emotion colors

Emotion colors remain available, but they are used as **reaction states**, not global UI accents.

```css
Flirty: soft rose / pink glow
Happy: warm gold glow
Sad: muted blue glow
Angry: softened red glow
Neutral: slate/cream calm state
```

### Typography

```css
--font-sans: 'Outfit', system-ui, sans-serif;
--font-display: 'Fraunces', Georgia, serif;
--font-mono: 'IBM Plex Mono', 'Courier New', monospace;
```

Decisions:

- Removed Inter/Roboto usage.
- Display typography uses Fraunces for brand moments.
- UI text uses Outfit for a cleaner app feel.
- Metadata/timers use IBM Plex Mono with tabular numbers.

### Radius and depth

```css
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 22px;
--radius-xl: 32px;
```

Cards and app panels now use softer large radii, while message bubbles use asymmetric corner shaping to feel more chat-native.

### Motion

```css
--motion-spring: cubic-bezier(0.32, 0.72, 0, 1);
--motion-smooth: cubic-bezier(0.22, 1, 0.36, 1);
```

Default `ease-in-out` style motion is replaced in the polished layer with heavier, spring-like transitions.

---

## Component decisions

### Authentication screen

Implemented continuation:

- Kept the cityscape background.
- Added premium double-bezel auth card treatment.
- Added inner auth card wrapper class instead of inline styles.
- Upgraded title typography and surface depth.
- Preserved login/register logic.

Files touched:

- `src/components/AuthScreen.jsx`
- `src/styles.css`
- `index.html`

### Sidebar / room list

Implemented continuation:

- Removed inline empty-state styling.
- Added a composed empty-room state.
- Polished room hover/active states.
- Made sidebar width responsive while preserving desktop layout.
- Kept create-room and logout functionality unchanged.

Files touched:

- `src/components/Sidebar.jsx`
- `src/styles.css`

### Chat header

Implemented continuation:

- Removed inline flex styles.
- Added semantic class structure for room identity and actions.
- Added room-type eyebrow: private room / group room.
- Improved call button grouping and mobile label behavior.

Files touched:

- `src/components/ChatRoom.jsx`
- `src/styles.css`

### Message list and bubbles

Implemented continuation:

- Fixed mismatch between JSX `data-mood` and CSS `data-emotion` selectors.
- Added message bubble wrapper styles.
- Added reply button reveal behavior.
- Added styled loading/empty message state.
- Added attachment, image, audio, and file chip polish.

Files touched:

- `src/components/ChatRoom.jsx`
- `src/styles.css`

### Message composer

Implemented continuation:

- Removed inline hidden-file-input styling.
- Added accessible hidden file input utility.
- Converted composer into a glass input island.
- Added styled upload error state.
- Preserved file upload, voice recording, and send behavior.

Files touched:

- `src/components/ChatRoom.jsx`
- `src/styles.css`

### Call screens

Implemented continuation:

- Polished incoming call card and active call screen.
- Added video stage, local video, remote video, and audio call surface styling.
- Added call control layout and toggle-off visual state.
- Kept WebRTC/call logic unchanged.

Files touched:

- `src/components/CallScreen.jsx`
- `src/components/IncomingCallModal.jsx`
- `src/styles.css`

### Emotion effects

Implemented continuation:

- Kept existing confetti, rain, screen shake, tints, and Web Audio effects.
- Reduced arbitrary z-index values in effect overlays from `999` to the app layering scale.
- Kept emotion reactions visually distinct without making the entire UI overly saturated.

Files touched:

- `src/lib/effects.js`
- `src/styles.css`

---

## Accessibility and performance decisions

Implemented:

- Visible `:focus-visible` rings for buttons, inputs, and links.
- Reduced-motion media query.
- `min-height: 100dvh` for full-screen shells.
- Removed inline styling from React components.
- Added `role="status"` to floating and composer error banners.
- Added social/meta description tags in `index.html`.
- Avoided backdrop blur on scrolling message bubbles; kept heavier blur on fixed/contained surfaces.

Still recommended later:

- Add a skip-to-content link if the app grows into multiple navigation areas.
- Add full form validation messages beyond browser validation.
- Add a favicon/OG image asset.

---

## Implementation log

### Session 1: 2026-09-02 11:24 AM

- Started redesign planning.
- Installed/recorded design skills.
- Documented initial redesign sections.

### Session 2: 2026-09-02

- Audited actual implementation and found redesign was partly implemented despite older planning placeholders.
- Continued the redesign directly in the existing React + vanilla CSS stack.
- Updated typography, color tokens, surface system, focus states, component classes, message states, call screens, and documentation.
- Verified production build.

Build result:

```text
npm --prefix /c/Users/Legion/Desktop/mood-chat-frontend run build
✓ built in 479ms
```

---

## Current status

**Redesign continuation is implemented and builds successfully.**

Next recommended step: run the frontend and backend together, inspect the UI in-browser, then tune spacing/colors based on screenshots or live feedback.
