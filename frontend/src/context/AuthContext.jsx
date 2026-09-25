import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ims_token') || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('ims_token');
    localStorage.removeItem('ims_user');
    setToken(null);
    setUser(null);
  };

  // Sync user from local storage or backend on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('ims_token');
      const storedUser = localStorage.getItem('ims_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify & refresh profile with backend
          const res = await userService.getProfile();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('ims_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Session verification note:', error?.message);
          // Only clear session if token is truly rejected (401), not for backend cold-starts/network blips
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for global 401 unauthorized events
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('ims_token', receivedToken);
    localStorage.setItem('ims_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('ims_token', receivedToken);
    localStorage.setItem('ims_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('ims_user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const res = await userService.getProfile();
      if (res.data && res.data.user) {
        updateUser(res.data.user);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
    refreshUser,
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
