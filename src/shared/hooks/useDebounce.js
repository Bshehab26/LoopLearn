// src/shared/hooks/useDebounce.js
// Delays updating a value until the user stops typing.
// Used by SearchBar and FilterDropdown to avoid firing on every keystroke.
//
// Usage:
//   const debouncedQuery = useDebounce(searchQuery, 400);
//   useEffect(() => { /* fire search */ }, [debouncedQuery]);

import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // reset timer on every value change
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
