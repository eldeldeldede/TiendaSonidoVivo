import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

// Átomo: Etiqueta pequeña para mostrar categorías, estados o roles
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  return (
    <span className={`badge bg-${variant} ${className}`}>
      {children}
    </span>
  );
};