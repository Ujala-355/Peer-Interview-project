import React, { useState } from 'react';
import { MessageSquare, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { InterviewFeedback } from '../types';

interface FeedbackFormProps {
  interviewId: string;
  onSubmit: (feedback: InterviewFeedback) => void;
}

export function FeedbackForm({ interviewId, onSubmit }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState<Partial<InterviewFeedback>>({
    interviewId,
    technicalScore: 0,
    communicationScore: 0,
    problemSolvingScore: 0,
    overallScore: 0,
    strengths: [],
    areasOfImprovement: [],
    generalComments: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback as InterviewFeedback);
  };

  const renderScoreInput = (
    label: string,
    field: keyof Pick<InterviewFeedback, 'technicalScore' | 'communicationScore' | 'problemSolvingScore' | 'overallScore'>
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => setFeedback({ ...feedback, [field]: score })}
            className={`p-2 rounded-full ${
              feedback[field] >= score
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className="h-6 w-6" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <MessageSquare className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Interview Feedback</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderScoreInput('Technical Skills', 'technicalScore')}
        {renderScoreInput('Communication Skills', 'communicationScore')}
        {renderScoreInput('Problem Solving', 'problemSolvingScore')}
        {renderScoreInput('Overall Performance', 'overallScore')}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <ThumbsUp className="h-4 w-4 inline mr-2" />
            Strengths
          </label>
          <textarea
            value={feedback.strengths?.join('\n')}
            onChange={(e) =>
              setFeedback({
                ...feedback,
                strengths: e.target.value.split('\n').filter(Boolean),
              })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="List the candidate's strengths..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <ThumbsDown className="h-4 w-4 inline mr-2" />
            Areas for Improvement
          </label>
          <textarea
            value={feedback.areasOfImprovement?.join('\n')}
            onChange={(e) =>
              setFeedback({
                ...feedback,
                areasOfImprovement: e.target.value.split('\n').filter(Boolean),
              })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="List areas that need improvement..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            General Comments
          </label>
          <textarea
            value={feedback.generalComments}
            onChange={(e) =>
              setFeedback({ ...feedback, generalComments: e.target.value })
            }
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Provide detailed feedback and suggestions..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}