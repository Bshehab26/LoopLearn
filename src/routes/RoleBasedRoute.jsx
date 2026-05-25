// src/routes/RoleBasedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AppProvider';

/**
 * RoleBasedRoute - Simplified version for single role checking
 * 
 * @example
 * <Route element={<RoleBasedRoute allowedRole="instructor" />}>
 *   <Route path="/instructor" element={<Dashboard />} />
 * </Route>
 */

const RoleBasedRoute = ({ allowedRole, redirectTo = '/' }) => {
  const { isAuthenticated, user, isInstructor, isAdmin, isStudent } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  const roleMap = {
    student: isStudent,
    instructor: isInstructor,
    admin: isAdmin,
  };

  const hasAccess = roleMap[allowedRole?.toLowerCase()] || false;

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;