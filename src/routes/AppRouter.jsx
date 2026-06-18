// src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '../store/AppProvider';
import StudentLayout from '../layouts/StudentLayout';
import InstructorLayout from '../layouts/InstructorLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '../shared/constants/routes';

// ============================================================================
// Lazy Imports
// ============================================================================

// Auth
const SignIn = lazy(() => import('../features/auth/pages/SignIn'));
const SignUp = lazy(() => import('../features/auth/pages/SignUp'));

// Student
const Home           = lazy(() => import('../features/student/pages/Home'));
const MyEnrollments  = lazy(() => import('../features/student/pages/MyEnrollments'));

// Profile
const Profile = lazy(() => import('../features/profile/pages/Profile'));

// Courses
const CoursesList   = lazy(() => import('../features/courses/pages/CoursesList'));
const CourseDetails = lazy(() => import('../features/courses/pages/CourseDetails'));
const WatchWindow   = lazy(() => import('../features/courses/pages/WatchWindow'));

// Chat
const Chat = lazy(() => import('../features/chat/pages/Chat'));

// Payment
const PaymentSuccessPage  = lazy(() => import('../features/payment/pages/PaymentSuccessPage'));
const PaymentCancelPage   = lazy(() => import('../features/payment/pages/PaymentCancelPage'));
const PaymentHistoryPage  = lazy(() => import('../features/payment/pages/PaymentHistoryPage'));

// Instructor
const InstructorDashboard       = lazy(() => import('../features/instructor/pages/Dashboard'));
const InstructorAddCourse       = lazy(() => import('../features/instructor/pages/AddCourseWizard'));
const InstructorEditCourse      = lazy(() => import('../features/instructor/pages/EditCourse'));
const InstructorMyCourses       = lazy(() => import('../features/instructor/pages/MyCourses'));
const InstructorStudentEnrolled = lazy(() => import('../features/instructor/pages/StudentEnrolled'));

// Admin
const AdminDashboard  = lazy(() => import('../features/admin/pages/Dashboard'));
const PendingCourses  = lazy(() => import('../features/admin/pages/PendingCourses'));
const AllCourses      = lazy(() => import('../features/admin/pages/AllCourses'));
const AdminUsers      = lazy(() => import('../features/admin/pages/Users'));

// ============================================================================
// Helpers
// ============================================================================

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isStudent, isInstructor, isAdmin, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return children;
  if (isAdmin)       return <Navigate to={ROUTES.ADMIN_DASHBOARD}      replace />;
  if (isInstructor)  return <Navigate to={ROUTES.INSTRUCTOR_DASHBOARD} replace />;
  if (isStudent)     return <Navigate to={ROUTES.HOME}                 replace />;
  return <Navigate to={ROUTES.HOME} replace />;
};

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-white to-gray-50">
    <div className="text-center">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <a
        href={ROUTES.HOME}
        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition"
      >
        ← Back to Home
      </a>
    </div>
  </div>
);

// ============================================================================
// Router
// ============================================================================

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Auth ─────────────────────────────────────────────────────────── */}
        <Route path={ROUTES.SIGN_IN} element={<AuthGuard><SignIn /></AuthGuard>} />
        <Route path={ROUTES.SIGN_UP} element={<AuthGuard><SignUp /></AuthGuard>} />

        {/* ── Student Layout ────────────────────────────────────────────────── */}
        <Route element={<StudentLayout />}>
          {/* Public */}
          <Route path={ROUTES.HOME}           element={<Home />} />
          <Route path={ROUTES.COURSE_LIST}    element={<CoursesList />} />
          <Route path={ROUTES.COURSE_DETAILS} element={<CourseDetails />} />

          {/* Payment */}
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel"  element={<PaymentCancelPage />} />

          {/* Any authenticated user */}
          <Route element={<ProtectedRoute allowedRoles={['Student', 'Instructor', 'Admin', 'SuperAdmin']} />}>
            <Route path={ROUTES.CHAT} element={<Chat />} />
          </Route>

          {/* Student only */}
          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            <Route path={ROUTES.MY_ENROLLMENTS}        element={<MyEnrollments />} />
            <Route path={ROUTES.PROFILE}               element={<Profile />} />
            <Route path={ROUTES.WATCH(':courseId')}    element={<WatchWindow />} />
            <Route path="/my-payments" element={<PaymentHistoryPage />} />
          </Route>
        </Route>

        {/* ── Instructor Layout ─────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['Instructor', 'Admin', 'SuperAdmin']} />}>
          <Route element={<InstructorLayout />}>
            <Route path={ROUTES.INSTRUCTOR_DASHBOARD} element={<InstructorDashboard />} />
            <Route path={ROUTES.INSTRUCTOR_COURSES}   element={<InstructorMyCourses />} />
            <Route path={ROUTES.INSTRUCTOR_ADD}       element={<InstructorAddCourse />} />
            <Route path={ROUTES.INSTRUCTOR_EDIT(':id')} element={<InstructorEditCourse />} />
            <Route path={ROUTES.INSTRUCTOR_STUDENTS}  element={<InstructorStudentEnrolled />} />
            <Route path={ROUTES.INSTRUCTOR_PROFILE}   element={<Profile />} />
          </Route>
        </Route>

        {/* ── Admin Layout ──────────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']} />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN_DASHBOARD}        element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_PENDING_COURSES}   element={<PendingCourses />} />
            <Route path={ROUTES.ADMIN_ALL_COURSES}       element={<AllCourses />} />
            <Route path={ROUTES.ADMIN_USERS}             element={<AdminUsers />} />
          </Route>
        </Route>

        {/* ── 404 ───────────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;