import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Setup axios interceptor for handling 401 errors
    authService.setupAxiosInterceptors(() => {
      setUser(null);
      setError(null);
    });

    // Check for current user session
    const checkAuth = async () => {
      try {
        const { user } = await authService.getCurrentUser();
        setUser(user);
      } catch (err) {
        // Don't log the error if it's just an unauthorized error (not logged in)
        if (!err.message?.includes('401')) {
          console.error('Auth check failed:', err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const { user } = await authService.login(credentials);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { user } = await authService.register(userData);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
