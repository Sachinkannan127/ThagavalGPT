import React from 'react';
import { FiUser, FiCpu } from 'react-icons/fi';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message-wrapper ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-content">
        <div className="message-icon">
          {isUser ? (
            <FiUser size={20} />
          ) : (
            <FiCpu size={20} />
          )}
        </div>
        <div className="message-text">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
