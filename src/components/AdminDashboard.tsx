import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, X } from 'lucide-react';
import { InterviewRequest, InterviewerAvailability } from '../types';
import axios from 'axios';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'requests' | 'availability'>('requests');
  const [interviews, setInterviews] = useState<InterviewRequest[]>([]);
  const [availabilities, setAvailabilities] = useState<InterviewerAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInterview, setSelectedInterview] = useState<InterviewRequest | null>(null);
  const [selectedInterviewer, setSelectedInterviewer] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchInterviews();
    fetchAvailabilities();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://resume-review-backend.onrender.com/api/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setInterviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch interviews');
      setLoading(false);
    }
  };

  const fetchAvailabilities = async () => {
    try {
      const response = await axios.get('https://resume-review-backend.onrender.com/api/teachers');
      const formattedData = response.data.map((teacher: any) => ({
        profile: teacher.Name,
        email: teacher.Email,
        timeSlots: [teacher.slot1, teacher.slot2, teacher.slot3].filter(Boolean),
      }));
      setAvailabilities(formattedData);
    } catch (err) {
      setError('Failed to fetch interviewer availability');
    }
  };

  const assignInterviewer = async () => {
    if (!selectedInterview || !selectedInterviewer) return;
    try {
      await axios.put(`https://resume-review-backend.onrender.com/api/student-assigned/${selectedInterview.id}`, {
        assigned_to: selectedInterviewer,
      });
      setSuccessMessage(`Interviewer ${selectedInterviewer} assigned to ${selectedInterview.name}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setSelectedInterview(null);
      fetchInterviews();
    } catch (err) {
      alert('Failed to assign interviewer');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {successMessage && (
        <div className="fixed bottom-5 left-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'requests'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Interview Requests
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'availability'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Interviewer Availability
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'requests' ? (
          <InterviewRequests interviews={interviews} setSelectedInterview={setSelectedInterview} />
        ) : (
          <InterviewerAvailabilities availabilities={availabilities} />
        )}
      </div>

      {selectedInterview && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Assign Interviewer for {selectedInterview.name}</h2>
              <button onClick={() => setSelectedInterview(null)} className="text-gray-500 hover:text-red-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <select
              className="mt-3 p-2 border rounded w-full"
              value={selectedInterviewer}
              onChange={(e) => setSelectedInterviewer(e.target.value)}
            >
              <option value="">Select Interviewer</option>
              {availabilities.map((interviewer) => (
                <option key={interviewer.profile} value={interviewer.profile}>
                  {interviewer.profile}
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setSelectedInterview(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={assignInterviewer}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InterviewRequests({ interviews, setSelectedInterview }: { interviews: InterviewRequest[], setSelectedInterview: any }) {
  return (
    <div className="space-y-6">
      {interviews.map((interview) => (
        <div key={interview.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {interview.name} - {interview.technology?.toUpperCase() || 'N/A'}
                </p>
                <div className="flex space-x-4 mt-1">
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(interview.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(interview.interviewDateTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedInterview(interview)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Assign Interviewer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
function InterviewerAvailabilities({ availabilities }: { availabilities: InterviewerAvailability[] }) {
  return (
    <div className="space-y-6">
      {availabilities.map((availability) => (
        <div key={availability.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {availability.profile ? availability.profile.toUpperCase() : 'N/A'} Interviewer
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(availability.date).toLocaleDateString()}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {availability.timeSlots?.map((slot) => (
                  <span
                    key={slot}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}