import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FiCpu, FiLayers, FiActivity, FiCheckCircle, FiMenu, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import Logo from '../Logo';
import './Chat.css';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [selectedTab, setSelectedTab] = useState('models');

  if (!user) {
    return <div>Loading...</div>;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleLeftPanel = () => setLeftPanelOpen(!leftPanelOpen);

  const aiModels = [
    {
      name: 'Gemini Pro',
      id: 'gemini',
      icon: <FiCpu />,
      speed: '⚡ Ultra Fast',
      accuracy: '98%',
      description: 'Google\'s most capable AI model for complex tasks',
      features: ['Multi-modal', 'Long context', 'Fast inference']
    },
    {
      name: 'Groq LLaMA',
      id: 'groq',
      icon: <FiLayers />,
      speed: '🚀 Lightning',
      accuracy: '96%',
      description: 'Fastest inference with exceptional performance',
      features: ['Speed optimized', 'Low latency', 'Cost effective']
    },
    {
      name: 'GPT-4',
      id: 'gpt4',
      icon: <FiActivity />,
      speed: '⚡ Fast',
      accuracy: '99%',
      description: 'Most advanced reasoning and problem-solving',
      features: ['Best reasoning', 'Creative', 'Comprehensive']
    }
  ];

  const capabilities = [
    'Answer questions with detailed explanations',
    'Write and review code in multiple languages',
    'Create content and creative stories',
    'Translate between languages',
    'Solve complex problems step-by-step',
    'Provide creative ideas and brainstorming'
  ];

  return (
    <div className="chat-container split-view">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Left Panel */}
      <div className={`left-panel ${leftPanelOpen ? 'open' : 'closed'}`}>
        <div className="left-panel-header">
          <div className="panel-logo">
            <Logo size="small" showText={true} />
          </div>
          <button className="panel-toggle" onClick={toggleLeftPanel}>
            {leftPanelOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {leftPanelOpen && (
          <div className="left-panel-content">
            {/* Tabs */}
            <div className="panel-tabs">
              <button 
                className={`tab ${selectedTab === 'models' ? 'active' : ''}`}
                onClick={() => setSelectedTab('models')}
              >
                AI Models
              </button>
              <button 
                className={`tab ${selectedTab === 'capabilities' ? 'active' : ''}`}
                onClick={() => setSelectedTab('capabilities')}
              >
                Capabilities
              </button>
            </div>

            {/* Tab Content */}
            <div className="panel-tab-content">
              {selectedTab === 'models' && (
                <div className="models-list">
                  <h3>Select AI Model</h3>
                  {aiModels.map((model) => (
                    <div 
                      key={model.id}
                      className={`model-item ${selectedModel === model.id ? 'active' : ''}`}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <div className="model-header">
                        <div className="model-icon">{model.icon}</div>
                        <div className="model-info">
                          <h4>{model.name}</h4>
                          <div className="model-badges">
                            <span className="badge">{model.speed}</span>
                            <span className="badge">{model.accuracy}</span>
                          </div>
                        </div>
                      </div>
                      <p className="model-description">{model.description}</p>
                      <div className="model-features">
                        {model.features.map((feature, idx) => (
                          <span key={idx} className="feature-tag">✓ {feature}</span>
                        ))}
                      </div>
                      {selectedModel === model.id && (
                        <div className="active-badge">Currently Active</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'capabilities' && (
                <div className="capabilities-list">
                  <h3>What I Can Do</h3>
                  <ul>
                    {capabilities.map((capability, idx) => (
                      <li key={idx}>
                        <FiCheckCircle className="check-icon" />
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="capability-note">
                    <p>💡 <strong>Tip:</strong> Be specific with your questions for better results!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!leftPanelOpen && (
          <div className="left-panel-collapsed">
            <button className="expand-btn" onClick={toggleLeftPanel} title="Expand panel">
              <FiMenu size={20} />
            </button>
            <div className="collapsed-icons">
              <FiCpu size={20} title="Models" />
              <FiCheckCircle size={20} title="Capabilities" />
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Chat */}
      <ChatWindow onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
    </div>
  );
};

export default Chat;
