import { useState, useRef, useCallback } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const HeroInput = ({ inputRef, value, onChange, onSubmit, onClear, inputId }) => (
  <form onSubmit={onSubmit} className="relative w-full max-w-2xl mx-auto" role="search">
    <HiSearch
      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      size={20}
    />
    <input
      id={inputId}
      ref={inputRef}
      type="text"
      autoComplete="off"
      value={value}
      onChange={onChange}
      placeholder="Search courses… (e.g. React, Python, Design)"
      aria-label="Search courses"
      className="w-full pl-12 pr-32 py-4 text-base rounded-full border border-gray-200 bg-white shadow-sm
                 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
    />
    {value && (
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear search"
        className="absolute right-[7.5rem] top-1/2 -translate-y-1/2
                   w-7 h-7 flex items-center justify-center rounded-full
                   bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700
                   transition-colors cursor-pointer"
      >
        <HiX size={14} />
      </button>
    )}
    <button
      type="submit"
      className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2
                 bg-gradient-to-r from-violet-600 to-indigo-600
                 text-white rounded-full text-sm font-semibold hover:shadow-md transition-shadow"
    >
      Search
    </button>
  </form>
);

const DefaultInput = ({ inputRef, value, onChange, onSubmit, onClear, inputId }) => (
  <form onSubmit={onSubmit} role="search">
    <div className="relative">
      <HiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={15}
      />
      <input
        id={inputId}
        ref={inputRef}
        type="text"
        autoComplete="off"
        value={value}
        onChange={onChange}
        placeholder="Search courses…"
        aria-label="Search courses"
        className="w-48 md:w-64 pl-9 pr-10 py-2 text-sm rounded-full border border-gray-200 bg-gray-50
                   focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
      />
      {/* Custom × — large enough to tap easily, sits inside the pill */}
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2
                     w-7 h-7 flex items-center justify-center rounded-full
                     bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700
                     transition-colors cursor-pointer"
        >
          <HiX size={13} />
        </button>
      )}
    </div>
  </form>
);

const SearchBar = ({
  variant          = 'default',
  onSearch,
  onClose,
  initialValue     = '',
  navigateOnSearch = true,
}) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const inputId  = useRef(`search-${Math.random().toString(36).slice(2)}`).current;

  const doSearch = useCallback((term) => {
    const t = term.trim();
    if (!t) return;
    onSearch?.(t);
    if (navigateOnSearch) {
      navigate(`/courses?search=${encodeURIComponent(t)}`);
    }
  }, [navigate, navigateOnSearch, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (!e.target.value) onSearch?.('');
  };

  const handleSubmit = (e) => { e.preventDefault(); doSearch(query); };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
    onClose?.();
    inputRef.current?.focus();
  };

  const sharedProps = {
    inputRef, value: query, inputId,
    onChange: handleChange,
    onSubmit: handleSubmit,
    onClear:  handleClear,
  };

  return variant === 'hero'
    ? <HeroInput    {...sharedProps} />
    : <DefaultInput {...sharedProps} />;
};

export default SearchBar;