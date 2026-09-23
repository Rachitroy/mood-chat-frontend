# Mood Chat Frontend Fixes - September 4, 2026

## Summary
Fixed two critical issues reported by user: composer/recording preview hidden behind fixed navigation bar, and WebRTC call signaling mismatch between frontend and backend.

---

## Issue 1: Composer/Recording Behind Navigation Bar

**Problem**: The composer (text input + attach/mic buttons) and recording preview were being cut off/hidden behind the fixed bottom navigation bar (`.bottom-nav`), especially visible on smaller screens. User reported: "it[Image #10] is still behind the navi bar."

**Root Cause**: The `.chat-main` container had no bottom padding, so when the fixed `.bottom-nav` (64px height) was positioned at `bottom: 0`, content at the bottom of the chat viewport was overlapped by the nav bar.

**Fix**: Added bottom padding to `.chat-main` in `src/styles.css`:
```css
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Extra bottom padding so the composer never sits behind the fixed nav bar */
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}
```
- `80px` matches the nav bar height plus some buffer
- `env(safe-area-inset-bottom)` ensures iOS devices with notches/displays work correctly
- Builds successfully and compiled CSS includes the fix

**Files modified**: `src/styles.css` (+2 lines)

---

## Issue 2: WebRTC Call Functionality

**Problem**: Call functionality was not working because the frontend was emitting socket events (`start_call`, `end_call`, `answer`, `ice_candidate`, `incoming_call`) that the backend (`src/sockets/chat.js`) does not listen for. The backend expects `call:invite`, `call:end`, `call:accept`, `call:reject`, `call:signal`, `call:incoming`, `call:accepted`, `call:rejected`, `call:ended`.

**Fix**: Updated `src/pages/ChatRoom.jsx` to use the correct event names matching the backend:

- `start_call` → `call:invite` (outgoing call initiation)
- `end_call` → `call:end` (hang up)
- `answer` → handled via `call:signal` with type "answer"
- `ice_candidate` → sent via `call:signal` with type "candidate"
- `incoming_call` → `call:incoming` (incoming call notification)

Added proper call flow:
- `initiateCall()` function: gets user media, creates RTCPeerConnection, sends offer via `call:signal`
- `endCall()` function: cleanup + emits `call:end`
- Socket listeners: `call:incoming`, `call:accepted`, `call:rejected`, `call:ended`, `call:signal`
- Incoming call handling: sets call active state, creates peer connection from accepted call

**Files modified**: `src/pages/ChatRoom.jsx` (significant refactor of WebRTC section)

---

## Build Status
- `npm run build` passes successfully
- Production build outputs confirmed in `dist/assets/`
- Git commit `787db22` includes both fixes

## UI Redesign and Netlify Deployment — September 12, 2026

### Two-Pane Chat Redesign

Implemented a reference-inspired two-pane chat layout while preserving Mood Chat's existing dark immersive glass identity, purple/indigo palette (`#7c86ff`), and Outfit/Fraunces typography.

Key changes included:

- Added `src/components/TwoPaneLayout.jsx` for the sidebar + conversation layout.
- Added `src/components/ChatListSidebar.jsx` with chat search, filter tabs, active states, unread badges, responsive sidebar behavior, and empty states.
- Updated `src/routes.jsx` so authenticated routes render inside the two-pane layout.
- Updated `src/App.jsx` to pass session state correctly through the route tree.
- Updated `src/pages/ChatRoom.jsx` with session-based room loading, date-separated messages, improved call states, and incoming/outgoing call handling.
- Updated `src/pages/ChatList.jsx` to provide a welcome state when no room is selected.
- Updated `src/styles.css` with the dark glass two-pane layout, sidebar, filters, chat rows, welcome state, date separators, responsive behavior, and interaction states.

### Build and Deployment Verification

- `npm run build` completed successfully.
- The production output was generated in `dist/`.
- Netlify production deployment completed successfully using the existing `netlify.toml` configuration.
- Site: `phenomenal-dragon-23872d`
- Live URL: https://phenomenal-dragon-23872d.netlify.app
- Admin: https://app.netlify.com/projects/phenomenal-dragon-23872d

### Rollback Status

The user requested discarding the UI redesign changes afterward. The local working tree still contained the redesign changes at the time the rollback request was issued, and the `git restore . && git clean -fd` command was interrupted before it completed. No commit was created for the redesign, and no push was performed after the Netlify deployment. The deployed Netlify version may therefore still contain the redesigned UI.

### Current State - September 13, 2026

#### Investigation Results
- `git status` shows clean working tree (no uncommitted changes)
- `git restore . && git clean -fd` completed successfully — only `.netlify/` directory remains as untracked
- All source files match HEAD commit exactly
- **Root cause identified**: The two-pane redesign was never committed to git. The files (`TwoPaneLayout.jsx`, `ChatListSidebar.jsx`) were untracked and have been removed
- The `src/components/Sidebar.jsx` present in HEAD is the **original single-pane sidebar component** from commit `e753db1` (Aug 7, 2008) — this is NOT the redesign sidebar
- HEAD `src/styles.css` contains both single-pane styles AND legacy sidebar CSS that was never removed in the original design
- The `routes.jsx` at HEAD renders ChatList/ChatRoom/CreateRoom/Requests/Block/LoginPage directly (no TwoPaneLayout wrapper)

#### Build Output Verification
- `npm run build` runs successfully from clean HEAD source
- `dist/` contains 7 JS chunks + 1 CSS file + `index.html`
- Built CSS contains `.sidebar` class (16 occurrences) but this is from the original committed styles, not the redesign
- The build does NOT contain "TwoPaneLayout" or "ChatListSidebar" classes — these were removed by git clean

#### Deployment Status
- **kaleidoscopic-sfogliatella-ea7551** (site ID: 07f5ebd1-...) — new site created by latest deploy, currently deployed with clean HEAD code (single-pane layout)
- **phenomenal-dragon-23872d** (site ID: 88a28e00-...) — old site, may still contain the two-pane redesign from the Sept 12 deployment (was never updated)
- Attempted to deploy to old site by ID but deploy command failed with permission error

#### Next Steps
- [ ] Retry deploying to phenomenal-dragon-23872d using `npx netlify deploy --prod --dir=dist --site=88a28e00-3a84-42fb-a0d2-56b277cd1965`
