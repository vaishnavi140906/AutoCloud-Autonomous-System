import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';
import { DEMO_CREDENTIALS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('autocloud_token'));
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await authService.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session validation error:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data.success && data.token) {
        localStorage.setItem('autocloud_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast({
          title: `Welcome back, ${data.user.name}`,
          message: `Logged in as ${data.user.role}`,
          type: 'success',
        });
        return { success: true };
      }
    } catch (err) {
      showToast({
        title: 'Authentication Failed',
        message: err.message || 'Invalid credentials provided',
        type: 'error',
      });
      return { success: false, error: err.message };
    }
  };

  const demoLogin = async (role = 'admin') => {
    const creds = role === 'admin' ? DEMO_CREDENTIALS.admin : DEMO_CREDENTIALS.operator;
    return await login(creds.email, creds.password);
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success && data.token) {
        localStorage.setItem('autocloud_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast({
          title: 'Account Created',
          message: `Welcome to AutoCloud Command Center!`,
          type: 'success',
        });
        return { success: true };
      }
    } catch (err) {
      showToast({
        title: 'Registration Failed',
        message: err.message || 'Failed to create user account',
        type: 'error',
      });
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('autocloud_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (formData) => {
    try {
      const data = await authService.updateProfile(formData);
      if (data.success && data.user) {
        setUser((prev) => ({ ...prev, ...data.user }));
        showToast({
          title: 'Profile Updated',
          message: 'Your account preferences have been saved.',
          type: 'success',
        });
        return { success: true };
      }
    } catch (err) {
      showToast({
        title: 'Update Failed',
        message: err.message,
        type: 'error',
      });
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isOperator: user?.role === 'OPERATOR',
    login,
    demoLogin,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
