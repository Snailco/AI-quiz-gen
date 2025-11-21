export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  OPEN_ENDED = 'open_ended',
  MIXED = 'mixed'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface QuizConfig {
  mode: 'subject' | 'context';
  input: string;
  questionCount: number;
  difficulty: Difficulty;
  type: QuestionType;
  apiKey?: string;
}

export interface Question {
  id: number;
  text: string;
  type: 'multiple_choice' | 'open_ended';
  options?: string[]; // Only for multiple choice
}

export interface GradingResult {
  questionId: number;
  score: number; // 0-100
  feedback: string;
  correctAnswer: string;
}

export interface QuizState {
  questions: Question[];
  answers: Record<number, string>;
  results: GradingResult[] | null;
  currentQuestionIndex: number;
  isGenerating: boolean;
  isGrading: boolean;
  error: string | null;
}