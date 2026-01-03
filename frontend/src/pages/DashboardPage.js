import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCohort } from "../context/CohortContext";
import { scoreService, submissionService } from "../services";
import {
  FaUsers,
  FaClipboardCheck,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import CohortSelector from "../components/CohortSelector";

const DashboardPage = () => {
  const { user, isFacilitator, isIntern } = useAuth();
  const { selectedCohort } = useCohort();
  const navigate = useNavigate();
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
        const [summary, submissionsRes] = await Promise.all([
          scoreService.getSummary(selectedCohort.id),
          submissionService.getSubmissions(selectedCohort.id),
        ]);

        const submissions = Array.isArray(submissionsRes)
          ? submissionsRes
          : submissionsRes.data || [];

        setStats({
          totalInterns: summary.total_interns || 0,
          completedAssessments: submissions.filter(
            (s) =>
              s.status === "submitted" ||
              s.status === "timed_out" ||
              s.rubric_score
          ).length,
          inProgress: submissions.filter((s) => s.status === "in_progress")
            .length,
          averageProficiency: summary.average_proficiency || 0,
          submissions: submissions.slice(0, 10).map((s) => ({
            ...s,
            // Normalize status display
            display_status: s.rubric_score
              ? "scored"
              : s.status === "timed_out"
              ? "completed (auto)"
              : s.status === "submitted"
              ? "completed"
              : s.status,
          })),
        });
      } else if (isIntern()) {
        const submissionsRes = await submissionService.getSubmissions(
          selectedCohort.id
        );
        const submissions = Array.isArray(submissionsRes)
          ? submissionsRes
          : submissionsRes.data || [];
        const userSubmissions = submissions.filter(
          (s) => s.user_id === user.id
        );

        setStats({
          completedAssessments: userSubmissions.filter(
            (s) => s.status === "submitted" || s.status === "timed_out"
          ).length,
          inProgress: userSubmissions.filter((s) => s.status === "in_progress")
            .length,
          submissions: userSubmissions.map((s) => ({
            ...s,
            display_status:
              s.status === "timed_out"
                ? "completed (auto)"
                : s.status === "submitted"
                ? "completed"
                : s.status,
          })),
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
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
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
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
                  <p className="text-3xl font-bold mt-1">
                    {stats.totalInterns}
                  </p>
                </div>
                <FaUsers className="text-4xl text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.completedAssessments}
                  </p>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Submissions
              </h2>
              <button
                onClick={() => navigate("/submissions")}
                className="px-4 py-2 bg-icstars-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Submissions
              </button>
            </div>
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
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {sub.user_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {sub.assessment_title ||
                            `Assessment ${sub.assessment_code}`}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              sub.rubric_score ||
                              sub.status === "submitted" ||
                              sub.status === "timed_out"
                                ? "bg-green-100 text-green-800"
                                : sub.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {sub.display_status || sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {sub.submitted_at
                            ? new Date(sub.submitted_at).toLocaleString()
                            : "In progress"}
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
                  <p className="text-3xl font-bold mt-1">
                    {stats.completedAssessments}
                  </p>
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
                  <p className="text-2xl font-bold mt-1">
                    Cycle {selectedCohort?.cycle_number}
                  </p>
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
