import React from 'react';
import { Person } from '../types';

interface AvatarProps {
  person: Person;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ person, size = 'md', selected = false, onClick }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-full flex items-center justify-center font-bold text-white transition-all transform shadow-sm
        ${person.color} 
        ${sizeClasses[size]}
        ${selected ? 'ring-4 ring-offset-2 ring-indigo-600 scale-110' : 'opacity-90 hover:opacity-100'}
      `}
      aria-label={`Select ${person.name}`}
      title={person.name}
    >
      {person.initials}
    </button>
  );
};

export default Avatar;