// src/shared/api/upload.api.js

import API from '../../services/api/axios';
import { handleApiError } from '../../services/api/errorHandler';

export const uploadFile = async (file, type) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // "avatar" or "course-thumbnail"
    
    console.log(`📤 Uploading ${type}...`, file.name);
    
    const response = await API.post('/Upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000, // 30 seconds timeout for large files
    });
    
    console.log('📥 Upload response:', response.data);
    
    if (response.data?.success) {
      return response.data.url;
    }
    throw new Error(response.data?.message || 'Upload failed');
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error response:', error.response?.data);
    
    // Provide more specific error messages
    if (error.response?.status === 500) {
      throw new Error('Server error during upload. Please check server logs.');
    }
    if (error.response?.status === 413) {
      throw new Error('File too large. Please upload a smaller file.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Upload timeout. Please try again with a smaller file.');
    }
    
    const handled = handleApiError(error);
    throw new Error(handled.message || 'Upload failed');
  }
};

// Convenience wrappers
export const uploadAvatar = (file) => uploadFile(file, 'avatar');
export const uploadCourseThumbnail = (file) => uploadFile(file, 'course-thumbnail');