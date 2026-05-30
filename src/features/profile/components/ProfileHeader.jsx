// src/features/profile/components/ProfileHeader.jsx
import { useState, useRef, memo, useEffect } from 'react';
import { HiCamera } from 'react-icons/hi';
import { getInitials } from '../../../shared/utils/formatters';

const ProfileHeader = memo(({ profile, onAvatarChange }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const fileInputRef = useRef(null);

  const avatarUrl = profile?.avatar;
  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();
  const initials = getInitials(profile?.username || profile?.firstName || 'U');
  const role = profile?.role || 'Student';

  // Force re-render when avatar URL changes
  useEffect(() => {
    if (avatarUrl) {
      console.log('🖼️ ProfileHeader: Avatar URL changed:', avatarUrl);
      setAvatarKey(Date.now());
    }
  }, [avatarUrl]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      setTimeout(() => setUploadError(null), 3000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      setTimeout(() => setUploadError(null), 3000);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await onAvatarChange(file);
      setAvatarKey(Date.now());
      e.target.value = '';
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Failed to upload image');
      setTimeout(() => setUploadError(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const getRoleBadgeColor = () => {
    switch (role?.toLowerCase()) {
      case 'instructor':
        return 'bg-blue-100 text-blue-700';
      case 'admin':
      case 'superadmin':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const getCacheBustedUrl = () => {
    if (!avatarUrl) return null;
    return `${avatarUrl}?t=${avatarKey}`;
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-purple-800">
      {uploadError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-red-500 text-white text-sm px-4 py-2 rounded-full shadow-lg">
          {uploadError}
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-700">Uploading...</span>
          </div>
        </div>
      )}

      <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600" />

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
          <div
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              {avatarUrl ? (
                <img
                  key={avatarKey}
                  src={getCacheBustedUrl()}
                  alt={fullName || 'Avatar'}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent && !parent.querySelector('.fallback-initials')) {
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'w-full h-full rounded-full bg-purple-100 flex items-center justify-center fallback-initials';
                      fallbackDiv.innerHTML = `<span class="text-2xl font-bold text-purple-600">${initials}</span>`;
                      parent.appendChild(fallbackDiv);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">{initials}</span>
                </div>
              )}
            </div>

            {isHovering && !isUploading && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
                title="Change photo"
              >
                <HiCamera size={16} className="text-purple-600" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{fullName || profile?.username}</h2>
            <div className="flex flex-wrap gap-2 mt-1 justify-center sm:justify-start">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor()}`}>
                {role}
              </span>
              {profile?.isVerifiedEmail && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          {profile?.joinDate && (
            <div className="text-right">
              <p className="text-xs text-purple-200">Member since</p>
              <p className="text-sm font-medium text-white">
                {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;