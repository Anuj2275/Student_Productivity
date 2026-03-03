import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const ChatPanel = ({ socket, roomId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("room-chat", (chat) => {
      setMessages((prev) => [...prev, chat]);
    });

    return () => {
      socket.off("room-chat");
    };
  }, [socket]);

  return (
    <div className="chat-panel">
      <MessageList
        messages={messages}
        currentUserId={socket.id}
      />
      <ChatInput socket={socket} roomId={roomId} />
    </div>
  );
};

export default ChatPanel;