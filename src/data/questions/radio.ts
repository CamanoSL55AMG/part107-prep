import { type Question } from '../../types';

export const radioQuestions: Question[] = [
  {
    id: 'radio-001',
    category: 'radio',
    question: 'What radio frequency is monitored by most airports for Unmanned Aircraft operations?',
    options: [
      '121.5 MHz (Emergency)',
      '122.9 MHz (CTAF)',
      '123.45 MHz (Air-to-air)',
      '243.0 MHz (Military)',
    ],
    correctAnswer: 1,
    explanation: '122.9 MHz is the Common Traffic Advisory Frequency (CTAF) used at many airports without a control tower. Remote pilots may monitor this frequency to maintain situational awareness of manned aircraft traffic.',
    reference: 'AC 107-2',
  },
];
