export type Profile = 'android' | 'backend' | 'frontend' | 'fullstack';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'interviewer' | 'admin';
  profilePicture?: string;
  resume?: string;
  about?: string;
  skills?: string[];
}

export interface InterviewRequest {
  id: string;
  candidateId: string;
  profile: Profile;
  status: 'pending' | 'assigned' | 'completed';
  createdAt: string;
  interviewerId?: string;
  score?: number;
  feedback?: string;
  scheduledFor?: string;
  meetingLink?: string;
  recordingUrl?: string;
}

export interface InterviewerAvailability {
  id: string;
  interviewerId: string;
  date: string;
  timeSlots: string[];
  profile: Profile;
}

export interface QuestionBank {
  id: string;
  profile: Profile;
  questions: InterviewQuestion[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  expectedAnswer?: string;
}

export interface InterviewFeedback {
  id: string;
  interviewId: string;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  overallScore: number;
  strengths: string[];
  areasOfImprovement: string[];
  generalComments: string;
  recordingUrl?: string;
}