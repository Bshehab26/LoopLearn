// src/features/instructor/components/ThumbnailUploader.jsx
import React, { useState, useRef } from 'react';
import { HiUpload, HiX, HiPhotograph, HiCloudUpload, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { uploadCourseThumbnail } from '../../../shared/api/upload.api';

export const ThumbnailUploader = ({ thumbnailUrl, onThumbnailChange, isEditable }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(thumbnailUrl);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select an image file (JPEG, PNG, WEBP)' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'Image must be less than 5MB' };
    }
    return { valid: true, error: null };
  };

  const handleFile = async (file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    // Show preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploadError(null);
    setUploading(true);
    setUploadProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const uploadedUrl = await uploadCourseThumbnail(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setPreviewUrl(uploadedUrl);
        onThumbnailChange(uploadedUrl);
        setUploading(false);
        setUploadProgress(0);
      }, 300);
    } catch (err) {
      clearInterval(progressInterval);
      console.error('❌ Upload failed:', err);
      setUploadError(err.message || 'Failed to upload image');
      setPreviewUrl(thumbnailUrl); // Revert to original
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onThumbnailChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isEditable) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-gray-100">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Course thumbnail"
            className="w-full object-cover"
            style={{ aspectRatio: '16/9' }}
          />
        ) : (
          <div className="flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
            <HiPhotograph size={48} className="text-gray-300" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Thumbnail Preview Area */}
      <div
        className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
          dragActive ? 'ring-2 ring-purple-500 ring-offset-2' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Course thumbnail preview"
              className="w-full object-cover"
              style={{ aspectRatio: '16/9' }}
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition shadow-lg transform hover:scale-105"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition shadow-lg transform hover:scale-105"
              >
                Remove
              </button>
            </div>

            {/* Upload progress overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-3">
                  <div className="w-full h-full border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-white text-sm mb-2">Uploading...</p>
                <div className="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-white/60 text-xs mt-2">{uploadProgress}%</p>
              </div>
            )}
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-purple-500 bg-purple-50'
                : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/30'
            }`}
            style={{ aspectRatio: '16/9' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <HiCloudUpload size={40} className={`mb-3 ${dragActive ? 'text-purple-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium text-gray-700">
              {dragActive ? 'Drop your image here' : 'Click or drag to upload'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG, PNG, WEBP up to 5MB
            </p>
            <p className="text-xs text-purple-500 mt-2">
              Recommended: 1280x720px (16:9)
            </p>
          </label>
        )}
      </div>

      {/* Status Messages */}
      {uploading && !previewUrl && (
        <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 p-2 rounded-lg">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          Uploading your thumbnail...
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <HiExclamationCircle size={18} />
          {uploadError}
        </div>
      )}

      {!uploading && !uploadError && previewUrl && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
          <HiCheckCircle size={16} />
          Thumbnail uploaded successfully
        </div>
      )}
    </div>
  );
};