import { useCallback, useEffect, useState } from "react";
import AuthScreen from "./components/AuthScreen.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatRoom from "./components/ChatRoom.jsx";
import IncomingCallModal from "./components/IncomingCallModal.jsx";
import CallScreen from "./components/CallScreen.jsx";
import { api } from "./lib/api.js";
import { connectSocket, disconnectSocket } from "./lib/socket.js";
import { useCall } from "./hooks/useCall.js";

const STORAGE_KEY = "moodchat_session";

export default function App() {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [mood, setMood] = useState("neutral");
  const [moodResetTimer, setMoodResetTimer] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat" — only matters on narrow screens
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {
        // Fullscreen API unsupported or blocked (e.g. iOS Safari) — silently ignore,
        // the button just won't visibly do anything on those browsers.
      });
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const call = useCall(socket, session?.user);

  const handleAuthenticated = useCallback((user, token) => {
    const next = { user, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    disconnectSocket();
    setSession(null);
    setSocket(null);
    setRooms([]);
    setActiveRoomId(null);
    setMobileView("list");
  }, []);

  // Connect socket + load rooms whenever we have a session
  useEffect(() => {
    if (!session) return;

    const s = connectSocket(session.token);
    setSocket(s);

    api.listRooms(session.token).then((data) => {
      setRooms(data.rooms);
      if (data.rooms.length > 0) setActiveRoomId(data.rooms[0].id);
    });

    return () => {
      disconnectSocket();
    };
  }, [session]);

  const handleCreateRoom = useCallback(
    async (name, isGroup, memberUsernames) => {
      const data = await api.createRoom(session.token, name, isGroup, memberUsernames);
      setRooms((prev) => [data.room, ...prev]);
      setActiveRoomId(data.room.id);
      setMobileView("chat");
    },
    [session]
  );

  const handleSelectRoom = useCallback((roomId) => {
    setActiveRoomId(roomId);
    setMobileView("chat");
  }, []);

  const handleBackToList = useCallback(() => {
    setMobileView("list");
  }, []);

  const handleMoodChange = useCallback(
    (tag) => {
      setMood(tag);
      clearTimeout(moodResetTimer);
      const timer = setTimeout(() => setMood("neutral"), 4000);
      setMoodResetTimer(timer);
    },
    [moodResetTimer]
  );

  if (!session) {
    return (
      <div className="app-shell" data-mood="neutral">
        <button
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
          title={isFullscreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullscreen ? "⤡" : "⤢"}
        </button>
        <AuthScreen onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || null;

  return (
    <div className="app-shell" data-mood={mood}>
      <button
        className="fullscreen-btn"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
        title={isFullscreen ? "Exit full screen" : "Enter full screen"}
      >
        {isFullscreen ? "⤡" : "⤢"}
      </button>
      <div className="chat-shell" data-mobile-view={mobileView}>
        <Sidebar
          user={session.user}
          rooms={rooms}
          activeRoomId={activeRoomId}
          onSelectRoom={handleSelectRoom}
          onCreateRoom={handleCreateRoom}
          onLogout={handleLogout}
        />
        {socket ? (
          <ChatRoom
            user={session.user}
            token={session.token}
            socket={socket}
            room={activeRoom}
            onMoodChange={handleMoodChange}
            onStartCall={call.startCall}
            callDisabled={call.callStatus !== "idle"}
            onBack={handleBackToList}
          />
        ) : (
          <div className="empty-state">Connecting…</div>
        )}
      </div>

      {call.errorMessage && (
        <div className="error-banner" style={{ position: "fixed", top: 16, right: 16, zIndex: 200, maxWidth: 320 }}>
          {call.errorMessage}
        </div>
      )}

      {call.callStatus === "ringing" && call.incomingCall && (
        <IncomingCallModal
          call={call.incomingCall}
          onAccept={call.acceptCall}
          onReject={call.rejectCall}
        />
      )}

      {(call.callStatus === "calling" || call.callStatus === "connected") && call.activeCall && (
        <CallScreen
          call={call.activeCall}
          localStream={call.localStream}
          remoteStream={call.remoteStream}
          status={call.callStatus}
          onEnd={call.endCall}
          toggleMic={call.toggleMic}
          toggleCamera={call.toggleCamera}
        />
      )}
    </div>
  );
}
