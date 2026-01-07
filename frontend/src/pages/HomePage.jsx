import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiCode, FiGlobe, FiShield, FiTrendingUp, FiUsers, FiArrowRight, FiCheckCircle, FiSend, FiCpu, FiLayers, FiActivity } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Logo from '../components/Logo';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // AI Demo State
  const [demoInput, setDemoInput] = useState('');
  const [demoMessages, setDemoMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  
  // Statistics Counter
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    accuracy: 0,
    uptime: 0
  });
  
  // Selected AI Model
  const [selectedModel, setSelectedModel] = useState('gemini');

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
    const text = `ThagavalGPT - Getting Started Guide

Welcome to ThagavalGPT!

Features:
- Lightning fast responses
- Code assistance
- Multi-language support
- Secure and private

Visit: ${window.location.origin}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ThagavalGPT-Guide.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Handle AI Demo
  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!demoInput.trim()) return;
    
    const userMessage = { role: 'user', content: demoInput };
    setDemoMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setDemoInput('');
    
    setTimeout(() => {
      let response = demoResponses.default;
      const input = demoInput.toLowerCase();
      
      if (input.includes('quantum')) response = demoResponses.quantum;
      else if (input.includes('python') || input.includes('code')) response = demoResponses.python;
      else if (input.includes('marketing')) response = demoResponses.marketing;
      
      typeResponse(response);
    }, 500);
  };
  
  const typeResponse = (text) => {
    let index = 0;
    setTypedText('');
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setTypedText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setDemoMessages(prev => [...prev, { role: 'assistant', content: text }]);
        setTypedText('');
      }
    }, 20);
  };
  
  useEffect(() => {
    const targetStats = { users: 50000, messages: 1000000, accuracy: 98, uptime: 99.9 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        users: Math.floor(targetStats.users * progress),
        messages: Math.floor(targetStats.messages * progress),
        accuracy: Math.floor(targetStats.accuracy * progress),
        uptime: (targetStats.uptime * progress).toFixed(1)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrompt(prev => (prev + 1) % examplePrompts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  
  const useExamplePrompt = (text) => setDemoInput(text);

  const features = [
    { icon: <FiZap size={32} />, title: 'Lightning Fast', description: 'Get instant responses powered by advanced AI models' },
    { icon: <FiCode size={32} />, title: 'Code Assistant', description: 'Write, debug, and optimize code in multiple languages' },
    { icon: <FiGlobe size={32} />, title: 'Multilingual', description: 'Communicate in multiple languages with ease' },
    { icon: <FiShield size={32} />, title: 'Secure & Private', description: 'Your conversations are encrypted and secure' },
    { icon: <FiTrendingUp size={32} />, title: 'Continuous Learning', description: 'Always improving with the latest AI capabilities' },
    { icon: <FiUsers size={32} />, title: 'User Friendly', description: 'Intuitive interface designed for everyone' }
  ];

  const capabilities = [
    'Answer questions with detailed explanations',
    'Write and review code',
    'Create content and stories',
    'Translate between languages',
    'Solve complex problems',
    'Provide creative ideas'
  ];
  
  const aiModels = [
    { name: 'Gemini Pro', id: 'gemini', icon: <FiCpu />, speed: '⚡ Ultra Fast', accuracy: '98%', description: 'Google\'s most capable AI model' },
    { name: 'Groq LLaMA', id: 'groq', icon: <FiLayers />, speed: '🚀 Lightning', accuracy: '96%', description: 'Fastest inference with exceptional performance' },
    { name: 'GPT-4', id: 'gpt4', icon: <FiActivity />, speed: '⚡ Fast', accuracy: '99%', description: 'Most advanced reasoning and problem-solving' }
  ];
  
  const examplePrompts = [
    { text: 'Explain quantum computing simply', category: 'Education' },
    { text: 'Write a Python function to sort an array', category: 'Code' },
    { text: 'Create a marketing tagline for eco products', category: 'Creative' },
    { text: 'Translate Hello to Spanish', category: 'Language' }
  ];
  
  const demoResponses = {
    quantum: 'Quantum computing uses quantum mechanics to process information faster than classical computers!',
    python: 'Here\'s a Python sort function:\n\n```python\ndef sort_array(arr):\n    return sorted(arr)\n```',
    marketing: 'Green Today, Sustainable Tomorrow - Nature\'s Choice, Your Voice!',
    default: 'I\'m ThagavalGPT, your AI assistant! Ask me anything!'
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="header-logo"><Logo size="small" showText={true} /></div>
          <nav className="header-nav">
            <button onClick={() => handleNavClick('features')} className="nav-link">Features</button>
            <button onClick={() => handleNavClick('about')} className="nav-link">About</button>
            <button onClick={() => handleNavClick('pricing')} className="nav-link">Pricing</button>
            <button onClick={handleDownload} className="nav-link">Download</button>
          </nav>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>{theme === 'light' ? '' : ''}</button>
            {user ? (
              <button className="nav-btn primary" onClick={() => navigate('/chat')}>Go to Chat</button>
            ) : (
              <>
                <button className="nav-btn" onClick={() => navigate('/login')}>Log in</button>
                <button className="nav-btn primary" onClick={() => navigate('/register')}>Sign up</button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your AI-Powered<br /><span className="gradient-text">Conversation Partner</span></h1>
          <p className="hero-description">Experience the power of advanced AI with ThagavalGPT</p>
          <div className="hero-actions">
            <button className="cta-button primary" onClick={handleGetStarted}>Get Started <FiArrowRight /></button>
          </div>
        </div>
      </section>

      <section className="ai-demo-section">
        <div className="section-header">
          <h2>Try AI Now - No Sign-up Required</h2>
          <p>Experience the power of AI instantly</p>
        </div>
        <div className="demo-container">
          <div className="demo-chat">
            <div className="demo-messages">
              {demoMessages.length === 0 ? (
                <div className="demo-welcome">
                  <div className="welcome-icon"></div>
                  <h3>Hi! I'm ThagavalGPT</h3>
                  <p>Ask me anything or try these examples:</p>
                  <div className="example-chips">
                    {examplePrompts.map((prompt, idx) => (
                      <button key={idx} className="example-chip" onClick={() => useExamplePrompt(prompt.text)}>
                        <span className="chip-category">{prompt.category}</span>{prompt.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {demoMessages.map((msg, idx) => (
                    <div key={idx} className={`demo-message ${msg.role}`}>
                      <div className="message-content">{msg.content}</div>
                    </div>
                  ))}
                  {isTyping && typedText && (
                    <div className="demo-message assistant typing">
                      <div className="message-content">{typedText}<span className="cursor">|</span></div>
                    </div>
                  )}
                </>
              )}
            </div>
            <form className="demo-input" onSubmit={handleDemoSubmit}>
              <input type="text" value={demoInput} onChange={(e) => setDemoInput(e.target.value)} placeholder="Ask me anything..." disabled={isTyping} />
              <button type="submit" disabled={isTyping || !demoInput.trim()}><FiSend /></button>
            </form>
          </div>
          <div className="demo-info">
            <div className="rotating-prompt">
              <div className="prompt-label">Try asking:</div>
              <div className="prompt-text">{examplePrompts[currentPrompt].text}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="models-section">
        <div className="section-header">
          <h2>Powered by Multiple AI Models</h2>
          <p>Choose the best model for your needs</p>
        </div>
        <div className="models-grid">
          {aiModels.map((model, idx) => (
            <div key={idx} className={`model-card ${selectedModel === model.id ? 'active' : ''}`} onClick={() => setSelectedModel(model.id)}>
              <div className="model-icon">{model.icon}</div>
              <h3>{model.name}</h3>
              <div className="model-stats">
                <span className="stat-badge">{model.speed}</span>
                <span className="stat-badge">{model.accuracy} Accurate</span>
              </div>
              <p>{model.description}</p>
              {selectedModel === model.id && <div className="active-indicator"> Currently Selected</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-number">{stats.users.toLocaleString()}+</div><div className="stat-label">Active Users</div></div>
          <div className="stat-card"><div className="stat-number">{stats.messages.toLocaleString()}+</div><div className="stat-label">Messages Processed</div></div>
          <div className="stat-card"><div className="stat-number">{stats.accuracy}%</div><div className="stat-label">Accuracy Rate</div></div>
          <div className="stat-card"><div className="stat-number">{stats.uptime}%</div><div className="stat-label">Uptime</div></div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-header"><h2>Powerful Features</h2><p>Everything you need in an AI assistant</p></div>
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

      <section id="about" className="about-section">
        <div className="section-content">
          <h2>About ThagavalGPT</h2>
          <p>ThagavalGPT is an advanced AI-powered conversation partner designed to help you with a wide range of tasks.</p>
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <div className="section-content">
          <h2>Simple, Transparent Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Free</h3>
              <div className="price">$0<span>/month</span></div>
              <ul><li>✓ Basic AI responses</li><li>✓ Limited messages</li></ul>
              <button className="pricing-btn" onClick={handleGetStarted}>Get Started</button>
            </div>
            <div className="pricing-card featured">
              <div className="badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">$20<span>/month</span></div>
              <ul><li>✓ Unlimited messages</li><li>✓ Priority responses</li></ul>
              <button className="pricing-btn primary" onClick={handleGetStarted}>Upgrade</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section"><Logo size="small" showText={true} /><p>Your intelligent AI partner</p></div>
          <div className="footer-links">
            <div className="footer-column"><h4>Product</h4><a href="#features">Features</a></div>
            <div className="footer-column"><h4>Company</h4><a href="#">About</a></div>
          </div>
        </div>
        <div className="footer-bottom"><p>© 2026 ThagavalGPT. All rights reserved.</p></div>
      </footer>
    </div>
  );
};

export default HomePage;
