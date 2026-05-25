// src/shared/hooks/useScrollToTop.js
// Scrolls the window to the top when a page mounts or when a dependency changes.
// Used by CourseDetails, WatchWindow, CoursesList, and any page that needs this.
//
// Usage (scroll on mount):
//   useScrollToTop();
//
// Usage (scroll when id changes):
//   useScrollToTop([id]);

import { useEffect } from 'react';

const useScrollToTop = (deps = []) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useScrollToTop;
