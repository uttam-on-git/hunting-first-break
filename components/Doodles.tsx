
import React from 'react';

export const StarDoodle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
    <path className="animate-draw" d="M50 5 L63 38 L95 38 L69 59 L79 91 L50 71 L21 91 L31 59 L5 38 L37 38 Z" />
  </svg>
);

export const ArrowDoodle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
    <path className="animate-draw" d="M10 50 Q 50 10 90 50 M90 50 L70 35 M90 50 L70 65" />
  </svg>
);

export const SwirlDoodle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
    <path className="animate-draw" d="M50 50 C 70 20, 90 80, 50 80 C 10 80, 30 20, 50 20" />
  </svg>
);

export const OrbitDoodle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none">
    <g className="orbit-spin">
      <circle className="orbit-ring" cx="60" cy="60" r="36" stroke="currentColor" strokeWidth="2" />
      <circle className="orbit-ring orbit-ring-2" cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" />
      <circle className="orbit-dot" cx="96" cy="60" r="3" fill="currentColor" />
    </g>
  </svg>
);
