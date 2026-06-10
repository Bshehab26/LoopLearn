// src/features/admin/api/admin.api.js

import api from '../../../services/api/axios';
import { handleApiError } from '../../../services/api/errorHandler';

// ============================================================================
// Constants - ENDPOINTS
// ============================================================================

const ADMIN_ENDPOINTS = {
  // ✅ REAL BACKEND ENDPOINTS (from AdminController.cs)
  PENDING_COURSES: '/Admin/courses/pending',
  APPROVE_COURSE: (id) => `/Admin/courses/${id}/approve`,
  REJECT_COURSE: (id) => `/Admin/courses/${id}/reject`,
  REVIEW_HISTORY: (id) => `/Admin/courses/${id}/review-history`,
  
  // 🟡 PENDING (will use mock data until backend implements)
  DASHBOARD_STATS: '/Admin/stats',
  ALL_COURSES: '/Admin/courses',
  USERS: '/Admin/users',
  CATEGORIES: '/Admin/categories',
  REPORTS: '/Admin/reports',
};

// ============================================================================
// ✅ REAL API CALLS (Working with backend)
// ============================================================================

export const getPendingCourses = async () => {
  try {
    console.log('[AdminAPI] Fetching pending courses...');
    const response = await api.get(ADMIN_ENDPOINTS.PENDING_COURSES);
    console.log('[AdminAPI] Pending courses response:', response.data);
    
    return {
      success: true,
      data: response.data?.data || [],
      message: response.data?.message
    };
  } catch (error) {
    console.error('[AdminAPI] Get pending courses error:', error);
    return handleApiError(error);
  }
};

export const approveCourse = async (courseId) => {
  try {
    console.log('[AdminAPI] Approving course:', courseId);
    const response = await api.post(ADMIN_ENDPOINTS.APPROVE_COURSE(courseId));
    console.log('[AdminAPI] Approve response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] Approve course error:', error);
    return handleApiError(error);
  }
};

export const rejectCourse = async (courseId, comment) => {
  try {
    console.log('[AdminAPI] Rejecting course:', courseId, 'Reason:', comment);
    const response = await api.post(ADMIN_ENDPOINTS.REJECT_COURSE(courseId), { comment });
    console.log('[AdminAPI] Reject response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] Reject course error:', error);
    return handleApiError(error);
  }
};

export const getReviewHistory = async (courseId) => {
  try {
    const response = await api.get(ADMIN_ENDPOINTS.REVIEW_HISTORY(courseId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// 🟡 MOCK DATA API CALLS (Until backend is ready)
// ============================================================================

// Mock Dashboard Stats
export const getDashboardStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    data: {
      totalUsers: 1247,
      totalStudents: 1156,
      totalInstructors: 86,
      totalAdmins: 5,
      totalCourses: 342,
      pendingCourses: 0,
      publishedCourses: 289,
      draftCourses: 30,
      totalRevenue: 158940,
      monthlyRevenue: 28450,
      averageRating: 4.7,
      totalEnrollments: 8950,
    }
  };
};

// Mock All Courses
export const getAdminCourses = async (params = {}) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const mockCourses = [
    { id: 1, title: 'React Masterclass 2024', instructor: 'Dr. Sarah Johnson', category: 'Programming', price: 49.99, status: 'Published', enrolled: 234, rating: 4.8, createdAt: '2024-01-15' },
    { id: 2, title: 'Advanced Python Programming', instructor: 'Prof. Michael Chen', category: 'Programming', price: 59.99, status: 'Published', enrolled: 189, rating: 4.6, createdAt: '2024-02-01' },
    { id: 3, title: 'UI/UX Design Mastery', instructor: 'Emily Rodriguez', category: 'Design', price: 39.99, status: 'Draft', enrolled: 0, rating: 0, createdAt: '2024-03-10' },
    { id: 4, title: 'Data Science Bootcamp', instructor: 'Dr. James Wilson', category: 'Data Science', price: 89.99, status: 'Pending', enrolled: 0, rating: 0, createdAt: '2024-03-15' },
    { id: 5, title: 'Cybersecurity Fundamentals', instructor: 'Lisa Thompson', category: 'Security', price: 49.99, status: 'Published', enrolled: 156, rating: 4.7, createdAt: '2024-01-20' },
    { id: 6, title: 'AWS Cloud Practitioner', instructor: 'Mark Williams', category: 'Cloud', price: 79.99, status: 'Published', enrolled: 98, rating: 4.5, createdAt: '2024-02-10' },
    { id: 7, title: 'Digital Marketing Mastery', instructor: 'Jessica Brown', category: 'Marketing', price: 44.99, status: 'Draft', enrolled: 0, rating: 0, createdAt: '2024-03-20' },
  ];
  
  const { page = 1, limit = 10, search = '', status = '' } = params;
  let filtered = [...mockCourses];
  
  if (search) {
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (status) {
    filtered = filtered.filter(c => c.status === status);
  }
  
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  
  return {
    success: true,
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    }
  };
};

// Mock Users
export const getUsers = async (params = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockUsers = [
    { id: '1', username: 'john_doe', email: 'john@example.com', role: 'Student', status: 'Active', joinDate: '2024-01-15', enrolledCourses: 5, avatar: null },
    { id: '2', username: 'jane_smith', email: 'jane@example.com', role: 'Instructor', status: 'Active', joinDate: '2024-02-20', totalCourses: 8, totalStudents: 234, avatar: null },
    { id: '3', username: 'mike_johnson', email: 'mike@example.com', role: 'Student', status: 'Active', joinDate: '2024-01-10', enrolledCourses: 3, avatar: null },
    { id: '4', username: 'sarah_williams', email: 'sarah@example.com', role: 'Instructor', status: 'Suspended', joinDate: '2024-02-01', totalCourses: 3, totalStudents: 45, avatar: null },
    { id: '5', username: 'admin_user', email: 'admin@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-01', avatar: null },
  ];
  
  const { page = 1, limit = 10, search = '', role = '', status = '' } = params;
  let filtered = [...mockUsers];
  
  if (search) {
    filtered = filtered.filter(u => 
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (role) filtered = filtered.filter(u => u.role === role);
  if (status) filtered = filtered.filter(u => u.status === status);
  
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  
  return {
    success: true,
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    }
  };
};

export const updateUserRole = async (userId, newRole) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'User role updated successfully' };
};

