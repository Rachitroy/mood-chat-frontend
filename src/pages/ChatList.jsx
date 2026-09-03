import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useNavigate } from "react-router-dom";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name) {
  if (!name) return "var(--primary)";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "#7c86ff", "#ff7eb3", "#7affd4", "#ffb347", "#c77dff",
    "#5af6ce", "#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3",
  ];
  return colors[Math.abs(hash) % colors.length];
}

function timeAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatList({ session, onLogout }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.listRooms(session.token)
      .then(data => {
        const list = data.rooms || [];
        list.sort((a, b) => {
          const aTime = a.last_message?.created_at ? new Date(a.last_message.created_at).getTime() : 0;
          const bTime = b.last_message?.created_at ? new Date(b.last_message.created_at).getTime() : 0;
          return bTime - aTime;
        });
        setRooms(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session.token]);

  const createRoom = async () => {
    const name = prompt("Room name");
    if (!name) return;
    const isGroup = confirm("Create group room?");
    try {
      const data = await api.createRoom(session.token, name, isGroup, []);
      navigate(`/chat/${data.room.id}`);
    } catch (err) {
      alert(err.message || "Failed to create room");
    }
  };

  const filtered = rooms.filter(r => {
    const q = search.toLowerCase();
    if (!q) return true;
    return r.name.toLowerCase().includes(q);
  });

  if (loading) return <div className="page-container"><div className="page-main"><p className="message-state">Loading chats…</p></div></div>;

  return (
    <div className="page-container">
      <header className="chat-list-header">
        <h1>Chats</h1>
        <button className="logout-btn" onClick={onLogout}>Sign out</button>
      </header>

      <main className="page-main">
        <div className="chat-search-wrap">
          <input
            type="search"
            className="chat-search"
            placeholder="Search chats…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p>{search ? "No chats match your search." : "No chats yet."}</p>
            <button className="btn-primary" onClick={createRoom}>Start a chat</button>
          </div>
        ) : (
          <div className="room-list-new">
            {filtered.map(room => {
              const displayName = room.is_group ? `# ${room.name}` : room.name;
              const color = getAvatarColor(displayName);
              const preview = room.last_message?.content || "No messages yet";
              const time = timeAgo(room.last_message?.created_at);
              const hasUnread = room.unread_count > 0;

              return (
                <button
                  key={room.id}
                  className="room-card"
                  onClick={() => navigate(`/chat/${room.id}`)}
                >
                  <div
                    className="room-avatar"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
                  >
                    {getInitials(displayName)}
                  </div>
                  <div className="room-info">
                    <h3>{displayName}</h3>
                    <p className="room-preview">{preview}</p>
                  </div>
                  <div className="room-meta">
                    {time && <span className="room-time">{time}</span>}
                    {hasUnread && <span className="unread-badge">{room.unread_count}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <button className="fab" onClick={createRoom} title="New chat">＋</button>

      <nav className="bottom-nav">
        <button className="nav-item active" data-tab="chat">
          <div className="nav-icon">💬</div>
          <span className="nav-label">Chats</span>
        </button>
        <button className="nav-item" data-tab="create" onClick={() => navigate("/create")}>
          <div className="nav-icon">➕</div>
          <span className="nav-label">Add</span>
        </button>
        <button className="nav-item" data-tab="requests" onClick={() => navigate("/requests")}>
          <div className="nav-icon">📥</div>
          <span className="nav-label">Requests</span>
        </button>
        <button className="nav-item" data-tab="block" onClick={() => navigate("/block")}>
          <div className="nav-icon">🚫</div>
          <span className="nav-label">Block</span>
        </button>
      </nav>
    </div>
  );
}