// src/features/courses/components/QuizView.jsx

import React, { useState, useEffect } from 'react';
import { getQuiz, submitQuiz } from '../api/course.api';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock, HiOutlineEye, HiOutlinePlay } from 'react-icons/hi';

const QuizView = ({ quizId, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('overview'); // 'overview' | 'taking' | 'details'
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [fullQuiz, setFullQuiz] = useState(null); // for details mode

  useEffect(() => {
    const fetchQuizOverview = async () => {
      try {
        const response = await getQuiz(quizId);
        if (response.success) {
          setQuiz(response.data);
          // For overview, we don't need the questions yet.
          // We'll fetch them only when taking or viewing details.
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizOverview();
  }, [quizId]);

  const handleTakeQuiz = () => {
    // Load the full quiz with questions if not already loaded
    if (fullQuiz) {
      setMode('taking');
      // initialize selectedAnswers
      const initial = {};
      fullQuiz.questions.forEach(q => { initial[q.id] = null; });
      setSelectedAnswers(initial);
    } else {
      // Fetch full quiz
      setLoading(true);
      getQuiz(quizId).then(response => {
        if (response.success) {
          setFullQuiz(response.data);
          const initial = {};
          response.data.questions.forEach(q => { initial[q.id] = null; });
          setSelectedAnswers(initial);
          setMode('taking');
        } else {
          alert(response.message);
        }
        setLoading(false);
      });
    }
  };

  const handleViewDetails = () => {
    if (fullQuiz) {
      setMode('details');
    } else {
      setLoading(true);
      getQuiz(quizId).then(response => {
        if (response.success) {
          setFullQuiz(response.data);
          setMode('details');
        } else {
          alert(response.message);
        }
        setLoading(false);
      });
    }
  };

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    // check all answered
    const allAnswered = fullQuiz.questions.every(q => selectedAnswers[q.id] !== null);
    if (!allAnswered) {
      alert('Please answer all questions before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const answers = fullQuiz.questions.map(q => ({
        questionId: q.id,
        selectedOptionId: selectedAnswers[q.id],
      }));
      const response = await submitQuiz(quizId, answers);
      if (response.success) {
        setResult(response.data);
        setMode('overview'); // go back to overview with updated attempt
        if (onComplete) onComplete();
        // Optionally refresh the quiz overview
        const updated = await getQuiz(quizId);
        if (updated.success) {
          setQuiz(updated.data);
        }
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert('Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToOverview = () => {
    setMode('overview');
    setResult(null);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  if (!quiz) return <div className="text-center py-12">Quiz not found</div>;

  // ── Overview mode ──────────────────────────────────────────────────────────
  if (mode === 'overview') {
    const hasAttempt = !!quiz.previousAttempt;
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
        <p className="text-gray-600 mb-4">{quiz.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>Passing score: {quiz.passingScore}%</span>
          <span>•</span>
          <span>{quiz.totalQuestions} questions</span>
          <span>•</span>
          <span>Total points: {quiz.totalPoints}</span>
        </div>

        {hasAttempt && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Previous Attempt</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-lg font-bold ${quiz.previousAttempt.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {quiz.previousAttempt.score}%
                  </span>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${quiz.previousAttempt.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {quiz.previousAttempt.isPassed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted: {new Date(quiz.previousAttempt.submittedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Earned {quiz.previousAttempt.earnedPoints} / {quiz.previousAttempt.totalPoints} points
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleTakeQuiz}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <HiOutlinePlay size={18} />
            {hasAttempt ? 'Retake Quiz' : 'Take Quiz'}
          </button>
          {hasAttempt && (
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-2 px-5 py-2.5 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
            >
              <HiOutlineEye size={18} />
              View Details
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Taking mode ────────────────────────────────────────────────────────────
  if (mode === 'taking' && fullQuiz) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{fullQuiz.title}</h3>
          <button
            onClick={handleBackToOverview}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-4">{fullQuiz.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>Passing score: {fullQuiz.passingScore}%</span>
          <span>•</span>
          <span>{fullQuiz.totalQuestions} questions</span>
        </div>

        <div className="space-y-6">
          {fullQuiz.questions.map((q, idx) => (
            <div key={q.id} className="border-b pb-4">
              <p className="font-medium mb-2">
                {idx + 1}. {q.body} <span className="text-sm text-gray-400">({q.points} pts)</span>
              </p>
              <div className="space-y-2 pl-4">
                {q.options.map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question_${q.id}`}
                      value={opt.id}
                      checked={selectedAnswers[q.id] === opt.id}
                      onChange={() => handleOptionSelect(q.id, opt.id)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm">{opt.body}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    );
  }

  // ── Details mode (shows previous attempt with all options, highlighting correct/chosen) ──
  if (mode === 'details' && fullQuiz && quiz.previousAttempt) {
    const attempt = quiz.previousAttempt;
    // Build map of questionId -> selectedOptionId
    const selectedMap = {};
    attempt.answers.forEach(ans => {
      selectedMap[ans.questionId] = ans.selectedOptionId;
    });
    // Build map of questionId -> correctOptionId
    const correctMap = {};
    attempt.answers.forEach(ans => {
      correctMap[ans.questionId] = ans.correctOptionId;
    });

    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{quiz.title} – Results</h3>
          <button
            onClick={handleBackToOverview}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <span className={`text-2xl font-bold ${attempt.isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {attempt.score}%
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${attempt.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {attempt.isPassed ? 'Passed' : 'Failed'}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(attempt.submittedAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Earned {attempt.earnedPoints} / {attempt.totalPoints} points
          </p>
        </div>

        <div className="space-y-6">
          {fullQuiz.questions.map((q, idx) => {
            const selectedId = selectedMap[q.id];
            const correctId = correctMap[q.id];
            const isCorrect = selectedId === correctId;
            return (
              <div key={q.id} className="border-b pb-4">
                <p className="font-medium mb-2">
                  {idx + 1}. {q.body} <span className="text-sm text-gray-400">({q.points} pts)</span>
                  {isCorrect ? (
                    <span className="ml-2 text-green-600 text-sm">✅ Correct</span>
                  ) : (
                    <span className="ml-2 text-red-600 text-sm">❌ Incorrect</span>
                  )}
                </p>
                <div className="space-y-2 pl-4">
                  {q.options.map(opt => {
                    let className = "flex items-center gap-3 p-2 rounded-lg transition";
                    if (opt.id === correctId) {
                      className += " bg-green-50 border border-green-300";
                    } else if (opt.id === selectedId && !isCorrect) {
                      className += " bg-red-50 border border-red-300";
                    } else {
                      className += " border border-transparent";
                    }
                    return (
                      <div key={opt.id} className={className}>
                        <span className="text-sm">{opt.body}</span>
                        {opt.id === correctId && (
                          <span className="ml-auto text-xs text-green-600 font-medium">Correct</span>
                        )}
                        {opt.id === selectedId && !isCorrect && (
                          <span className="ml-auto text-xs text-red-600 font-medium">Your Answer</span>
                        )}
                        {opt.id === selectedId && isCorrect && (
                          <span className="ml-auto text-xs text-green-600 font-medium">Your Answer ✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleBackToOverview}
          className="mt-6 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Back to Overview
        </button>
      </div>
    );
  }

  return null;
};

export default QuizView;