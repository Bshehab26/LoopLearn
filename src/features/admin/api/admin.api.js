// src/features/admin/api/admin.api.js
import api from '../../../services/api/axios';
import { handleApiError } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================

const ADMIN_ENDPOINTS = {
  DASHBOARD: '/Admin/dashboard',
  USERS: '/Admin/users',
  USER_ROLE: (id) => `/Admin/users/${id}/role`,
  USER_DELETE: (id) => `/Admin/users/${id}`,
  COURSES: '/Admin/courses',
  COURSE_APPROVE: (id) => `/Admin/courses/${id}/approve`,
  COURSE_REJECT: (id) => `/Admin/courses/${id}/reject`,
  COURSE_DELETE: (id) => `/Admin/courses/${id}`,
  CATEGORIES: '/Admin/categories',
  CATEGORY_CREATE: '/Admin/categories',
  CATEGORY_UPDATE: (id) => `/Admin/categories/${id}`,
  CATEGORY_DELETE: (id) => `/Admin/categories/${id}`,
  REPORTS: '/Admin/reports',
  STATS: '/Admin/stats',
};

// ============================================================================
// Mock Data (Remove when backend is ready)
// ============================================================================

const MOCK_STATS = {
  totalUsers: 1247,
  totalStudents: 1156,
  totalInstructors: 86,
  totalAdmins: 5,
  totalCourses: 342,
  pendingCourses: 23,
  publishedCourses: 289,
  draftCourses: 30,
  totalRevenue: 158940,
  monthlyRevenue: 28450,
  averageRating: 4.7,
  totalEnrollments: 8950,
};

const MOCK_USERS = [
  { id: '1', username: 'john_doe', email: 'john@example.com', role: 'Student', status: 'Active', joinDate: '2024-01-15', enrolledCourses: 5 },
  { id: '2', username: 'jane_smith', email: 'jane@example.com', role: 'Instructor', status: 'Active', joinDate: '2024-02-20', totalCourses: 8, totalStudents: 234 },
  { id: '3', username: 'admin_user', email: 'admin@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-01' },
  { id: '4', username: 'peter_parker', email: 'peter@example.com', role: 'Student', status: 'Suspended', joinDate: '2024-03-10', enrolledCourses: 2 },
  { id: '5', username: 'tony_stark', email: 'tony@example.com', role: 'Instructor', status: 'Active', joinDate: '2024-02-01', totalCourses: 12, totalStudents: 1250 },
];

const MOCK_COURSES = [
  { id: 1, title: 'React Masterclass', instructor: 'Jane Smith', category: 'Programming', price: 49.99, status: 'Published', enrolled: 234, rating: 4.8, createdAt: '2024-02-15' },
  { id: 2, title: 'Python for Data Science', instructor: 'Tony Stark', category: 'Data Science', price: 59.99, status: 'Pending', enrolled: 0, rating: 0, createdAt: '2024-05-20' },
  { id: 3, title: 'UI/UX Design Fundamentals', instructor: 'Sarah Lee', category: 'Design', price: 39.99, status: 'Published', enrolled: 189, rating: 4.6, createdAt: '2024-03-01' },
  { id: 4, title: 'Advanced Node.js', instructor: 'Mike Chen', category: 'Programming', price: 79.99, status: 'Draft', enrolled: 0, rating: 0, createdAt: '2024-05-10' },
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'Programming', description: 'Learn programming languages and software development', courseCount: 98, createdAt: '2024-01-01' },
  { id: 2, name: 'Data Science', description: 'Data analysis, machine learning, and AI', courseCount: 67, createdAt: '2024-01-01' },
  { id: 3, name: 'Design', description: 'UI/UX, graphic design, and creative skills', courseCount: 54, createdAt: '2024-01-01' },
  { id: 4, name: 'Business', description: 'Entrepreneurship, marketing, and management', courseCount: 43, createdAt: '2024-01-01' },
  { id: 5, name: 'Cybersecurity', description: 'Network security and ethical hacking', courseCount: 32, createdAt: '2024-01-15' },
];

// ============================================================================
// Mock API Functions (Replace with real API calls when backend is ready)
// ============================================================================

const USE_MOCK = true; // Set to false when backend is ready

// ============================================================================
// Dashboard & Stats
// ============================================================================

