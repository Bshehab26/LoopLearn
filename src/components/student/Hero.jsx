import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { AppContext } from "../../context/AppContext";

const Hero = () => {
  const navigate = useNavigate();
  const { isNavSearchVisible } = useContext(AppContext);

  const handleExploreCourses = () => {
    navigate("/course-list");
  };

  const handleLearnMore = () => {
    const section = document.getElementById("about");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-linear-to-b from-purple-50 via-white to-white pt-28 md:pt-36 pb-16 px-6 text-center">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight relative">
          Empower Your Future With Courses Designed To{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-purple-800">
            Fit Your Needs
          </span>

          <img
            src={assets.sketch}
            alt="sketch"
            className="hidden md:block absolute -bottom-6 right-10 w-28 opacity-80"
          />
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Learn from world-class instructors, explore interactive content,
          and join a supportive community to achieve your goals.
        </p>

        {/* SEARCH (with hide/show animation) */}
        <div
          className={`pt-4 flex justify-center transition-all duration-300 ${
            isNavSearchVisible
              ? "opacity-0 pointer-events-none h-0 overflow-hidden"
              : "opacity-100"
          }`}
        >
          <div className="w-full max-w-xl">
            <SearchBar variant="hero" />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleExploreCourses}
            className="bg-linear-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-full text-lg font-medium shadow-md hover:scale-105 transition duration-300"
          >
            Explore Courses
          </button>

          <button
            onClick={handleLearnMore}
            className="border border-purple-600 text-purple-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-50 transition duration-300"
          >
            Learn More
          </button>
        </div>

      </div>
    </div>
  );
};

export default Hero;