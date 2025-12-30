import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

function Settings({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-tabs">
            <button 
              className={`tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="5" strokeWidth="2"/>
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Appearance
            </button>
            <button 
              className={`tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2"/>
              </svg>
              General
            </button>
            <button 
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M12 16v-4m0-4h.01" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              About
            </button>
          </div>

          <div className="settings-panel">
            {activeTab === 'appearance' && (
              <div className="settings-section">
                <h3>Theme</h3>
                <p className="section-description">Choose your preferred color theme</p>
                
                <div className="theme-selector">
                  <div 
                    className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => theme !== 'dark' && toggleTheme()}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="2"/>
                    </svg>
                    <span>Dark</span>
                    {theme === 'dark' && (
                      <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  
                  <div 
                    className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => theme !== 'light' && toggleTheme()}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="5" strokeWidth="2"/>
                      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2"/>
                    </svg>
                    <span>Light</span>
                    {theme === 'light' && (
                      <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="settings-section">
                <h3>General Settings</h3>
                <p className="section-description">Configure your chatbot preferences</p>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>AI Provider</label>
                    <p>Choose your preferred AI provider</p>
                  </div>
                  <select className="setting-select">
                    <option value="auto">Auto (Best Available)</option>
                    <option value="openai">OpenAI GPT</option>
                    <option value="gemini">Google Gemini</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Message History</label>
                    <p>Number of messages to keep in context</p>
                  </div>
                  <select className="setting-select">
                    <option value="10">10 messages</option>
                    <option value="20" selected>20 messages</option>
                    <option value="50">50 messages</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto-save Conversations</label>
                    <p>Automatically save chat sessions</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="settings-section">
                <div className="about-content">
                  <div className="about-logo">
                    <svg width="60" height="60" viewBox="0 0 50 50" fill="none">
                      <rect width="50" height="50" rx="12" fill="url(#gradient-about)" />
                      <path d="M25 15L35 22.5V32.5L25 40L15 32.5V22.5L25 15Z" fill="white" fillOpacity="0.9" />
                      <defs>
                        <linearGradient id="gradient-about" x1="0" y1="0" x2="50" y2="50">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3>ThagavalGPT</h3>
                  <p className="version">Version 2.0.0</p>
                  <p className="description">
                    A professional AI chatbot powered by OpenAI and Google Gemini.
                    Built with React and Flask.
                  </p>
                  
                  <div className="about-features">
                    <div className="feature-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/>
                      </svg>
                      Secure Authentication
                    </div>
                    <div className="feature-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2"/>
                      </svg>
                      Fast Responses
                    </div>
                    <div className="feature-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeWidth="2"/>
                      </svg>
                      AI Powered
                    </div>
                  </div>
                  
                  <div className="about-links">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeWidth="2"/>
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeWidth="2"/>
                      </svg>
                      Documentation
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
