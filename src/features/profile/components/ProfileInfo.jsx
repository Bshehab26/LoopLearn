// src/features/profile/components/ProfileInfo.jsx
import { useState, useCallback, useEffect } from 'react';
import { HiPencil, HiCheck, HiX, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar, HiOutlineUser } from 'react-icons/hi';
import { validateEmail, validateEgyptianPhone } from '../../../shared/utils/validators';

const ProfileInfo = ({ profile, onSave, saving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validateEgyptianPhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const success = await onSave(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-gray-500" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Personal Information</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEditing ? 'Update your personal details' : 'Your personal information'}
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-purple-50"
            style={{ border: '0.5px solid #534AB7', color: '#534AB7' }}
          >
            <HiPencil size={13} /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all hover:bg-gray-100"
              style={{ border: '0.5px solid rgba(0,0,0,0.12)', color: '#888780' }}
            >
              <HiX size={13} /> Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-white font-medium transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #534AB7 0%, #7B74D4 100%)' }}
            >
              <HiCheck size={13} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {!isEditing ? (
        // View Mode
        <div className="space-y-1">
          <InfoRow icon={HiOutlineUser} label="Full Name" value={`${profile?.firstName || ''} ${profile?.lastName || ''}`.trim()} />
          <InfoRow icon={HiOutlineMail} label="Email Address" value={profile?.email} />
          <InfoRow icon={HiOutlinePhone} label="Phone Number" value={profile?.phone} />
          {profile?.birthDate && (
            <InfoRow icon={HiOutlineCalendar} label="Birth Date" value={new Date(profile.birthDate).toLocaleDateString()} />
          )}
        </div>
      ) : (
        // Edit Mode
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            <p className="text-xs text-gray-400 mt-1">Egyptian phone number starting with 010, 011, 012, or 015</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;