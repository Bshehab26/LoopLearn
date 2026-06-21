// api/chatService.js

const API_BASE_URL = 'http://localhost:8000';  // or 'http://127.0.0.1:8000'
export const chatService = {
  // Send a message
  sendMessage: async (message, sessionId) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Request failed: ${response.status}`);
    }
    
    return response.json();
  },

  // Get conversation history
  getHistory: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },

  // Clear session
  clearSession: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear session');
    return response.json();
  },

  // Health check
  checkHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Backend unavailable');
    return response.json();
  },

  // Search courses
  searchCourses: async (query) => {
    const response = await fetch(`${API_BASE_URL}/courses/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search courses');
    return response.json();
  },

  // Get single course
  getCourse: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Course '${courseId}' not found`);
    }
    return response.json();
  },

  // Get all courses
  getCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },
};