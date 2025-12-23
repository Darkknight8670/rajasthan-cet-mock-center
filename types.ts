
export interface TestMetadata {
  id: string;
  title: string;
  durationMinutes: number;
  category: string;
  questionCount: number;
  csvUrl?: string; // Simulated link to Google Sheet CSV
}

export interface Question {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  subject: string;
}

export interface UserResponse {
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isMarkedForReview: boolean;
}

export interface TestResult {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
  accuracy: number;
  timeSpent: number;
  responses: UserResponse[];
  questions: Question[];
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT'
}
