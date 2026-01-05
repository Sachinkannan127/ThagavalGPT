import React, { useContext } from 'react';
import { FiPlus, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { conversations, currentConversation, createConversation, selectConversation, deleteConversation } = useContext(ChatContext);
  const { user, logout } = useContext(AuthContext);

  const handleNewChat = () => {
    createConversation();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
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
  );
};

export default Sidebar;
