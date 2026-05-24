import { type Question } from '../../types';

export const regulationsQuestions: Question[] = [
  {
    id: 'reg-001',
    category: 'regulations',
    question: 'Who is responsible for ensuring a small UAS is in a condition for safe operation?',
    options: [
      'The owner of the aircraft',
      'The Remote Pilot in Command (RPIC)',
      'The manufacturer',
      'The ground crew',
    ],
    correctAnswer: 1,
    explanation: '14 CFR Part 107.15 states that the remote pilot in command is responsible for ensuring the small unmanned aircraft is in a condition for safe operation before flight.',
    reference: '14 CFR § 107.15',
  },
  {
    id: 'reg-002',
    category: 'regulations',
    question: 'How often must a Remote Pilot take a recurrent training course?',
    options: [
      'Every 6 months',
      'Every 12 months',
      'Every 24 months',
      'Only once after initial certification',
    ],
    correctAnswer: 2,
    explanation: '14 CFR Part 107.65 requires remote pilots to pass a recurrent aeronautical knowledge test or complete an online recurrent training course every 24 months to maintain certification.',
    reference: '14 CFR § 107.65',
  },
];
