import { useState, useRef, useEffect } from "react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { label: "Web Development", count: 42 },
  { label: "Mobile Apps", count: 28 },
  { label: "Data Science", count: 35 },
  { label: "UI/UX Design", count: 19 },
  { label: "Cybersecurity", count: 14 },
  { label: "DevOps", count: 21 },
  { label: "AI & ML", count: 31 },
];

const FilterDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (label) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const clearAll = () => setSelected(new Set());

  const applyFilter = () => {
    const categories = [...selected];
    if (categories.length === 0) {
      navigate("/course-list");
    } else {
      navigate(`/course-list?categories=${encodeURIComponent(categories.join(","))}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all"
        style={{
          border: selected.size > 0
            ? "0.5px solid #534AB7"
            : "0.5px solid rgba(0,0,0,0.1)",
          color: selected.size > 0 ? "#534AB7" : "#5F5E5A",
          background: selected.size > 0 ? "#EEEDFE" : "transparent",
        }}
      >
        <HiOutlineAdjustmentsHorizontal size={15} />
        Filter
        {selected.size > 0 && (
          <span
            className="text-white text-xs rounded-full px-1.5 py-0.5"
            style={{ background: "#534AB7", fontSize: "11px" }}
          >
            {selected.size}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-56 rounded-2xl overflow-hidden z-50"
          style={{
            background: "white",
            border: "0.5px solid rgba(0,0,0,0.08)",
            top: "100%",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <span
              className="text-xs font-medium tracking-wide uppercase"
              style={{ color: "#888780" }}
            >
              Categories
            </span>
            {selected.size > 0 && (
              <button
                onClick={clearAll}
                className="text-xs transition hover:opacity-70"
                style={{ color: "#534AB7" }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category list */}
          <div className="px-2 pb-2 flex flex-col gap-0.5">
            {CATEGORIES.map(({ label, count }) => (
              <div
                key={label}
                onClick={() => toggle(label)}
                className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition hover:bg-gray-50"
              >
                {/* Checkbox */}
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    border: selected.has(label)
                      ? "none"
                      : "1.5px solid #B4B2A9",
                    background: selected.has(label) ? "#534AB7" : "transparent",
                  }}
                >
                  {selected.has(label) && (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none"
                      stroke="white" strokeWidth="2">
                      <polyline points="1.5,5 4,7.5 8.5,2.5" />
                    </svg>
                  )}
                </div>

                <span className="text-sm flex-1" style={{ color: "#2C2C2A" }}>
                  {label}
                </span>
                <span className="text-xs" style={{ color: "#B4B2A9" }}>
                  {count}
                </span>
              </div>
            ))}
          </div>

          {/* Apply button */}
          <div className="px-2 pb-3">
            <button
              onClick={applyFilter}
              className="w-full py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: "#534AB7" }}
            >
              {selected.size > 0 ? `Apply (${selected.size})` : "View all courses"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;