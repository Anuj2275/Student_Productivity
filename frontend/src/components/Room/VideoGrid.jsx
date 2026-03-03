import React from "react";
import VideoTile from "./VideoTitle";

const VideoGrid = ({ localStream, remoteStreams }) => {
  const allStreams = [localStream, ...remoteStreams];

  return (
    <div className="video-grid">
      {allStreams.map((stream, idx) => (
        <VideoTile key={idx} stream={stream} />
      ))}
    </div>
  );
};

export default VideoGrid;