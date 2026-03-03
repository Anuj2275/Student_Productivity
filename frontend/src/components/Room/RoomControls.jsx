import React, { useState } from "react";
import MicToggleButton from "./MicToggleButton";
import CamToggleButton from "./CamToggleButton";

const RoomControls = ({ leaveRoom }) => {
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  const handleMicToggle = () => {
    setMicMuted(prev => !prev);
    // feed this back into your WebRTC logic
  };

  const handleCamToggle = () => {
    setCamOff(prev => !prev);
    // feed this back into your WebRTC logic
  };

  return (
    <div className="room-controls">
      <MicToggleButton muted={micMuted} onToggle={handleMicToggle} />
      <CamToggleButton camOff={camOff} onToggle={handleCamToggle} />
      <button className="neu-btn" onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};

export default RoomControls;