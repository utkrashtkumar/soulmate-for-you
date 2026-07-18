import React from 'react';

export default function SoulmateLogo({ size = 36 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Robust Brand Gradient Heart */}
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#ff4d8d"
        />
        {/* Subtle white accent overlay for depth */}
        <path
          d="M12 18.5l-0.8-0.7c-2.8-2.5-4.7-4.2-4.7-6.3 0-1.7 1.3-3 3-3 .9 0 1.9.4 2.5 1.1.6-.7 1.6-1.1 2.5-1.1 1.7 0 3 1.3 3 3 0 2.1-1.9 3.8-4.7 6.3l-0.8.7z"
          fill="#ffffff"
          opacity="0.22"
        />
      </svg>
    </div>
  );
}
