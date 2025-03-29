import React from 'react';
import { ChatWindow } from './components/ChatWindow';
import { CompanionState, UserProfile } from './types';
import { generateResponse } from './lib/gemini';
import { Heart, MessageCircle } from 'lucide-react';
import { UserProfileForm } from './components/UserProfileForm';
import { Navbar } from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';

function App() {
  const [hasSelected, setHasSelected] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [activeCompanion, setActiveCompanion] = React.useState<'boyfriend' | 'girlfriend'>('boyfriend');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setIsRegistered(true);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setIsRegistered(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const companions = {
    boyfriend: {
      id: 'boyfriend' as const,
      name: 'Allu',
      avatar: '/avatars/Allu.jpeg', // Use absolute path
      mood: 'loving' as const,
      primaryColor: '#4F46E5',
      secondaryColor: '#7C3AED',
      description: 'A caring and attentive companion who loves deep conversations and sharing moments together.'
    },
    girlfriend: {
      id: 'girlfriend' as const,
      name: 'Jenny',
      avatar: '/avatars/Jenny.jpeg', // Use absolute path
      mood: 'happy' as const,
      primaryColor: '#EC4899',
      secondaryColor: '#F472B6',
      description: 'A vibrant and empathetic soul who brings warmth and joy to every conversation.'
    }
  };
  
  

  const [state, setState] = React.useState<CompanionState>({
    companion: companions[activeCompanion],
    messages: [],
    isTyping: false
  });

  const handleSendMessage = async (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isTyping: true
    }));

    try {
      const messageHistory = state.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        parts: msg.content
      }));
      
      messageHistory.push({
        role: 'user',
        parts: content
      });

      const response = await generateResponse(
        messageHistory,
        state.companion.id,
        state.companion.name
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'ai',
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isTyping: false,
        companion: {
          ...prev.companion,
          mood: response.mood as any
        }
      }));
    } catch (error) {
      console.error('Error generating response:', error);
      setState(prev => ({
        ...prev,
        isTyping: false
      }));
    }
  };

  const handleProfileSubmit = (profile: UserProfile) => {
    setIsLoggedIn(true);
    setIsRegistered(true);
    setHasSelected(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsRegistered(false);
    setHasSelected(false);
    setState({
      companion: companions[activeCompanion],
      messages: [],
      isTyping: false
    });
  };

  const handleLogin = () => {
    setHasSelected(true);
    setIsRegistered(false);
  };

  const handleHome = () => {
    setHasSelected(false);
    setState({
      companion: companions[activeCompanion],
      messages: [],
      isTyping: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
        onLogin={handleLogin}
        onHome={handleHome}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!hasSelected && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your AI Companion</h1>
              <p className="text-lg text-gray-600">Select who you'd like to chat with today</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(companions).map(([id, companion]) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveCompanion(id as 'boyfriend' | 'girlfriend');
                    setState(prev => ({ 
                      companion: companion,
                      messages: [],
                      isTyping: false
                    }));
                    setHasSelected(true);
                  }}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left"
                >
                  <div className="absolute inset-0 rounded-2xl transition-colors duration-300"
                    style={{
                      background: `linear-gradient(45deg, ${companion.primaryColor}11, ${companion.secondaryColor}11)`,
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={companion.avatar}
                        alt={companion.name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white"
                      />
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900">{companion.name}</h2>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Heart className="w-4 h-4" style={{ color: companion.primaryColor }} />
                          <span>AI Companion</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{companion.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm font-medium"
                      style={{ color: companion.primaryColor }}>
                      <MessageCircle className="w-5 h-5" />
                      Start Chatting
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {!isRegistered && hasSelected && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl">
            <UserProfileForm onSubmit={handleProfileSubmit} />
          </div>
        )}

        {isRegistered && hasSelected && (
          <div>
            <div className="flex justify-center space-x-4 mb-6">
              {Object.entries(companions).map(([id, companion]) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveCompanion(id as 'boyfriend' | 'girlfriend');
                    setState(prev => ({ 
                      companion: companion,
                      messages: [],
                      isTyping: false
                    }));
                  }}
                  className={`px-6 py-3 rounded-full transition-colors flex items-center gap-2 ${
                    activeCompanion === id
                      ? 'text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  style={
                    activeCompanion === id
                      ? { background: `linear-gradient(to right, ${companion.primaryColor}, ${companion.secondaryColor})` }
                      : {}
                  }
                >
                  <img
                    src={companion.avatar}
                    alt={companion.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  Chat with {companion.name}
                </button>
              ))}
            </div>

            <ChatWindow
              state={state}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
