import React from "react";

const MicToggleButton = ({ muted, onToggle }) => {
  return (
    <button
      className={`neu-btn ${muted ? "disabled" : ""}`}
      onClick={onToggle}
    >
      {muted ? "Unmute Mic" : "Mute Mic"}
    </button>
  );
};

export default MicToggleButton;