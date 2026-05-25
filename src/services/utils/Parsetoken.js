/**
 * Parsetoken.js
 * Utility functions for JWT token parsing and validation.
 * 
 * @module services/utils/Parsetoken
 */

/**
 * Extract user ID from JWT token
 * Supports multiple claim types (ASP.NET Identity, custom claims)
 * @param {string} token - JWT token
 * @returns {number|string|null} User ID or null if invalid
 */
export const getUserIdFromToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('[Parsetoken] Token payload keys:', Object.keys(payload));
    
    // Try multiple possible claim names for user ID
    // ASP.NET Core typically uses these claim types
    const userId = 
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'] ||
      payload.nameid ||
      payload.sub ||
      payload.id ||
      payload.userId ||
      payload.unique_name;
    
    console.log('[Parsetoken] Extracted user ID:', userId);
    return userId;
  } catch (error) {
    console.error('[Parsetoken] Error parsing token:', error);
    return null;
  }
};

/**
 * Extract user role from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} User role or null if invalid
 */
export const getUserRoleFromToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const role = 
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      payload.role ||
      payload.Role;
    
    console.log('[Parsetoken] Extracted user role:', role);
    return role;
  } catch (error) {
    console.error('[Parsetoken] Error parsing token for role:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error('[Parsetoken] Error checking token expiration:', error);
    return true;
  }
};