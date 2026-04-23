import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import character from "../assets/character_img.png";

const AuthLayout = ({ title, subtitle, children, mode = "signin" }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #534AB7 0%, #3C3489 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl max-w-4xl w-full 
        grid grid-cols-1 md:grid-cols-2 
        overflow-hidden max-h-[90vh] shadow-md"
        style={{ border: "0.5px solid rgba(0,0,0,0.08)" }}
      >
        {/* LEFT — Branding */}
        <div
          className="hidden md:flex flex-col items-center justify-center gap-5 px-8 py-12 relative overflow-hidden"
          style={{ background: "#EEEDFE" }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-14 -left-14 w-48 h-48 rounded-full opacity-50"
            style={{ background: "#CECBF6" }}
          />
          <div
            className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full opacity-40"
            style={{ background: "#CECBF6" }}
          />

          {/* Brand */}
          <p
            className="relative z-10 text-xl tracking-widest"
            style={{ color: "#26215C", fontWeight: 500 }}
          >
            LOOP<span style={{ color: "#534AB7" }}>LEARN</span>
          </p>

          {/* Character */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative z-10 w-44 h-44 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: "#CECBF6" }}
          >
            <img
              src={character}
              alt="LoopLearn mascot"
              className="w-36 object-contain"
            />
          </motion.div>

          <p
            className="relative z-10 text-lg text-center"
            style={{ color: "#3C3489", fontWeight: 500 }}
          >
            Learn Without Limits
          </p>
          <p
            className="relative z-10 text-sm text-center"
            style={{ color: "#534AB7" }}
          >
            Your journey starts here 🚀
          </p>

          {/* Feature pills */}
          <div className="relative z-10 flex flex-col gap-2 w-full max-w-[210px]">
            {[
              "500+ expert courses",
              "Learn at your own pace",
              "Certificates included",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 bg-white rounded-xl px-3 py-2"
                style={{ border: "0.5px solid #AFA9EC" }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#534AB7" }}
                />
                <span className="text-xs" style={{ color: "#3C3489" }}>
                  {f}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm max-h-[70vh] overflow-y-auto pr-2">

            {/* Tabs */}
            <div
              className="flex rounded-xl p-1 mb-6"
              style={{ background: "#F1EFE8" }}
            >
              <Link
                to="/signin"
                className="flex-1 text-center py-2 rounded-lg text-sm transition-all"
                style={
                  mode === "signin"
                    ? {
                        background: "white",
                        color: "#534AB7",
                        fontWeight: 500,
                        border: "0.5px solid rgba(0,0,0,0.08)",
                      }
                    : { color: "#888780" }
                }
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center py-2 rounded-lg text-sm transition-all"
                style={
                  mode === "signup"
                    ? {
                        background: "white",
                        color: "#534AB7",
                        fontWeight: 500,
                        border: "0.5px solid rgba(0,0,0,0.08)",
                      }
                    : { color: "#888780" }
                }
              >
                Sign up
              </Link>
            </div>

            <h1 className="text-2xl text-gray-800 font-medium">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              {subtitle}
            </p>

            {/* FORM CONTENT */}
            <div className="space-y-4">
              {children}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;