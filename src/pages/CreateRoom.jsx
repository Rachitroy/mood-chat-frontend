import { useState } from "react";
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

export default function CreateRoom({ session, onLogout }) {
  const [username, setUsername] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  async function handleCreate(e) {
    e.preventDefault();

    setLoading(true);
    try {
      if (isGroup) {
        const name = groupName.trim();
        if (!name) return;
        const memberUsernames = memberInput.split(",").map((m) => m.trim()).filter(Boolean);
        const data = await api.createRoom(session.token, name, true, memberUsernames);
        navigate(`/chat/${data.room.id}`);
      } else {
        const target = username.trim();
        if (!target) return;
        await api.sendRequest(session.token, target, "Let's chat!");
        alert(`Request sent to ${target}. They can accept it from the Requests tab.`);
        navigate("/");
      }
    } catch (err) {
      alert(err.message || "Failed to create chat");
    } finally {
      setLoading(false);
    }
  }

  async function searchUsers(query) {
    if (!query.trim()) {
      setMemberSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const data = await api.searchUsers(session.token, query);
      setMemberSuggestions(data.users || []);
    } catch (err) {
      setMemberSuggestions([]);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="page-container">
      <header className="chat-list-header">
        <h1>New chat</h1>
        <button className="logout-btn" onClick={onLogout}>Sign out</button>
      </header>

      <main className="page-main create-room-main">
        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-btn${!isGroup ? " active" : ""}`}
            onClick={() => setIsGroup(false)}
          >
            👤 Direct message
          </button>
          <button
            type="button"
            className={`mode-btn${isGroup ? " active" : ""}`}
            onClick={() => setIsGroup(true)}
          >
            👥 Group
          </button>
        </div>

        <form onSubmit={handleCreate}>
          {!isGroup ? (
            <>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "8px" }}>
                Enter a username to send a chat request. The other person must accept before you can chat.
              </p>
              <input
                type="text"
                placeholder="Their username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                autoComplete="off"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                autoFocus
                autoComplete="off"
              />
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Add members (comma separated or search)…"
                  value={memberInput}
                  onChange={(e) => {
                    setMemberInput(e.target.value);
                    searchUsers(e.target.value.split(",").pop().trim());
                  }}
                  autoComplete="off"
                />
                {searching && (
                  <div className="suggestions-dropdown">
                    <span style={{ padding: "8px 12px", color: "var(--text-muted)" }}>
                      Searching…
                    </span>
                  </div>
                )}
                {memberSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {memberSuggestions.slice(0, 4).map(user => (
                      <button
                        key={user.id}
                        type="button"
                        className="suggestion-item"
                        onClick={() => {
                          const parts = memberInput.split(",").map(s => s.trim()).filter(Boolean);
                          if (!parts.includes(user.username)) parts.push(user.username);
                          setMemberInput(parts.join(", "));
                          setMemberSuggestions([]);
                        }}
                      >
                        <span
                          className="suggestion-avatar"
                          style={{
                            background: `linear-gradient(135deg, ${getAvatarColor(user.username)}, ${getAvatarColor(user.username)}88)`,
                          }}
                        >
                          {getInitials(user.username)}
                        </span>
                        {user.username}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Sending…" : isGroup ? "Create Group" : "Send Request"}
          </button>
        </form>
      </main>

      <nav className="bottom-nav">
        <button className="nav-item" data-tab="chat" onClick={() => navigate("/")}>
          <div className="nav-icon">💬</div>
          <span className="nav-label">Chats</span>
        </button>
        <button className="nav-item active" data-tab="create">
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
