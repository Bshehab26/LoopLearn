// src/services/utils/storage.js

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
  LANGUAGE: 'language',
  LAST_VISITED: 'lastVisited',
};

export const storage = {
  // User
  getUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  
  setUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
  
  updateUser: (updates) => {
    const currentUser = storage.getUser();
    if (currentUser) {
      storage.setUser({ ...currentUser, ...updates });
    }
  },
  
  // Token
  getToken: () => {
    const user = storage.getUser();
    return user?.token || localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
  
  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },
  
  removeToken: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },
  
  // Theme
  getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME),
  setTheme: (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme),
  
  // Language
  getLanguage: () => localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en',
  setLanguage: (lang) => localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang),
  
  // Last Visited
  getLastVisited: () => localStorage.getItem(STORAGE_KEYS.LAST_VISITED),
  setLastVisited: (path) => localStorage.setItem(STORAGE_KEYS.LAST_VISITED, path),
  
  // Clear all
  clearAll: () => {
    localStorage.clear();
    sessionStorage.clear();
  },
};