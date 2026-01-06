import React, { useState, useMemo } from 'react';
import { FiUser, FiCpu, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { marked } from 'marked';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import './ChatMessage.css';

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

const ChatMessage = ({ message, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  // Render markdown content with syntax highlighting
  const renderedContent = useMemo(() => {
    if (isUser) return message.content;
    
    const renderer = new marked.Renderer();
    
    // Custom code block renderer
    renderer.code = (code, language) => {
      return `<pre class="code-block"><code class="language-${language || 'text'}" data-lang="${language || 'text'}">${code}</code></pre>`;
    };
    
    // Custom inline code renderer
    renderer.codespan = (code) => {
      return `<code class="inline-code">${code}</code>`;
    };
    
    marked.use({ renderer });
    return marked.parse(message.content);
  }, [message.content, isUser]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
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
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-wrapper ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-content">
        <div className="message-icon">
          {isUser ? (
            <FiUser size={20} />
          ) : (
            <FiCpu size={20} />
          )}
        </div>
        <div className="message-body">
          {isUser ? (
            <div className="message-text">{message.content}</div>
          ) : (
            <div 
              className="message-text markdown-content"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          )}
          <div className="message-actions">
            {message.timestamp && (
              <span className="message-time">{formatTime(message.timestamp)}</span>
            )}
            <button className="action-btn copy-btn" onClick={handleCopy} title="Copy message">
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            </button>
            {!isUser && onRegenerate && (
              <button className="action-btn regenerate-btn" onClick={handleRegenerate} title="Regenerate response">
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
