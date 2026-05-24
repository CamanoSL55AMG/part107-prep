import { useState } from 'react';
import { allQuestions } from './data/questions';
import { useExamStore } from './store/examStore';
import type { Category, PricingTier } from './types';

type View = 'home' | 'study' | 'exam' | 'results' | 'review' | 'drill' | 'pricing';

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
    drillSession,
    examHistory, 
    studyStreak,
    accessTier,
    originalTier,
    canAccessStudy,
    canAccessExams,
    canAccessDrillMode,
    setAccessTier,
    upgradeTier,
    startExam, 
    startDrill,
    answerQuestion, 
    answerDrillQuestion,
    flagQuestion, 
    unflagQuestion,
    nextQuestion, 
    prevQuestion, 
    nextDrillQuestion,
    submitExam,
    skipQuestion,
    completeDrill,
  } = useExamStore();


  const handleSubmitExam = () => {
    submitExam();
    setView('results');
  };


  const handleStartDrill = (missedIds: string[], sourceExamId?: string) => {
    if (!canAccessDrillMode()) {
      setView('pricing');
      return;
    }
    startDrill(missedIds, sourceExamId);
    setView('drill');
  };

  const handleStartExam = () => {
    if (!canAccessExams()) {
      setView('pricing');
      return;
    }
    startExam(60);
    setView('exam');
  };

  const handleStartStudy = (category: Category) => {
    if (!canAccessStudy()) {
      setView('pricing');
      return;
    }
    setStudyCategory(category);
    setStudyIndex(0);
    setShowExplanation(false);
    setView('study');
  };

  const pricingTiers: PricingTier[] = [
    {
      id: 'study',
      name: 'Study Guide',
      description: 'Perfect for beginners',
      price: 19,
      features: [
        'Full study mode access',
        'All 320+ questions with explanations',
        'Category-by-category learning',
        'Progress tracking',
        'No exam access'
      ],
      cta: 'Start Learning'
    },
    {
      id: 'exam',
      name: 'Exam Only',
      description: 'For confident test-takers',
      price: 29,
      features: [
        'Unlimited practice exams',
        '60-question timed exams',
        'Real FAA Part 107 format',
        'Score tracking & history',
        'No study mode access'
      ],
      cta: 'Get Exam Access'
    },
    {
      id: 'full',
      name: 'Complete Bundle',
      description: 'Best value - Everything included',
      price: originalTier === 'study' ? 15 : 39, // Discounted upgrade price
      originalPrice: 48,
      features: [
        'Everything in Study Guide',
        'Everything in Exam Only',
        'Weak Area Drill mode',
        'Post-exam review & mastery',
        'Priority support'
      ],
      cta: originalTier === 'study' ? 'Upgrade for $15' : 'Get Complete Access',
      popular: true
    }
  ];

  // Home View
  if (view === 'home') {
    const tierBadges: Record<typeof accessTier, { color: string; label: string }> = {
      free: { color: 'bg-gray-500', label: 'Free Preview' },
      study: { color: 'bg-green-500', label: 'Study Guide' },
      exam: { color: 'bg-blue-500', label: 'Exam Access' },
      full: { color: 'bg-purple-500', label: 'Complete Bundle' }
    };
    const badge = tierBadges[accessTier];

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Part 107 Pilot Prep</h1>
              <p className="text-blue-100">FAA Remote Pilot Certificate Study</p>
            </div>
            <div className="flex gap-2">
              <span className={`${badge.color} px-3 py-1 rounded-full text-sm font-medium`}>
                {badge.label}
              </span>
              {accessTier !== 'full' && (
                <button
                  onClick={() => setView('pricing')}
                  className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium hover:bg-yellow-300"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
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

          {/* Free Tier Promo */}
          {accessTier === 'free' && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">Unlock Full Access</h2>
              <p className="mb-4">Get 320+ questions, practice exams, and study tools to pass your Part 107 exam.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setView('pricing')}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
                >
                  View Pricing
                </button>
              </div>
            </div>
          )}

          {/* Start Exam */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold">Practice Exam</h2>
              {!canAccessExams() && <span className="text-gray-400">🔒</span>}
            </div>
            <p className="text-gray-600 mb-4">60 questions, 120 minutes, 70% to pass</p>
            {!canAccessExams() ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Exam access requires purchase</p>
                <button
                  onClick={() => setView('pricing')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Unlock Exams
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartExam}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Practice Exam
              </button>
            )}
          </div>

          {/* Study Sections */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Study by Category</h2>
              {!canAccessStudy() && <span className="text-gray-400">🔒</span>}
            </div>
            {!canAccessStudy() ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-3">Full study guide requires purchase</p>
                <button
                  onClick={() => setView('pricing')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Unlock Study Guide
                </button>
              </div>
            ) : (
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
            )}
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

          {/* Missed Questions Review */}
          {result.missedQuestions.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Review Missed Questions</h2>
              <p className="text-gray-600 mb-4">
                You missed {result.missedQuestions.length} question{result.missedQuestions.length > 1 ? 's' : ''}. 
                Use Weak Area Drill to master these questions.
              </p>
              <button
                onClick={() => handleStartDrill(result.missedQuestions, result.id)}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
              >
                🎯 Study Missed Questions ({result.missedQuestions.length})
              </button>
            </div>
          )}

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

  // Study View - Beginner-friendly with immediate feedback
  if (view === 'study' && studyCategory) {
    const questions = allQuestions.filter((q) => q.category === studyCategory);
    const question = questions[studyIndex];
    const [studyAnswer, setStudyAnswer] = useState<number | null>(null);

    const handleStudyAnswer = (idx: number) => {
      setStudyAnswer(idx);
      setShowExplanation(true);
    };

    const handleNext = () => {
      setStudyAnswer(null);
      setShowExplanation(false);
      if (studyIndex < questions.length - 1) {
        setStudyIndex(studyIndex + 1);
      } else {
        setView('home');
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">{categoryLabels[studyCategory]}</h1>
            <p className="text-blue-100">Study Mode - Question {studyIndex + 1} of {questions.length}</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Mode Badge */}
            <div className="mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Beginner Study Guide
              </span>
            </div>

            <h2 className="text-lg font-semibold mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = studyAnswer === idx;
                const isCorrect = idx === question.correctAnswer;
                const showCorrect = showExplanation && isCorrect;
                const showWrong = showExplanation && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => !showExplanation && handleStudyAnswer(idx)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showWrong
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`font-bold mr-3 w-8 h-8 rounded-full flex items-center justify-center ${
                        showCorrect ? 'bg-green-500 text-white' : showWrong ? 'bg-red-500 text-white' : 'bg-gray-200'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showCorrect && <span className="text-green-600 font-bold">✓ Correct</span>}
                      {showWrong && <span className="text-red-600 font-bold">✗ Incorrect</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 mb-2">Explanation</h3>
                <p className="text-gray-700">{question.explanation}</p>
                {question.reference && (
                  <p className="text-sm text-gray-500 mt-3">Reference: {question.reference}</p>
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setView('home')}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Exit Study
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {studyIndex < questions.length - 1 ? 'Next Question →' : 'Finish Study'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Drill View - Weak Area Mode (post-exam)
  if (view === 'drill' && drillSession) {
    const question = drillSession.questions[drillSession.currentIndex];
    const progress = drillSession.questions.filter((q) => (drillSession.correctCount[q.id] || 0) >= 2).length;
    const totalMaster = drillSession.questions.length;
    const [drillResult, setDrillResult] = useState<{ correct: boolean; mastered: boolean } | null>(null);

    const handleDrillAnswer = (idx: number) => {
      const result = answerDrillQuestion(question.id, idx);
      setDrillResult(result);
    };

    const handleDrillNext = () => {
      setDrillResult(null);
      
      // Check if all questions are mastered
      const allMastered = drillSession.questions.every((q) => (drillSession.correctCount[q.id] || 0) >= 2);
      if (allMastered) {
        completeDrill();
        setView('home');
      } else {
        nextDrillQuestion();
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-orange-600 text-white p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Weak Area Drill</h1>
              <p className="text-orange-100">Master missed questions (need 2 correct in a row)</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{progress}/{totalMaster}</p>
              <p className="text-sm text-orange-200">Mastered</p>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Mastery indicator for this question */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Current question mastery:</span>
              <div className="flex gap-1">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full ${
                      (drillSession.correctCount[question.id] || 0) > i
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isAnswered = drillResult !== null;
                const isSelected = drillSession.answers[question.id] === idx;
                const isCorrect = idx === question.correctAnswer;
                const showCorrect = isAnswered && isCorrect;
                const showWrong = isAnswered && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => !isAnswered && handleDrillAnswer(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showWrong
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`font-bold mr-3 w-8 h-8 rounded-full flex items-center justify-center ${
                        showCorrect ? 'bg-green-500 text-white' : showWrong ? 'bg-red-500 text-white' : 'bg-gray-200'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showCorrect && <span className="text-green-600 font-bold">✓ Correct</span>}
                      {showWrong && <span className="text-red-600 font-bold">✗ Incorrect</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {drillResult && (
              <div className={`mt-6 p-4 rounded-lg border-l-4 ${
                drillResult.mastered 
                  ? 'bg-green-50 border-green-500' 
                  : drillResult.correct 
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-red-50 border-red-500'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  drillResult.mastered ? 'text-green-900' : drillResult.correct ? 'text-blue-900' : 'text-red-900'
                }`}>
                  {drillResult.mastered 
                    ? '🎉 Question Mastered!' 
                    : drillResult.correct 
                    ? '✓ Correct! Answer once more to master.' 
                    : '✗ Incorrect. Review the explanation.'}
                </h3>
                <p className="text-gray-700">{question.explanation}</p>
                {question.reference && (
                  <p className="text-sm text-gray-500 mt-3">Reference: {question.reference}</p>
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  completeDrill();
                  setView('home');
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Exit Drill
              </button>
              {drillResult && (
                <button
                  onClick={handleDrillNext}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Continue →
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Pricing View
  if (view === 'pricing') {
    const isUpgrade = originalTier === 'study' && accessTier === 'study';
    
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Choose Your Plan</h1>
              <p className="text-blue-100">Select the best option for your Part 107 preparation</p>
            </div>
            <button
              onClick={() => setView('home')}
              className="text-white hover:text-blue-200"
            >
              ← Back
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4">
          {/* Current Tier Notice */}
          {accessTier !== 'free' && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-blue-900">
                You currently have the <strong>{pricingTiers.find(t => t.id === accessTier)?.name}</strong> plan.
                {isUpgrade && ' Upgrade to Complete Bundle to unlock exams and drill mode at a discounted price!'}
              </p>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => {
              const isCurrent = accessTier === tier.id;
              const isLocked = tier.id === 'full' && accessTier === 'exam'; // Can't go exam -> full without paying
              
              return (
                <div
                  key={tier.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                    tier.popular ? 'ring-2 ring-purple-500' : ''
                  } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
                >
                  {tier.popular && (
                    <div className="bg-purple-500 text-white text-center py-2 text-sm font-semibold">
                      BEST VALUE
                    </div>
                  )}
                  {isCurrent && (
                    <div className="bg-green-500 text-white text-center py-2 text-sm font-semibold">
                      CURRENT PLAN
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">{tier.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold">${tier.price}</span>
                      {tier.originalPrice && tier.price < tier.originalPrice && (
                        <>
                          <span className="text-lg text-gray-400 line-through ml-2">
                            ${tier.originalPrice}
                          </span>
                          <span className="text-green-600 text-sm ml-2">
                            (Save ${tier.originalPrice - tier.price}!)
                          </span>
                        </>
                      )}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className={feature.includes('No ') ? 'text-gray-400' : ''}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        if (!isCurrent && !isLocked) {
                          // Simulate purchase - in real app, this would open Stripe
                          upgradeTier(tier.id);
                          setView('home');
                        }
                      }}
                      disabled={isCurrent || isLocked}
                      className={`w-full py-3 rounded-lg font-semibold transition ${
                        isCurrent
                          ? 'bg-gray-200 text-gray-500 cursor-default'
                          : isLocked
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : tier.popular
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : isLocked ? 'Not Available' : tier.cta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ / Notes */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">Pricing Notes</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Study Guide → Complete Bundle upgrade saves $4 (pay $15 instead of $19 difference)</li>
              <li>• All purchases are one-time - no subscriptions</li>
              <li>• Free tier: 20 sample questions + 1 practice mini-exam</li>
              <li>• Full Bundle includes Weak Area Drill mode for targeted practice</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

export default App;

