import React from 'react';
import { UserProfile } from '../types';
import { User, Calendar, Users, Heart, FileText, Clock, Mail } from 'lucide-react';

interface UserProfileDisplayProps {
  profile: UserProfile;
}

export function UserProfileDisplay({ profile }: UserProfileDisplayProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Created {formatDate(profile.createdAt)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{profile.email}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{profile.age} years old</span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 capitalize">{profile.gender}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Interests</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {profile.bio && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Bio</span>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}