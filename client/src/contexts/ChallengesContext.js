import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import challengeService from '../services/challengeService';
import { useAuth } from './AuthContext';

const ChallengesContext = createContext();

export const ChallengesProvider = ({ children }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    difficulty: '',
    category: '',
    search: '',
    tag: '',
    sortBy: '-createdAt',
    author: ''
  });

  const { user } = useAuth();

  // Fetch challenges with current filters
  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { challenges: fetchedChallenges } = await challengeService.getChallenges(
        filters.page,
        filters.limit,
        filters
      );
      setChallenges(fetchedChallenges);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching challenges:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // Create a new challenge
  const createChallenge = async (challengeData) => {
    try {
      const { challenge } = await challengeService.createChallenge({
        ...challengeData,
        author: user._id
      });
      setChallenges(prev => [challenge, ...prev]);
      return challenge;
    } catch (err) {
      throw err;
    }
  };

  // Update a challenge
  const updateChallenge = async (id, challengeData) => {
    try {
      const { challenge } = await challengeService.updateChallenge(id, challengeData);
      setChallenges(prev =>
        prev.map(ch => ch._id === id ? challenge : ch)
      );
      return challenge;
    } catch (err) {
      throw err;
    }
  };

  // Delete a challenge
  const deleteChallenge = async (id) => {
    try {
      await challengeService.deleteChallenge(id);
      setChallenges(prev => prev.filter(ch => ch._id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset page when filters change
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      difficulty: '',
      category: '',
      search: '',
      tag: '',
      sortBy: '-createdAt',
      author: ''
    });
  };

  const value = {
    challenges,
    loading,
    error,
    filters,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    updateFilters,
    resetFilters,
    refreshChallenges: fetchChallenges
  };

  return (
    <ChallengesContext.Provider value={value}>
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
};

export default ChallengesContext;
