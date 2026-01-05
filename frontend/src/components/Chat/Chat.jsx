import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import './Chat.css';

const Chat = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default Chat;
