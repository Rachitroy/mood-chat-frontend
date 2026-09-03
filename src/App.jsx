import { useCallback, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes.jsx";
import { connectSocket, disconnectSocket } from "./lib/socket.js";

const STORAGE_KEY = "moodchat_session";

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const handleAuthenticated = useCallback((user, token) => {
    const next = { user, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    disconnectSocket();
    setSession(null);
  }, []);

  // Connect socket whenever we have a session
  useEffect(() => {
    if (!session) return;

    const s = connectSocket(session.token);
    return () => {
      disconnectSocket();
    };
  }, [session]);

  return (
    <AppRoutes
      session={session}
      onAuthenticated={handleAuthenticated}
      onLogout={handleLogout}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          {/* Fullscreen button - only show after login */}
          {/* Handled per-page now */}
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}