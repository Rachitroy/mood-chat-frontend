# Mood Chat — Frontend

React + Vite frontend for Mood Chat. Login/register, group chat rooms, and
emotion-reactive animations driven by the `emotionTag` the backend attaches
to every message.

## Setup

1. Make sure the backend (`mood-chat-backend`) is already running on
   `http://localhost:4000`.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API URL:
   ```bash
   copy .env.example .env      (Windows)
   cp .env.example .env         (Mac/Linux)
   ```
   The default (`http://localhost:4000`) is correct if you didn't change
   the backend's port.

4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open the URL it prints (usually `http://localhost:5173`).

## How the mood reactions work

- Every message the server sends back carries an `emotionTag`
  (`flirty` / `happy` / `sad` / `angry` / `neutral`).
- `src/lib/effects.js` maps each tag to a visual effect: confetti for
  flirty/happy, a brief screen shake for angry, falling rain for sad.
- `src/App.jsx` also tints the whole app's background for a few seconds
  based on the most recent emotion (`app-shell[data-mood="..."]` in
  `styles.css`).
- Effects only fire for messages from *other* people, not your own, so
  your screen doesn't shake every time you're the one who's frustrated.

## Project structure

```
src/
  components/
    AuthScreen.jsx   Login + register (single screen, toggled)
    Sidebar.jsx      Room list + create-room form
    ChatRoom.jsx      Message list, composer, effect triggers
  lib/
    api.js           REST calls to the backend
    socket.js        Socket.io connection management
    effects.js       Confetti / shake / rain trigger functions
  App.jsx            Top-level state: session, socket, active room
  styles.css         Design tokens + all styling
```

## Notes

- Auth token is stored in `localStorage` so refreshing the page keeps you
  logged in.
- To create a group chat with specific people, list their usernames
  comma-separated in the "Invite usernames" field when creating a room —
  they must already have accounts.
