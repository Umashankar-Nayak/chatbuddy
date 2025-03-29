import React from 'react';
import { MessageSquare } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
  onHome: () => void;
}

export function Navbar({ isLoggedIn, onLogout, onLogin, onHome }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <button 
            onClick={onHome}
            className="flex-shrink-0 flex items-center group hover:opacity-80 transition-opacity cursor-pointer"
          >
            <MessageSquare className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">ChatAI</span>
          </button>
          <div>
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}