import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiCode, FiGlobe, FiShield, FiTrendingUp, FiUsers, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Logo from '../components/Logo';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleGetStarted = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <FiZap size={32} />,
      title: 'Lightning Fast',
      description: 'Get instant responses powered by advanced AI models'
    },
    {
      icon: <FiCode size={32} />,
      title: 'Code Assistant',
      description: 'Write, debug, and optimize code in multiple languages'
    },
    {
      icon: <FiGlobe size={32} />,
      title: 'Multilingual',
      description: 'Communicate in multiple languages with ease'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and secure'
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Continuous Learning',
      description: 'Always improving with the latest AI capabilities'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'User Friendly',
      description: 'Intuitive interface designed for everyone'
    }
  ];

  const capabilities = [
    'Answer questions with detailed explanations',
    'Write and review code',
    'Create content and stories',
    'Translate between languages',
    'Solve complex problems',
    'Provide creative ideas'
  ];

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-logo">
            <Logo size="small" showText={true} />
          </div>
          <nav className="header-nav">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {user ? (
              <button className="nav-btn primary" onClick={() => navigate('/chat')}>
                Go to Chat
              </button>
            ) : (
              <>
                <button className="nav-btn" onClick={() => navigate('/login')}>
                  Log in
                </button>
                <button className="nav-btn primary" onClick={() => navigate('/register')}>
                  Sign up
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your AI-Powered
            <br />
            <span className="gradient-text">Conversation Partner</span>
          </h1>
          <p className="hero-description">
            Experience the power of advanced AI with ThagavalGPT. Get answers, generate ideas,
            write code, and so much more with our intelligent assistant.
          </p>
          <div className="hero-actions">
            <button className="cta-button primary" onClick={handleGetStarted}>
              Get Started <FiArrowRight />
            </button>
            <button className="cta-button secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="chat-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="preview-messages">
              <div className="preview-message user">
                <div className="message-bubble">What can you help me with?</div>
              </div>
              <div className="preview-message assistant">
                <div className="message-bubble">
                  I can help you with coding, writing, problem-solving, answering questions,
                  and much more. What would you like to explore today?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need in an AI assistant</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="capabilities-section">
        <div className="capabilities-content">
          <div className="capabilities-text">
            <h2>What Can ThagavalGPT Do?</h2>
            <p>
              Our AI assistant is designed to help you with a wide range of tasks,
              from simple questions to complex problem-solving.
            </p>
            <ul className="capabilities-list">
              {capabilities.map((capability, index) => (
                <li key={index}>
                  <FiCheckCircle className="check-icon" />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="capabilities-visual">
            <div className="floating-card card-1">
              <div className="card-icon">💡</div>
              <div className="card-text">Creative Solutions</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🚀</div>
              <div className="card-text">Boost Productivity</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🎯</div>
              <div className="card-text">Accurate Results</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users already benefiting from ThagavalGPT</p>
          <button className="cta-button primary large" onClick={handleGetStarted}>
            Start Chatting Now <FiArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <Logo size="small" showText={true} />
            <p>Your intelligent AI conversation partner</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#" onClick={() => navigate('/chat')}>Chat</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 ThagavalGPT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
