import { useState } from 'react';
import { allQuestions, getRandomExamQuestions } from './data/questions';
import { useExamStore } from './store/examStore';
import type { Category } from './types';

type View = 'home' | 'study' | 'exam' | 'results' | 'review';

const categoryLabels: Record<Category, string> = {
  airspace: 'Airspace',
  weather: 'Weather',
  regulations: 'Regulations',
  charts: 'Sectional Charts',
  performance: 'Aircraft Performance',
  safety: 'Safety',
  operations: 'Operations',
  radio: 'Radio Procedures',
};

function App() {
  const [view, setView] = useState<View>('home');
  const [studyCategory, setStudyCategory] = useState<Category | null>(null);
  const [studyIndex, setStudyIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const { 
    currentSession, 
    examHistory, 
    studyStreak,
    startExam, 
    answerQuestion, 
    flagQuestion, 
    unflagQuestion,
    nextQuestion, 
    prevQuestion, 
    submitExam,
    skipQuestion,
  } = useExamStore();

  const handleStartExam = () => {
    startExam(60);
    setView('exam');
  };

  const handleSubmitExam = () => {
    submitExam();
    setView('results');
  };

  const handleStartStudy = (category: Category) => {
    setStudyCategory(category);
    setStudyIndex(0);
    setShowExplanation(false);
    setView('study');
  };

  // Home View
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Part 107 Pilot Prep</h1>
          <p className="text-blue-100">FAA Remote Pilot Certificate Study</p>
        </header>

        <main className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Study Streak</p>
              <p className="text-2xl font-bold text-blue-600">{studyStreak} days</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Questions</p>
              <p className="text-2xl font-bold text-blue-600">{allQuestions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Exams Taken</p>
              <p className="text-2xl font-bold text-blue-600">{examHistory.length}</p>
            </div>
          </div>

          {/* Start Exam */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Practice Exam</h2>
            <p className="text-gray-600 mb-4">60 questions, 120 minutes, 70% to pass</p>
            <button
              onClick={handleStartExam}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Practice Exam
            </button>
          </div>

          {/* Study Sections */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Study by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleStartStudy(cat)}
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Results */}
          {examHistory.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Recent Exams</h2>
              <div className="space-y-2">
                {examHistory.slice(-5).map((result) => (
                  <div
                    key={result.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <span>{new Date(result.date).toLocaleDateString()}</span>
                    <span className={`font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.score}% {result.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Exam View
  if (view === 'exam' && currentSession) {
    const question = currentSession.questions[currentSession.currentIndex];
    const progress = ((currentSession.currentIndex + 1) / currentSession.questions.length) * 100;
    const isFlagged = currentSession.flagged.includes(question.id);
    const hasAnswer = currentSession.answers[question.id] !== undefined;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <span className="text-sm">Question {currentSession.currentIndex + 1} of {currentSession.questions.length}</span>
              <div className="w-48 h-2 bg-blue-800 rounded mt-1">
                <div
                  className="h-full bg-green-400 rounded transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <button
              onClick={handleSubmitExam}
              className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </header>

        {/* Question */}
        <main className="flex-1 max-w-4xl mx-auto w-full p-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                {categoryLabels[question.category]}
              </span>
              <button
                onClick={() => isFlagged ? unflagQuestion(question.id) : flagQuestion(question.id)}
                className={`p-2 rounded ${isFlagged ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}
              >
                {isFlagged ? '⚑' : '⚐'}
              </button>
            </div>

            <h2 className="text-lg font-semibold mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const selected = currentSession.answers[question.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => answerQuestion(question.id, idx)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={prevQuestion}
                disabled={currentSession.currentIndex === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                ← Previous
              </button>
              <button
                onClick={hasAnswer ? nextQuestion : skipQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {hasAnswer ? (currentSession.currentIndex === currentSession.questions.length - 1 ? 'Finish' : 'Next →') : 'Skip →'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Results View
  if (view === 'results' && examHistory.length > 0) {
    const result = examHistory[examHistory.length - 1];

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Exam Results</h1>
        </header>

        <main className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Score */}
          <div className={`p-8 rounded-lg text-center ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="text-5xl font-bold mb-2">{result.score}%</p>
            <p className={`text-xl font-semibold ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
              {result.passed ? 'PASSED' : 'FAILED'} ({result.correct}/{result.total})
            </p>
            <p className="text-gray-600 mt-2">70% required to pass</p>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Performance by Category</h2>
            <div className="space-y-3">
              {(Object.keys(result.categoryBreakdown) as Category[]).map((cat) => {
                const stats = result.categoryBreakdown[cat];
                if (stats.total === 0) return null;
                const pct = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="font-medium">{categoryLabels[cat]}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded">
                        <div
                          className={`h-full rounded ${pct >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm w-16 text-right">{stats.correct}/{stats.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setView('home')}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Back to Home
            </button>
            <button
              onClick={handleStartExam}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Take Another Exam
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Study View
  if (view === 'study' && studyCategory) {
    const questions = allQuestions.filter((q) => q.category === studyCategory);
    const question = questions[studyIndex];

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">{categoryLabels[studyCategory]}</h1>
          <p className="text-blue-100">Question {studyIndex + 1} of {questions.length}</p>
        </header>

        <main className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setShowExplanation(true)}
                  className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition"
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-green-700 mb-2">
                  Correct Answer: {String.fromCharCode(65 + question.correctAnswer)}
                </p>
                <p className="text-gray-700">{question.explanation}</p>
                {question.reference && (
                  <p className="text-sm text-gray-500 mt-2">Reference: {question.reference}</p>
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setView('home')}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Exit
              </button>
              <button
                onClick={() => {
                  setShowExplanation(false);
                  if (studyIndex < questions.length - 1) {
                    setStudyIndex(studyIndex + 1);
                  } else {
                    setView('home');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {studyIndex < questions.length - 1 ? 'Next →' : 'Finish'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

export default App;

