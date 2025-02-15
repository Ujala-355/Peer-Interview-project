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
      console.log('Fetched Interviews:', response.data);
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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
                    <div className="flex flex-col sm:flex-row sm:space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created: {formatDateTime(interview.created_at)}
                      </span>
                      {interview.interviewdatetime && (
                        <span className="flex items-center mt-1 sm:mt-0">
                          <Clock className="h-4 w-4 mr-1" />
                          Scheduled: {formatDateTime(interview.interviewdatetime)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${interview.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : interview.status === 'confirmed'
                      ? 'bg-blue-100 text-green-800'
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
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-700">Profile</p>
                <p className="text-gray-600">{selectedInterview.technology.toUpperCase()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Name</p>
                <p className="text-gray-600">{selectedInterview.name}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Email</p>
                <p className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" /> {selectedInterview.email}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Created At</p>
                <p className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDateTime(selectedInterview.created_at)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Scheduled For</p>
                <p className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {selectedInterview.interview_scheduled_at
                    ? `Confirmed with ${selectedInterview.assigned_to} on ${formatDateTime(selectedInterview.interview_scheduled_at)}`
                    : 'Not scheduled yet'}
                </p>
              </div>
            </div>
            <button
              className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              onClick={() => setSelectedInterview(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
