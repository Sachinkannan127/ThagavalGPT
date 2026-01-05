import React, { useState, useContext, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { ChatContext } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import Logo from '../Logo';
import './ChatWindow.css';

const ChatWindow = () => {
  const [input, setInput] = useState('');
  const { messages, loading, sendMessage, currentConversation } = useContext(ChatContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-window">
      {messages.length === 0 && !currentConversation ? (
        <div className="welcome-screen">
          <div style={{ marginBottom: '30px' }}>
            <Logo size="large" showText={false} />
          </div>
          <h1>ThagavalGPT</h1>
          <p>How can I help you today?</p>
          <div className="example-prompts">
            <button onClick={() => setInput("Explain quantum computing in simple terms")}>
              Explain quantum computing
            </button>
            <button onClick={() => setInput("Write a creative story about space exploration")}>
              Write a creative story
            </button>
            <button onClick={() => setInput("Help me plan a healthy meal")}>
              Plan a healthy meal
            </button>
            <button onClick={() => setInput("Teach me about machine learning")}>
              Teach me ML basics
            </button>
          </div>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <div className="message-wrapper assistant-message">
              <div className="message-content">
                <div className="message-icon">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="message-text">
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            rows={1}
            disabled={loading}
          />
          <button type="submit" disabled={!input.trim() || loading}>
            <FiSend size={20} />
          </button>
        </form>
        <p className="input-disclaimer">
          ThagavalGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
