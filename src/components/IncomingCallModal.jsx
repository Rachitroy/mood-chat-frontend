export default function IncomingCallModal({ call, onAccept, onReject }) {
  if (!call) return null;

  return (
    <div className="call-overlay">
      <div className="incoming-call-card">
        <div className="incoming-call-avatar">{call.fromUser.username[0]?.toUpperCase()}</div>
        <p className="incoming-call-name">{call.fromUser.username}</p>
        <p className="incoming-call-sub">
          Incoming {call.callType === "video" ? "video" : "voice"} call…
        </p>
        <div className="incoming-call-actions">
          <button className="call-btn call-btn-reject" onClick={onReject}>
            Decline
          </button>
          <button className="call-btn call-btn-accept" onClick={onAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
