import React from 'react';

const Logo = ({ size = 'medium', showText = true }) => {
  const sizes = {
    small: { width: 32, height: 32, fontSize: '14px' },
    medium: { width: 48, height: 48, fontSize: '20px' },
    large: { width: 64, height: 64, fontSize: '28px' }
  };

  const style = sizes[size] || sizes.medium;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg 
        width={style.width} 
        height={style.height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        
        {/* Outer circle */}
        <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
        
        {/* Chat bubble shape */}
        <path 
          d="M30 35 C30 30 32 27 37 27 L63 27 C68 27 70 30 70 35 L70 55 C70 60 68 63 63 63 L45 63 L35 70 L35 63 C32 63 30 60 30 55 Z" 
          fill="white"
        />
        
        {/* AI sparkle */}
        <circle cx="43" cy="43" r="3" fill="url(#logoGradient)" />
        <circle cx="57" cy="43" r="3" fill="url(#logoGradient)" />
        <path 
          d="M45 52 Q50 55 55 52" 
          stroke="url(#logoGradient)" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
        />
      </svg>
      
      {showText && (
        <span style={{ 
          fontSize: style.fontSize, 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ThagavalGPT
        </span>
      )}
    </div>
  );
};

export default Logo;
