import React, { useState, useMemo, useEffect } from 'react';
import { FiUser, FiCpu, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { marked } from 'marked';
import toast from 'react-hot-toast';
import './ChatMessage.css';

// Helper function to safely convert any value to displayable string
const safeStringify = (value) => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
  
  // Handle objects
  if (typeof value === 'object') {
    // Check for common message properties
    if (value.text) return String(value.text);
    if (value.content) return String(value.content);
    if (value.message) return String(value.message);
    if (value.data) return safeStringify(value.data);
    
    // Try to JSON stringify
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return `[Object: ${value.constructor?.name || 'Unknown'}]`;
    }
  }
  
  return String(value);
};

// Configure marked renderer once
const renderer = new marked.Renderer();

// Custom code block renderer with Prism highlighting
renderer.code = function(code, language) {
  const validLang = language || 'plaintext';
  
  // Clean the code content
  const codeContent = String(code).trim();
  
  // HTML escape for safe rendering
  const escapedCode = codeContent
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  return `<div class="code-block-wrapper">
    <div class="code-header">
      <span class="code-language">${validLang}</span>
      <button class="code-copy-btn" data-code="${escapedCode.replace(/"/g, '&quot;')}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
    <pre class="language-${validLang}"><code class="language-${validLang}">${escapedCode}</code></pre>
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

// Custom paragraph renderer
renderer.paragraph = function(text) {
  return `<p>${text}</p>\n`;
};

// Configure marked options globally
marked.setOptions({
  renderer,
  breaks: true,
  gfm: true,
  pedantic: false,
  headerIds: false,
  mangle: false
});

const ChatMessage = ({ message, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  // Add copy button functionality after content updates
  useEffect(() => {
    if (!isUser) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Add copy button functionality
        const copyButtons = document.querySelectorAll('.code-copy-btn');
        copyButtons.forEach(button => {
          button.onclick = async (e) => {
            e.preventDefault();
            const codeBlock = button.closest('.code-block-wrapper');
            const codeElement = codeBlock.querySelector('code');
            const code = codeElement.textContent;
            
            try {
              await navigator.clipboard.writeText(code);
              button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>`;
              setTimeout(() => {
                button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>`;
              }, 2000);
            } catch (err) {
              console.error('Failed to copy:', err);
            }
          };
        });
      }, 100);
    }
  }, [message.content, isUser]);

  // Render markdown content
  const renderedContent = useMemo(() => {
    if (isUser) return safeStringify(message.content);
    
    // Use safeStringify to convert content
    let content = safeStringify(message.content);
    
    // Final validation
    if (!content || content === 'undefined' || content === 'null') {
      content = 'No response received';
    }
    
    // Check if it still contains [object Object]
    if (content.includes('[object Object]')) {
      console.error('❌ Still has [object Object], raw:', message.content);
      content = `**Error displaying message**\n\nRaw data:\n\`\`\`json\n${JSON.stringify(message, null, 2)}\n\`\`\``;
    }
    
    try {
      console.log('📄 Parsing markdown, content length:', content.length);
      console.log('📄 Content preview:', content.substring(0, 300));
      console.log('📄 Has code blocks (```):', content.includes('```'));
      
      // Use the safely converted content
      if (!content || content === 'undefined' || content === 'null') {
        return '<p>No response received</p>';
      }
      
      // Parse the markdown to HTML using marked v17 API
      const parsed = marked.parse(content);
      console.log('✅ Parsed HTML length:', parsed.length);
      console.log('✅ Parsed HTML has code-block-wrapper:', parsed.includes('code-block-wrapper'));
      console.log('✅ Parsed HTML preview:', parsed.substring(0, 500));
      
      return parsed || '<p>Error rendering message</p>';
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return `<p>${String(content || 'Error rendering message')}</p>`;
    }
  }, [message.content, isUser]);

  const handleCopy = async () => {
    try {
      const contentToCopy = safeStringify(message.content);
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
              {safeStringify(message.content)}
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
