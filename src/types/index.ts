export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  reference?: string;
}

export type Category = 
  | 'airspace' 
  | 'weather' 
  | 'regulations' 
  | 'charts' 
  | 'performance' 
  | 'safety' 
  | 'operations' 
  | 'radio';

export interface ExamSession {
  id: string;
  questions: Question[];
  answers: Record<string, number>;
  flagged: string[];
  startTime: Date;
  endTime?: Date;
  currentIndex: number;
}

export interface ExamResult {
  id: string;
  date: Date;
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  categoryBreakdown: Record<Category, { correct: number; total: number }>;
  missedQuestions: string[];
}

export interface UserProgress {
  userId: string;
  examHistory: ExamResult[];
  questionStats: Record<string, { attempts: number; correct: number }>;
  studyStreak: number;
  lastStudyDate: Date;
  masteryLevel: Record<string, number>;
}

export interface StudySection {
  id: Category;
  title: string;
  description: string;
  content: string;
  progress: number;
}

// Access tiers for tiered pricing model
export type AccessTier = 'free' | 'study' | 'exam' | 'full';

// Pricing configuration
export interface PricingTier {
  id: AccessTier;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For showing discount
  features: string[];
  cta: string;
  popular?: boolean;
}
