import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from './AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  // Load from localStorage with content validation
  const loadMessagesFromStorage = () => {
    const saved = localStorage.getItem('messages');
    if (!saved) return [];
    
    try {
      const messages = JSON.parse(saved);
      // Fix any object content in old messages
      return messages.map(msg => {
        let content = msg.content;
        
        if (typeof content === 'object' && content !== null) {
          content = content.text || content.content || JSON.stringify(content);
        }
        
        content = String(content);
        
        // Check for [object Object]
        if (content === '[object Object]' || content.includes('[object Object]')) {
          console.warn('⚠️ localStorage message has [object Object], clearing...');
          if (typeof msg.content === 'object') {
            content = JSON.stringify(msg.content, null, 2);
          } else {
            content = 'Message content unavailable';
          }
        }
        
        return {
          ...msg,
          content: content
        };
      });
    } catch (e) {
      console.error('Error loading messages:', e);
      return [];
    }
  };
  
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('conversations');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentConversation, setCurrentConversation] = useState(() => {
    const saved = localStorage.getItem('currentConversation');
    return saved ? JSON.parse(saved) : null;
  });
  const [messages, setMessages] = useState(loadMessagesFromStorage);
  const [loading, setLoading] = useState(false);
  const [responseLength, setResponseLength] = useState(() => {
    const saved = localStorage.getItem('responseLength');
    return saved || 'auto'; // Default to 'auto' if not set
  });
  const [codeMode, setCodeMode] = useState(() => {
    const saved = localStorage.getItem('codeMode');
    return saved === 'true'; // Default to false
  });

  // Save responseLength to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('responseLength', responseLength);
    console.log('📏 Response length set to:', responseLength);
  }, [responseLength]);

  // Save codeMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('codeMode', codeMode);
    console.log('💻 Code generation mode:', codeMode ? 'ON' : 'OFF');
  }, [codeMode]);

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
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        let content = data.content;
        
        // Handle object content
        if (typeof content === 'object' && content !== null) {
          console.warn('⚠️ Firestore message has object content:', content);
          content = content.text || content.content || content.message || JSON.stringify(content);
        }
        
        // Convert to string
        content = String(content || 'No content');
        
        // Check if conversion resulted in [object Object]
        if (content === '[object Object]' || content.includes('[object Object]')) {
          console.error('❌ Detected [object Object] from Firestore, message ID:', doc.id);
          // Try JSON stringify as last resort
          if (typeof data.content === 'object') {
            content = JSON.stringify(data.content, null, 2);
          } else {
            content = 'Message could not be loaded';
          }
        }
        
        return {
          id: doc.id,
          ...data,
          content: content
        };
      });
      
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
      // Ensure content is a string
      const messageContent = String(content);
      
      // Add user message to Firestore
      const userMessage = {
        conversationId,
        role: 'user',
        content: messageContent,
        createdAt: new Date().toISOString()
      };
      
      const userMessageRef = await addDoc(collection(db, 'messages'), userMessage);
      userMsg = { id: userMessageRef.id, ...userMessage };
      setMessages(prev => [...prev, userMsg]);

      console.log('Sending message to backend API...');
      
      // Call backend API for AI response
      const response = await api.post('/api/chat', {
        message: messageContent,
        conversationId: conversationId,
        responseLength: responseLength,
        codeMode: codeMode
      });

      console.log('📥 Received full response:', response);
      console.log('📥 Response data:', response.data);
      console.log('📥 Response data type:', typeof response.data);
      console.log('📥 Response.data.message:', response.data.message);
      console.log('📥 Response.data.message type:', typeof response.data.message);
      
      // Extract the message content - MUST be the .message field
      let aiContent = response.data.message;
      
      console.log('🔍 Extracted aiContent:', aiContent);
      console.log('🔍 aiContent type:', typeof aiContent);
      
      // If it's an object, try to extract the content recursively
      if (typeof aiContent === 'object' && aiContent !== null) {
        console.error('⚠️ AI response is an object:', JSON.stringify(aiContent, null, 2));
        
        // Try multiple paths to extract string content
        aiContent = aiContent.message 
          || aiContent.content 
          || aiContent.text 
          || aiContent.data
          || aiContent.response
          || (aiContent.choices && aiContent.choices[0]?.message?.content)
          || JSON.stringify(aiContent, null, 2);
      }
      
      // Ensure it's a string
      aiContent = String(aiContent || 'No response received');
      
      // Final check for [object Object]
      if (aiContent === '[object Object]' || aiContent.includes('[object Object]')) {
        console.error('❌ Detected [object Object] after conversion!');
        // Try to recover from original response
        const originalResponse = response.data.message || response.data;
        if (typeof originalResponse === 'object' && originalResponse !== null) {
          aiContent = JSON.stringify(originalResponse, null, 2);
        } else {
          aiContent = 'Error: Could not parse AI response. Please try again.';
        }
      }
      
      console.log('✅ Final AI content type:', typeof aiContent);
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

  const clearLocalStorage = () => {
    localStorage.removeItem('messages');
    localStorage.removeItem('conversations');
    localStorage.removeItem('currentConversation');
    setMessages([]);
    setConversations([]);
    setCurrentConversation(null);
    console.log('✅ Local storage cleared');
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    responseLength,
    setResponseLength,
    codeMode,
    setCodeMode,
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
