import { type Question } from '../../types';

export const performanceQuestions: Question[] = [
  {
    id: 'perf-001',
    category: 'performance',
    question: 'How does density altitude affect small UAS performance?',
    options: [
      'Higher density altitude improves performance',
      'Higher density altitude reduces performance',
      'Density altitude has no effect on performance',
      'Performance is only affected at night',
    ],
    correctAnswer: 1,
    explanation: 'Higher density altitude (hot, humid, high elevation conditions) reduces air density, which decreases lift and thrust performance of the small unmanned aircraft.',
    reference: 'FAA-H-8083-25',
  },
];
