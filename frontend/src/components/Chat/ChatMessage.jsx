import React, { useState } from 'react';
import { FiUser, FiCpu, FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

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
        <div className="message-body">
          <div className="message-text">
            {message.content}
          </div>
          <button className="copy-btn" onClick={handleCopy} title="Copy message">
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
