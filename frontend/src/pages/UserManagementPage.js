import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import CreateUserModal from "../components/CreateUserModal";
import { FaPlus, FaEdit, FaUserCircle, FaFilter } from "react-icons/fa";

const UserManagementPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    cohortId: "",
    status: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadUsers();
    loadCohorts();
  }, [filters, pagination.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.role && { role: filters.role }),
        ...(filters.cohortId && { cohortId: filters.cohortId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { q: filters.search }),
      });

      const response = await api.get(`/users?${params}`);
      console.log("Users API response:", response.data);

      if (response.data.success) {
        setUsers(Array.isArray(response.data.data) ? response.data.data : []);
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      } else {
        setError(response.data.error || "Failed to load users");
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setError(
        error.response?.data?.error || error.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCohorts = async () => {
    try {
      const response = await api.get("/cohorts");
      setCohorts(
        Array.isArray(response.data) ? response.data : response.data.data || []
      );
    } catch (error) {
      console.error("Failed to load cohorts:", error);
    }
  };

  const handleCreateSuccess = (newUser) => {
    setShowCreateModal(false);
    loadUsers();
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-purple-100 text-purple-800",
      facilitator: "bg-blue-100 text-blue-800",
      intern: "bg-green-100 text-green-800",
    };
    return badges[role] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  if (!isAdmin()) {
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
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system users and their roles
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus /> Create User
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-400" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="input"
            >
              <option value="">All Roles</option>
              <option value="intern">Intern</option>
              <option value="facilitator">Facilitator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cohort
            </label>
            <select
              value={filters.cohortId}
              onChange={(e) => handleFilterChange("cohortId", e.target.value)}
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
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <FaUserCircle className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600">No users found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary mt-4"
            >
              Create First User
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cohort
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUserCircle className="text-2xl text-gray-400 mr-3" />
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.cohort_name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit user"
                        >
                          <FaEdit />
                        </button>
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
                  of {pagination.total} results
                </div>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="btn btn-secondary btn-sm px-3"
                  >
                    ‹
                  </button>

                  {/* Page Number Buttons */}
                  <div className="flex gap-1">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and 2 pages around current
                        return (
                          page === 1 ||
                          page === pagination.pages ||
                          Math.abs(page - pagination.page) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-2 py-1 text-sm text-gray-500">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() =>
                                setPagination((prev) => ({
                                  ...prev,
                                  page: page,
                                }))
                              }
                              className={`btn btn-sm w-10 h-10 p-0 ${
                                pagination.page === page
                                  ? "btn-primary"
                                  : "btn-secondary"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page >= pagination.pages}
                    className="btn btn-secondary btn-sm px-3"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
          cohorts={cohorts}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
