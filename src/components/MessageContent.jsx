import { API_BASE } from "../lib/api.js";

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MessageContent({ msg }) {
  const messageType = msg.message_type || msg.messageType || "text";
  const fileUrl = msg.file_url || msg.fileUrl;
  const fileName = msg.file_name || msg.fileName;
  const fileMime = msg.file_mime || msg.fileMime;
  const fileSize = msg.file_size || msg.fileSize;

  if (messageType !== "file" || !fileUrl) {
    return <>{msg.content}</>;
  }

  const absoluteUrl = fileUrl.startsWith("http") ? fileUrl : `${API_BASE}${fileUrl}`;
  const isImage = fileMime?.startsWith("image/");
  const isAudio = fileMime?.startsWith("audio/");

  if (isImage) {
    return (
      <a href={absoluteUrl} target="_blank" rel="noreferrer">
        <img src={absoluteUrl} alt={fileName} className="message-image" />
      </a>
    );
  }

  if (isAudio) {
    return (
      <div className="voice-message">
        <span className="voice-message-icon">🎤</span>
        <audio src={absoluteUrl} controls preload="metadata" />
      </div>
    );
  }

  return (
    <a href={absoluteUrl} target="_blank" rel="noreferrer" className="file-chip">
      <span className="file-chip-icon">📄</span>
      <span className="file-chip-info">
        <span className="file-chip-name">{fileName}</span>
        <span className="file-chip-size">{formatBytes(fileSize)}</span>
      </span>
    </a>
  );
}
