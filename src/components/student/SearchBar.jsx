import React, { useState } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearchComplete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/course-list/${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");

      if (onSearchComplete) {
        onSearchComplete();
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-xl relative">
      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 text-gray-700 outline-none w-full p-4 pr-12 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-600 transition"
      />

      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 flex items-center justify-center text-purple-600 hover:text-purple-800 transition duration-300"
      >
        <RiSearch2Line size={22} />
      </button>
    </form>
  );
};

export default SearchBar;