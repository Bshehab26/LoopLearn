// features/student — barrel export
export { default as Hero } from './components/Hero';
export { default as Companies } from './components/Companies';
export { default as AboutSection } from './components/AboutSection';
export { default as ContactSection } from './components/ContactSection';
export { default as TestimonialSection } from './components/TestimonialSection';
export { default as Home } from './pages/Home';
export { default as MyEnrollments } from './pages/MyEnrollments';
export { default as useEnrollments } from './hooks/useEnrollments';

// ❌ REMOVED profile-related exports (now in features/profile)
// export { default as ProfileHeader } from './components/profile/ProfileHeader';
// export { default as ProfileInfo } from './components/profile/ProfileInfo';
// export { default as ChangePasswordModal } from './components/profile/ChangePasswordModal';
// export { default as Profile } from './pages/Profile';
// export { default as useProfile } from './hooks/useProfile';
// export { getProfile, updateProfile, uploadAvatar, changePassword } from './api/profile.api';