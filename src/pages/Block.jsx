import { useState, useEffect } from "react";
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

export default function Block({ session, onLogout }) {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.getBlockedUsers(session.token)
      .then((data) => {
        setBlockedUsers(data.users || []);
      })
      .catch((err) => {
        setActionMessage(err.message || "Not connected to server for this feature.");
        setBlockedUsers([]);
      })
      .finally(() => setLoading(false));
  }, [session.token]);

  const handleBlock = async (e) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;
    try {
      await api.blockUser(session.token, searchUsername.trim());
      setActionMessage(`Blocked ${searchUsername}`);
      setSearchUsername("");
      setBlockedUsers(prev => [...prev, { username: searchUsername.trim() }]);
    } catch (err) {
      setActionMessage(err.message || "Failed to block user");
    }
    setTimeout(() => setActionMessage(""), 3000);
  };

  const handleUnblock = async (username) => {
    try {
      await api.unblockUser(session.token, username);
      setActionMessage(`Unblocked ${username}`);
      setBlockedUsers(prev => prev.filter(u => u.username !== username));
    } catch (err) {
      setActionMessage(err.message || "Failed to unblock user");
    }
    setTimeout(() => setActionMessage(""), 3000);
  };

  return (
    <div className="page-container">
      <header className="chat-list-header">
        <h1>Blocked users</h1>
        <button className="logout-btn" onClick={onLogout}>Sign out</button>
      </header>

      <main className="page-main block-main">
        {actionMessage && (
          <div className="error-banner" role="status">{actionMessage}</div>
        )}

        <form className="block-search" onSubmit={handleBlock}>
          <input
            type="search"
            className="block-input"
            placeholder="Search user to block…"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            spellCheck={false}
          />
          <button type="submit" className="btn-unblock" disabled={!searchUsername.trim()}>
            Block
          </button>
        </form>

        {loading ? (
          <p className="message-state">Loading…</p>
        ) : blockedUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚫</div>
            <p>No blocked users.</p>
          </div>
        ) : (
          <div className="blocked-list">
            {blockedUsers.map(user => (
              <div key={user.username} className="blocked-card">
                <div className="blocked-info">
                  <div
                    className="room-avatar"
                    style={{
                      background: `linear-gradient(135deg, ${getAvatarColor(user.username)}, ${getAvatarColor(user.username)}88)`,
                    }}
                  >
                    {getInitials(user.username)}
                  </div>
                  <div>
                    <h3>{user.username}</h3>
                    <p>Blocked</p>
                  </div>
                </div>
                <button className="btn-unblock" onClick={() => handleUnblock(user.username)}>
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className="nav-item" data-tab="chat" onClick={() => navigate("/")}>
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
        <button className="nav-item active" data-tab="block">
          <div className="nav-icon">🚫</div>
          <span className="nav-label">Block</span>
        </button>
      </nav>
    </div>
  );
}
