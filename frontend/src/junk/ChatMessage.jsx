const ChatMessage = ({ message }) => (
  <div className="chat-message">
    <span className="sender">{message.id}:</span>
    <span className="text">{message.message}</span>
  </div>
);

export default ChatMessage;