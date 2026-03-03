import React, { useRef, useEffect } from "react";

const VideoTile = ({ stream }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline muted={false} className="video-tile" />;
};

export default VideoTile;