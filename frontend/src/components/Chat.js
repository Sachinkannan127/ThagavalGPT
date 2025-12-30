import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { chatService, authService } from '../services/api';
import './Chat.css';

function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const data = await chatService.getHistory(sessionId);
      setMessages(data.history);
      if (data.session_id) {
        setSessionId(data.session_id);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };

    // Optimistically add user message
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const data = await chatService.sendMessage(inputMessage, sessionId);
      
      // Update with full history from server
      setMessages(data.history);
      
      // Update session ID if returned
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      
      // Show error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
      
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!window.confirm('Are you sure you want to clear the chat history?')) return;

    try {
      await chatService.clearHistory(sessionId);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      onLogout();
    }
  };

  const examplePrompts = [
    "Explain quantum computing in simple terms",
    "Write a Python function to sort a list",
    "What are the best practices for React development?",
    "How does blockchain technology work?"
  ];

  const handleExampleClick = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <svg width="36" height="36" viewBox="0 0 50 50" fill="none">
              <rect width="50" height="50" rx="12" fill="url(#gradient)" />
              <path d="M25 15L35 22.5V32.5L25 40L15 32.5V22.5L25 15Z" fill="white" fillOpacity="0.9" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="50" y2="50">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
            <h2>ThagavalGPT</h2>
          </div>
        </div>

        <div className="sidebar-content">
          <button className="new-chat-btn" onClick={clearChat}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Chat
          </button>

          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Help
              </button>
              <button className="action-btn" onClick={clearChat}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Clear History
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h1>Chat Assistant</h1>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-logo">
                <svg width="80" height="80" viewBox="0 0 50 50" fill="none">
                  <rect width="50" height="50" rx="12" fill="url(#gradient2)" />
                  <path d="M25 15L35 22.5V32.5L25 40L15 32.5V22.5L25 15Z" fill="white" fillOpacity="0.9" />
                  <defs>
                    <linearGradient id="gradient2" x1="0" y1="0" x2="50" y2="50">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2>Welcome to ThagavalGPT</h2>
              <p>Your intelligent AI assistant is ready to help you with any questions or tasks.</p>
              
              <div className="example-prompts">
                <h3>Try asking:</h3>
                <div className="prompts-grid">
                  {examplePrompts.map((prompt, index) => (
                    <button 
                      key={index} 
                      className="example-prompt"
                      onClick={() => handleExampleClick(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'user' ? (
                    <div className="user-avatar-small">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 50 50" fill="none">
                      <rect width="50" height="50" rx="10" fill="url(#gradient3)" />
                      <path d="M25 15L35 22.5V32.5L25 40L15 32.5V22.5L25 15Z" fill="white" fillOpacity="0.9" />
                      <defs>
                        <linearGradient id="gradient3" x1="0" y1="0" x2="50" y2="50">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </div>
                <div className="message-content">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message assistant">
              <div className="message-avatar">
                <svg width="32" height="32" viewBox="0 0 50 50" fill="none">
                  <rect width="50" height="50" rx="10" fill="url(#gradient4)" />
                  <path d="M25 15L35 22.5V32.5L25 40L15 32.5V22.5L25 15Z" fill="white" fillOpacity="0.9" />
                  <defs>
                    <linearGradient id="gradient4" x1="0" y1="0" x2="50" y2="50">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <form className="chat-input-form" onSubmit={sendMessage}>
            <textarea
              className="chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type your message here... (Press Enter to send)"
              rows="1"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="send-button" 
              disabled={loading || !inputMessage.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
          <p className="input-hint">
            ThagavalGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chat;
