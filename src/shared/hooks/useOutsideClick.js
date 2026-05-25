// src/shared/hooks/useOutsideClick.js
// Fires a callback when the user clicks outside a referenced element.
// Used by FilterDropdown and the Navbar avatar dropdown — both currently
// duplicate this same useEffect + document.addEventListener pattern.
//
// Usage:
//   const dropdownRef = useOutsideClick(() => setIsOpen(false));
//   return <div ref={dropdownRef}>...</div>

import { useEffect, useRef } from 'react';

const useOutsideClick = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [callback]);

  return ref;
};

export default useOutsideClick;
