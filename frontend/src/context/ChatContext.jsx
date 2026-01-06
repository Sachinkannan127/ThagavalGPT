import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from './AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('conversations');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentConversation, setCurrentConversation] = useState(() => {
    const saved = localStorage.getItem('currentConversation');
    return saved ? JSON.parse(saved) : null;
  });
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (currentConversation) {
      localStorage.setItem('currentConversation', JSON.stringify(currentConversation));
    }
  }, [currentConversation]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      setConversations([]);
      setMessages([]);
      setCurrentConversation(null);
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const convos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setConversations(convos);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createConversation = async (title = 'New Chat') => {
    try {
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        userId: user.uid,
        title: title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const newConvo = {
        id: conversationRef.id,
        userId: user.uid,
        title: title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setConversations([newConvo, ...conversations]);
      setCurrentConversation(newConvo);
      setMessages([]);
      
      return newConvo;
    } catch (error) {
      toast.error('Error creating conversation');
      throw error;
    }
  };

  const sendMessage = async (content) => {
    if (!currentConversation) {
      const newConvo = await createConversation();
      return sendMessageToConversation(newConvo.id, content);
    }
    
    return sendMessageToConversation(currentConversation.id, content);
  };

  const sendMessageToConversation = async (conversationId, content) => {
    setLoading(true);
    let userMsg = null;
    
    try {
      // Add user message to Firestore
      const userMessage = {
        conversationId,
        role: 'user',
        content: content,
        createdAt: new Date().toISOString()
      };
      
      const userMessageRef = await addDoc(collection(db, 'messages'), userMessage);
      userMsg = { id: userMessageRef.id, ...userMessage };
      setMessages(prev => [...prev, userMsg]);

      console.log('Sending message to backend API...');
      
      // Call backend API for AI response
      const response = await api.post('/api/chat', {
        message: content,
        conversationId: conversationId
      });

      console.log('Received AI response:', response.data);
      
      // Extract the message content properly
      let aiContent = response.data.message;
      
      // If it's an object, try to extract the content
      if (typeof aiContent === 'object' && aiContent !== null) {
        console.warn('⚠️ AI response is an object:', aiContent);
        aiContent = aiContent.content || aiContent.text || JSON.stringify(aiContent);
      }
      
      // Ensure it's a string
      aiContent = String(aiContent || 'No response received');
      
      console.log('✅ Processed AI content length:', aiContent.length);
      console.log('📝 Content preview:', aiContent.substring(0, 200));

      // Add AI response to Firestore
      const aiMessage = {
        conversationId,
        role: 'assistant',
        content: aiContent,
        createdAt: new Date().toISOString()
      };
      
      const aiMessageRef = await addDoc(collection(db, 'messages'), aiMessage);
      const aiMsg = { id: aiMessageRef.id, ...aiMessage };
      setMessages(prev => [...prev, aiMsg]);

      return aiMsg;
    } catch (error) {
      console.error('Send message error:', error);
      
      // Determine error message
      let errorMessage = 'Error sending message';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        console.error('Server error:', error.response.status, error.response.data);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        console.error('Network error:', error.request);
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
        console.error('Request setup error:', error.message);
      }
      
      toast.error(errorMessage);
      
      // Remove the user message if there's an error and we added one
      if (userMsg) {
        setMessages(prev => prev.filter(m => m.id !== userMsg.id));
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      // Delete conversation
      await deleteDoc(doc(db, 'conversations', conversationId));
      
      // Delete all messages in conversation
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId)
      );
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      
      toast.success('Conversation deleted');
    } catch (error) {
      toast.error('Error deleting conversation');
      throw error;
    }
  };

  const selectConversation = async (conversation) => {
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    createConversation,
    sendMessage,
    deleteConversation,
    selectConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
