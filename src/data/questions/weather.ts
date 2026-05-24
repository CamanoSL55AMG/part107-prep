import { type Question } from '../../types';

export const weatherQuestions: Question[] = [
  {
    id: 'weather-001',
    category: 'weather',
    question: 'What weather condition is most dangerous for small UAS operations?',
    options: [
      'Light rain',
      'High wind gusts exceeding 20 knots',
      'Temperature above 90°F',
      'Low humidity',
    ],
    correctAnswer: 1,
    explanation: 'High wind gusts can cause loss of control of the small unmanned aircraft. The remote pilot must monitor weather conditions and avoid operations when wind speeds or gusts exceed the aircraft\'s capabilities.',
    reference: 'AC 107-2',
  },
  {
    id: 'weather-002',
    category: 'weather',
    question: 'What does a "Special Weather Statement" indicate?',
    options: [
      'Clear skies for the next 24 hours',
      'Significant weather conditions requiring attention',
      'Normal daily weather forecast',
      'Historical weather data',
    ],
    correctAnswer: 1,
    explanation: 'A Special Weather Statement is issued by the National Weather Service to highlight significant weather conditions that may impact operations but do not meet warning or advisory criteria.',
    reference: 'FAA-H-8083-25',
  },
];
