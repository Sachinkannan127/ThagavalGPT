import React, { useState, useContext, useRef, useEffect } from 'react';
import { FiSend, FiMenu, FiTrash2, FiZap, FiCode, FiBook, FiCoffee, FiDownload } from 'react-icons/fi';
import { ChatContext } from '../../context/ChatContext';
import { ThemeContext } from '../../context/ThemeContext';
import ChatMessage from './ChatMessage';
import Logo from '../Logo';
import toast from 'react-hot-toast';
import './ChatWindow.css';

const ChatWindow = ({ onToggleSidebar, sidebarOpen }) => {
  const [input, setInput] = useState('');
  const [charCount, setCharCount] = useState(0);
  const { messages, loading, sendMessage, currentConversation, createConversation } = useContext(ChatContext);
  const { isDark } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setCharCount(value.length);
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    if (window.confirm('Clear all messages in this chat?')) {
      createConversation();
      toast.success('Chat cleared');
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) {
      toast.error('No messages to export');
      return;
    }

    const chatData = {
      conversation: currentConversation?.title || 'Chat Export',
      date: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported successfully');
  };

  const handleRegenerate = async (message) => {
    const messageIndex = messages.findIndex(m => m.id === message.id);
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      if (previousUserMessage.role === 'user') {
        await sendMessage(previousUserMessage.content);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    setCharCount(0);
    
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
      <div className="chat-header">
        <button className="menu-btn" onClick={onToggleSidebar} title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
          <FiMenu size={24} />
        </button>
        <div className="header-logo">
          <Logo size="small" showText={false} />
          <span className="header-title">ThagavalGPT</span>
        </div>
        {messages.length > 0 && (
          <div className="header-actions">
            <button className="header-btn export-btn" onClick={handleExportChat} title="Export chat">
              <FiDownload size={18} />
              <span>Export</span>
            </button>
            <button className="header-btn clear-chat-btn" onClick={handleClearChat} title="Clear chat">
              <FiTrash2 size={18} />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>
      {messages.length === 0 && !currentConversation ? (
        <div className="welcome-screen">
          <div className="welcome-logo">
            <Logo size="large" showText={false} />
          </div>
          <h1>Welcome to ThagavalGPT</h1>
          <p className="welcome-subtitle">Your AI-powered assistant for any task</p>
          <div className="capabilities">
            <div className="capability-item">
              <FiZap size={24} />
              <span>Lightning Fast</span>
            </div>
            <div className="capability-item">
              <FiCode size={24} />
              <span>Code Helper</span>
            </div>
            <div className="capability-item">
              <FiBook size={24} />
              <span>Knowledge Base</span>
            </div>
            <div className="capability-item">
              <FiCoffee size={24} />
              <span>Creative Ideas</span>
            </div>
          </div>
          <div className="example-prompts">
            <button onClick={() => setInput("Explain quantum computing in simple terms")}>
              <span className="prompt-icon">💡</span>
              <span>Explain quantum computing</span>
            </button>
            <button onClick={() => setInput("Write a Python function to sort a list")}>
              <span className="prompt-icon">💻</span>
              <span>Write Python code</span>
            </button>
            <button onClick={() => setInput("Create a weekly workout plan for beginners")}>
              <span className="prompt-icon">🏋️</span>
              <span>Fitness plan</span>
            </button>
            <button onClick={() => setInput("Help me write a professional email")}>
              <span className="prompt-icon">✉️</span>
              <span>Professional email</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              onRegenerate={message.role === 'assistant' ? handleRegenerate : null}
            />
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
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift + Enter for new line)"
            rows={1}
            disabled={loading}
            maxLength={4000}
          />
          {charCount > 0 && (
            <span className="char-counter">{charCount}/4000</span>
          )}
          <button type="submit" disabled={!input.trim() || loading}>
            <FiSend size={20} />
          </button>
        </form>
        <div className="input-footer">
          <p className="input-disclaimer">
            ThagavalGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
