import { useCallback, useEffect, useRef, useState } from "react";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

// Call lifecycle:
// idle -> "calling" (we invited someone, waiting for accept)
//      -> "ringing" (someone invited us, waiting for our decision)
//      -> "connected" (peer connection established)
//      -> idle again on end/reject/error
export function useCall(socket, currentUser) {
  const [callStatus, setCallStatus] = useState("idle");
  const [incomingCall, setIncomingCall] = useState(null); // { fromUser, roomId, callType }
  const [activeCall, setActiveCall] = useState(null); // { withUser, roomId, callType }
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  useEffect(() => {
    if (!errorMessage) return;
    const t = setTimeout(() => setErrorMessage(""), 5000);
    return () => clearTimeout(t);
  }, [errorMessage]);

  const cleanup = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    pendingCandidatesRef.current = [];
    setLocalStream(null);
    setRemoteStream(null);
    setActiveCall(null);
    setIncomingCall(null);
    setCallStatus("idle");
  }, []);

  function createPeerConnection(targetUserId) {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call:signal", {
          targetUserId,
          data: { type: "candidate", payload: event.candidate },
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
        // Let explicit call:end / call:ended handle UI cleanup; this just
        // guards against a silently dead connection.
      }
    };

    pcRef.current = pc;
    return pc;
  }

  async function getMedia(callType) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === "video",
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    return stream;
  }

  // ----- Outgoing call -----
  const startCall = useCallback(
    async (targetUser, roomId, callType) => {
      setErrorMessage("");
      try {
        await getMedia(callType);
      } catch (err) {
        setErrorMessage("Could not access camera/microphone. Check permissions.");
        return;
      }

      setActiveCall({ withUser: targetUser, roomId, callType });
      setCallStatus("calling");

      socket.emit(
        "call:invite",
        { targetUserId: targetUser.id, roomId, callType },
        (res) => {
          if (!res?.ok) {
            setErrorMessage(res?.error === "user is offline" ? "That user is offline." : res?.error || "Call failed to start.");
            cleanup();
          }
        }
      );
    },
    [socket, cleanup]
  );

  // ----- Incoming call: accept -----
  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    setErrorMessage("");
    try {
      await getMedia(incomingCall.callType);
    } catch (err) {
      setErrorMessage("Could not access camera/microphone. Check permissions.");
      socket.emit("call:reject", { targetUserId: incomingCall.fromUser.id });
      setIncomingCall(null);
      return;
    }

    const pc = createPeerConnection(incomingCall.fromUser.id);
    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    setActiveCall({
      withUser: incomingCall.fromUser,
      roomId: incomingCall.roomId,
      callType: incomingCall.callType,
    });
    setCallStatus("connected");
    socket.emit("call:accept", {
      targetUserId: incomingCall.fromUser.id,
      roomId: incomingCall.roomId,
    });
    setIncomingCall(null);
    // Now wait for the caller's offer via call:signal
  }, [incomingCall, socket]);

  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    socket.emit("call:reject", { targetUserId: incomingCall.fromUser.id });
    setIncomingCall(null);
  }, [incomingCall, socket]);

  const endCall = useCallback(() => {
    if (activeCall) {
      socket.emit("call:end", { targetUserId: activeCall.withUser.id });
    }
    cleanup();
  }, [activeCall, socket, cleanup]);

  const toggleMic = useCallback((enabled) => {
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = enabled));
  }, []);

  const toggleCamera = useCallback((enabled) => {
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = enabled));
  }, []);

  // ----- Socket event wiring -----
  useEffect(() => {
    if (!socket) return;

    function onIncoming({ fromUser, roomId, callType }) {
      // If already in a call, auto-reject new invites for simplicity.
      if (callStatus !== "idle") {
        socket.emit("call:reject", { targetUserId: fromUser.id });
        return;
      }
      setIncomingCall({ fromUser, roomId, callType });
      setCallStatus("ringing");
    }

    async function onAccepted({ fromUser }) {
      // We're the caller; callee accepted. Create the offer.
      setCallStatus("connected");
      const pc = createPeerConnection(fromUser.id);
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("call:signal", {
        targetUserId: fromUser.id,
        data: { type: "offer", payload: offer },
      });
    }

    function onRejected() {
      setErrorMessage("Call declined.");
      cleanup();
    }

    function onEnded() {
      cleanup();
    }

    async function onSignal({ fromUserId, data }) {
      const pc = pcRef.current;
      if (!pc) return;

      if (data.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
        for (const c of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        }
        pendingCandidatesRef.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("call:signal", {
          targetUserId: fromUserId,
          data: { type: "answer", payload: answer },
        });
      } else if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
        for (const c of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        }
        pendingCandidatesRef.current = [];
      } else if (data.type === "candidate") {
        if (pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(data.payload));
        } else {
          pendingCandidatesRef.current.push(data.payload);
        }
      }
    }

    socket.on("call:incoming", onIncoming);
    socket.on("call:accepted", onAccepted);
    socket.on("call:rejected", onRejected);
    socket.on("call:ended", onEnded);
    socket.on("call:signal", onSignal);

    return () => {
      socket.off("call:incoming", onIncoming);
      socket.off("call:accepted", onAccepted);
      socket.off("call:rejected", onRejected);
      socket.off("call:ended", onEnded);
      socket.off("call:signal", onSignal);
    };
  }, [socket, callStatus, cleanup]);

  return {
    callStatus,
    incomingCall,
    activeCall,
    localStream,
    remoteStream,
    errorMessage,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMic,
    toggleCamera,
  };
}
