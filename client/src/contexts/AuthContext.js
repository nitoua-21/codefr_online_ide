import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Setup axios interceptor for handling 401 errors
    authService.setupAxiosInterceptors(async () => {
      await handleLogout();
    });

    // Check for current user session
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const { user } = await authService.getCurrentUser();
        setUser(user);
        setIsAuthenticated(true);
      } catch (err) {
        // Don't log the error if it's just an unauthorized error (not logged in)
        if (!err.message?.includes('401')) {
          console.error('Auth check failed:', err);
        }
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const { user, token } = await authService.login(credentials);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      await handleLogout();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { user, token } = await authService.register(userData);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
