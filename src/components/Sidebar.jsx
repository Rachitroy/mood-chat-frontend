import { useState } from "react";

export default function Sidebar({ user, rooms, activeRoomId, onSelectRoom, onCreateRoom, onLogout }) {
  const [newRoomName, setNewRoomName] = useState("");
  const [members, setMembers] = useState("");

  function handleCreate(e) {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    const memberUsernames = members
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    onCreateRoom(newRoomName.trim(), memberUsernames.length > 0, memberUsernames);
    setNewRoomName("");
    setMembers("");
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Mood Chat</h1>
        <p className="sidebar-user">@{user.username}</p>
      </div>

      <div className="room-list">
        {rooms.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: 13, padding: "8px 12px" }}>
            No rooms yet — create one below.
          </p>
        )}
        {rooms.map((room) => (
          <button
            key={room.id}
            className="room-item"
            data-active={room.id === activeRoomId}
            onClick={() => onSelectRoom(room.id)}
          >
            <span className="room-name-full">
              {room.is_group ? "# " : ""}
              {room.name}
            </span>
          </button>
        ))}
      </div>

      <form className="new-room-form" onSubmit={handleCreate} style={{ flexDirection: "column", alignItems: "stretch", gap: 6 }}>
        <input
          placeholder="New room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <input
          placeholder="Invite usernames, comma separated (optional)"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
        />
        <button type="submit" title="Create room">Create room</button>
      </form>

      <button className="logout-btn" onClick={onLogout}>
        Sign out
      </button>
    </div>
  );
}
