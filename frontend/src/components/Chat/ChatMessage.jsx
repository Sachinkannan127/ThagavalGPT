import React, { useState, useMemo, useEffect } from 'react';
import { FiUser, FiCpu, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { marked } from 'marked';
import toast from 'react-hot-toast';
import './ChatMessage.css';

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false
});

const ChatMessage = ({ message, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  // Render markdown content
  const renderedContent = useMemo(() => {
    if (isUser) return message.content;
    
    const renderer = new marked.Renderer();
    
    // Custom code block renderer
    renderer.code = function(code, language) {
      const validLang = language || 'plaintext';
      const escapedCode = String(code)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      
      return `<div class="code-block-wrapper">
        <div class="code-header">
          <span class="code-language">${validLang}</span>
          <button class="code-copy-btn" onclick="navigator.clipboard.writeText(this.dataset.code)" data-code="${code.replace(/"/g, '&quot;')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <pre><code class="language-${validLang}">${escapedCode}</code></pre>
      </div>`;
    };
    
    // Custom inline code renderer
    renderer.codespan = function(code) {
      const escapedCode = String(code)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<code class="inline-code">${escapedCode}</code>`;
    };
    
    // Custom paragraph renderer to preserve newlines
    renderer.paragraph = function(text) {
      return `<p>${text}</p>\n`;
    };
    
    marked.use({ renderer });
    
    const content = String(message.content || '');
    return marked.parse(content);
  }, [message.content, isUser]);

  const handleCopy = async () => {
    try {
      const contentToCopy = typeof message.content === 'object'
        ? JSON.stringify(message.content, null, 2)
        : message.content;
      
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message);
      toast('Regenerating response...');
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message-wrapper ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-content">
        <div className="message-icon">
          {isUser ? <FiUser size={20} /> : <FiCpu size={20} />}
        </div>
        
        <div className="message-body">
          {isUser ? (
            <div className="message-text">
              {typeof message.content === 'object'
                ? JSON.stringify(message.content, null, 2)
                : message.content}
            </div>
          ) : (
            <div 
              className="message-text markdown-content"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          )}
          
          <div className="message-actions">
            {message.timestamp && (
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
            )}
            
            <button 
              className="action-btn copy-btn" 
              onClick={handleCopy} 
              title="Copy message"
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            </button>
            
            {!isUser && onRegenerate && (
              <button 
                className="action-btn regenerate-btn" 
                onClick={handleRegenerate} 
                title="Regenerate response"
              >
                <FiRefreshCw size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
