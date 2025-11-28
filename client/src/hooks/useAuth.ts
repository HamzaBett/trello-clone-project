import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure, logout, setUser } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import type { User, AuthState } from '@/types/user.types';

export const useAuth = () => {
  const dispatch = useDispatch();
const authState = useSelector((state: RootState): AuthState => state.auth);

  const login = async (email: string, password: string) => {
    dispatch(loginStart());
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user: User = { id: '1', email, username: email.split('@')[0] };
      dispatch(loginSuccess(user));
    } catch (error) {
      dispatch(loginFailure('Invalid credentials'));
    }
  };

  const register = async (email: string, password: string, username: string) => {
    dispatch(registerStart());
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user: User = { id: '1', email, username };
      dispatch(registerSuccess(user));
    } catch (error) {
      dispatch(registerFailure('Registration failed'));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const setUserData = (user: User) => {
    dispatch(setUser(user));
  };

return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout: logoutUser,
    setUserData,
  };
};
