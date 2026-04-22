import { motion } from "framer-motion";
import character from "../../src/assets/character_img.png";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
      >
        {/* Character Section */}
        <div className="hidden md:flex flex-col items-center justify-center bg-purple-50 p-8">
          <motion.img
            src={character}
            alt="Infinity Character"
            initial={{ y: -20 }}
            animate={{ y: [ -10, 10, -10 ] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-64"
          />
          <h2 className="text-2xl font-bold text-purple-700 mt-6">
            Learn Without Limits
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Your journey starts here 🚀
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 mt-2">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
