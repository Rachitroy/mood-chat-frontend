import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy load components for better performance
const ChatList = lazy(() => import("./pages/ChatList.jsx"));
const ChatRoom = lazy(() => import("./pages/ChatRoom.jsx"));
const CreateRoom = lazy(() => import("./pages/CreateRoom.jsx"));
const Requests = lazy(() => import("./pages/Requests.jsx"));
const Block = lazy(() => import("./pages/Block.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));

export default function AppRoutes({ session, onAuthenticated, onLogout }) {
  if (!session) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LoginPage onAuthenticated={onAuthenticated} />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <ChatList session={session} onLogout={onLogout} />
          </Suspense>
        }
      />
      <Route
        path="/chat/:roomId"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <ChatRoom session={session} onLogout={onLogout} />
          </Suspense>
        }
      />
      <Route
        path="/create"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <CreateRoom session={session} onLogout={onLogout} />
          </Suspense>
        }
      />
      <Route
        path="/requests"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Requests session={session} onLogout={onLogout} />
          </Suspense>
        }
      />
      <Route
        path="/block"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Block session={session} onLogout={onLogout} />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}