import React, { useState, useEffect } from 'react';
import { FiDownload, FiX, FiSmartphone, FiMonitor } from 'react-icons/fi';
import {
  isAppInstalled,
  isInstallPromptAvailable,
  showInstallPrompt,
  isMobileDevice,
  isIOS,
  getInstallInstructions,
} from '../utils/pwaInstall';
import './InstallPrompt.css';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (isAppInstalled()) {
      return;
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt after 30 seconds if not dismissed in the last 7 days
    if (daysSinceDismissed > 7 || !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      // Show iOS installation instructions
      setShowInstructions(true);
      return;
    }

    if (isInstallPromptAvailable()) {
      const { outcome } = await showInstallPrompt();
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        localStorage.removeItem('pwa-install-dismissed');
      }
    } else {
      // Show generic instructions
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const instructions = getInstallInstructions();

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <button className="install-prompt-close" onClick={handleDismiss} aria-label="Close">
          <FiX size={20} />
        </button>

        {!showInstructions ? (
          <>
            <div className="install-prompt-icon">
              {isMobileDevice() ? <FiSmartphone size={48} /> : <FiMonitor size={48} />}
            </div>
            
            <h3 className="install-prompt-title">Install ThagavalGPT</h3>
            
            <p className="install-prompt-description">
              Get faster access and work offline! Install ThagavalGPT on your{' '}
              {isMobileDevice() ? 'device' : 'computer'} for the best experience.
            </p>

            <ul className="install-prompt-features">
              <li>✨ Works offline</li>
              <li>⚡ Faster loading</li>
              <li>🔔 Push notifications</li>
              <li>📱 Full-screen experience</li>
            </ul>

            <div className="install-prompt-actions">
              <button className="install-btn" onClick={handleInstall}>
                <FiDownload size={18} />
                Install App
              </button>
              <button className="dismiss-btn" onClick={handleDismiss}>
                Maybe Later
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="install-prompt-icon">
              {isMobileDevice() ? <FiSmartphone size={48} /> : <FiMonitor size={48} />}
            </div>
            
            <h3 className="install-prompt-title">{instructions.title}</h3>
            
            <ol className="install-instructions">
              {instructions.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>

            <div className="install-prompt-actions">
              <button className="dismiss-btn" onClick={handleDismiss}>
                Got it!
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;
