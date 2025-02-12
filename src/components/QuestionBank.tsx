import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type { InterviewQuestion, Profile } from '../types';

const mockQuestions: Record<Profile, InterviewQuestion[]> = {
  frontend: [
    {
      id: '1',
      question: 'Explain the difference between let, const, and var in JavaScript.',
      difficulty: 'easy',
      category: 'JavaScript Fundamentals',
    },
    {
      id: '2',
      question: 'What is the virtual DOM in React and how does it work?',
      difficulty: 'medium',
      category: 'React',
    },
  ],
  backend: [
    {
      id: '3',
      question: 'Explain RESTful API design principles.',
      difficulty: 'medium',
      category: 'API Design',
    },
    {
      id: '4',
      question: 'What is database normalization?',
      difficulty: 'medium',
      category: 'Databases',
    },
  ],
  android: [
    {
      id: '5',
      question: 'Explain the Android activity lifecycle.',
      difficulty: 'medium',
      category: 'Android Fundamentals',
    },
    {
      id: '6',
      question: 'What is the difference between implicit and explicit intents?',
      difficulty: 'easy',
      category: 'Android Components',
    },
  ],
  fullstack: [
    {
      id: '7',
      question: 'Explain the concept of microservices architecture.',
      difficulty: 'hard',
      category: 'System Design',
    },
    {
      id: '8',
      question: 'How would you implement authentication in a full-stack application?',
      difficulty: 'medium',
      category: 'Security',
    },
  ],
};

interface QuestionBankProps {
  profile: Profile;
}

export function QuestionBank({ profile }: QuestionBankProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const questions = mockQuestions[profile];
  const categories = Array.from(new Set(questions.map(q => q.category)));

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          <BookOpen className="h-5 w-5 inline-block mr-2" />
          Question Bank - {profile.charAt(0).toUpperCase() + profile.slice(1)}
        </h2>
      </div>

      <div className="space-y-4">
        {categories.map(category => (
          <div key={category} className="border rounded-lg">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">{category}</span>
              {expandedCategories.includes(category) ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedCategories.includes(category) && (
              <div className="px-4 pb-4">
                {questions
                  .filter(q => q.category === category)
                  .map(question => (
                    <div
                      key={question.id}
                      className="mt-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-gray-900">{question.question}</p>
                        <span
                          className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                            question.difficulty
                          )}`}
                        >
                          {question.difficulty}
                        </span>
                      </div>
                      {question.expectedAnswer && (
                        <p className="mt-2 text-sm text-gray-600">
                          <strong>Expected Answer:</strong> {question.expectedAnswer}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}