
import { TestMetadata, Question } from './types';

export const MARKS_PER_CORRECT = 2;
export const NEGATIVE_MARKING = -0.33;

export const CATEGORIES = [
  "All",
  "Full Mock",
  "Rajasthan GK",
  "Science",
  "Hindi",
  "English",
  "Reasoning"
];

export const MOCK_TESTS: TestMetadata[] = [
  {
    id: 't1',
    title: 'CET Full Mock Test - 01',
    durationMinutes: 180,
    category: 'Full Mock',
    questionCount: 150
  },
  {
    id: 't2',
    title: 'Rajasthan Geography Special',
    durationMinutes: 60,
    category: 'Rajasthan GK',
    questionCount: 50
  },
  {
    id: 't3',
    title: 'General Science Fundamentals',
    durationMinutes: 45,
    category: 'Science',
    questionCount: 40
  },
  {
    id: 't4',
    title: 'Hindi Grammar Mastery',
    durationMinutes: 30,
    category: 'Hindi',
    questionCount: 30
  },
  {
    id: 't5',
    title: 'CET Daily Quiz #42',
    durationMinutes: 15,
    category: 'Reasoning',
    questionCount: 15
  }
];

// Helper to generate mock questions for any test
export const generateQuestions = (count: number): Question[] => {
  const subjects = ['History', 'Geography', 'Art & Culture', 'Polity', 'Science'];
  const options = ['A', 'B', 'C', 'D'] as const;
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    text: `Question ${i + 1}: Who was the first ruler of the Mewar dynasty in Rajasthan? This is a placeholder for actual exam content fetched from your Google Sheet CSV.`,
    options: {
      A: `Option A for question ${i + 1}`,
      B: `Option B for question ${i + 1}`,
      C: `Option C for question ${i + 1}`,
      D: `Option D for question ${i + 1}`,
    },
    correctAnswer: options[Math.floor(Math.random() * 4)],
    subject: subjects[Math.floor(Math.random() * subjects.length)]
  }));
};
