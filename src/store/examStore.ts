import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, ExamSession, ExamResult, Category } from '../types';
import { getRandomExamQuestions, allQuestions } from '../data/questions';

interface ExamState {
  currentSession: ExamSession | null;
  examHistory: ExamResult[];
  questionStats: Record<string, { attempts: number; correct: number }>;
  studyStreak: number;
  lastStudyDate: string | null;
  masteryLevel: Record<string, number>;
  
  // Actions
  startExam: (questionCount?: number) => void;
  answerQuestion: (questionId: string, answerIndex: number) => void;
  flagQuestion: (questionId: string) => void;
  unflagQuestion: (questionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitExam: () => ExamResult;
  skipQuestion: () => void;
  updateMastery: (questionId: string, correct: boolean) => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      examHistory: [],
      questionStats: {},
      studyStreak: 0,
      lastStudyDate: null,
      masteryLevel: {},

      startExam: (questionCount = 60) => {
        const questions = getRandomExamQuestions(questionCount);
        const session: ExamSession = {
          id: Date.now().toString(),
          questions,
          answers: {},
          flagged: [],
          startTime: new Date(),
          currentIndex: 0,
        };
        set({ currentSession: session });
      },

      answerQuestion: (questionId, answerIndex) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        set({
          currentSession: {
            ...currentSession,
            answers: { ...currentSession.answers, [questionId]: answerIndex },
          },
        });
      },

      flagQuestion: (questionId) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        if (!currentSession.flagged.includes(questionId)) {
          set({
            currentSession: {
              ...currentSession,
              flagged: [...currentSession.flagged, questionId],
            },
          });
        }
      },

      unflagQuestion: (questionId) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        set({
          currentSession: {
            ...currentSession,
            flagged: currentSession.flagged.filter((id) => id !== questionId),
          },
        });
      },

      nextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        set({
          currentSession: {
            ...currentSession,
            currentIndex: Math.min(
              currentSession.currentIndex + 1,
              currentSession.questions.length - 1
            ),
          },
        });
      },

      prevQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        set({
          currentSession: {
            ...currentSession,
            currentIndex: Math.max(currentSession.currentIndex - 1, 0),
          },
        });
      },

      skipQuestion: () => {
        get().nextQuestion();
      },

      submitExam: () => {
        const { currentSession, questionStats, masteryLevel } = get();
        if (!currentSession) throw new Error('No active exam');

        const endTime = new Date();
        let correct = 0;
        const missedQuestions: string[] = [];
        const categoryBreakdown: Record<Category, { correct: number; total: number }> = {
          airspace: { correct: 0, total: 0 },
          weather: { correct: 0, total: 0 },
          regulations: { correct: 0, total: 0 },
          charts: { correct: 0, total: 0 },
          performance: { correct: 0, total: 0 },
          safety: { correct: 0, total: 0 },
          operations: { correct: 0, total: 0 },
          radio: { correct: 0, total: 0 },
        };

        // Calculate results
        currentSession.questions.forEach((q) => {
          const userAnswer = currentSession.answers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          
          categoryBreakdown[q.category].total++;
          if (isCorrect) {
            correct++;
            categoryBreakdown[q.category].correct++;
          } else {
            missedQuestions.push(q.id);
          }

          // Update stats
          const stats = questionStats[q.id] || { attempts: 0, correct: 0 };
          stats.attempts++;
          if (isCorrect) stats.correct++;
          questionStats[q.id] = stats;

          // Update mastery
          if (isCorrect) {
            masteryLevel[q.id] = (masteryLevel[q.id] || 0) + 1;
          }
        });

        const total = currentSession.questions.length;
        const score = Math.round((correct / total) * 100);
        const passed = score >= 70;

        const result: ExamResult = {
          id: Date.now().toString(),
          date: endTime,
          score,
          correct,
          total,
          passed,
          categoryBreakdown,
          missedQuestions,
        };

        // Update streak
        const today = new Date().toISOString().split('T')[0];
        const lastDate = get().lastStudyDate;
        let streak = get().studyStreak;
        
        if (lastDate) {
          const last = new Date(lastDate);
          const now = new Date(today);
          const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak++;
          } else if (diffDays > 1) {
            streak = 1;
          }
        } else {
          streak = 1;
        }

        set({
          currentSession: null,
          examHistory: [...get().examHistory, result],
          questionStats,
          masteryLevel,
          studyStreak: streak,
          lastStudyDate: today,
        });

        return result;
      },

      updateMastery: (questionId, correct) => {
        const { masteryLevel } = get();
        if (correct) {
          masteryLevel[questionId] = (masteryLevel[questionId] || 0) + 1;
        }
        set({ masteryLevel });
      },
    }),
    {
      name: 'part107-exam-storage',
    }
  )
);
