import { type Question } from '../../types';
import { airspaceQuestions } from './airspace';
import { weatherQuestions } from './weather';
import { regulationsQuestions } from './regulations';
import { chartsQuestions } from './charts';
import { performanceQuestions } from './performance';
import { safetyQuestions } from './safety';
import { operationsQuestions } from './operations';
import { radioQuestions } from './radio';

export const allQuestions: Question[] = [
  ...airspaceQuestions,
  ...weatherQuestions,
  ...regulationsQuestions,
  ...chartsQuestions,
  ...performanceQuestions,
  ...safetyQuestions,
  ...operationsQuestions,
  ...radioQuestions,
];

export const questionsByCategory = {
  airspace: airspaceQuestions,
  weather: weatherQuestions,
  regulations: regulationsQuestions,
  charts: chartsQuestions,
  performance: performanceQuestions,
  safety: safetyQuestions,
  operations: operationsQuestions,
  radio: radioQuestions,
};

export function getRandomExamQuestions(count: number = 60): Question[] {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getQuestionsByCategory(category: string): Question[] {
  return questionsByCategory[category as keyof typeof questionsByCategory] || [];
}
