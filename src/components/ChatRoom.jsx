import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api.js";
import { runEmotionEffect } from "../lib/effects.js";
import MessageContent from "./MessageContent.jsx";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB, matches backend limit

export default function ChatRoom({ user, token, socket, room, onMoodChange, onStartCall, callDisabled, onBack }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherMember, setOtherMember] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");

  const listRef = useRef(null);
  const shakeTargetRef = useRef(null);
  const rainContainerRef = useRef(null);
  const chatMainRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordTimerRef = useRef(null);
  const emotionTimeoutRef = useRef(null);

  // Load history + join the socket room whenever the active room changes
  useEffect(() => {
    if (!room) return;
    let cancelled = false;

    setLoading(true);
    setMessages([]);
    setOtherMember(null);
    setReplyingTo(null);

    api.getMessages(token, room.id).then((data) => {
      if (!cancelled) {
        setMessages(data.messages);
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    // Calls are 1-on-1 for now: find the other member of this room, if any.
    api.getRoomMembers(token, room.id).then((data) => {
      if (cancelled) return;
      const other = data.members.find((m) => m.id !== user.id);
      setOtherMember(other || null);
    }).catch(() => setOtherMember(null));

    socket.emit("join_room", { roomId: room.id });

    return () => {
      cancelled = true;
      socket.emit("leave_room", { roomId: room.id });
    };
  }, [room, socket, token, user.id]);

  // Listen for incoming messages + typing signals
  useEffect(() => {
    function handleNewMessage(msg) {
      if (msg.roomId !== room.id) return;
      setMessages((prev) => [...prev, msg]);

      if (msg.sender.id !== user.id) {
        const emotion = msg.emotionTag || "neutral";
        onMoodChange(emotion);

        // Apply emotion effect
        setCurrentEmotion(emotion);

        // Run visual/audio effects
        runEmotionEffect(emotion, {
          shakeTarget: shakeTargetRef.current,
          rainContainer: rainContainerRef.current,
        });

        // Reset emotion after delay
        if (emotionTimeoutRef.current) {
          clearTimeout(emotionTimeoutRef.current);
        }
        emotionTimeoutRef.current = setTimeout(() => {
          setCurrentEmotion("neutral");
        }, 2000);
      }
    }

    function handleTyping({ roomId, username }) {
      if (roomId !== room.id) return;
      setTypingUser(username);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000);
    }

    socket.on("new_message", handleNewMessage);
    socket.on("typing", handleTyping);
    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("typing", handleTyping);
    };
  }, [room, socket, user.id, onMoodChange]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;

    const replyToId = replyingTo?.id || null;

    socket.emit("send_message", { roomId: room.id, content, replyToId }, (res) => {
      if (res?.ok) {
        const emotion = res.message.emotionTag || "neutral";
        onMoodChange(emotion);

        // Apply emotion effect
        setCurrentEmotion(emotion);
        runEmotionEffect(emotion, {
          shakeTarget: shakeTargetRef.current,
          rainContainer: rainContainerRef.current,
        });

        // Reset emotion after delay
        if (emotionTimeoutRef.current) {
          clearTimeout(emotionTimeoutRef.current);
        }
        emotionTimeoutRef.current = setTimeout(() => {
          setCurrentEmotion("neutral");
        }, 2000);
      }
    });
    setDraft("");
    setReplyingTo(null);
  }

  function handleDraftChange(e) {
    setDraft(e.target.value);
    socket.emit("typing", { roomId: room.id });
  }

  // If the user switches rooms mid-recording, stop and discard cleanly
  // rather than leaving the mic stream open in the background.
  useEffect(() => {
    return () => {
      clearInterval(recordTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        recordedChunksRef.current = [];
        mediaRecorderRef.current.stop();
      }
    };
  }, [room]);

  function handleAttachClick() {
    fileInputRef.current?.click();
  }

  async function startRecording() {
    setUploadError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        clearInterval(recordTimerRef.current);
        setIsRecording(false);

        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        if (blob.size === 0) return; // recording too short / cancelled

        const ext = mimeType === "audio/webm" ? "webm" : "m4a";
        const file = new File([blob], `voice-message-${Date.now()}.${ext}`, { type: mimeType });

        const replyToId = replyingTo?.id || null;
        setUploading(true);
        try {
          const uploaded = await api.uploadFile(token, room.id, file);
          socket.emit(
            "send_file_message",
            {
              roomId: room.id,
              url: uploaded.url,
              fileName: uploaded.fileName,
              fileMime: uploaded.fileMime,
              fileSize: uploaded.fileSize,
              replyToId,
            },
            (res) => {
              if (!res?.ok) setUploadError(res?.error || "Failed to send voice message.");
            }
          );
          setReplyingTo(null);
        } catch (err) {
          setUploadError(err.message || "Failed to send voice message.");
        } finally {
          setUploading(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch (err) {
      setUploadError("Could not access microphone. Check permissions.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  function cancelRecording() {
    // Discard without sending: clear chunks before the stop handler runs.
    recordedChunksRef.current = [];
    mediaRecorderRef.current?.stop();
  }

  function formatRecordTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function handleReplyClick(msg) {
    const senderUsername = msg.sender_username || msg.sender?.username;
    const messageType = msg.message_type || msg.messageType || "text";
    const preview = messageType === "text" ? msg.content : msg.file_name || msg.fileName || "Attachment";
    setReplyingTo({ id: msg.id, senderUsername, messageType, preview });
  }

  function cancelReply() {
    setReplyingTo(null);
  }

  async function handleFileSelected(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow selecting the same file again later
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File is too large (max 15MB).");
      return;
    }

    setUploadError("");
    setUploading(true);
    const replyToId = replyingTo?.id || null;
    try {
      const uploaded = await api.uploadFile(token, room.id, file);
      socket.emit(
        "send_file_message",
        {
          roomId: room.id,
          url: uploaded.url,
          fileName: uploaded.fileName,
          fileMime: uploaded.fileMime,
          fileSize: uploaded.fileSize,
          replyToId,
        },
        (res) => {
          if (!res?.ok) {
            setUploadError(res?.error || "Failed to share file.");
          }
        }
      );
      setReplyingTo(null);
    } catch (err) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (!room) {
    return <div className="empty-state">Select or create a room to start chatting.</div>;
  }

  return (
    <div className="chat-main" ref={shakeTargetRef} data-emotion={currentEmotion}>
      <div className="rain-overlay" ref={rainContainerRef} />

      <div className="chat-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="back-btn" onClick={onBack} aria-label="Back to rooms">
            ←
          </button>
          <h2>{room.is_group ? "# " : ""}{room.name}</h2>
        </div>
        {otherMember && (
          <div>
            <button
              className="call-btn-header"
              disabled={callDisabled}
              onClick={() => onStartCall(otherMember, room.id, "audio")}
            >
              📞 <span className="call-btn-label">Call</span>
            </button>
            <button
              className="call-btn-header"
              disabled={callDisabled}
              onClick={() => onStartCall(otherMember, room.id, "video")}
            >
              🎥 <span className="call-btn-label">Video</span>
            </button>
          </div>
        )}
      </div>

      <div className="message-list" ref={listRef}>
        {loading && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading messages…</p>}
        {!loading && messages.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            No messages yet — say something.
          </p>
        )}
        {messages.map((msg) => {
          const own = msg.sender_id === user.id || msg.sender?.id === user.id;
          const senderName = msg.sender_username || msg.sender?.username;
          const tag = msg.emotion_tag || msg.emotionTag;
          const createdAt = msg.created_at || msg.createdAt;

          return (
            <div key={msg.id} className="message-row" data-own={own}>
              <div className="message-meta">
                {own ? "You" : senderName} · {formatTime(createdAt)}
              </div>
              <div className="message-bubble-wrap">
                <div className="message-bubble" data-mood={tag}>
                  {msg.replyTo && (
                    <div className="reply-quote">
                      <span className="reply-quote-sender">{msg.replyTo.senderUsername}</span>
                      <span className="reply-quote-preview">
                        {msg.replyTo.messageType !== "text" ? "📎 " : ""}
                        {msg.replyTo.preview}
                      </span>
                    </div>
                  )}
                  <MessageContent msg={msg} />
                </div>
                <button
                  type="button"
                  className="reply-trigger"
                  onClick={() => handleReplyClick(msg)}
                  title="Reply"
                  aria-label="Reply to this message"
                >
                  ↩
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="typing-indicator">
        {typingUser ? `${typingUser} is typing…` : uploading ? "Uploading…" : ""}
      </div>

      {uploadError && (
        <div className="error-banner" style={{ margin: "0 24px 8px" }}>
          {uploadError}
        </div>
      )}

      {replyingTo && (
        <div className="reply-bar">
          <div className="reply-bar-text">
            <span className="reply-bar-label">Replying to {replyingTo.senderUsername}</span>
            <span className="reply-bar-preview">
              {replyingTo.messageType !== "text" ? "📎 " : ""}
              {replyingTo.preview}
            </span>
          </div>
          <button type="button" className="reply-bar-cancel" onClick={cancelReply} aria-label="Cancel reply">
            ✕
          </button>
        </div>
      )}

      {isRecording ? (
        <div className="recording-bar">
          <span className="recording-dot" />
          <span className="recording-time">{formatRecordTime(recordSeconds)}</span>
          <span className="recording-label">Recording…</span>
          <button type="button" className="recording-cancel" onClick={cancelRecording}>
            Cancel
          </button>
          <button type="button" className="recording-send" onClick={stopRecording}>
            Send
          </button>
        </div>
      ) : (
        <form className="composer" onSubmit={handleSend}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelected}
          />
          <button
            type="button"
            className="attach-btn"
            onClick={handleAttachClick}
            disabled={uploading}
            title="Attach a file or photo"
          >
            📎
          </button>
          <button
            type="button"
            className="attach-btn"
            onClick={startRecording}
            disabled={uploading}
            title="Record a voice message"
          >
            🎤
          </button>
          <input
            placeholder="Type a message…"
            value={draft}
            onChange={handleDraftChange}
            maxLength={2000}
          />
          <button type="submit" disabled={!draft.trim()}>
            Send
          </button>
        </form>
      )}
    </div>
  );
}
