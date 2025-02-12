import React, { useState } from 'react';
import { User, FileText, Upload, Save } from 'lucide-react';
import type { User as UserType } from '../types';

interface StudentProfileProps {
  user: UserType;
  onUpdate: (user: UserType) => void;
}

export function StudentProfile({ user, onUpdate }: StudentProfileProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    about: user.about || '',
    skills: user.skills?.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...user,
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Student Profile</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {editing ? <Save className="h-4 w-4" /> : 'Edit Profile'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-gray-400" />
            )}
          </div>
          <div className="ml-6">
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            ) : (
              <h3 className="text-xl font-medium text-gray-900">{user.name}</h3>
            )}
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">About</label>
              <textarea
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Resume</label>
              <div className="mt-1 flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume
                </button>
                {user.resume && (
                  <a
                    href={user.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <FileText className="h-4 w-4 inline mr-1" />
                    View Current Resume
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">About</h4>
              <p className="mt-1 text-sm text-gray-500">{user.about || 'No description provided'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Skills</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {user.resume && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Resume</h4>
                <a
                  href={user.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Resume
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}