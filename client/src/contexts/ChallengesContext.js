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
    console.log("Fetching challenges");
    try {
      setLoading(true);
      setError(null);
      const response = await challengeService.getChallenges(
        filters.page,
        filters.limit,
        filters
      );
      console.log("Response--->", response)
      setChallenges(response.challenges || []);
    } catch (err) {
      setError(err.message || 'Error fetching challenges');
      console.error('Error fetching challenges:', err);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create a new challenge
  const createChallenge = useCallback(async (challengeData) => {
    try {
      const { challenge } = await challengeService.createChallenge({
        ...challengeData,
        author: user._id
      });
      return challenge;
    } catch (err) {
      console.error('Create challenge error:', err);
      throw err.response?.data?.error || 'Error creating challenge';
    }
  }, [user?._id]);

  // Update a challenge
  const updateChallenge = useCallback(async (id, challengeData) => {
    try {
      const { challenge } = await challengeService.updateChallenge(id, challengeData);
      return challenge;
    } catch (err) {
      console.error('Update challenge error:', err);
      throw err.response?.data?.error || 'Error updating challenge';
    }
  }, []);

  // Delete a challenge
  const deleteChallenge = useCallback(async (id) => {
    try {
      await challengeService.deleteChallenge(id);
    } catch (err) {
      console.error('Delete challenge error:', err);
      throw err.response?.data?.error || 'Error deleting challenge';
    }
  }, []);

  // Get a single challenge
  const getChallenge = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await challengeService.getChallenge(id);
      return response.challenge;
    } catch (err) {
      setError(err.message || 'Error fetching challenge');
      console.error('Error fetching challenge:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.hasOwnProperty('page') ? newFilters.page : 1 // Reset page when filters change unless page is specified
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
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
  }, []);

  // Refresh challenges
  const refreshChallenges = useCallback(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // Initial fetch
  useEffect(() => {
    console.log("Initial fetch effect running");
    fetchChallenges();
  }, []); // Empty dependency array for initial fetch

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
    refreshChallenges,
    getChallenge
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
