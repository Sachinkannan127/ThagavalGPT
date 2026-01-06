import React, { useContext, useState } from 'react';
import { FiX, FiSun, FiMoon, FiMonitor, FiCheck } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [selectedTheme, setSelectedTheme] = useState(theme);

  if (!isOpen) return null;

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    if (newTheme !== theme) {
      toggleTheme();
    }
  };

  const themeOptions = [
    { id: 'light', name: 'Light', icon: <FiSun size={20} />, description: 'Clean and bright' },
    { id: 'dark', name: 'Dark', icon: <FiMoon size={20} />, description: 'Easy on the eyes' },
  ];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="settings-content">
          {/* User Info Section */}
          <div className="settings-section">
            <h3>Account</h3>
            <div className="user-info-card">
              <div className="user-avatar-large">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details-large">
                <div className="user-name-large">{user?.displayName || 'User'}</div>
                <div className="user-email-large">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div className="settings-section">
            <h3>Appearance</h3>
            <p className="section-description">Customize how ThagavalGPT looks for you</p>
            <div className="theme-options">
              {themeOptions.map((option) => (
                <div
                  key={option.id}
                  className={`theme-option ${selectedTheme === option.id ? 'active' : ''}`}
                  onClick={() => handleThemeChange(option.id)}
                >
                  <div className="theme-option-icon">{option.icon}</div>
                  <div className="theme-option-details">
                    <div className="theme-option-name">{option.name}</div>
                    <div className="theme-option-description">{option.description}</div>
                  </div>
                  {selectedTheme === option.id && (
                    <div className="theme-option-check">
                      <FiCheck size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="settings-section">
            <h3>About</h3>
            <div className="about-info">
              <div className="about-item">
                <span className="about-label">Version</span>
                <span className="about-value">1.0.0</span>
              </div>
              <div className="about-item">
                <span className="about-label">Platform</span>
                <span className="about-value">ThagavalGPT</span>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="settings-section">
            <h3>Data & Privacy</h3>
            <p className="section-description">
              Your conversations are stored securely and encrypted. We respect your privacy and 
              never share your data with third parties.
            </p>
            <div className="privacy-links">
              <a href="#" className="privacy-link">Privacy Policy</a>
              <a href="#" className="privacy-link">Terms of Service</a>
              <a href="#" className="privacy-link">Data Controls</a>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-btn primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
