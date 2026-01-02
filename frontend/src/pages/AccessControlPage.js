import React, { useState, useEffect } from "react";
import { useCohort } from "../context/CohortContext";
import { windowService, overrideService, assessmentService } from "../services";
import CohortSelector from "../components/CohortSelector";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaLock, FaUnlock, FaEye, FaEyeSlash, FaPlus } from "react-icons/fa";

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
  const [opens, setOpens] = useState(new Date(window.opens_at));
  const [closes, setCloses] = useState(new Date(window.closes_at));
  const [editing, setEditing] = useState(false);

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
    </div>
  );
};

export default AccessControlPage;
