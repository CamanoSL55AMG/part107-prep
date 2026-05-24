import { type Question } from '../../types';

export const chartsQuestions: Question[] = [
  {
    id: 'charts-001',
    category: 'charts',
    question: 'What does a blue dashed line on a sectional chart represent?',
    options: [
      'Class B airspace boundary',
      'Class D airspace boundary',
      'Military training route',
      'Restricted area',
    ],
    correctAnswer: 1,
    explanation: 'On sectional charts, a blue dashed line indicates the boundary of Class D airspace. Class B airspace is shown with solid blue lines, restricted areas with hatched blue lines.',
    reference: 'FAA Chart User\'s Guide',
  },
  {
    id: 'charts-002',
    category: 'charts',
    question: 'What does magenta shading on a sectional chart indicate?',
    options: [
      'Class B airspace floor',
      'Class C and Class E surface area',
      'Prohibited area',
      'Warning area',
    ],
    correctAnswer: 1,
    explanation: 'Magenta shading on sectional charts indicates Class E airspace at the surface (typically associated with airports) and Class C airspace.',
    reference: 'FAA Chart User\'s Guide',
  },
];
