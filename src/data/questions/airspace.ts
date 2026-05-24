import { type Question } from '../../types';

export const airspaceQuestions: Question[] = [
  {
    id: 'airspace-001',
    category: 'airspace',
    question: 'What is the maximum altitude above ground level (AGL) that a Remote Pilot in Command (RPIC) may operate a small unmanned aircraft?',
    options: [
      '400 feet AGL',
      '500 feet AGL',
      '600 feet AGL',
      'There is no maximum altitude limit',
    ],
    correctAnswer: 0,
    explanation: '14 CFR Part 107.51 states that the altitude of the small unmanned aircraft cannot be higher than 400 feet AGL unless the small unmanned aircraft is flown within a 400-foot radius of a structure, in which case it may not fly higher than 400 feet above the structure\'s immediate uppermost limit.',
    reference: '14 CFR § 107.51',
  },
  {
    id: 'airspace-002',
    category: 'airspace',
    question: 'In which class of airspace is prior authorization required to operate a small UAS?',
    options: [
      'Class G airspace',
      'Class E airspace below 400 feet AGL',
      'Class B, C, and D airspace',
      'All airspace requires prior authorization',
    ],
    correctAnswer: 2,
    explanation: '14 CFR Part 107.41 requires prior authorization from ATC to operate in Class B, C, and D airspace and within the lateral boundaries of the surface area of Class E airspace designated for an airport. Class G airspace does not require authorization.',
    reference: '14 CFR § 107.41',
  },
  {
    id: 'airspace-003',
    category: 'airspace',
    question: 'What is the minimum visibility required for operating a small UAS during daylight hours?',
    options: [
      '1 statute mile',
      '2 statute miles',
      '3 statute miles',
      '5 statute miles',
    ],
    correctAnswer: 2,
    explanation: '14 CFR Part 107.51 requires minimum flight visibility of 3 statute miles from the control station. This applies to all operations conducted under Part 107.',
    reference: '14 CFR § 107.51',
  },
  {
    id: 'airspace-004',
    category: 'airspace',
    question: 'When operating near an airport, what must the Remote Pilot do?',
    options: [
      'Maintain radio contact with the tower at all times',
      'Give way to all manned aircraft',
      'Obtain a transponder code',
      'Fly only below 200 feet AGL',
    ],
    correctAnswer: 1,
    explanation: '14 CFR Part 107.37 requires the remote pilot to give way to all manned aircraft. This means the unmanned aircraft must yield right-of-way and not interfere with manned aircraft operations.',
    reference: '14 CFR § 107.37',
  },
  {
    id: 'airspace-005',
    category: 'airspace',
    question: 'What is the minimum distance from clouds required for small UAS operations?',
    options: [
      '500 feet below, 1000 feet horizontally',
      '500 feet below, 2000 feet horizontally',
      '1000 feet below, 2000 feet horizontally',
      'There is no minimum distance requirement',
    ],
    correctAnswer: 1,
    explanation: '14 CFR Part 107.51 requires the small unmanned aircraft to maintain at least 500 feet below a cloud and 2,000 feet horizontally from a cloud.',
    reference: '14 CFR § 107.51',
  },
];
