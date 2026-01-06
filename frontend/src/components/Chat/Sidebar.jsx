import React, { useContext, useState } from 'react';
import { FiPlus, FiTrash2, FiMessageSquare, FiSun, FiMoon, FiX, FiSettings } from 'react-icons/fi';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import Logo from '../Logo';
import SettingsModal from '../SettingsModal';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { conversations, currentConversation, createConversation, selectConversation, deleteConversation } = useContext(ChatContext);
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showSettings, setShowSettings] = useState(false);

  const handleNewChat = () => {
    createConversation();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Logo size="small" showText={true} />
        </div>
        <button className="close-sidebar-btn" onClick={onClose}>
          <FiX size={20} />
        </button>
        <button className="new-chat-btn" onClick={handleNewChat}>
          <FiPlus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="conversations-list">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${currentConversation?.id === conversation.id ? 'active' : ''}`}
            onClick={() => selectConversation(conversation)}
          >
            <FiMessageSquare size={18} />
            <span className="conversation-title">{conversation.title}</span>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(conversation.id);
              }}
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <button className="settings-btn" onClick={() => setShowSettings(true)}>
          <FiSettings size={18} />
          <span>Settings</span>
        </button>
        <div className="user-info">
          <div className="user-avatar">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.displayName || 'User'}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
    
    <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default Sidebar;
