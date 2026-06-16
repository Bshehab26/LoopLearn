// src/features/payment/pages/PaymentSuccessPage.jsx
// Route: /payment/success?session_id={CHECKOUT_SESSION_ID}
//
// Stripe appends ?session_id=cs_xxx to the URL — we read it and display it
// as a reference number so the user has proof of payment while they wait.
//
// Enrollment is created by the backend webhook AFTER Stripe confirms payment.
// We poll GET /api/enrollment/courses every 2s for up to 16s to detect the
// new enrollment. Three UI states: polling → confirmed | timeout.

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { getMyEnrollments } from '../api/payment.api';

const POLL_INTERVAL_MS  = 2000;
const POLL_MAX_ATTEMPTS = 8; // 8 × 2s = 16s

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  // ── Read ?session_id=cs_xxx from URL ───────────────────────────────────────
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id'); // e.g. "cs_test_a1b2c3..."
  // Show only last 8 chars as a short reference — full ID is very long
  const shortRef = sessionId ? `…${sessionId.slice(-8)}` : null;

  // ── Polling state ───────────────────────────────────────────────────────────
  const [status, setStatus]     = useState('polling'); // 'polling' | 'confirmed' | 'timeout'
  const [attempts, setAttempts] = useState(0);
  const [enrolledCourse, setEnrolledCourse] = useState(null); // most recent enrollment
  const prevCountRef = useRef(null);
  const timerRef     = useRef(null);

  // Read the enrollment count we saved just before redirecting to Stripe
  useEffect(() => {
    const stored = sessionStorage.getItem('enrollmentCountBeforeCheckout');
    prevCountRef.current = stored !== null ? parseInt(stored, 10) : null;
  }, []);

  // Poll GET /api/enrollment/courses until a new row appears
  useEffect(() => {
    if (status !== 'polling') return;

    timerRef.current = setInterval(async () => {
      setAttempts((prev) => {
        const next = prev + 1;
        if (next >= POLL_MAX_ATTEMPTS) {
          clearInterval(timerRef.current);
          setStatus('timeout');
        }
        return next;
      });

      try {
        const result = await getMyEnrollments();
        const courses = result.data ?? [];
        const count   = courses.length;

        if (prevCountRef.current === null || count > prevCountRef.current) {
          clearInterval(timerRef.current);
          sessionStorage.removeItem('enrollmentCountBeforeCheckout');
          // The newest enrollment is the last item (most recently added)
          setEnrolledCourse(courses[courses.length - 1] ?? null);
          setStatus('confirmed');
        }
      } catch {
        // Network blip — keep polling silently
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timerRef.current);
  }, [status]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-white to-white">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">

        {/* ── Polling ───────────────────────────────────────────────────────── */}
        {status === 'polling' && (
          <>
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-5">
              <svg className="animate-spin w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Payment received!</h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Confirming your enrollment — usually takes a few seconds.
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(POLL_MAX_ATTEMPTS)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                    i < attempts ? 'bg-purple-500' : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>

            {/* Session ID reference */}
            {shortRef && (
              <p className="text-[11px] text-gray-300 mt-2">
                Payment ref: <span className="font-mono">{shortRef}</span>
              </p>
            )}
          </>
        )}

        {/* ── Confirmed ─────────────────────────────────────────────────────── */}
        {status === 'confirmed' && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-gray-800 mb-1">You're enrolled! 🎉</h1>

            {/* Show the course name if we got it from polling */}
            {enrolledCourse?.title && (
              <p className="text-sm font-medium text-purple-600 mb-3">
                {enrolledCourse.title}
              </p>
            )}

            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Your payment was successful and your course access is ready.
            </p>

            {/* Session ID reference */}
            {shortRef && (
              <div className="bg-gray-50 rounded-lg px-3 py-2 mb-5 inline-block">
                <p className="text-[11px] text-gray-400">
                  Payment reference:{' '}
                  <span className="font-mono text-gray-600">{shortRef}</span>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {/* If we know the courseId, go directly to watch page */}
              {enrolledCourse?.courseId ? (
                <button
                  onClick={() => navigate(`/watch/${enrolledCourse.courseId}`)}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
                >
                  Start learning now →
                </button>
              ) : (
                <button
                  onClick={() => navigate('/my-enrollments')}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
                >
                  Go to my courses
                </button>
              )}
              <Link
                to="/courses"
                className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600
                  text-sm font-medium hover:bg-gray-50 transition text-center block"
              >
                Browse more courses
              </Link>
            </div>
          </>
        )}

        {/* ── Timeout (webhook still pending) ───────────────────────────────── */}
        {status === 'timeout' && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-gray-800 mb-2">Payment confirmed</h1>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Your payment went through but enrollment is taking a little longer
              than usual. Your course will appear in your dashboard within a few minutes.
            </p>

            {/* Session ID as support reference */}
            {sessionId && (
              <div className="bg-gray-50 rounded-lg px-3 py-2.5 mb-4 text-left">
                <p className="text-[11px] text-gray-400 mb-0.5">Keep this for support:</p>
                <p className="font-mono text-xs text-gray-600 break-all">{sessionId}</p>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5">
              <p className="text-xs text-amber-700">
                If your course doesn't appear after 5 minutes, contact support
                with the reference above.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/my-enrollments')}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
                style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
              >
                Go to my courses
              </button>
              <button
                onClick={() => { setStatus('polling'); setAttempts(0); }}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600
                  text-sm font-medium hover:bg-gray-50 transition"
              >
                Check again
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccessPage;