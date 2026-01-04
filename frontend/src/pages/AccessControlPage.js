import React, { useState, useEffect } from "react";
import { useCohort } from "../context/CohortContext";
import {
  windowService,
  overrideService,
  assessmentService,
  userService,
} from "../services";
import CohortSelector from "../components/CohortSelector";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaLock,
  FaUnlock,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaTimes,
  FaUserClock,
} from "react-icons/fa";

const AccessControlPage = () => {
  const { selectedCohort } = useCohort();
  const [windows, setWindows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCohort) {
      loadWindows();
    }
  }, [selectedCohort]);

  const loadWindows = async () => {
    try {
      setLoading(true);
      const data = await windowService.getWindows(selectedCohort.id);
      setWindows(data);
    } catch (error) {
      console.error("Failed to load windows:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (windowId, currentVisible) => {
    try {
      await windowService.updateVisibility(windowId, !currentVisible);
      await loadWindows();
    } catch (error) {
      alert("Failed to update visibility");
    }
  };

  const toggleLock = async (windowId, currentLocked) => {
    try {
      await windowService.updateLock(windowId, !currentLocked);
      await loadWindows();
    } catch (error) {
      alert("Failed to update lock status");
    }
  };

  const updateSchedule = async (windowId, opens_at, closes_at) => {
    try {
      await windowService.updateSchedule(windowId, opens_at, closes_at);
      await loadWindows();
    } catch (error) {
      alert("Failed to update schedule");
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Access Control</h1>
          <p className="text-gray-600 mt-1">
            Manage assessment visibility, scheduling, and access for your cohort
          </p>
        </div>
        <CohortSelector />
      </div>

      {windows.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">
            No assessment windows configured for this cohort.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {windows.map((window) => (
            <AssessmentWindowCard
              key={window.id}
              window={window}
              onToggleVisibility={toggleVisibility}
              onToggleLock={toggleLock}
              onUpdateSchedule={updateSchedule}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AssessmentWindowCard = ({
  window,
  onToggleVisibility,
  onToggleLock,
  onUpdateSchedule,
}) => {
  const { selectedCohort } = useCohort();
  const [opens, setOpens] = useState(new Date(window.opens_at));
  const [closes, setCloses] = useState(new Date(window.closes_at));
  const [editing, setEditing] = useState(false);
  const [overrides, setOverrides] = useState([]);
  const [users, setUsers] = useState([]);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [loadingOverrides, setLoadingOverrides] = useState(false);

  useEffect(() => {
    if (selectedCohort) {
      loadOverrides();
      loadUsers();
    }
  }, [selectedCohort, window.assessment_id]);

  const loadOverrides = async () => {
    try {
      setLoadingOverrides(true);
      const data = await overrideService.getOverrides(
        selectedCohort.id,
        window.assessment_id
      );
      setOverrides(data);
    } catch (error) {
      console.error("Failed to load overrides:", error);
    } finally {
      setLoadingOverrides(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      // Handle API response format - extract array from response
      const userList = Array.isArray(response) ? response : response.data || [];
      // Filter to only show interns in the selected cohort
      const cohortUsers = userList.filter(
        (user) =>
          user.role === "intern" && user.current_cohort_id == selectedCohort.id
      );
      setUsers(cohortUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    }
  };

  const handleDeleteOverride = async (overrideId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this exception?")) {
      return;
    }
    try {
      await overrideService.deleteOverride(overrideId);
      await loadOverrides();
    } catch (error) {
      alert("Failed to delete exception");
    }
  };

  const handleSaveSchedule = () => {
    onUpdateSchedule(
      window.id,
      opens.toISOString().slice(0, 19).replace("T", " "),
      closes.toISOString().slice(0, 19).replace("T", " ")
    );
    setEditing(false);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Assessment {window.code} - {window.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Duration: {window.duration_minutes} minutes
          </p>
        </div>

        <div className="flex space-x-2">
          {/* Visibility Toggle */}
          <button
            onClick={() => onToggleVisibility(window.id, window.visible)}
            className={`btn ${
              window.visible ? "btn-success" : "btn-secondary"
            }`}
            title={window.visible ? "Hide from interns" : "Show to interns"}
          >
            {window.visible ? <FaEye /> : <FaEyeSlash />}
            <span className="ml-2">
              {window.visible ? "Visible" : "Hidden"}
            </span>
          </button>

          {/* Lock Toggle */}
          <button
            onClick={() => onToggleLock(window.id, window.locked)}
            className={`btn ${window.locked ? "btn-danger" : "btn-secondary"}`}
            title={window.locked ? "Unlock assessment" : "Lock assessment"}
          >
            {window.locked ? <FaLock /> : <FaUnlock />}
            <span className="ml-2">
              {window.locked ? "Locked" : "Unlocked"}
            </span>
          </button>
        </div>
      </div>

      {/* Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Opens At</label>
          {editing ? (
            <DatePicker
              selected={opens}
              onChange={setOpens}
              showTimeSelect
              dateFormat="Pp"
              className="input"
            />
          ) : (
            <p className="input bg-gray-50">
              {new Date(window.opens_at).toLocaleString()}
            </p>
          )}
        </div>

        <div>
          <label className="label">Closes At</label>
          {editing ? (
            <DatePicker
              selected={closes}
              onChange={setCloses}
              showTimeSelect
              dateFormat="Pp"
              className="input"
            />
          ) : (
            <p className="input bg-gray-50">
              {new Date(window.closes_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      {window.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <strong>Notes:</strong> {window.notes}
          </p>
        </div>
      )}

      {/* Edit Buttons */}
      <div className="flex justify-end space-x-2">
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveSchedule} className="btn-primary">
              Save Schedule
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-secondary">
            Edit Schedule
          </button>
        )}
      </div>

      {/* Overrides Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaUserClock className="mr-2" />
            Individual Exceptions ({overrides.length})
          </h3>
          <button
            onClick={() => setShowOverrideModal(true)}
            className="btn-primary text-sm"
          >
            <FaPlus className="mr-2" />
            Add Exception
          </button>
        </div>

        {loadingOverrides ? (
          <div className="text-center py-4">
            <div className="spinner spinner-sm"></div>
          </div>
        ) : overrides.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No exceptions set for this assessment. Use exceptions to grant
            makeup exams or block specific users.
          </p>
        ) : (
          <div className="space-y-2">
            {overrides.map((override) => (
              <div
                key={override.id}
                className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {override.user_name}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        override.override_type === "allow"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {override.override_type === "allow" ? "Allow" : "Deny"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {override.user_email}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Window:</strong>{" "}
                    {new Date(override.starts_at).toLocaleString()} →{" "}
                    {new Date(override.ends_at).toLocaleString()}
                  </p>
                  {override.reason && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Reason:</strong> {override.reason}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteOverride(override.id)}
                  className="btn-danger text-sm ml-4"
                  title="Delete exception"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <OverrideModal
          assessmentId={window.assessment_id}
          assessmentName={`${window.code} - ${window.title}`}
          cohortId={selectedCohort.id}
          users={users}
          onClose={() => setShowOverrideModal(false)}
          onSave={loadOverrides}
        />
      )}
    </div>
  );
};

const OverrideModal = ({
  assessmentId,
  assessmentName,
  cohortId,
  users,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    user_id: "",
    override_type: "allow",
    starts_at: new Date(),
    ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
    reason: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_id) {
      alert("Please select a user");
      return;
    }

    if (formData.ends_at <= formData.starts_at) {
      alert("End time must be after start time");
      return;
    }

    try {
      setSaving(true);
      await overrideService.createOverride({
        user_id: formData.user_id,
        assessment_id: assessmentId,
        cohort_id: cohortId,
        override_type: formData.override_type,
        starts_at: formData.starts_at
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        ends_at: formData.ends_at.toISOString().slice(0, 19).replace("T", " "),
        reason: formData.reason || null,
      });
      onSave();
      onClose();
    } catch (error) {
      alert(
        "Failed to create exception: " + (error.message || "Unknown error")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Add Individual Exception
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Assessment:</strong> {assessmentName}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Create an exception to grant a makeup exam window or deny access
              for a specific user.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Selection */}
            <div>
              <label className="label">Select Intern *</label>
              <select
                className="input"
                value={formData.user_id}
                onChange={(e) =>
                  setFormData({ ...formData, user_id: e.target.value })
                }
                required
              >
                <option value="">-- Choose an intern --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Override Type */}
            <div>
              <label className="label">Exception Type *</label>
              <select
                className="input"
                value={formData.override_type}
                onChange={(e) =>
                  setFormData({ ...formData, override_type: e.target.value })
                }
                required
              >
                <option value="allow">
                  Allow - Grant Access (Makeup Exam)
                </option>
                <option value="deny">Deny - Block Access</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {formData.override_type === "allow"
                  ? "User will be able to access this assessment during the specified time window."
                  : "User will be blocked from accessing this assessment during the specified time window."}
              </p>
            </div>

            {/* Time Window */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Starts At *</label>
                <DatePicker
                  selected={formData.starts_at}
                  onChange={(date) =>
                    setFormData({ ...formData, starts_at: date })
                  }
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Ends At *</label>
                <DatePicker
                  selected={formData.ends_at}
                  onChange={(date) =>
                    setFormData({ ...formData, ends_at: date })
                  }
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="input"
                  minDate={formData.starts_at}
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="label">Reason (Optional)</label>
              <textarea
                className="input"
                rows="3"
                placeholder="e.g., Makeup exam - absent on original date"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                maxLength={300}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.reason.length}/300 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Creating..." : "Create Exception"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccessControlPage;
