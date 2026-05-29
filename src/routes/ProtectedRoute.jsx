// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AppProvider';  // ✅ Changed

const ROLE_HIERARCHY = {
  'SuperAdmin': ['SuperAdmin', 'Admin', 'Instructor', 'Student'],
  'Admin': ['Admin', 'Instructor', 'Student'],
  'Instructor': ['Instructor', 'Student'],
  'Student': ['Student'],
};

const DEFAULT_ALLOWED_ROLES = ['Student', 'Instructor', 'Admin', 'SuperAdmin'];

const hasRequiredRole = (userRole, allowedRoles) => {
  if (!userRole) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;
  
  return allowedRoles.some(allowedRole => {
    if (allowedRole === userRole) return true;
    const hasAccess = ROLE_HIERARCHY[userRole]?.includes(allowedRole);
    return hasAccess;
  });
};

const ProtectedRoute = ({ 
  allowedRoles = DEFAULT_ALLOWED_ROLES, 
  redirectTo = '/signin',
  fallback = null 
}) => {
  const { isAuthenticated, user, loading } = useAuth();  // ✅ Changed
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!isAuthenticated || !user?.token) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const userRole = user.role;
  const hasAccess = hasRequiredRole(userRole, allowedRoles);

  if (!hasAccess) {
    if (fallback) return fallback;
    
    let redirectPath = '/';
    if (userRole === 'Admin' || userRole === 'SuperAdmin') redirectPath = '/admin/dashboard';
    else if (userRole === 'Instructor') redirectPath = '/instructor/dashboard';
    else if (userRole === 'Student') redirectPath = '/';
    
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;