import React from "react";

const CamToggleButton = ({ camOff, onToggle }) => {
  return (
    <button
      className="neu-btn"
      onClick={onToggle}
    >
      {camOff ? "Enable Camera" : "Disable Camera"}
    </button>
  );
};

export default CamToggleButton;