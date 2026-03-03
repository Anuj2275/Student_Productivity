const MessageItem = ({ message, isOwn }) => {
  return (
    <div className={`message-item ${isOwn ? "own" : ""}`}>
      {!isOwn && <span className="sender">{message.id}</span>}
      <div className="bubble">
        {message.message}
      </div>
    </div>
  );
};

export default MessageItem;