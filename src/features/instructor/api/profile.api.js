/**
 * instructor/profile.api.js
 * Instructor profile API service for managing instructor profile information.
 * Handles profile retrieval, updates, avatar uploads, and password changes.
 * 
 * @module features/instructor/api/profile.api
 */

import api from '../../../services/api/axios';
import { handleApiError, createApiResponse } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================

/** API endpoints for instructor profile */
const ENDPOINTS = {
  PROFILE: '/Instructor/profile',
  UPDATE: '/Instructor/profile',
  PASSWORD: '/Instructor/profile/password',
  AVATAR: '/Instructor/profile/avatar',
};

/** Base URL for avatar images - Adjust based on your backend configuration */
const AVATAR_BASE_URL = 'https://localhost:7215/api/Instructor/avatar/';
/** Maximum file size for avatar upload (5MB) */
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

/** Allowed avatar mime types */
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/** Allowed file extensions */
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

/** Success messages */
const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  AVATAR_UPDATED: 'Profile photo updated successfully',
};

// Cache for profile data to reduce API calls
let cachedProfileData = null;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Constructs full avatar URL from filename
 * @param {string} avatarFilename - The avatar filename from backend
 * @returns {string|null} Full avatar URL or null
 */
const getAvatarUrl = (avatarFilename) => {
  if (!avatarFilename) return null;
  
  // If it's already a full URL or base64, return as is
  if (avatarFilename.startsWith('http') || avatarFilename.startsWith('data:') || avatarFilename.startsWith('blob:')) {
    return avatarFilename;
  }
  
  // Construct full URL from filename
  return `${AVATAR_BASE_URL}${avatarFilename}`;
};

/**
 * Validates avatar file before upload
 * @param {File} file - The file to validate
 * @returns {Object} { isValid, error }
 */
const validateAvatarFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (!(file instanceof File)) {
    return { isValid: false, error: 'Invalid file type' };
  }
  
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Please select a valid image file (JPEG, PNG, GIF, or WEBP)' };
  }
  
  if (file.size > MAX_AVATAR_SIZE) {
    return { isValid: false, error: `Image must be less than ${MAX_AVATAR_SIZE / (1024 * 1024)}MB` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates file extension against backend requirements
 * @param {File} file - The file to validate
 * @returns {string|null} File extension if valid, null otherwise
 */
const validateFileExtension = (file) => {
  const fileName = file.name.toLowerCase();
  const extension = fileName.split('.').pop();
  return ALLOWED_EXTENSIONS.includes(extension) ? extension : null;
};

/**
 * Generates avatar filename with timestamp and extension
 * @param {File} file - The uploaded file
 * @returns {string} Generated filename
 */
const generateAvatarFileName = (file) => {
  const extension = validateFileExtension(file);
  return `instructor_avatar_${Date.now()}.${extension}`;
};

/**
 * Converts a File object to base64 string for preview
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Normalizes profile data from API response
 * @param {Object} data - Raw API response data
 * @returns {Object} Normalized profile object
 */
const normalizeProfileData = (data) => ({
  id: data.id,
  username: data.username,
  email: data.email,
  firstName: data.firstName || data.fName,
  lastName: data.lastName || data.lName,
  fName: data.firstName || data.fName,
  lName: data.lastName || data.lName,
  phone: data.phone || '',
  avatar: getAvatarUrl(data.avatar), // Convert filename to full URL
  avatarFilename: data.avatar, // Store original filename
  bio: data.bio || '',
  expertise: data.expertise || '',
  totalCourses: data.totalCourses || 0,
  totalStudents: data.totalStudents || 0,
  totalRevenue: data.totalRevenue || 0,
  joinDate: data.joinDate,
  isVerifiedEmail: data.isVerifiedEmail,
  role: 'instructor',
});

/**
 * Prepares update data for API request
 * @param {Object} profileData - Profile data from form
 * @returns {Object} API-ready update object
 */
const prepareUpdateData = (profileData) => ({
  firstName: profileData.firstName || profileData.fName,
  lastName: profileData.lastName || profileData.lName,
  email: profileData.email,
  phone: profileData.phone || '',
  bio: profileData.bio || '',
  expertise: profileData.expertise || '',
});

/**
 * Prepares password change data for API request
 * @param {Object} passwordData - Password data from form
 * @returns {Object} API-ready password object
 */
const preparePasswordData = (passwordData) => ({
  oldPassword: passwordData.oldPassword,
  newPassword: passwordData.newPassword,
});

// ============================================================================
// API Functions
// ============================================================================

/**
 * GET /api/Instructor/profile
 * Fetches the current instructor's profile information
 * 
 * @param {boolean} useCache - Whether to use cached data
 * @returns {Promise<Object>} API response with profile data
 */
export const getInstructorProfile = async (useCache = false) => {
  // Return cached data if requested and available
  if (useCache && cachedProfileData) {
    console.log('[InstructorProfile] Returning cached profile data');
    return createApiResponse(cachedProfileData, true);
  }
  
  try {
    console.log('[InstructorProfile] Fetching profile from API...');
    const response = await api.get(ENDPOINTS.PROFILE);
    const normalizedData = normalizeProfileData(response.data);
    
    // Update cache
    cachedProfileData = normalizedData;
    
    // Store avatar in localStorage for persistence across refreshes
    if (normalizedData.avatar) {
      localStorage.setItem('instructor_avatar', normalizedData.avatar);
    }
    if (normalizedData.avatarFilename) {
      localStorage.setItem('instructor_avatar_filename', normalizedData.avatarFilename);
    }
    
    console.log('[InstructorProfile] Profile fetched successfully');
    return createApiResponse(normalizedData, true);
  } catch (error) {
    console.error('[InstructorProfile] Get profile error:', error);
    return handleApiError(error);
  }
};

/**
 * PUT /api/Instructor/profile
 * Updates the instructor's profile information
 * 
 * @param {Object} profileData - Profile update data
 * @returns {Promise<Object>} API response
 */
export const updateInstructorProfile = async (profileData) => {
  try {
    const updateData = prepareUpdateData(profileData);
    console.log('[InstructorProfile] Update payload:', updateData);
    
    const response = await api.put(ENDPOINTS.UPDATE, updateData);
    
    // Update cache with new data
    if (response.data) {
      cachedProfileData = normalizeProfileData(response.data);
    }
    
    return createApiResponse(response.data, true, SUCCESS_MESSAGES.PROFILE_UPDATED);
  } catch (error) {
    console.error('[InstructorProfile] Update profile error:', error);
    return handleApiError(error);
  }
};

/**
 * PUT /api/Instructor/profile/password
 * Changes the instructor's password
 * 
 * @param {Object} passwordData - Password change data
 * @returns {Promise<Object>} API response
 */
export const changeInstructorPassword = async (passwordData) => {
  try {
    const passwordPayload = preparePasswordData(passwordData);
    console.log('[InstructorProfile] Changing password...');
    
    const response = await api.put(ENDPOINTS.PASSWORD, passwordPayload);
    return createApiResponse(response.data, true, SUCCESS_MESSAGES.PASSWORD_CHANGED);
  } catch (error) {
    console.error('[InstructorProfile] Change password error:', error);
    return handleApiError(error);
  }
};

/**
 * PUT /api/Instructor/profile/avatar
 * Uploads a new avatar image for the instructor
 * IMPORTANT: Backend expects full profile data PLUS avatar filename
 * 
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} API response with avatar URL
 */
export const uploadInstructorAvatar = async (file) => {
  // Validate file
  const validation = validateAvatarFile(file);
  if (!validation.isValid) {
    return createApiResponse(null, false, validation.error);
  }
  
  // Validate file extension
  const fileExtension = validateFileExtension(file);
  if (!fileExtension) {
    return createApiResponse(null, false, 'Avatar must be an image file (jpg, jpeg, png, gif, webp).');
  }
  
  try {
    console.log('[InstructorProfile] Uploading avatar...', file.name);
    
    // FIRST: Get current profile data to include in the update
    const profileResult = await getInstructorProfile();
    
    if (!profileResult.success || !profileResult.data) {
      return createApiResponse(null, false, 'Failed to get current profile data');
    }
    
    const currentProfile = profileResult.data;
    
    // Generate filename for backend
    const avatarFileName = generateAvatarFileName(file);
    
    // Convert file to base64 for immediate preview
    const previewUrl = await fileToBase64(file);
    
    // Build complete payload with all required fields
    // Backend expects: { firstName, lastName, email, phone, bio, expertise, avatar }
    const payload = {
      firstName: currentProfile.firstName || currentProfile.fName || '',
      lastName: currentProfile.lastName || currentProfile.lName || '',
      email: currentProfile.email || '',
      phone: currentProfile.phone || '',
      bio: currentProfile.bio || '',
      expertise: currentProfile.expertise || '',
      avatar: avatarFileName,
    };
    
    console.log('[InstructorProfile] Avatar update payload:', payload);
    
    // Send complete profile update with avatar filename
    const response = await api.put(ENDPOINTS.AVATAR, payload);
    
    // Construct the permanent avatar URL
    const permanentAvatarUrl = `${AVATAR_BASE_URL}${avatarFileName}`;
    
    // Update cache and localStorage
    cachedProfileData = {
      ...cachedProfileData,
      avatar: permanentAvatarUrl,
      avatarFilename: avatarFileName,
      ...currentProfile,
    };
    
    // Store in localStorage for persistence across refreshes
    localStorage.setItem('instructor_avatar', permanentAvatarUrl);
    localStorage.setItem('instructor_avatar_filename', avatarFileName);
    
    console.log('[InstructorProfile] Avatar uploaded successfully');
    
    return createApiResponse({ 
      avatar: permanentAvatarUrl,
      preview: previewUrl,
      fileName: avatarFileName 
    }, true, SUCCESS_MESSAGES.AVATAR_UPDATED);
  } catch (error) {
    console.error('[InstructorProfile] Upload avatar error:', error);
    console.error('[InstructorProfile] Error response:', error.response?.data);
    return handleApiError(error);
  }
};

/**
 * Clears the profile cache (useful after logout)
 */
export const clearInstructorProfileCache = () => {
  cachedProfileData = null;
  localStorage.removeItem('instructor_avatar');
  localStorage.removeItem('instructor_avatar_filename');
};

/**
 * Gets cached profile data without making API call
 * @returns {Object|null} Cached profile data or null
 */
export const getCachedInstructorProfile = () => {
  return cachedProfileData;
};

// ============================================================================
// Exports
// ============================================================================

export default {
  getProfile: getInstructorProfile,
  updateProfile: updateInstructorProfile,
  changePassword: changeInstructorPassword,
  uploadAvatar: uploadInstructorAvatar,
  clearCache: clearInstructorProfileCache,
  getCachedProfile: getCachedInstructorProfile,
};