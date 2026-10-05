import React from 'react';

interface LogoIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  theme?: 'light' | 'dark' | 'monochrome';
}

export const LogoIcon: React.FC<LogoIconProps> = ({ 
  size = 'md', 
  className = '',
  theme = 'dark'
}) => {
  let dimension = 36;
  if (typeof size === 'number') {
    dimension = size;
  } else if (size === 'sm') {
    dimension = 24;
  } else if (size === 'md') {
    dimension = 36;
  } else if (size === 'lg') {
    dimension = 48;
  } else if (size === 'xl') {
    dimension = 64;
  }

  const isMonochrome = theme === 'monochrome';
  const pinFill = isMonochrome ? '#334155' : 'url(#returnhome-grad-primary)';
  const bridgeStroke = isMonochrome ? '#0F172A' : '#06B6D4';
  const nodeFill = isMonochrome ? '#0F172A' : '#38BDF8';

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-200 ${className}`}
      aria-label="ReturnHome Logo Icon"
    >
      <defs>
        <linearGradient id="returnhome-grad-primary" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>

        <filter id="returnhome-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0284C7" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer Pin / House Base */}
      <path
        d="M50 8C31.2 8 16 23.2 16 42C16 63 42 88 48 93.5C49.2 94.6 50.8 94.6 52 93.5C58 88 84 63 84 42C84 23.2 68.8 8 50 8Z"
        fill={pinFill}
        filter={theme === 'dark' ? "url(#returnhome-glow)" : undefined}
        opacity={isMonochrome ? 0.95 : 1}
      />

      {/* House Roof / Reconnecting Arc */}
      <path
        d="M32 44L50 28L68 44"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Magnifying Glass Inner Lens */}
      <circle
        cx="50"
        cy="48"
        r="14"
        stroke="#FFFFFF"
        strokeWidth="4"
        fill="none"
      />

      {/* Reconnection Heart/Node */}
      <circle
        cx="50"
        cy="48"
        r="4"
        fill={nodeFill}
      />
    </svg>
  );
};

export default LogoIcon;
