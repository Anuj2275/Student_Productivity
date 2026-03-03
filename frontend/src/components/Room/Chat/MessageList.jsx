import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, currentUserId }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <MessageItem
          key={index}
          message={msg}
          isOwn={msg.id === currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;