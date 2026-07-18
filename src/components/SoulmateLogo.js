import React from 'react';

export default function SoulmateLogo({ size = 36 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft elegant background glow */}
        <circle cx="50" cy="50" r="46" fill="url(#bgGlow)" stroke="url(#borderGrad)" strokeWidth="1.5" />
        
        {/* Intersecting Hearts representing connection */}
        <g transform="translate(18, 22) scale(0.95)">
          {/* Main Heart */}
          <path 
            d="M32 57.35L29.45 55.03C9.4 36.88 2 30.15 2 21.75C2 14.95 7.35 9.6 14.15 9.6C17.99 9.6 21.67 11.39 24.08 14.22L32 23.51L39.92 14.22C42.33 11.39 46.01 9.6 49.85 9.6C56.65 9.6 62 14.95 62 21.75C62 30.15 54.6 36.88 34.55 55.05L32 57.35Z" 
            fill="url(#heartGrad)" 
            filter="url(#shadow)"
          />
          {/* Inner spark heart */}
          <path 
            d="M20 30C20 22 25 18 30 22C35 18 40 22 40 30C40 36 30 42 30 42C30 42 20 36 20 30Z" 
            fill="#ffffff" 
            opacity="0.25"
          />
        </g>

        <defs>
          <filter id="shadow" x="-10" y="-10" width="84" height="84" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#ff4d8d" floodOpacity="0.3" />
          </filter>
          <linearGradient id="bgGlow" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(255, 77, 141, 0.08)" />
            <stop stopColor="rgba(168, 85, 247, 0.04)" />
          </linearGradient>
          <linearGradient id="borderGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff4d8d" stopOpacity="0.4" />
            <stop stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="heartGrad" x1="2" y1="9.6" x2="62" y2="57.35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff4d8d" />
            <stop stopColor="#ff758c" />
            <stop stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
