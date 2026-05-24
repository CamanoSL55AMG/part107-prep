import { type Question } from '../../types';

export const safetyQuestions: Question[] = [
  {
    id: 'safety-001',
    category: 'safety',
    question: 'What is the first priority after an accident involving a small UAS?',
    options: [
      'Report to the FAA within 24 hours',
      'Check for injuries and call emergency services if needed',
      'Recover the aircraft immediately',
      'Notify the property owner',
    ],
    correctAnswer: 1,
    explanation: 'Human safety is always the first priority. After an accident, immediately check for injuries and call emergency services if needed. Report to the FAA within 10 days of any serious injury or property damage over $500.',
    reference: '14 CFR § 107.9',
  },
];