export const deleteUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'User deleted successfully' };
};

export const suspendUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'User suspended successfully' };
};

export const activateUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'User activated successfully' };
};

// Mock Categories
export const getCategories = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    success: true,
    data: [
      { id: 1, name: 'Programming', description: 'Learn programming languages and software development', courseCount: 98, createdAt: '2024-01-01' },
      { id: 2, name: 'Data Science', description: 'Data analysis, machine learning, and AI', courseCount: 67, createdAt: '2024-01-01' },
      { id: 3, name: 'Design', description: 'UI/UX, graphic design, and creative skills', courseCount: 54, createdAt: '2024-01-01' },
      { id: 4, name: 'Business', description: 'Entrepreneurship, marketing, and management', courseCount: 43, createdAt: '2024-01-01' },
      { id: 5, name: 'Cybersecurity', description: 'Network security and ethical hacking', courseCount: 32, createdAt: '2024-01-15' },
      { id: 6, name: 'Cloud Computing', description: 'AWS, Azure, GCP and cloud technologies', courseCount: 28, createdAt: '2024-02-01' },
    ]
  };
};

export const createCategory = async (categoryData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { 
    success: true, 
    message: 'Category created successfully', 
    data: { 
      id: Date.now(), 
      ...categoryData, 
      courseCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    } 
  };
};

export const updateCategory = async (categoryId, categoryData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Category updated successfully' };
};

export const deleteCategory = async (categoryId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Category deleted successfully' };
};

// Mock Reports
export const getReports = async (params = {}) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    data: {
      revenue: { 
        monthly: [45000, 52000, 48900, 58450, 62000, 71000], 
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] 
      },
      enrollments: { 
        monthly: [1450, 1680, 1520, 1890, 2100, 2450] 
      },
      topCourses: [
        { id: 1, title: 'React Masterclass', enrollments: 234, revenue: 11688 },
        { id: 2, title: 'Python for Data Science', enrollments: 189, revenue: 11322 },
        { id: 3, title: 'UI/UX Design', enrollments: 156, revenue: 9360 },
      ],
      topInstructors: [
        { id: 1, name: 'Jane Smith', courses: 8, students: 234, revenue: 18720 },
        { id: 2, name: 'Tony Stark', courses: 12, students: 1250, revenue: 62400 },
        { id: 3, name: 'Sarah Lee', courses: 5, students: 189, revenue: 11340 },
      ]
    }
  };
};

// Alias for backwards compatibility
export const getAllCourses = getAdminCourses;