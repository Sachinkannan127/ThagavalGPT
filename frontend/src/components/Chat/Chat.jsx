import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import './Chat.css';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    return <div>Loading...</div>;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="chat-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ChatWindow onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
    </div>
  );
};

export default Chat;
