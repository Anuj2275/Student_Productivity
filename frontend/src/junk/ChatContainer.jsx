import React, { useEffect, useState } from "react";

const ChatContainer = ({ socket, roomId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("room-chat", ({ id, message }) => {
      setMessages((prev) => [...prev, { id, message }]);
    });

    return () => {
      socket.off("room-chat");
    };
  }, [socket]);

  return (
    <div className="chat-container" style={{ maxHeight: "300px", overflowY: "auto" }}>
      {messages.map((msg, index) => (
        <div key={index}>
          <b>{msg.id === socket.id ? "You" : msg.id}:</b> {msg.message}
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;