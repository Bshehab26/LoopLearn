// src/features/instructor/pages/AddCourse.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This file now redirects to the new wizard component
 * Keep for backward compatibility
 */
const AddCourse = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/instructor/add-course/wizard', { replace: true });
  }, [navigate]);
  
  return null;
};

export default AddCourse;