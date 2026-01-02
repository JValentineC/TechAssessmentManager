import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCohort } from '../context/CohortContext';
import { scoreService, submissionService } from '../services';
import { FaUsers, FaClipboardCheck, FaClock, FaChartLine } from 'react-icons/fa';
import CohortSelector from '../components/CohortSelector';

const DashboardPage = () => {
  const { user, isFacilitator, isIntern } = useAuth();
  const { selectedCohort } = useCohort();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCohort) {
      loadDashboardData();
    }
  }, [selectedCohort]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isFacilitator()) {
        const [summary, submissions] = await Promise.all([
          scoreService.getSummary(selectedCohort.id),
          submissionService.getSubmissions(selectedCohort.id)
        ]);

        setStats({
          totalInterns: summary.total_interns || 0,
          completedAssessments: submissions.filter(s => s.status === 'submitted').length,
          inProgress: submissions.filter(s => s.status === 'in_progress').length,
          averageProficiency: summary.average_proficiency || 0,
          submissions: submissions.slice(0, 5) // Recent 5
        });
      } else if (isIntern()) {
        const submissions = await submissionService.getSubmissions(
          selectedCohort.id
        );
        const userSubmissions = submissions.filter(s => s.user_id === user.id);

        setStats({
          completedAssessments: userSubmissions.filter(s => s.status === 'submitted').length,
          inProgress: userSubmissions.filter(s => s.status === 'in_progress').length,
          submissions: userSubmissions
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}!
          </p>
        </div>
        {isFacilitator() && <CohortSelector />}
      </div>

      {/* Facilitator Dashboard */}
      {isFacilitator() && stats && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Interns</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalInterns}</p>
                </div>
                <FaUsers className="text-4xl text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold mt-1">{stats.completedAssessments}</p>
                </div>
                <FaClipboardCheck className="text-4xl text-green-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">In Progress</p>
                  <p className="text-3xl font-bold mt-1">{stats.inProgress}</p>
                </div>
                <FaClock className="text-4xl text-yellow-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Proficiency</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.averageProficiency.toFixed(1)}%
                  </p>
                </div>
                <FaChartLine className="text-4xl text-purple-200" />
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Submissions
            </h2>
            {stats.submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Intern
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Assessment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.submissions.map((sub) => (
                      <tr key={sub.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {sub.user_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          Assessment {sub.assessment_code}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`badge ${
                              sub.status === 'submitted'
                                ? 'badge-success'
                                : sub.status === 'in_progress'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {sub.submitted_at
                            ? new Date(sub.submitted_at).toLocaleString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recent submissions
              </p>
            )}
          </div>
        </>
      )}

      {/* Intern Dashboard */}
      {isIntern() && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold mt-1">{stats.completedAssessments}</p>
                </div>
                <FaClipboardCheck className="text-4xl text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">In Progress</p>
                  <p className="text-3xl font-bold mt-1">{stats.inProgress}</p>
                </div>
                <FaClock className="text-4xl text-yellow-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Cohort</p>
                  <p className="text-2xl font-bold mt-1">Cycle {selectedCohort?.cycle_number}</p>
                </div>
                <FaUsers className="text-4xl text-green-200" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <a
                href="/assessments"
                className="block p-4 bg-icstars-blue hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <h3 className="font-semibold">View Available Assessments</h3>
                <p className="text-sm text-blue-100 mt-1">
                  See which assessments are currently open
                </p>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
