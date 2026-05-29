// src/services/utils/tokenUtils.js
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const TOKEN_KEY = 'looplearn_token';
export const USER_KEY = 'looplearn_user';

// .NET ClaimTypes map to these URIs in the JWT
const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const CLAIM_EMAIL = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const CLAIM_NAMEIDENT = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

/** Save JWT to a secure cookie */
export function saveToken(token, expiresOn) {
  const expires = expiresOn ? new Date(expiresOn) : undefined;
  Cookies.set(TOKEN_KEY, token, {
    expires,
    path: '/',
    sameSite: 'Strict',
    // secure: true, // enable in production with HTTPS
  });
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Read raw JWT string from cookie */
export function getToken() {
  return Cookies.get(TOKEN_KEY) || null;
}

/** Save full user data to localStorage (for avatar and extra data) */
export function saveUser(user) {
  if (user) {
    // Don't store token in localStorage (already in cookie)
    const { token, ...userWithoutToken } = user;
    localStorage.setItem(USER_KEY, JSON.stringify(userWithoutToken));
  }
}

/** Get user data from localStorage */
export function getUserFromStorage() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/** Update user avatar in localStorage */
export function updateStoredAvatar(avatarUrl) {
  const user = getUserFromStorage();
  if (user) {
    user.avatar = avatarUrl;
    saveUser(user);
  }
}

/** Clear user data */
export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

/** Decode token and return user payload, or null if missing/invalid/expired */
export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // Check expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }
    
    // Get stored user for avatar
    const storedUser = getUserFromStorage();
    
    return {
      id: decoded[CLAIM_NAMEIDENT] || decoded.sub || null,
      username: decoded[CLAIM_NAME] || decoded.name || null,
      email: decoded[CLAIM_EMAIL] || decoded.email || null,
      role: decoded[CLAIM_ROLE] || decoded.role || null,
      avatar: storedUser?.avatar || null, // ✅ Restore avatar from storage
    };
  } catch {
    return null;
  }
}