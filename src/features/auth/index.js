// features/auth — barrel export
export { default as SignIn } from './pages/SignIn';
export { default as SignUp } from './pages/SignUp';
export { ErrorAlert, AuthInput, PasswordInput, AuthButton, AuthSelect } from './components/AuthComponents';
export { default as useAuth } from './hooks/useAuth';
export { login, register }   from './api/auth.api';