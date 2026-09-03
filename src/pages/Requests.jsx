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

export default function Requests({ session, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.getRequests(session.token)
      .then((data) => {
        setRequests(data.requests || []);
      })
      .catch((err) => {
        setActionMessage(err.message || "Not connected to server for this feature.");
        // Show demo data for now
        setRequests([
          { id: 1, fromUsername: "alex_99", message: "Hey, can I join your chat?" },
          { id: 2, fromUsername: "maria_dev", message: "Sent you a message earlier!" },
        ]);
      })
      .finally(() => setLoading(false));
  }, [session.token]);

  const handleAction = async (requestId, action) => {
    try {
      await api.actionRequest(session.token, requestId, action);
      setRequests(requests.filter(r => r.id !== requestId));
      setActionMessage(action === "accept" ? "Request accepted!" : "Request declined.");
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      setActionMessage(err.message || "Action failed");
    }
  };

  return (
    <div className="page-container">
      <header className="chat-list-header">
        <h1>Requests</h1>
        <button className="logout-btn" onClick={onLogout}>Sign out</button>
      </header>

      <main className="page-main requests-main">
        {actionMessage && (
          <div className="error-banner" role="status">{actionMessage}</div>
        )}
        {loading ? (
          <p className="message-state">Loading requests…</p>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No pending requests.</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map(req => (
              <div key={req.id} className="request-card">
                <div className="request-info">
                  <div
                    className="room-avatar"
                    style={{
                      background: `linear-gradient(135deg, ${getAvatarColor(req.fromUsername)}, ${getAvatarColor(req.fromUsername)}88)`,
                    }}
                  >
                    {getInitials(req.fromUsername)}
                  </div>
                  <div>
                    <h3>{req.fromUsername}</h3>
                    <p>{req.message || "Wants to chat with you"}</p>
                  </div>
                </div>
                <div className="request-actions">
                  <button className="btn-accept" onClick={() => handleAction(req.id, "accept")}>
                    Accept
                  </button>
                  <button className="btn-reject" onClick={() => handleAction(req.id, "reject")}>
                    Decline
                  </button>
                </div>
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
        <button className="nav-item active" data-tab="requests">
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
