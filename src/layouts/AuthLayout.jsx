// src/layouts/AuthLayout.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiHome } from 'react-icons/hi';
import character from '../assets/character_img.png';

const AuthLayout = ({ title, subtitle, children, mode = 'signin', showBackButton = true }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-700 to-purple-900">
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="fixed -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-3xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl"
      >
        {/* Left Column - Mascot & Features */}
        <div className="hidden md:flex flex-col items-center justify-center gap-6 px-10 py-14 relative overflow-hidden bg-purple-50">
          <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full bg-purple-200/40" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-purple-200/30" />

          <p className="relative z-10 text-xl tracking-[3px] font-semibold text-purple-900">
            LOOP<span className="text-purple-600">LEARN</span>
          </p>

          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative z-10 w-44 h-44 rounded-full flex items-center justify-center overflow-hidden bg-purple-200 shadow-lg"
          >
            <img src={character} alt="mascot" className="w-36 object-contain" />
          </motion.div>

          <div className="relative z-10 text-center">
            <p className="text-lg font-semibold text-purple-900">Learn Without Limits</p>
            <p className="text-sm mt-1 text-purple-600">Your journey starts here 🚀</p>
          </div>

          <div className="relative z-10 flex flex-col gap-2 w-full max-w-[200px]">
            {['500+ expert courses', 'Learn at your own pace', 'Certificates included'].map((f) => (
              <div key={f} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-purple-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="text-xs font-medium text-purple-900">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-sm">
            {/* Back to Home Button - Now positioned at the top */}
            {showBackButton && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-4"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-purple-600 transition-colors group"
                >
                  <svg 
                    className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Home</span>
                </Link>
              </motion.div>
            )}

            {/* Sign In / Sign Up Tabs */}
            <div className="flex rounded-xl p-1 mb-7 bg-gray-100">
              <Link
                to="/signin"
                className={`flex-1 text-center py-2 rounded-lg text-sm transition-all font-medium ${
                  mode === 'signin'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className={`flex-1 text-center py-2 rounded-lg text-sm transition-all font-medium ${
                  mode === 'signup'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Sign up
              </Link>
            </div>

            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-400 mt-1 mb-6">{subtitle}</p>

            <div className={mode === 'signup' ? 'max-h-[55vh] overflow-y-auto pr-1' : ''}>
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;