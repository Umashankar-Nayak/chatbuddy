import React from 'react';
import { Heart, Send, Smile } from 'lucide-react';
import { Message, CompanionState } from '../types';
import { MessageBubble } from './MessageBubble';
import { CompanionHeader } from './CompanionHeader';

interface ChatWindowProps {
  state: CompanionState;
  onSendMessage: (message: string) => void;
}

export function ChatWindow({ state, onSendMessage }: ChatWindowProps) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const quickReplies = [
    "How are you feeling?",
    "Tell me about your day",
    "I miss you",
    "What should we do today?"
  ];

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
      <CompanionHeader companion={state.companion} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            companion={state.companion}
          />
        ))}
        {state.isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => onSendMessage(reply)}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Smile className="w-6 h-6" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            className="p-2 text-white rounded-full"
            style={{ backgroundColor: state.companion.primaryColor }}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}