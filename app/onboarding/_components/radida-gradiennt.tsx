import React from 'react';

interface RadialGradientProps {
  color?: string;
  opacity?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size?: 'small' | 'medium' | 'large';
}

export default function RadialGradient({ 
  color = '#2563EB', 
  opacity = 0.15,
  position = 'top-right',
  size = 'large'
}: RadialGradientProps) {
  const positions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  const sizes = {
    'small': 'w-32 h-32',
    'medium': 'w-48 h-48',
    'large': 'w-64 h-64'
  };

  return (
    <div 
      className={`absolute ${positions[position]} ${sizes[size]} pointer-events-none`}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: opacity
      }}
    />
  );
}