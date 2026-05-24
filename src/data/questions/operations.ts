import { type Question } from '../../types';

export const operationsQuestions: Question[] = [
  {
    id: 'ops-001',
    category: 'operations',
    question: 'What is the maximum groundspeed for a small UAS?',
    options: [
      '50 knots',
      '75 knots',
      '87 knots (100 mph)',
      '100 knots',
    ],
    correctAnswer: 2,
    explanation: '14 CFR Part 107.51 limits the groundspeed of a small unmanned aircraft to a maximum of 87 knots (100 mph).',
    reference: '14 CFR § 107.51',
  },
];
