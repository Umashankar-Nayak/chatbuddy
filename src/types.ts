export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export type Mood = 'happy' | 'calm' | 'concerned' | 'loving';

export type Companion = {
  id: 'boyfriend' | 'girlfriend';
  name: string;
  avatar: string;
  mood: Mood;
  primaryColor: string;
  secondaryColor: string;
};

export type CompanionState = {
  companion: Companion;
  messages: Message[];
  isTyping: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  interests: string[];
  bio: string;
  createdAt: string;
  updatedAt: string;
};