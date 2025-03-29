import React from 'react';
import { UserProfile } from '../types';
import { User, Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

export function UserProfileForm({ onSubmit }: UserProfileFormProps) {
  const [isLogin, setIsLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No user data returned');

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        const profile: UserProfile = {
          id: authData.user.id,
          name: profileData.username || authData.user.email?.split('@')[0] || '',
          email: authData.user.email!,
          password: formData.password,
          age: profileData.age || 0,
          gender: profileData.gender || '',
          interests: profileData.interests || [],
          bio: profileData.bio || '',
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
        };

        toast.success('Successfully logged in!');
        onSubmit(profile);
      } else {
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
            },
          },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No user data returned');

        // Profile is automatically created by the database trigger
        const profile: UserProfile = {
          id: authData.user.id,
          name: formData.username,
          email: formData.email,
          password: formData.password,
          age: 0,
          gender: '',
          interests: [],
          bio: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        toast.success('Registration successful! You can now log in.');
        onSubmit(profile);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-sm mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {isLogin ? 'Login to continue chatting' : 'Join to start chatting'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <User className="w-4 h-4" />
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="Enter username"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder={isLogin ? "Enter password" : "Create password"}
            minLength={6}
          />
          {!isLogin && (
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ username: '', email: '', password: '' });
            }}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}