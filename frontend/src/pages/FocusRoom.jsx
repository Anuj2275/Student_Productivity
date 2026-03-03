// // import React, { useEffect, useRef, useState } from "react";
// // import Peer from "simple-peer";
// // import { socket } from "../services/socket";

// // const FocusRoom = ({ roomId, userId, timeoutConfig }) => {
// //   function createPeer(userToSignal, callerID, stream) {
// //     const peer = new Peer({ initiator: true, trickle: false, stream });

// //     peer.on("signal", (signal) => {
// //       socket.emit("sending-signal", { target: userToSignal, signal, callerID });
// //     });

// //     peer.on("stream", (remoteStream) => {
// //       setRemoteStreams((prev) => [...prev, remoteStream]);
// //     });

// //     return peer;
// //   }

// //   function addPeer(incomingSignal, callerID, stream) {
// //     const peer = new Peer({ initiator: false, trickle: false, stream });

// //     peer.on("signal", (signal) => {
// //       socket.emit("returning-signal", { target: callerID, signal });
// //     });

// //     peer.on("stream", (remoteStream) => {
// //       setRemoteStreams((prev) => [...prev, remoteStream]);
// //     });

// //     return peer;
// //   }

// //   const localVideoRef = useRef(null);
// //   const peersRef = useRef({});
// //   const [remoteStreams, setRemoteStreams] = useState([]);

// //   useEffect(() => {
// //     socket.connect();

// //     // Join room with timeout/owner config
// //     socket.emit("join-room", { roomId, ownerId: userId, timeoutConfig });

// //     // Grab camera + mic
// //     navigator.mediaDevices
// //       .getUserMedia({ video: true, audio: true })
// //       .then((stream) => {
// //         // Show local video
// //         localVideoRef.current.srcObject = stream;

// //         // Handle list of existing users in room
// //         socket.on("room-members", ({ members, ownerId }) => {
// //           members.forEach((peerId) => {
// //             if (peerId !== socket.id) {
// //               const peer = createPeer(peerId, socket.id, stream);
// //               peersRef.current[peerId] = peer;
// //             }
// //           });
// //         });

// //         // When a user joins after us
// //         socket.on("user-joined", ({ id }) => {
// //           const peer = addPeer(id, socket.id, stream);
// //           peersRef.current[id] = peer;
// //         });

// //         // Receive signal from backend
// //         socket.on("receive-signal", ({ signal, callerID }) => {
// //           peersRef.current[callerID].signal(signal);
// //         });

// //         // Peers send back signal
// //         socket.on("receive-returned-signal", ({ signal, id }) => {
// //           peersRef.current[id].signal(signal);
// //         });
// //       });

// //     return () => {
// //       socket.emit("leave-room", { roomId });
// //       socket.disconnect();
// //     };
// //   }, []);
// //   return (
// //     <div>
// //       <video
// //         ref={localVideoRef}
// //         autoPlay
// //         muted
// //         playsInline
// //         style={{ width: 200 }}
// //       />
// //       {remoteStreams.map((stream, index) => (
// //         <video
// //           key={index}
// //           srcObject={stream}
// //           autoPlay
// //           playsInline
// //           style={{ width: 200 }}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // export default FocusRoom;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import RoomContainer from "../components/Room/RoomContainer";
// import { socket } from "../services/socket";

// const FocusRoom = () => {
//   const { roomId } = useParams();
//   const userId = socket.id || ""; // initial blank

//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStreams, setRemoteStreams] = useState([]);

//   useEffect(() => {
//     socket.connect();

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setLocalStream(stream);

//         socket.emit("join-room", {
//           roomId,
//           ownerId: userId,
//           timeoutConfig: { enabled: true, duration: 300 }
//         });

//         socket.on("room-members", ({ members }) => {
//           // signaling logic (peer connections) handled manually elsewhere
//         });
//       });

//     return () => {
//       socket.emit("leave-room", { roomId });
//       socket.disconnect();
//     };
//   }, [roomId]);

//   return (
//     <div>
//       <RoomContainer
//         socket={socket}
//         roomId={roomId}
//         localStream={localStream}
//         remoteStreams={remoteStreams}
//       />
//     </div>
//   );
// };

// export default FocusRoom;

import React, { useEffect, useState } from "react";
import RoomContainer from "../components/Room/RoomContainer";
import { socket } from "../services/socket";

const FocusRoom = () => {
  const roomId = "demo-room";

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams] = useState([]);

  useEffect(() => {
    socket.connect();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      });
navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  },
  video: true
});
    return () => {
      socket.disconnect();
    };
  }, []);

  const leaveRoom = () => {
    socket.disconnect();
    alert("Left room");
  };

  return (
    <RoomContainer
      socket={socket}
      roomId={roomId}
      localStream={localStream}
      remoteStreams={remoteStreams}
      leaveRoom={leaveRoom}
    />
  );
};

export default FocusRoom;