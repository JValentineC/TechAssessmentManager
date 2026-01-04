import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaFilter,
  FaEye,
  FaStar,
  FaFileExport,
  FaClipboardList,
  FaFileAlt,
  FaSync,
} from "react-icons/fa";

const SubmissionsPage = () => {
  const { isAdmin, isFacilitator } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cohort_id: "",
    assessment_id: "",
    user_id: "",
    status: "", // Show all submissions by default
    from_date: "",
    to_date: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [filters, pagination.page]);

  const loadData = async () => {
    try {
      const [cohortsRes, assessmentsRes] = await Promise.all([
        api.get("/cohorts"),
        api.get("/assessments"),
      ]);

      setCohorts(
        Array.isArray(cohortsRes.data)
          ? cohortsRes.data
          : cohortsRes.data.data || []
      );
      setAssessments(
        Array.isArray(assessmentsRes.data)
          ? assessmentsRes.data
          : assessmentsRes.data.data || []
      );
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.cohort_id && { cohort_id: filters.cohort_id }),
        ...(filters.assessment_id && { assessment_id: filters.assessment_id }),
        ...(filters.user_id && { user_id: filters.user_id }),
        ...(filters.status && { status: filters.status }),
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date }),
      });

      const response = await api.get(`/submissions?${params}`);

      if (response.data.success) {
        console.log("Submissions loaded:", response.data.data);
        console.log(
          "Sample submission statuses:",
          response.data.data
            .slice(0, 3)
            .map((s) => ({ id: s.id, status: s.status, file: s.file_path }))
        );
        setSubmissions(response.data.data);
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      }
    } catch (error) {
      console.error("Failed to load submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDownload = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/uploads/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  const handleViewSubmission = (submissionId) => {
    navigate(`/scoring?submission=${submissionId}`);
  };

  const handleScoreSubmission = (submissionId) => {
    navigate(`/scoring?submission=${submissionId}&mode=score`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      in_progress: "bg-yellow-100 text-yellow-800",
      submitted: "bg-blue-100 text-blue-800",
      timed_out: "bg-orange-100 text-orange-800",
      scored: "bg-green-100 text-green-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      in_progress: "In Progress",
      submitted: "Completed",
      timed_out: "Auto-Submitted",
      scored: "Scored",
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isAdmin() && !isFacilitator()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Submissions</h1>
          <p className="text-gray-600 mt-1">
            View and manage assessment submissions
          </p>
        </div>
        <button
          onClick={loadSubmissions}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-400" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cohort
            </label>
            <select
              value={filters.cohort_id}
              onChange={(e) => handleFilterChange("cohort_id", e.target.value)}
              className="input"
            >
              <option value="">All Cohorts</option>
              {cohorts.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assessment
            </label>
            <select
              value={filters.assessment_id}
              onChange={(e) =>
                handleFilterChange("assessment_id", e.target.value)
              }
              className="input"
            >
              <option value="">All Assessments</option>
              {assessments.map((assessment) => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.title} ({assessment.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Completed</option>
              <option value="timed_out">Auto-Submitted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) => handleFilterChange("from_date", e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) => handleFilterChange("to_date", e.target.value)}
              className="input"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({
                  cohort_id: "",
                  assessment_id: "",
                  user_id: "",
                  status: "",
                  from_date: "",
                  to_date: "",
                });
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="btn btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12">
            <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600">No submissions found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intern
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cohort
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessment
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="font-medium text-gray-900 text-sm">
                          {submission.user_name}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {submission.cohort_name}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-gray-900 text-sm">
                          {submission.assessment_title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {submission.assessment_code}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600 max-w-xs">
                        {submission.task_title}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            submission.status
                          )}`}
                        >
                          {getStatusLabel(submission.status)}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm">
                        {submission.file_path ? (
                          <button
                            onClick={() => handleDownload(submission.file_path)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Download file"
                          >
                            <FaFileAlt />
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-600">
                        {formatDate(submission.submitted_at)}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {submission.rubric_score ? (
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-500 text-xs" />
                            <span className="font-semibold text-sm">
                              {submission.rubric_score}/5
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewSubmission(submission.id)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="View submission"
                          >
                            <FaEye />
                          </button>
                          {!submission.rubric_score &&
                            (submission.status === "submitted" ||
                              submission.status === "timed_out") && (
                              <button
                                onClick={() =>
                                  handleScoreSubmission(submission.id)
                                }
                                className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                                title="Score submission"
                              >
                                <FaStar />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} submissions
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="btn btn-secondary btn-sm"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page >= pagination.pages}
                    className="btn btn-secondary btn-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;
