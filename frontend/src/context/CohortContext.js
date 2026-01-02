import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CohortContext = createContext(null);

export const CohortProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadCohorts();
    }
  }, [isAuthenticated]);

  const loadCohorts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cohorts');
      const cohortList = response.data;
      setCohorts(cohortList);

      // Auto-select cohort
      if (user?.current_cohort_id) {
        const userCohort = cohortList.find(c => c.id === user.current_cohort_id);
        if (userCohort) {
          setSelectedCohort(userCohort);
          return;
        }
      }

      // Default to active Cycle 59 or first active cohort
      const cycle59 = cohortList.find(c => c.cycle_number === 59 && c.status === 'active');
      if (cycle59) {
        setSelectedCohort(cycle59);
      } else {
        const firstActive = cohortList.find(c => c.status === 'active');
        if (firstActive) {
          setSelectedCohort(firstActive);
        }
      }
    } catch (error) {
      console.error('Failed to load cohorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectCohort = (cohort) => {
    setSelectedCohort(cohort);
    localStorage.setItem('selectedCohortId', cohort.id);
  };

  const createCohort = async (cohortData) => {
    try {
      const response = await api.post('/cohorts', cohortData);
      await loadCohorts();
      return { success: true, cohort: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create cohort'
      };
    }
  };

  const updateCohort = async (id, cohortData) => {
    try {
      const response = await api.patch(`/cohorts/${id}`, cohortData);
      await loadCohorts();
      return { success: true, cohort: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update cohort'
      };
    }
  };

  const value = {
    cohorts,
    selectedCohort,
    loading,
    selectCohort,
    loadCohorts,
    createCohort,
    updateCohort
  };

  return <CohortContext.Provider value={value}>{children}</CohortContext.Provider>;
};

export const useCohort = () => {
  const context = useContext(CohortContext);
  if (!context) {
    throw new Error('useCohort must be used within a CohortProvider');
  }
  return context;
};

export default CohortContext;
