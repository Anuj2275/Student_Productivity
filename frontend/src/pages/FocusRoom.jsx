import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { socket } from "../services/socket";

const FocusRoom = ({ roomId, userId, timeoutConfig }) => {
  const localVideoRef = useRef(null);
  const peersRef = useRef({});
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    socket.connect();

    // Join room with timeout/owner config
    socket.emit("join-room", { roomId, ownerId: userId, timeoutConfig });

    // Grab camera + mic
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Show local video
        localVideoRef.current.srcObject = stream;

        // Handle list of existing users in room
        socket.on("room-members", ({ members, ownerId }) => {
          members.forEach((peerId) => {
            if (peerId !== socket.id) {
              const peer = createPeer(peerId, socket.id, stream);
              peersRef.current[peerId] = peer;
            }
          });
        });

        // When a user joins after us
        socket.on("user-joined", ({ id }) => {
          const peer = addPeer(id, socket.id, stream);
          peersRef.current[id] = peer;
        });

        // Receive signal from backend
        socket.on("receive-signal", ({ signal, callerID }) => {
          peersRef.current[callerID].signal(signal);
        });

        // Peers send back signal
        socket.on("receive-returned-signal", ({ signal, id }) => {
          peersRef.current[id].signal(signal);
        });
      });

    return () => {
      socket.emit("leave-room", { roomId });
      socket.disconnect();
    };
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("sending-signal", { target: userToSignal, signal, callerID });
    });

    peer.on("stream", (remoteStream) => {
      setRemoteStreams((prev) => [...prev, remoteStream]);
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("returning-signal", { target: callerID, signal });
    });

    peer.on("stream", (remoteStream) => {
      setRemoteStreams((prev) => [...prev, remoteStream]);
    });

    return peer;
  }

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted playsInline style={{ width: 200 }} />
      {remoteStreams.map((stream, index) => (
        <video
          key={index}
          srcObject={stream}
          autoPlay
          playsInline
          style={{ width: 200 }}
        />
      ))}
    </div>
  );
};

export default FocusRoom;