export const getDashboardStats = async () => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: MOCK_STATS, message: 'Stats retrieved successfully' };
  }
  
  try {
    const response = await api.get(ADMIN_ENDPOINTS.DASHBOARD);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAdminStats = getDashboardStats;

// ============================================================================
// User Management
// ============================================================================

export const getUsers = async (params = {}) => {
  const { page = 1, limit = 10, search = '', role = '', status = '' } = params;
  
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredUsers = [...MOCK_USERS];
    
    if (search) {
      filteredUsers = filteredUsers.filter(u => 
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (role) filteredUsers = filteredUsers.filter(u => u.role === role);
    if (status) filteredUsers = filteredUsers.filter(u => u.status === status);
    
    const start = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(start, start + limit);
    
    return {
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
      message: 'Users retrieved successfully',
    };
  }
  
  try {
    const response = await api.get(ADMIN_ENDPOINTS.USERS, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateUserRole = async (userId, newRole) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex].role = newRole;
      return { success: true, message: 'User role updated successfully', data: MOCK_USERS[userIndex] };
    }
    return { success: false, message: 'User not found' };
  }
  
  try {
    const response = await api.put(ADMIN_ENDPOINTS.USER_ROLE(userId), { role: newRole });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteUser = async (userId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      MOCK_USERS.splice(userIndex, 1);
      return { success: true, message: 'User deleted successfully' };
    }
    return { success: false, message: 'User not found' };
  }
  
  try {
    const response = await api.delete(ADMIN_ENDPOINTS.USER_DELETE(userId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const suspendUser = async (userId) => {
  // Additional endpoint for suspending users
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex].status = 'Suspended';
      return { success: true, message: 'User suspended successfully', data: MOCK_USERS[userIndex] };
    }
    return { success: false, message: 'User not found' };
  }
  
  try {
    const response = await api.post(ADMIN_ENDPOINTS.USER_ROLE(userId), { action: 'suspend' });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const activateUser = async (userId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex].status = 'Active';
      return { success: true, message: 'User activated successfully', data: MOCK_USERS[userIndex] };
    }
    return { success: false, message: 'User not found' };
  }
  
  try {
    const response = await api.post(ADMIN_ENDPOINTS.USER_ROLE(userId), { action: 'activate' });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Course Management
// ============================================================================

export const getAdminCourses = async (params = {}) => {
  const { page = 1, limit = 10, search = '', status = '', category = '' } = params;
  
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredCourses = [...MOCK_COURSES];
    
    if (search) {
      filteredCourses = filteredCourses.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status) filteredCourses = filteredCourses.filter(c => c.status === status);
    if (category) filteredCourses = filteredCourses.filter(c => c.category === category);
    
    const start = (page - 1) * limit;
    const paginatedCourses = filteredCourses.slice(start, start + limit);
    
    return {
      success: true,
      data: paginatedCourses,
      pagination: {
        page,
        limit,
        total: filteredCourses.length,
        totalPages: Math.ceil(filteredCourses.length / limit),
      },
      message: 'Courses retrieved successfully',
    };
  }
  
  try {
    const response = await api.get(ADMIN_ENDPOINTS.COURSES, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const approveCourse = async (courseId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const courseIndex = MOCK_COURSES.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      MOCK_COURSES[courseIndex].status = 'Published';
      return { success: true, message: 'Course approved successfully', data: MOCK_COURSES[courseIndex] };
    }
    return { success: false, message: 'Course not found' };
  }
  
  try {
    const response = await api.put(ADMIN_ENDPOINTS.COURSE_APPROVE(courseId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const rejectCourse = async (courseId, reason = '') => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const courseIndex = MOCK_COURSES.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      MOCK_COURSES[courseIndex].status = 'Rejected';
      return { success: true, message: 'Course rejected successfully', data: MOCK_COURSES[courseIndex] };
    }
    return { success: false, message: 'Course not found' };
  }
  
  try {
    const response = await api.put(ADMIN_ENDPOINTS.COURSE_REJECT(courseId), { reason });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteCourse = async (courseId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const courseIndex = MOCK_COURSES.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      MOCK_COURSES.splice(courseIndex, 1);
      return { success: true, message: 'Course deleted successfully' };
    }
    return { success: false, message: 'Course not found' };
  }
  
  try {
    const response = await api.delete(ADMIN_ENDPOINTS.COURSE_DELETE(courseId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Category Management
// ============================================================================

export const getCategories = async () => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: MOCK_CATEGORIES, message: 'Categories retrieved successfully' };
  }
  
  try {
    const response = await api.get(ADMIN_ENDPOINTS.CATEGORIES);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createCategory = async (categoryData) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCategory = {
      id: MOCK_CATEGORIES.length + 1,
      ...categoryData,
      courseCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    MOCK_CATEGORIES.push(newCategory);
    return { success: true, message: 'Category created successfully', data: newCategory };
  }
  
  try {
    const response = await api.post(ADMIN_ENDPOINTS.CATEGORY_CREATE, categoryData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const categoryIndex = MOCK_CATEGORIES.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
      MOCK_CATEGORIES[categoryIndex] = { ...MOCK_CATEGORIES[categoryIndex], ...categoryData };
      return { success: true, message: 'Category updated successfully', data: MOCK_CATEGORIES[categoryIndex] };
    }
    return { success: false, message: 'Category not found' };
  }
  
  try {
    const response = await api.put(ADMIN_ENDPOINTS.CATEGORY_UPDATE(categoryId), categoryData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteCategory = async (categoryId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const categoryIndex = MOCK_CATEGORIES.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
      MOCK_CATEGORIES.splice(categoryIndex, 1);
      return { success: true, message: 'Category deleted successfully' };
    }
    return { success: false, message: 'Category not found' };
  }
  
  try {
    const response = await api.delete(ADMIN_ENDPOINTS.CATEGORY_DELETE(categoryId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Reports
// ============================================================================

export const getReports = async (params = {}) => {
  const { type = 'all', startDate, endDate } = params;
  
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const reports = {
      revenue: {
        daily: [1250, 2300, 1890, 3420, 2780, 4100, 3850],
        weekly: [12500, 15800, 14200, 18900, 21000],
        monthly: [45000, 52000, 48900, 58450],
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      },
      enrollments: {
        daily: [45, 78, 62, 94, 85, 120, 110],
        weekly: [320, 450, 380, 520, 610],
        monthly: [1450, 1680, 1520, 1890],
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
      ],
    };
    
    return { success: true, data: reports, message: 'Reports generated successfully' };
  }
  
  try {
    const response = await api.get(ADMIN_ENDPOINTS.REPORTS, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};