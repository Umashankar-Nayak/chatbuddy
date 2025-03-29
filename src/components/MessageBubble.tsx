import React from 'react';
import { Message, Companion } from '../types';

interface MessageBubbleProps {
  message: Message;
  companion: Companion;
}

export function MessageBubble({ message, companion }: MessageBubbleProps) {
  const isAI = message.sender === 'ai';
  
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isAI
            ? 'bg-gray-100 text-gray-800'
            : 'text-white'
        }`}
        style={
          !isAI
            ? {
                background: `linear-gradient(to right, ${companion.primaryColor}, ${companion.secondaryColor})`
              }
            : {}
        }
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}