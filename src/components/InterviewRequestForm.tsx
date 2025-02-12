import React, { useState } from 'react';
import { Profile } from '../types';

interface FormData {
  name: string;
  email: string;
  technology: Profile;
  interviewDateTime: string;
}

export function InterviewRequestForm() {
  const [profile, setProfile] = useState<Profile>('Frontend');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    technology: 'Frontend', // Capitalized
    interviewDateTime: ''
  });

  // Capitalized to match the backend expectations
  const profiles: Profile[] = ['Android', 'Backend', 'Frontend', 'Fullstack'];

  const handleProfileSelect = (selectedProfile: Profile) => {
    setProfile(selectedProfile);
    setFormData(prev => ({ ...prev, technology: selectedProfile }));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://resume-review-backend.onrender.com/api/students-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'pending'
        }),
      });

      if (response.ok) {
        alert('Interview request submitted successfully!');
        setShowForm(false);
        setFormData({
          name: '',
          email: '',
          technology: 'Frontend', // Reset with capitalized value
          interviewDateTime: ''
        });
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      alert('Error submitting interview request. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-xl shadow-lg">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Request an Interview
          </h2>
          {!showForm ? (
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Your Profile
                </label> 
                <select
                  value={profile}
                  onChange={(e) => handleProfileSelect(e.target.value as Profile)}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 appearance-none bg-white"
                >
                  {profiles.map((p) => (
                    <option key={p} value={p}>
                      {p} Developer
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleProfileSelect(profile)}
                className="w-full py-3 px-6 text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 animate-fadeIn">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Complete Your Request</h3>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Technology
                      </label>
                      <select
                        value={formData.technology}
                        onChange={(e) => setFormData(prev => ({ ...prev, technology: e.target.value as Profile }))}
                        className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                      >
                        {profiles.map((p) => (
                          <option key={p} value={p}>
                            {p} Developer
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Interview Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formData.interviewDateTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, interviewDateTime: e.target.value }))}
                        min={new Date().toISOString().slice(0, 16)}
                        className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-6 text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Submit Interview Request
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}