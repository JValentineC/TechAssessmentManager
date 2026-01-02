import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  FaPlus,
  FaEdit,
  FaUsers,
  FaFileImport,
  FaArchive,
  FaTrash,
} from "react-icons/fa";

const CohortManagementPage = () => {
  const { isAdmin } = useAuth();
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    loadCohorts();
  }, []);

  useEffect(() => {
    if (selectedCohort) {
      loadRoster(selectedCohort.id);
    }
  }, [selectedCohort]);

  const loadCohorts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cohorts");
      const cohortsData = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setCohorts(cohortsData);
      if (cohortsData.length > 0 && !selectedCohort) {
        setSelectedCohort(cohortsData[0]);
      }
    } catch (error) {
      console.error("Failed to load cohorts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoster = async (cohortId) => {
    try {
      const response = await api.get(`/cohorts/${cohortId}/roster`);
      setRoster(
        Array.isArray(response.data) ? response.data : response.data.data || []
      );
    } catch (error) {
      console.error("Failed to load roster:", error);
    }
  };

  const handleCreateCohort = async (data) => {
    try {
      const response = await api.post("/cohorts", data);
      if (response.data.success) {
        setShowCreateModal(false);
        loadCohorts();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateCohort = async (id, data) => {
    try {
      const response = await api.patch(`/cohorts/${id}`, data);
      if (response.data.success) {
        setShowEditModal(false);
        loadCohorts();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveMember = async (userId) => {
    if (
      // eslint-disable-next-line no-restricted-globals
      !confirm("Are you sure you want to remove this member from the cohort?")
    )
      return;

    try {
      await api.delete(`/cohorts/${selectedCohort.id}/members/${userId}`);
      loadRoster(selectedCohort.id);
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800",
      upcoming: "bg-blue-100 text-blue-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
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
          <h1 className="text-3xl font-bold text-gray-800">
            Cohort Management
          </h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage cohorts</p>
        </div>
        {isAdmin() && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus /> Create Cohort
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cohorts List */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Cohorts</h2>
            <div className="space-y-2">
              {cohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  onClick={() => setSelectedCohort(cohort)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedCohort?.id === cohort.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{cohort.name}</h3>
                      <p className="text-sm text-gray-600">
                        Cycle {cohort.cycle_number}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        cohort.status
                      )}`}
                    >
                      {cohort.status}
                    </span>
                  </div>
                  {cohort.start_date && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(cohort.start_date).toLocaleDateString()} -{" "}
                      {cohort.end_date
                        ? new Date(cohort.end_date).toLocaleDateString()
                        : "Ongoing"}
                    </p>
                  )}
                </div>
              ))}

              {cohorts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaUsers className="mx-auto text-4xl mb-2" />
                  <p>No cohorts yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cohort Details & Roster */}
        <div className="lg:col-span-2">
          {selectedCohort ? (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCohort.name}</h2>
                  <p className="text-gray-600">
                    Cycle {selectedCohort.cycle_number}
                  </p>
                </div>
                {isAdmin() && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="btn btn-secondary btn-sm flex items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="btn btn-secondary btn-sm flex items-center gap-2"
                    >
                      <FaFileImport /> Import
                    </button>
                  </div>
                )}
              </div>

              {/* Roster Actions */}
              {isAdmin() && (
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="btn btn-primary btn-sm flex items-center gap-2"
                  >
                    <FaPlus /> Add Member
                  </button>
                </div>
              )}

              {/* Roster Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Joined
                      </th>
                      {isAdmin() && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roster.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {member.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(member.joined_at).toLocaleDateString()}
                        </td>
                        {isAdmin() && (
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove from cohort"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {roster.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FaUsers className="mx-auto text-5xl mb-3" />
                    <p>No members in this cohort</p>
                    {isAdmin() && (
                      <button
                        onClick={() => setShowAddMemberModal(true)}
                        className="btn btn-primary mt-4"
                      >
                        Add First Member
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card text-center py-12 text-gray-500">
              <FaUsers className="mx-auto text-6xl mb-4" />
              <p>Select a cohort to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CohortModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateCohort}
        />
      )}

      {showEditModal && selectedCohort && (
        <CohortModal
          mode="edit"
          cohort={selectedCohort}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => handleUpdateCohort(selectedCohort.id, data)}
        />
      )}

      {showAddMemberModal && selectedCohort && (
        <AddMemberModal
          cohortId={selectedCohort.id}
          onClose={() => setShowAddMemberModal(false)}
          onSuccess={() => {
            setShowAddMemberModal(false);
            loadRoster(selectedCohort.id);
          }}
        />
      )}

      {showImportModal && selectedCohort && (
        <ImportModal
          cohortId={selectedCohort.id}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            loadRoster(selectedCohort.id);
          }}
        />
      )}
    </div>
  );
};

// Cohort Create/Edit Modal
const CohortModal = ({ mode, cohort, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    cycle_number: cohort?.cycle_number || "",
    name: cohort?.name || "",
    start_date: cohort?.start_date || "",
    end_date: cohort?.end_date || "",
    status: cohort?.status || "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save cohort");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">
            {mode === "create" ? "Create" : "Edit"} Cohort
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cycle Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.cycle_number}
              onChange={(e) =>
                setFormData({ ...formData, cycle_number: e.target.value })
              }
              required
              disabled={mode === "edit"}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="input"
              placeholder="Cycle 59"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="input"
            >
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Member Modal
const AddMemberModal = ({ cohortId, onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get("/users");
      const usersData = response.data.success
        ? response.data.data
        : response.data;
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post(`/cohorts/${cohortId}/members`, {
        user_id: parseInt(selectedUserId),
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add member");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Add Member</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select User <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
              className="input"
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Import Modal
const ImportModal = ({ cohortId, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(`/cohorts/${cohortId}/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
      if (response.data.imported > 0) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to import");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Import Interns (CSV)</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <p className="font-semibold">Import Complete!</p>
              <p className="text-sm">Imported: {result.imported}</p>
              {result.errors && result.errors.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">
                    View Errors
                  </summary>
                  <ul className="text-xs mt-1 list-disc list-inside">
                    {result.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

          {!result && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Format: name, email, password (optional)
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Importing..." : "Import"}
                </button>
              </div>
            </>
          )}

          {result && (
            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
              >
                Done
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CohortManagementPage;
