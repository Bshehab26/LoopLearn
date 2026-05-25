/**
 * Profile Module - Barrel Exports
 * Central export point for all profile-related functionality.
 * 
 * @module features/profile
 * 
 * @example
 * // Import profile hook
 * import { useProfile } from '../features/profile';
 * 
 * // Import profile page component
 * import { Profile } from '../features/profile';
 */

// ============================================================================
// Hooks
// ============================================================================

export { default as useProfile } from './hooks/useProfile';

// ============================================================================
// Pages
// ============================================================================

export { default as Profile } from './pages/Profile';

// ============================================================================
// Components (if needed in the future)
// ============================================================================

// export { default as ProfileHeader } from './components/ProfileHeader';
// export { default as ProfileInfo } from './components/ProfileInfo';
// export { default as ChangePasswordModal } from './components/ChangePasswordModal';

// ============================================================================
// Types (if using TypeScript in the future)
// ============================================================================

// export type { ProfileData, ProfileUpdateData } from './types';