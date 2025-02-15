import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, X, Mail } from 'lucide-react';
import axios from 'axios';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'requests' | 'availability'>('requests');
  const [interviews, setInterviews] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedInterviewer, setSelectedInterviewer] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchInterviews();
    fetchAvailabilities();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://resume-review-backend.onrender.com/api/students', {
        headers: { Authorization: `Bearer ${token}` }
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
      const formattedData = response.data.map((teacher) => ({
        name: teacher.Name,
        email: teacher.Email,
        timeSlots: [
          new Date(teacher["Availability 1"]),
          new Date(teacher["Availability 2"]),
          new Date(teacher["Availability 3"]),
        ].filter(date => !isNaN(date.getTime()))
      }));
      setAvailabilities(formattedData);
    } catch (err) {
      setError('Failed to fetch interviewer availability');
    }
  };

  const assignInterviewer = async () => {
    if (!selectedInterview || !selectedInterviewer || !selectedDateTime) return;

    try {
      await axios.put(`https://resume-review-backend.onrender.com/api/student-assigned/${selectedInterview.id}`, {
        assigned_to: selectedInterviewer,
        // interviewDateTime: selectedDateTime,
        interview_scheduled_at: selectedDateTime,
      });

      setSuccessMessage(
        `Interviewer ${selectedInterviewer} assigned to ${selectedInterview.name} on ${new Date(selectedDateTime).toLocaleString()}`
      );

      setTimeout(() => setSuccessMessage(''), 3000);
      setSelectedInterview(null);
      fetchInterviews();
    } catch (err) {
      alert('Failed to assign interviewer');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-600 font-medium">Loading...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <div className="bg-white p-6 rounded-lg shadow-xl border border-red-100">
        <p className="text-red-500 font-medium flex items-center">
          <X className="w-5 h-5 mr-2" />
          {error}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {successMessage && (
          <div className="fixed bottom-5 left-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-6 px-8 text-sm font-medium transition-all duration-200 ease-in-out
                  ${activeTab === 'requests' 
                    ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50 bg-opacity-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Interview Requests</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`flex-1 py-6 px-8 text-sm font-medium transition-all duration-200 ease-in-out
                  ${activeTab === 'availability' 
                    ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50 bg-opacity-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Interviewer Availability</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'requests' ? (
              <InterviewRequests interviews={interviews} setSelectedInterview={setSelectedInterview} />
            ) : (
              <InterviewerAvailabilities availabilities={availabilities} />
            )}
          </div>
        </div>
      </div>

      {selectedInterview && (
        <InterviewAssignmentPopup
          selectedInterview={selectedInterview}
          setSelectedInterview={setSelectedInterview}
          selectedInterviewer={selectedInterviewer}
          setSelectedInterviewer={setSelectedInterviewer}
          selectedDateTime={selectedDateTime}
          setSelectedDateTime={setSelectedDateTime}
          availabilities={availabilities}
          assignInterviewer={assignInterviewer}
        />
      )}
    </div>
  );
}

function InterviewRequests({ interviews, setSelectedInterview }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview) => (
        <div 
          key={interview.id} 
          className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out border border-gray-100 hover:border-indigo-100"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{interview.name}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Mail className="h-3 w-3 mr-1" /> {interview.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                {interview.technology}
              </div>
            </div>
            <button 
              onClick={() => setSelectedInterview(interview)}
              className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Assign Interviewer</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function InterviewAssignmentPopup({
  selectedInterview,
  setSelectedInterview,
  selectedInterviewer,
  setSelectedInterviewer,
  selectedDateTime,
  setSelectedDateTime,
  availabilities,
  assignInterviewer
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Assign Interview
            </h2>
            <button 
              onClick={() => setSelectedInterview(null)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm text-indigo-700 font-medium">
                Assigning interview for
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedInterview.name}
              </p>
              <p className="text-sm text-gray-500">
                {selectedInterview.email}
              </p>
            </div>

            <div className="space-y-3">
              <select 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 appearance-none bg-white"
                value={selectedInterviewer}
                onChange={(e) => setSelectedInterviewer(e.target.value)}
              >
                <option value="">Select Interviewer</option>
                {availabilities.map(interviewer => (
                  <option key={interviewer.name} value={interviewer.name}>
                    {interviewer.name}
                  </option>
                ))}
              </select>

              {selectedInterviewer && (
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 appearance-none bg-white"
                  value={selectedDateTime}
                  onChange={(e) => setSelectedDateTime(e.target.value)}
                >
                  <option value="">Select Date & Time</option>
                  {availabilities
                    .find(i => i.name === selectedInterviewer)
                    ?.timeSlots.map((slot, idx) => (
                      <option key={idx} value={slot.toISOString()}>
                        {slot.toLocaleString()}
                      </option>
                    ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button 
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
              onClick={() => setSelectedInterview(null)}
            >
              Cancel
            </button>
            <button 
              className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2
                ${!selectedDateTime
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white'
                }`}
              onClick={assignInterviewer}
              disabled={!selectedDateTime}
            >
              <CheckCircle className="h-5 w-5" />
              <span>Assign</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InterviewerAvailabilities({ availabilities }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {availabilities.map((interviewer) => (
        <div 
          key={interviewer.name}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{interviewer.name}</h3>
              <p className="text-sm text-gray-500">{interviewer.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Available Time Slots:</p>
            <div className="space-y-2">
              {interviewer.timeSlots.map((slot, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2"
                >
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span>{slot.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
