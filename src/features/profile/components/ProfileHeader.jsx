// src/features/profile/components/ProfileHeader.jsx
import { useState, useRef } from 'react';
import { HiCamera, HiUser } from 'react-icons/hi';
import { getInitials } from '../../../shared/utils/formatters';

const ProfileHeader = ({ profile, onAvatarChange, saving }) => {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const avatarUrl = profile?.avatar;
  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();
  const initials = getInitials(profile?.username || profile?.firstName || 'U');
  const role = profile?.role || profile?.userRole || 'Student';

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    
    // Create local preview URL
    const previewUrl = URL.createObjectURL(file);
    onAvatarChange(previewUrl, file);
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

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-purple-800">
      {/* Cover Image Placeholder */}
      <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600" />
      
      {/* Avatar Section */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
          {/* Avatar */}
          <div
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName || 'Avatar'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">{initials}</span>
                </div>
              )}
            </div>
            
            {/* Camera Overlay */}
            {isHovering && !saving && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
              >
                <HiCamera size={16} className="text-purple-600" />
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* User Info */}
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

          {/* Join Date */}
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
};

export default ProfileHeader;