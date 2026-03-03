import React, { useState } from "react";
import VideoGrid from "./VideoGrid";
import ChatPanel from "./Chat/ChatPanel";
import RoomControls from "./RoomControls";

const RoomContainer = ({
  socket,
  roomId,
  localStream,
  remoteStreams,
  leaveRoom,
}) => {
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="room-container">
      <div className="video-and-chat">
        <VideoGrid
          localStream={localStream}
          remoteStreams={remoteStreams}
        />
        {chatOpen && (
          <ChatPanel
            socket={socket}
            roomId={roomId}
          />
        )}
      </div>

      <RoomControls
        toggleChat={() => setChatOpen(prev => !prev)}
        leaveRoom={leaveRoom}
      />
    </div>
  );
};

export default RoomContainer;