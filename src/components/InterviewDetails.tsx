import React from 'react';
import { Calendar, Clock, User, Video, MessageSquare, Award } from 'lucide-react';
import { InterviewRequest } from '../types';

interface InterviewDetailsProps {
  interview: InterviewRequest;
  onClose: () => void;
}

export function InterviewDetails({ interview, onClose }: InterviewDetailsProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Interview Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="space-y-6">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Profile</p>
                <p className="text-sm text-gray-500">{interview.profile.toUpperCase()}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Scheduled For</p>
                <p className="text-sm text-gray-500">
                  {interview.scheduledFor 
                    ? new Date(interview.scheduledFor).toLocaleString()
                    : 'Not scheduled yet'}
                </p>
              </div>
            </div>

            {interview.meetingLink && (
              <div className="flex items-center">
                <Video className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Meeting Link</p>
                  <a 
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Join Meeting
                  </a>
                </div>
              </div>
            )}

            {interview.status === 'completed' && (
              <>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Score</p>
                    <p className="text-sm text-gray-500">{interview.score}/10</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Feedback</p>
                    <p className="text-sm text-gray-500 mt-1">{interview.feedback}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}