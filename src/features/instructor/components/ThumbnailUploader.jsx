// src/features/instructor/components/ThumbnailUploader.jsx

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUpload, HiX, HiPhotograph, HiCloudUpload, HiCheckCircle, HiExclamationCircle, HiArrowUp } from 'react-icons/hi';
import { uploadCourseThumbnail } from '../../../shared/api/upload.api';

export const ThumbnailUploader = ({ thumbnailUrl, onThumbnailChange, isEditable }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(thumbnailUrl);
  const [dragActive, setDragActive] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Please select a valid image file (JPEG, PNG, or WEBP)' };
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
    setImageLoaded(false);
    setUploadError(null);
    setUploading(true);
    setUploadProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 150);

    try {
      console.log('[ThumbnailUploader] Uploading file:', file.name);
      const uploadedUrl = await uploadCourseThumbnail(file);
      console.log('[ThumbnailUploader] Upload success:', uploadedUrl);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setPreviewUrl(uploadedUrl);
        onThumbnailChange(uploadedUrl);
        setUploading(false);
        setUploadProgress(0);
        setImageLoaded(true);
      }, 300);
    } catch (err) {
      clearInterval(progressInterval);
      console.error('❌ Upload failed:', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
      setPreviewUrl(thumbnailUrl);
      setUploading(false);
      setUploadProgress(0);
      if (thumbnailUrl) setImageLoaded(true);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    setImageLoaded(false);
    onThumbnailChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to trigger file input
  const handleChangeClick = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isEditable) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-inner">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Course thumbnail"
            className="w-full object-cover"
            style={{ aspectRatio: '16/9' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2" style={{ aspectRatio: '16/9' }}>
            <HiPhotograph size={48} className="text-gray-300" />
            <span className="text-xs text-gray-400">No thumbnail</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Hidden file input - MOVED OUTSIDE of any label */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Thumbnail Preview Area */}
      <div
        className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
          dragActive ? 'ring-2 ring-purple-500 ring-offset-2 shadow-lg' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative group">
            {/* Image with fade-in animation */}
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded || !uploading ? 1 : 0.5 }}
              src={previewUrl}
              alt="Course thumbnail preview"
              className="w-full object-cover"
              style={{ aspectRatio: '16/9' }}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleChangeClick}
                  className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition shadow-lg transform hover:scale-105"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition shadow-lg transform hover:scale-105"
                >
                  Remove
                </button>
              </div>
              <p className="text-white text-xs opacity-80">Click to modify thumbnail</p>
            </div>

            {/* Upload progress overlay */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 mb-4">
                    <div className="w-full h-full border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-white text-sm font-medium mb-2">Uploading...</p>
                  <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-white/60 text-xs mt-2">{uploadProgress}%</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success checkmark */}
            {!uploading && imageLoaded && previewUrl && !uploadError && (
              <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1 shadow-lg">
                <HiCheckCircle size={16} className="text-white" />
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-purple-500 bg-purple-50 scale-[1.02]'
                : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/30'
            }`}
            style={{ aspectRatio: '16/9' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: dragActive ? 1.05 : 1 }}
              className="text-center"
            >
              {dragActive ? (
                <>
                  <HiArrowUp size={48} className="mx-auto mb-3 text-purple-500 animate-bounce" />
                  <p className="text-sm font-medium text-purple-600">Drop your image here</p>
                </>
              ) : (
                <>
                  <HiCloudUpload size={48} className="mx-auto mb-3 text-gray-400 group-hover:text-purple-500 transition" />
                  <p className="text-sm font-medium text-gray-700">
                    Click or drag to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    JPEG, PNG, WEBP up to 5MB
                  </p>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {uploading && !previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 p-3 rounded-lg"
          >
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            Uploading your thumbnail...
          </motion.div>
        )}

        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
          >
            <HiExclamationCircle size={18} />
            {uploadError}
          </motion.div>
        )}

        {!uploading && !uploadError && previewUrl && imageLoaded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200"
          >
            <HiCheckCircle size={16} />
            Thumbnail uploaded successfully! Your course image is ready.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview tip */}
      {previewUrl && !uploading && (
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Hover over the image to change or remove
          </p>
        </div>
      )}
    </div>
  );
};

export default ThumbnailUploader;