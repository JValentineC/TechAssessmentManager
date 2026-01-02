import React from 'react';
import { useCohort } from '../context/CohortContext';

const CohortSelector = ({ className = '' }) => {
  const { cohorts, selectedCohort, selectCohort, loading } = useCohort();

  if (loading || cohorts.length === 0) {
    return null;
  }

  const handleChange = (e) => {
    const cohortId = parseInt(e.target.value);
    const cohort = cohorts.find((c) => c.id === cohortId);
    if (cohort) {
      selectCohort(cohort);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <label htmlFor="cohort-select" className="text-sm font-medium text-gray-700">
        Active Cohort:
      </label>
      <select
        id="cohort-select"
        value={selectedCohort?.id || ''}
        onChange={handleChange}
        className="input max-w-xs"
      >
        {cohorts.map((cohort) => (
          <option key={cohort.id} value={cohort.id}>
            Cycle {cohort.cycle_number} - {cohort.name}
            {cohort.status !== 'active' && ` (${cohort.status})`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CohortSelector;
