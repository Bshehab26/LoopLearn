import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      // navigate home first, then scroll after mount
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-center px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/20">

        {/* Brand */}
        <div className="flex flex-col md:items-start items-center w-full">
          <Link to="/">
            <h1 className="font-extrabold text-2xl md:text-3xl text-white/50 tracking-wide">
              LOOP<span className="text-purple-600">LEARN</span>
            </h1>
          </Link>
          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            Get in touch with us!
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li>
              <Link to="/" className="hover:text-purple-400 transition">Home</Link>
            </li>
            <li>
              {/* ✅ scrolls to #about section on Home page */}
              <button
                onClick={() => scrollTo("about")}
                className="hover:text-purple-400 transition text-white/80"
              >
                About us
              </button>
            </li>
            <li>
              {/* ✅ scrolls to #contact section on Home page */}
              <button
                onClick={() => scrollTo("contact")}
                className="hover:text-purple-400 transition text-white/80"
              >
                Contact us
              </button>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400 transition">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">Subscribe to our Newsletter</h2>
          <p className="text-sm text-white/80">Stay updated with our latest news and offers.</p>
          <div className="flex items-center gap-2 pt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-500/30 bg-gray-800 text-gray-300 placeholder-gray-500 outline-none w-64 h-9 px-2 text-sm rounded-l-md"
            />
            <button className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-r-md rounded-l-md text-sm">
              Subscribe
            </button>
          </div>
        </div>

      </div>
      <p className="text-center text-sm text-white/80 py-6">
        Copyright &copy; LoopLearn Platform. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
