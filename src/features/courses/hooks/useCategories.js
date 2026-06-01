// src/features/courses/hooks/useCategories.js
// Fetches categories from GET /api/Category once and caches them in module scope
// so multiple FilterDropdown instances don't fire duplicate requests.

import { useState, useEffect } from 'react';
import { getCategories } from '../api/category.api';

// Module-level cache so the request is made only once per session
let _cache = null;
let _promise = null;

const fetchOnce = () => {
  if (_cache)   return Promise.resolve(_cache);
  if (_promise) return _promise;

  _promise = getCategories().then((res) => {
    if (res.success) {
      _cache = res.data;          // [{ id, name, description }]
      return _cache;
    }
    _promise = null;              // allow retry on failure
    return [];
  });

  return _promise;
};

const useCategories = () => {
  const [categories, setCategories] = useState(_cache ?? []);
  const [loading,    setLoading]    = useState(!_cache);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    if (_cache) { setCategories(_cache); setLoading(false); return; }

    setLoading(true);
    fetchOnce()
      .then((data) => { setCategories(data); })
      .catch((err) => { setError(err.message ?? 'Failed to load categories'); })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
};

export default useCategories;