# Loop Learn - Source Code (src/) Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Core Architecture](#core-architecture)
4. [Features Overview](#features-overview)
5. [Services & API](#services--api)
6. [State Management](#state-management)
7. [Shared Resources](#shared-resources)
8. [Routing](#routing)
9. [Layouts](#layouts)
10. [Development Guide](#development-guide)

---

## Project Overview

**Loop Learn** is a comprehensive online learning platform built with **React 18**, **Vite**, and **Tailwind CSS**. It supports multiple user roles (Student, Instructor, Admin) with features including:

- 👨‍🎓 Course browsing and enrollment
- 👨‍🏫 Course creation and management (Instructors)
- 💬 Real-time chat system
- 💳 Payment processing (Stripe integration)
- 📊 Admin dashboard for platform management
- 👤 User profiles and account management
- 🔐 Authentication & authorization

---

## Folder Structure

```
src/
├── App.jsx                    # Main app component
├── App.css                    # Global app styles
├── index.css                  # Global styles & Tailwind imports
├── main.jsx                   # React entry point
│
├── assets/                    # Static assets
│   ├── assets.js              # Asset exports & helpers
│   ├── rich-text-css.txt      # Rich text editor styles
│   ├── backgrounds/           # Background images
│   ├── Course Thumbnails/     # Course thumbnail images
│   └── icons/                 # Icon assets
│
├── features/                  # Feature modules (role-based)
│   ├── admin/                 # Admin dashboard & management
│   ├── auth/                  # Authentication & authorization
│   ├── chat/                  # Real-time chat system
│   ├── courses/               # Course catalog & details
│   ├── instructor/            # Instructor course management
│   ├── payment/               # Payment & billing
│   ├── profile/               # User profile management
│   └── student/               # Student dashboard & enrollments
│
├── layouts/                   # Layout components
│   ├── AdminLayout.jsx
│   ├── AuthLayout.jsx
│   ├── InstructorLayout.jsx
│   └── StudentLayout.jsx
│
├── routes/                    # Routing configuration
│   ├── AppRouter.jsx          # Main router setup
│   ├── ProtectedRoute.jsx     # Authentication guard
│   └── RoleBasedRoute.jsx     # Role-based access control
│
├── services/                  # Business logic & API
│   ├── index.js               # Service exports
│   ├── api/
│   │   ├── axios.js           # Axios instance & interceptors
│   │   ├── errorHandler.js    # Centralized error handling
│   │   └── index.js           # API exports
│   └── utils/
│       ├── index.js           # Utility exports
│       ├── storage.js         # Local storage utilities
│       └── tokenUtils.js      # JWT token management
│
├── shared/                    # Shared resources
│   ├── index.js               # Shared exports
│   ├── api/
│   │   ├── paginationHelper.js    # Pagination utilities
│   │   ├── preLoadData.api.js     # Pre-loading API calls
│   │   └── upload.api.js          # File upload handling
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── Pagination.jsx
│   │   ├── Rating.jsx
│   │   └── UnsavedChangesModal.jsx
│   ├── constants/
│   │   ├── api.js             # API endpoints
│   │   ├── config.js          # Configuration constants
│   │   ├── roles.js           # User roles
│   │   └── routes.js          # Route paths
│   ├── hooks/
│   │   ├── useDebounce.js     # Debounce hook
│   │   ├── useOutsideClick.js # Outside click detection
│   │   ├── usePagination.js   # Pagination logic
│   │   └── useScrollToTop.js  # Auto scroll to top
│   └── utils/
│       ├── avatarColors.js    # Avatar color utilities
│       ├── formatters.js      # Data formatting utilities
│       ├── helpers.js         # General helper functions
│       └── validators.js      # Form & data validators
│
└── store/                     # Global state management
    ├── index.js               # Store exports
    ├── AppProvider.jsx        # Combined context provider
    └── contexts/
        ├── AuthContext.jsx    # Authentication state
        ├── CourseContext.jsx  # Course state
        ├── ProfileContext.jsx # User profile state
        └── UIContext.jsx      # UI state
```

---

## Core Architecture

### 3-Layer Architecture Pattern

The application follows a **3-layer architecture** for clean separation of concerns:

```
┌─────────────────────────────────────┐
│     PRESENTATION LAYER              │
│  (Components, Pages, Layouts)       │
├─────────────────────────────────────┤
│     STATE MANAGEMENT LAYER          │
│  (Context API, Hooks, Store)        │
├─────────────────────────────────────┤
│     SERVICE LAYER                   │
│  (API Calls, Business Logic)        │
├─────────────────────────────────────┤
│     UTILITIES & HELPERS             │
│  (Constants, Formatters, Validators)│
└─────────────────────────────────────┘
```

### Data Flow

```
User Interaction
       ↓
Component Event Handler
       ↓
Context Action / Hook
       ↓
Service Layer (API Call)
       ↓
Response Handler
       ↓
State Update
       ↓
Component Re-render
```

---

## Features Overview

### 📚 **Admin Module** (`features/admin/`)

Manages the entire platform with comprehensive administrative tools.

**Structure:**
```
admin/
├── index.js                    # Module exports
├── api/
│   └── admin.api.js            # Admin API endpoints
├── components/
│   ├── categories/             # Category management UI
│   ├── common/                 # Reusable admin components
│   ├── courses/                # Course management UI
│   ├── dashboard/              # Dashboard widgets
│   ├── tags/                   # Tag management UI
│   └── users/                  # User management UI
├── hooks/
│   ├── useAdminCourseActions.js    # Course action hooks
│   ├── useAdminCourseDetail.js     # Course detail hook
│   ├── useAdminCourseReviewHistory.js
│   ├── useAdminCourses.js          # Courses list hook
│   ├── useAdminStats.js            # Statistics hook
│   ├── useAdminUserActions.js      # User action hooks
│   ├── useAdminUserDetail.js       # User detail hook
│   └── useAdminUsers.js            # Users list hook
├── pages/
│   ├── AdminCourseDetailPage.jsx
│   ├── AdminUserDetailPage.jsx
│   ├── Categories.jsx
│   ├── Dashboard.jsx
│   ├── PendingCourses.jsx
│   ├── Tags.jsx
│   └── Users.jsx
└── utils/
    └── format.js               # Admin-specific formatters
```

**Key Responsibilities:**
- User management (view, edit, deactivate)
- Course moderation (approve/reject pending courses)
- Category and tag management
- Platform statistics and analytics
- Dashboard overview

---

### 🔐 **Auth Module** (`features/auth/`)

Handles authentication, authorization, and user sessions.

**Structure:**
```
auth/
├── index.js                    # Module exports
├── api/
│   └── auth.api.js             # Auth endpoints (login, signup, logout)
├── components/
│   ├── SignInForm.jsx
│   ├── SignUpForm.jsx
│   └── ... other auth components
└── pages/
    ├── SignIn.jsx
    ├── SignUp.jsx
    └── ... other auth pages
```

**Key Responsibilities:**
- User registration & login
- JWT token management
- Session handling
- Password recovery
- OAuth integration (if applicable)

---

### 💬 **Chat Module** (`features/chat/`)

Real-time messaging system between students and instructors.

**Structure:**
```
chat/
├── index.js                    # Module exports
├── api/
│   └── chat.api.js             # Chat endpoints
├── components/
│   ├── ChatList.jsx
│   ├── ChatWindow.jsx
│   ├── MessageItem.jsx
│   └── ... other chat components
├── hooks/
│   ├── useChat.js
│   ├── useMessages.js
│   └── ... other chat hooks
└── pages/
    └── Chat.jsx
```

**Key Responsibilities:**
- Message sending/receiving
- Conversation management
- User presence/status
- Message history

---

### 📖 **Courses Module** (`features/courses/`)

Core course catalog and course details viewing.

**Structure:**
```
courses/
├── index.js                    # Module exports
├── api/
│   └── courses.api.js          # Course endpoints
├── components/
│   ├── CourseCard.jsx
│   ├── CourseFilter.jsx
│   ├── CourseLessons.jsx
│   ├── CourseReviews.jsx
│   └── ... other course components
├── hooks/
│   ├── useCourses.js           # Fetch courses hook
│   ├── useCourseDetail.js      # Single course hook
│   └── ... other course hooks
└── pages/
    ├── CoursesList.jsx         # Browse all courses
    ├── CourseDetails.jsx       # Single course detail
    └── WatchWindow.jsx         # Video player & lessons
```

**Key Responsibilities:**
- Course browsing & filtering
- Course details display
- Video streaming
- Course reviews & ratings
- Search functionality

---

### 👨‍🏫 **Instructor Module** (`features/instructor/`)

Course creation, management, and student tracking for instructors.

**Structure:**
```
instructor/
├── index.js                    # Module exports
├── api/
│   └── instructor.api.js       # Instructor endpoints
├── components/
│   ├── CourseForm/
│   ├── LessonEditor.jsx
│   ├── StudentList.jsx
│   └── ... other instructor components
├── hooks/
│   ├── useInstructorCourses.js
│   ├── useInstructorStudents.js
│   └── ... other instructor hooks
├── pages/
│   ├── Dashboard.jsx           # Instructor overview
│   ├── AddCourseWizard.jsx     # Course creation wizard
│   ├── EditCourse.jsx          # Course editor
│   ├── MyCourses.jsx           # Courses list
│   └── StudentEnrolled.jsx     # Enrolled students view
└── utils/
    └── ... instructor utilities
```

**Key Responsibilities:**
- Course creation & editing
- Lesson management
- Student enrollment tracking
- Course analytics
- Revenue/earnings dashboard

---

### 💳 **Payment Module** (`features/payment/`)

Payment processing and billing management using Stripe.

**Structure:**
```
payment/
├── api/
│   └── payment.api.js          # Stripe payment endpoints
├── components/
│   ├── PaymentForm.jsx
│   ├── CheckoutModal.jsx
│   └── ... payment components
├── hooks/
│   └── usePayment.js
└── pages/
    ├── PaymentSuccessPage.jsx
    ├── PaymentCancelPage.jsx
    └── PaymentHistoryPage.jsx
```

**Key Responsibilities:**
- Stripe integration
- Checkout process
- Payment history
- Invoice generation
- Refund handling

---

### 👤 **Profile Module** (`features/profile/`)

User profile management and account settings.

**Structure:**
```
profile/
├── index.js                    # Module exports
├── api/
│   └── profile.api.js          # Profile endpoints
├── components/
│   ├── ProfileForm.jsx
│   ├── AvatarUpload.jsx
│   └── ... profile components
└── pages/
    └── Profile.jsx
```

**Key Responsibilities:**
- Profile viewing & editing
- Avatar management
- Account settings
- Password change

---

### 👨‍🎓 **Student Module** (`features/student/`)

Student dashboard, course browsing, and enrollment management.

**Structure:**
```
student/
├── index.js                    # Module exports
├── api/
│   └── student.api.js          # Student endpoints
├── components/
│   ├── EnrollmentCard.jsx
│   ├── ProgressTracker.jsx
│   └── ... student components
├── hooks/
│   ├── useStudentEnrollments.js
│   ├── useStudentProgress.js
│   └── ... other student hooks
└── pages/
    ├── Home.jsx                # Student home/dashboard
    ├── MyEnrollments.jsx       # Enrolled courses
    └── InstructorApplicationPage.jsx
```

**Key Responsibilities:**
- Course browsing & filtering
- Course enrollment
- Progress tracking
- Certificate management
- Enrollment history

---

## Services & API

### API Service Layer (`services/`)

Centralized API communication and business logic.

#### **Axios Configuration** (`services/api/axios.js`)

```javascript
// Features:
- Base URL configuration (supports environment variables)
- Request/Response interceptors
- Automatic token attachment to requests
- Error handling & response transformation
- Timeout configuration
- Automatic logout on 401 (Unauthorized)
```

#### **Error Handler** (`services/api/errorHandler.js`)

```javascript
// Handles:
- API errors with proper messages
- HTTP status code mapping
- User notifications
- Error logging
```

#### **API Endpoints** (`services/api/index.js`)

Aggregates all API calls from different modules.

### Utilities (`services/utils/`)

**Token Management** (`tokenUtils.js`)
```javascript
- getToken()      // Retrieve JWT from storage
- setToken()      // Save JWT to storage
- removeToken()   // Clear token on logout
- isTokenValid()  // Check token expiration
```

**Storage** (`storage.js`)
```javascript
- Wrapper around localStorage
- Type-safe storage operations
- Data serialization/deserialization
```

---

## State Management

### Context API Architecture

Using **React Context API** with custom hooks for state management.

#### **1. AuthContext** (`store/contexts/AuthContext.jsx`)

**State:**
```javascript
{
  user: { id, email, name, role },
  token: JWT_TOKEN,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
```javascript
- login(email, password)
- signup(userData)
- logout()
- refreshToken()
- updateUserData()
```

**Hook:**
```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

---

#### **2. ProfileContext** (`store/contexts/ProfileContext.jsx`)

**State:**
```javascript
{
  profile: { avatar, bio, phone, address },
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
```javascript
- fetchProfile()
- updateProfile(data)
- uploadAvatar(file)
```

**Hook:**
```javascript
const { profile, updateProfile } = useProfile();
```

---

#### **3. CourseContext** (`store/contexts/CourseContext.jsx`)

**State:**
```javascript
{
  courses: [],
  selectedCourse: null,
  filters: { category, level, price },
  pagination: { page, limit, total },
  isLoading: boolean
}
```

**Actions:**
```javascript
- fetchCourses(filters)
- fetchCourseDetail(id)
- applyCourseFilter(filters)
- enrollCourse(courseId)
```

**Hook:**
```javascript
const { courses, selectedCourse, enrollCourse } = useCourseContext();
```

---

#### **4. UIContext** (`store/contexts/UIContext.jsx`)

**State:**
```javascript
{
  theme: 'light' | 'dark',
  sidebarOpen: boolean,
  notifications: [],
  modals: { isOpen, content, type }
}
```

**Actions:**
```javascript
- toggleTheme()
- toggleSidebar()
- addNotification(msg)
- openModal(content)
```

**Hook:**
```javascript
const { theme, toggleTheme, addNotification } = useUI();
```

---

#### **AppProvider** (`store/AppProvider.jsx`)

Combines all contexts in correct dependency order:

```javascript
<AuthProvider>              // Must be first
  <ProfileProvider>         // Depends on Auth
    <UIProvider>
      <CourseProvider>
        {children}
      </CourseProvider>
    </UIProvider>
  </ProfileProvider>
</AuthProvider>
```

---

## Shared Resources

### Components (`shared/components/`)

Reusable components used across the application.

| Component | Purpose |
|-----------|---------|
| `Navbar.jsx` | Top navigation bar |
| `Footer.jsx` | Footer component |
| `Loading.jsx` | Loading spinner |
| `Modal.jsx` | Reusable modal dialog |
| `Pagination.jsx` | Pagination controls |
| `Rating.jsx` | Star rating component |
| `UnsavedChangesModal.jsx` | Warn before leaving unsaved form |

### Constants (`shared/constants/`)

**API Constants** (`api.js`)
```javascript
- API endpoints
- HTTP methods
- Status codes
- Error messages
```

**Routes** (`routes.js`)
```javascript
- All route paths as constants
- Prevents typos in route references
```

**Roles** (`roles.js`)
```javascript
- User role definitions
- Permission mappings
```

**Config** (`config.js`)
```javascript
- Feature flags
- App configuration
- Limits & defaults
```

### Custom Hooks (`shared/hooks/`)

| Hook | Purpose |
|------|---------|
| `useDebounce` | Debounce input values |
| `useOutsideClick` | Detect clicks outside element |
| `usePagination` | Manage pagination state |
| `useScrollToTop` | Auto scroll to top on page change |

### Utilities (`shared/utils/`)

| Utility | Purpose |
|---------|---------|
| `formatters.js` | Format dates, currency, text |
| `validators.js` | Validate forms & data |
| `helpers.js` | General helper functions |
| `avatarColors.js` | Avatar color schemes |

### API Utilities (`shared/api/`)

**Pagination Helper** (`paginationHelper.js`)
```javascript
- Calculate pagination info
- Generate page numbers
- Handle limit/offset
```

**File Upload** (`upload.api.js`)
```javascript
- Handle file uploads
- Form data preparation
- Progress tracking
```

**Pre-load Data** (`preLoadData.api.js`)
```javascript
- Pre-load categories
- Pre-load featured courses
- Cache data efficiently
```

---

## Routing

### Router Configuration (`routes/AppRouter.jsx`)

Uses **React Router v6** with lazy loading:

```javascript
// Protected Routes
<Route element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
  <Route path="/student" element={<Home />} />
  <Route path="/student/enrollments" element={<MyEnrollments />} />
</Route>

// Role-Based Routes
<Route element={<RoleBasedRoute allowedRoles={['INSTRUCTOR']}>
  <InstructorLayout />
</RoleBasedRoute>}>
  <Route path="/instructor" element={<Dashboard />} />
</Route>
```

### Route Protection (`routes/ProtectedRoute.jsx`)

- Checks if user is authenticated
- Redirects to login if not
- Shows loading state

```javascript
<ProtectedRoute>
  <ProtectedComponent />
</ProtectedRoute>
```

### Role-Based Access (`routes/RoleBasedRoute.jsx`)

- Validates user role
- Prevents unauthorized access
- Redirects to appropriate page

```javascript
<RoleBasedRoute allowedRoles={['ADMIN', 'INSTRUCTOR']}>
  <AdminPanel />
</RoleBasedRoute>
```

---

## Layouts

### Layout Components (`layouts/`)

Different layouts for different user roles and sections:

#### **StudentLayout**
- Sidebar with student menu
- Navbar with search
- Footer
- Main content area

#### **InstructorLayout**
- Instructor-specific sidebar
- Dashboard controls
- Course management tools
- Analytics widgets

#### **AdminLayout**
- Admin dashboard sidebar
- System-wide controls
- User management tools
- Moderation queue

#### **AuthLayout**
- Minimal layout (no sidebar)
- Centered content
- No navbar/footer
- For login/signup pages

**Layout Structure:**
```javascript
export default function StudentLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Navbar />
        <Outlet /> {/* Page content */}
        <Footer />
      </main>
    </div>
  );
}
```

---

## Development Guide

### Adding a New Feature

**Step 1: Create Feature Module**
```
src/features/newFeature/
├── index.js
├── api/
│   └── newFeature.api.js
├── components/
│   └── NewFeatureComponent.jsx
├── hooks/
│   └── useNewFeature.js
└── pages/
    └── NewFeaturePage.jsx
```

**Step 2: Create API Service**
```javascript
// src/features/newFeature/api/newFeature.api.js
import api from '../../../services/api';

export const fetchNewFeatureData = async () => {
  const response = await api.get('/newfeature');
  return response.data;
};
```

**Step 3: Create Custom Hook**
```javascript
// src/features/newFeature/hooks/useNewFeature.js
import { useState, useEffect } from 'react';
import { fetchNewFeatureData } from '../api/newFeature.api';

export const useNewFeature = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchNewFeatureData();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, loadData };
};
```

**Step 4: Create Component**
```javascript
// src/features/newFeature/components/NewFeatureComponent.jsx
import { useNewFeature } from '../hooks/useNewFeature';

export default function NewFeatureComponent() {
  const { data, loading } = useNewFeature();

  if (loading) return <Loading />;

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

**Step 5: Add Route**
```javascript
// In src/routes/AppRouter.jsx
const NewFeaturePage = lazy(() => 
  import('../features/newFeature/pages/NewFeaturePage')
);

// Add to Routes
<Route path="/newfeature" element={<NewFeaturePage />} />
```

---

### Naming Conventions

```
Components:        PascalCase (HomeComponent.jsx)
Pages:            PascalCase (HomePage.jsx)
Hooks:            camelCase (useAuth.js)
API files:        moduleName.api.js
Utils:            descriptive (tokenUtils.js)
Constants:        UPPERCASE (API_BASE_URL)
Contexts:         *Context.jsx (AuthContext.jsx)
Styles:           Component.css (App.css)
```

### File Organization Best Practices

1. **Group by feature**, not by type
2. **Co-locate related files** (hook + component)
3. **Keep components small** and focused
4. **Reuse shared components** from `shared/`
5. **Use index.js for exports** to simplify imports

### Import Patterns

```javascript
// ❌ Avoid: Deep relative imports
import Component from '../../../shared/components/Component';

// ✅ Better: Use centralized exports
import { Component } from '@/shared';  // if configured
// Or organize exports in index.js files
import { Component } from '../shared/components';
```

---

### Environment Variables

Create `.env` file in project root:

```env
VITE_API_BASE_URL=https://localhost:7244/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Loop Learn
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Common Development Tasks

### Fetching Data with Loading State

```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.get('/endpoint');
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Form Handling with Validation

```javascript
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm(formData);
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    await api.post('/endpoint', formData);
    // Show success message
  } catch (error) {
    // Handle error
  }
};
```

### Using Global State (Context)

```javascript
import { useAuth } from '../store/AppProvider';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

---

## Performance Optimization Tips

1. **Lazy Load Routes** - Already implemented in AppRouter
2. **Memoize Components** - Use `React.memo()` for expensive renders
3. **Use useCallback** - Prevent unnecessary function recreations
4. **Debounce Inputs** - Use `useDebounce` hook for search/filters
5. **Code Split** - Keep bundle size manageable
6. **Optimize Images** - Compress and use proper formats
7. **Pagination** - Load data in pages, not all at once
8. **Caching** - Cache API responses when appropriate

---

## Debugging Tips

### Using React DevTools

- Inspect component hierarchy
- View props and state changes
- Track context values
- Profile performance

### Using Network Tab

- Monitor API requests
- Check response times
- Verify payload structure
- Debug CORS issues

### Console Logging Best Practices

```javascript
// ❌ Avoid
console.log('data');

// ✅ Better
console.log('[UserAPI]', 'User fetched:', user);
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` v18.2 | UI library |
| `react-router-dom` v6.22 | Client-side routing |
| `axios` v1.6 | HTTP client |
| `tailwindcss` v3.4 | CSS framework |
| `react-icons` v5 | Icon library |
| `framer-motion` v11 | Animations |
| `recharts` v3.8 | Charts & graphs |
| `@stripe/react-stripe-js` v6 | Payment processing |
| `jwt-decode` v4 | JWT token parsing |
| `date-fns` v4 | Date utilities |

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

---

## File Size Guidelines

Keep files manageable:
- **Components**: < 200 lines
- **Hooks**: < 100 lines
- **API files**: < 150 lines
- **Utils**: < 100 lines

Split larger files into smaller, focused modules.

---

## Related Documentation

- [React Documentation](https://react.dev)
- [React Router Guide](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)

---

## Contributing Guidelines

1. Follow naming conventions
2. Keep components focused and small
3. Add prop validation (JSDoc or PropTypes)
4. Write descriptive comments for complex logic
5. Test components before committing
6. Update documentation when adding features

---

**Last Updated**: 2026-06-22  
**Version**: 1.0.0  
**Maintainers**: Development Team

---

