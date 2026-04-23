import { useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearchComplete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const normalizeQuery = (text = "") =>
    text.toLowerCase().trim().replace(/\s+/g, " ");

  const handleSearch = (e) => {
    e.preventDefault();
    const normalizedQuery = normalizeQuery(searchQuery);
    if (!normalizedQuery) return;
    navigate(`/course-list/${encodeURIComponent(normalizedQuery)}`);
    setSearchQuery("");
    if (onSearchComplete) onSearchComplete();
  };

  return (
    <div className="hidden lg:flex flex-1 mx-8 max-w-md">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 w-full px-4 rounded-full"
        style={{
          background: "#F1EFE8",
          border: "0.5px solid rgba(0,0,0,0.08)",
          height: "36px",
        }}
      >
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 min-w-0"
        />
        <button
          type="submit"
          className="flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-purple-600 transition"
        >
          <RiSearch2Line size={16} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;