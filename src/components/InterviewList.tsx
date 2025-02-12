import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, X, CheckCircle } from 'lucide-react';
import { InterviewRequest, StudentDetails } from '../types';
import axios from 'axios';

export function InterviewList() {
  const [interviews, setInterviews] = useState<InterviewRequest[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get('https://resume-review-backend.onrender.com/api/students');
      setInterviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch interviews');
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (id: string) => {
    try {
      const response = await axios.get(`https://resume-review-backend.onrender.com/api/student/${id}`);
      setSelectedInterview(response.data);
    } catch (err) {
      setError('Failed to fetch student details');
    }
  };

  if (loading) return <div className="text-center p-4 text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4 font-medium">{error}</div>;

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5">
          <h2 className="text-lg font-bold text-white">Interview Requests</h2>
        </div>
        <ul className="divide-y divide-gray-300">
          {interviews.map((interview) => (
            <li 
              key={interview.id} 
              className="p-4 hover:bg-gray-100 cursor-pointer transition-all duration-200"
              onClick={() => fetchStudentDetails(interview.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {interview.name} - {interview.technology.toUpperCase()}
                    </p>
                    <div className="flex space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(interview.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(interview.interviewDateTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  interview.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : interview.status === 'assigned'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {interview.status.toUpperCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedInterview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button 
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedInterview(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-indigo-700">Interview Details</h2>
            <p className="font-semibold">Profile</p>
            <p className="text-gray-700">{selectedInterview.technology.toUpperCase()}</p>
            <p className="font-semibold mt-2">Name</p>
            <p className="text-gray-700">{selectedInterview.name}</p>
            <p className="font-semibold mt-2">Email</p>
            <p className="flex items-center text-gray-700"><Mail className="h-4 w-4 mr-2" /> {selectedInterview.email}</p>
            <p className="font-semibold mt-2">Scheduled For</p>
            <p className="text-gray-700">
              {selectedInterview.interviewDateTime 
                ? new Date(selectedInterview.interviewDateTime).toLocaleString() 
                : selectedInterview.status === 'assigned' 
                  ? 'Assigned' 
                  : 'Not scheduled yet'}
            </p>
            {selectedInterview.assignedInterviewer && (
              <div className="mt-4 flex items-center bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-700 mr-2" />
                <p className="text-green-700 font-medium">Assigned to: {selectedInterview.assignedInterviewer}</p>
              </div>
            )}
            <button 
              className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              onClick={() => setSelectedInterview(null)}
            >Close</button>
          </div>
        </div>
      )}
    </>
  );
}