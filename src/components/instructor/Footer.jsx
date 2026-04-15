import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-6 text-center border-t border-gray-200 mt-10">
      <h1 className="text-sm text-gray-500">
        © {new Date().getFullYear()} LoopLearn — Instructor Panel
      </h1>
    </footer>
  );
};

export default Footer;