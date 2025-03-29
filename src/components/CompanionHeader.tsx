import React from 'react';
import { Heart } from 'lucide-react';
import { Companion } from '../types';

interface CompanionHeaderProps {
  companion: Companion;
}

export function CompanionHeader({ companion }: CompanionHeaderProps) {
  return (
    <div 
      className="p-4 flex items-center space-x-4"
      style={{ 
        background: `linear-gradient(to right, ${companion.primaryColor}, ${companion.secondaryColor})`
      }}
    >
      <div className="relative">
        <img
          src={companion.avatar}
          alt={companion.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
        />
        <div className="absolute bottom-0 right-0">
          <Heart 
            className="w-4 h-4 text-white fill-current" 
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
          />
        </div>
      </div>
      
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-white">{companion.name}</h2>
        <p className="text-sm text-white/80">
          Feeling {companion.mood} 
          <span className="ml-2">
            {companion.mood === 'happy' && '😊'}
            {companion.mood === 'calm' && '😌'}
            {companion.mood === 'concerned' && '🤔'}
            {companion.mood === 'loving' && '🥰'}
          </span>
        </p>
      </div>
    </div>
  );
}