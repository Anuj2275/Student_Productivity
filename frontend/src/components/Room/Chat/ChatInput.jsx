import React, { useState } from "react";

const ChatInput = ({ socket, roomId }) => {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("room-chat", { roomId, message: text });
    setText("");
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatInput;