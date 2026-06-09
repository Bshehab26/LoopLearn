// src/features/courses/hooks/useCategories.js
// Fetches categories from GET /api/Category and calculates accurate counts
// by fetching all published courses once.

import { useState, useEffect } from 'react';
import { getCategories } from '../api/category.api';
import { getAllCourses } from '../api/course.api';

// Module-level cache so the request is made only once per session
let _cache = null;
let _countsCache = null;
let _promise = null;

const fetchOnce = async () => {
  if (_cache && _countsCache) {
    return { categories: _cache, counts: _countsCache };
  }
  
  if (_promise) return _promise;

  _promise = (async () => {
    try {
      // Fetch categories
      const categoriesRes = await getCategories();
      
      if (!categoriesRes.success) {
        _promise = null;
        return { categories: [], counts: {} };
      }
      
      const categories = categoriesRes.data || [];
      _cache = categories;
      
      // Fetch ALL published courses to calculate accurate counts
      // Use a large page size to get all courses at once
      const coursesRes = await getAllCourses(1, 1000);
      
      const countsMap = {};
      // Initialize counts for all categories
      categories.forEach(cat => {
        countsMap[cat.name] = 0;
      });
      
      if (coursesRes.success && coursesRes.data) {
        const courses = coursesRes.data;
        courses.forEach(course => {
          const cat = course.category;
          if (cat && countsMap[cat] !== undefined) {
            countsMap[cat]++;
          }
        });
      }
      
      _countsCache = countsMap;
      return { categories, counts: countsMap };
    } catch (err) {
      console.error('Failed to fetch categories data:', err);
      _promise = null;
      return { categories: [], counts: {} };
    }
  })();

  return _promise;
};

const useCategories = () => {
  const [categories, setCategories] = useState(_cache ?? []);
  const [categoryCounts, setCategoryCounts] = useState(_countsCache ?? {});
  const [loading, setLoading] = useState(!_cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_cache && _countsCache) {
      setCategories(_cache);
      setCategoryCounts(_countsCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchOnce()
      .then(({ categories, counts }) => {
        setCategories(categories);
        setCategoryCounts(counts);
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load categories');
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, categoryCounts, loading, error };
};

export default useCategories;