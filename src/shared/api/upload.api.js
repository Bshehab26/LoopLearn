import API from '../../services/api/axios';

export const uploadFile = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type); // "avatar" or "course-thumbnail"
  const response = await API.post('/Upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (response.data?.success) {
    return response.data.url;
  }
  throw new Error(response.data?.message || 'Upload failed');
};

// Convenience wrappers
export const uploadAvatar = (file) => uploadFile(file, 'avatar');
export const uploadCourseThumbnail = (file) => uploadFile(file, 'course-thumbnail');