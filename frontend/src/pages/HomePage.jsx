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

  const handleNavClick = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownload = () => {
    // Create a simple download for a getting started guide
    const text = `ThagavalGPT - Getting Started Guide

Welcome to ThagavalGPT!

This is your AI-powered conversation partner.

Features:
- Lightning fast responses
- Code assistance
- Multi-language support
- Secure and private

To get started:
1. Sign up for a free account
2. Log in to access the chat
3. Start asking questions!

Visit: ${window.location.origin}
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ThagavalGPT-Guide.txt';
    a.click();
    URL.revokeObjectURL(url);
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
            <button onClick={() => handleNavClick('about')} className="nav-link">About</button>
            <button onClick={() => handleNavClick('features')} className="nav-link">Features</button>
            <button onClick={() => handleNavClick('learn')} className="nav-link">Learn</button>
            <button onClick={() => handleNavClick('business')} className="nav-link">Business</button>
            <button onClick={() => handleNavClick('pricing')} className="nav-link">Pricing</button>
            <button onClick={() => handleNavClick('images')} className="nav-link">Images</button>
            <button onClick={handleDownload} className="nav-link">Download</button>
          </nav>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
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
          </div>
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

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-content">
          <h2>About ThagavalGPT</h2>
          <p>
            ThagavalGPT is an advanced AI-powered conversation partner designed to help you with 
            a wide range of tasks. From answering questions to writing code, our intelligent 
            assistant is here to boost your productivity and creativity.
          </p>
          <p>
            Built with cutting-edge AI technology, ThagavalGPT provides fast, accurate, and 
            helpful responses to all your queries. Whether you're a student, professional, or 
            just curious, we're here to assist you 24/7.
          </p>
        </div>
      </section>

      {/* Learn Section */}
      <section id="learn" className="learn-section">
        <div className="section-content">
          <h2>Learn More About AI</h2>
          <div className="learn-grid">
            <div className="learn-card">
              <h3>📚 Getting Started</h3>
              <p>Learn how to use ThagavalGPT effectively with our comprehensive guides and tutorials.</p>
            </div>
            <div className="learn-card">
              <h3>💡 Best Practices</h3>
              <p>Discover tips and tricks to get the most out of your AI conversations.</p>
            </div>
            <div className="learn-card">
              <h3>🎓 Advanced Techniques</h3>
              <p>Master advanced prompting techniques for better results.</p>
            </div>
            <div className="learn-card">
              <h3>🔒 Safety & Privacy</h3>
              <p>Understand how we protect your data and ensure safe AI interactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="business" className="business-section">
        <div className="section-content">
          <h2>ThagavalGPT for Business</h2>
          <p>
            Empower your team with AI-powered productivity tools. ThagavalGPT helps businesses 
            automate tasks, generate content, and solve complex problems faster.
          </p>
          <div className="business-benefits">
            <div className="benefit-item">
              <FiZap size={24} />
              <h3>Boost Productivity</h3>
              <p>Automate repetitive tasks and focus on what matters</p>
            </div>
            <div className="benefit-item">
              <FiShield size={24} />
              <h3>Enterprise Security</h3>
              <p>Bank-level encryption and data protection</p>
            </div>
            <div className="benefit-item">
              <FiUsers size={24} />
              <h3>Team Collaboration</h3>
              <p>Share insights and work together seamlessly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-content">
          <h2>Simple, Transparent Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Free</h3>
              <div className="price">$0<span>/month</span></div>
              <ul>
                <li>✓ Basic AI responses</li>
                <li>✓ Limited messages per day</li>
                <li>✓ Community support</li>
              </ul>
              <button className="pricing-btn" onClick={handleGetStarted}>Get Started</button>
            </div>
            <div className="pricing-card featured">
              <div className="badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">$20<span>/month</span></div>
              <ul>
                <li>✓ Unlimited messages</li>
                <li>✓ Priority responses</li>
                <li>✓ Advanced features</li>
                <li>✓ Email support</li>
              </ul>
              <button className="pricing-btn primary" onClick={handleGetStarted}>Upgrade to Pro</button>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <div className="price">Custom</div>
              <ul>
                <li>✓ Everything in Pro</li>
                <li>✓ Custom integrations</li>
                <li>✓ Dedicated support</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <button className="pricing-btn" onClick={handleGetStarted}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Images Section */}
      <section id="images" className="images-section">
        <div className="section-content">
          <h2>AI Image Generation</h2>
          <p>
            Create stunning images with AI. Describe what you want, and our AI will generate 
            beautiful, unique images in seconds.
          </p>
          <div className="image-features">
            <div className="image-feature">
              <h3>🎨 Text to Image</h3>
              <p>Transform your ideas into visual art</p>
            </div>
            <div className="image-feature">
              <h3>⚡ Fast Generation</h3>
              <p>Get results in seconds, not hours</p>
            </div>
            <div className="image-feature">
              <h3>🎯 High Quality</h3>
              <p>Professional-grade images every time</p>
            </div>
          </div>
          <button className="cta-button primary" onClick={handleGetStarted}>
            Try Image Generation
          </button>
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
