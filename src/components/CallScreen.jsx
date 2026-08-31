import { useEffect, useRef, useState } from "react";

export default function CallScreen({ call, localStream, remoteStream, status, onEnd, toggleMic, toggleCamera }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(call.callType === "video");

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    const target = call.callType === "video" ? remoteVideoRef.current : remoteAudioRef.current;
    if (target && remoteStream) {
      target.srcObject = remoteStream;
    }
  }, [remoteStream, call.callType]);

  function handleToggleMic() {
    const next = !micOn;
    setMicOn(next);
    toggleMic(next);
  }

  function handleToggleCamera() {
    const next = !cameraOn;
    setCameraOn(next);
    toggleCamera(next);
  }

  return (
    <div className="call-overlay">
      <div className="call-screen">
        <p className="call-status-label">
          {status === "calling" ? `Calling ${call.withUser.username}…` : call.withUser.username}
        </p>

        {call.callType === "video" ? (
          <div className="call-video-stage">
            <video ref={remoteVideoRef} className="remote-video" autoPlay playsInline />
            <video ref={localVideoRef} className="local-video" autoPlay playsInline muted />
          </div>
        ) : (
          <div className="call-audio-stage">
            <div className="incoming-call-avatar">{call.withUser.username[0]?.toUpperCase()}</div>
            <audio ref={remoteAudioRef} autoPlay />
          </div>
        )}

        <div className="call-controls">
          <button className="call-btn call-btn-toggle" data-off={!micOn} onClick={handleToggleMic}>
            {micOn ? "Mute" : "Unmute"}
          </button>
          {call.callType === "video" && (
            <button className="call-btn call-btn-toggle" data-off={!cameraOn} onClick={handleToggleCamera}>
              {cameraOn ? "Camera off" : "Camera on"}
            </button>
          )}
          <button className="call-btn call-btn-reject" onClick={onEnd}>
            End call
          </button>
        </div>
      </div>
    </div>
  );
}
