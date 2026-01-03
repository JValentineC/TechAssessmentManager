import React, { useState, useEffect } from "react";
import { assessmentService, taskService } from "../services";
import TaskConfigModal from "../components/TaskConfigModal";

const AssessmentManagementPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Assessment form state
  const [assessmentForm, setAssessmentForm] = useState({
    code: "",
    title: "",
    description: "",
    duration_minutes: 60,
  });

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    if (selectedAssessment) {
      loadTasks(selectedAssessment.id);
    }
  }, [selectedAssessment]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAll();
      setAssessments(data);
      setError(null);
    } catch (err) {
      setError("Failed to load assessments: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (assessmentId) => {
    try {
      const data = await assessmentService.getTasks(assessmentId);
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks: " + err.message);
    }
  };

  const handleCreateAssessment = () => {
    setEditingAssessment(null);
    setAssessmentForm({
      code: "",
      title: "",
      description: "",
      duration_minutes: 60,
    });
    setShowAssessmentModal(true);
  };

  const handleEditAssessment = (assessment) => {
    setEditingAssessment(assessment);
    setAssessmentForm({
      code: assessment.code,
      title: assessment.title,
      description: assessment.description || "",
      duration_minutes: assessment.duration_minutes,
    });
    setShowAssessmentModal(true);
  };

  const handleSaveAssessment = async () => {
    try {
      if (editingAssessment) {
        await assessmentService.update(editingAssessment.id, assessmentForm);
      } else {
        await assessmentService.create(assessmentForm);
      }
      await loadAssessments();
      setShowAssessmentModal(false);
      setError(null);
    } catch (err) {
      setError("Failed to save assessment: " + err.message);
    }
  };

  const handleDeleteAssessment = async (assessment) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${assessment.title}"? This will also delete all associated tasks.`
      )
    ) {
      return;
    }

    try {
      await assessmentService.delete(assessment.id);
      if (selectedAssessment?.id === assessment.id) {
        setSelectedAssessment(null);
        setTasks([]);
      }
      await loadAssessments();
      setError(null);
    } catch (err) {
      setError("Failed to delete assessment: " + err.message);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, taskData);
      } else {
        await taskService.create({
          ...taskData,
          assessment_id: selectedAssessment.id,
        });
      }
      await loadTasks(selectedAssessment.id);
      setError(null);
    } catch (err) {
      setError("Failed to save task: " + err.message);
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    try {
      await taskService.delete(task.id);
      await loadTasks(selectedAssessment.id);
      setError(null);
    } catch (err) {
      setError("Failed to delete task: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-icstars-blue">
          Assessment Management
        </h1>
        <p className="text-gray-600 mt-2">
          Create and manage assessments and their tasks
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-900 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessments Panel */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold">Assessments</h2>
            <button
              onClick={handleCreateAssessment}
              className="bg-icstars-blue text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + New Assessment
            </button>
          </div>

          <div className="divide-y max-h-[600px] overflow-y-auto">
            {assessments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No assessments yet. Create one to get started.
              </div>
            ) : (
              assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className={`p-4 cursor-pointer transition ${
                    selectedAssessment?.id === assessment.id
                      ? "bg-blue-50 border-l-4 border-icstars-blue"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedAssessment(assessment)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{assessment.code}</h3>
                      <p className="text-gray-700">{assessment.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Duration: {assessment.duration_minutes} minutes
                      </p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAssessment(assessment);
                        }}
                        className="text-blue-600 hover:text-blue-800 px-2 py-1"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAssessment(assessment);
                        }}
                        className="text-red-600 hover:text-red-800 px-2 py-1"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tasks Panel */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold">
              {selectedAssessment
                ? `Tasks for ${selectedAssessment.code}`
                : "Tasks"}
            </h2>
            {selectedAssessment && (
              <button
                onClick={handleCreateTask}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + New Task
              </button>
            )}
          </div>

          <div className="divide-y max-h-[600px] overflow-y-auto">
            {!selectedAssessment ? (
              <div className="p-8 text-center text-gray-500">
                ← Select an assessment to view its tasks
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No tasks yet. Create one to get started.
              </div>
            ) : (
              tasks.map((task, index) => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-semibold">
                          #{index + 1}
                        </span>
                        <h3 className="font-bold">{task.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {task.instructions}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          Type:{" "}
                          <span className="font-semibold">
                            {task.task_type || "single_input"}
                          </span>
                        </span>
                        <span>
                          Points:{" "}
                          <span className="font-semibold">
                            {task.max_points}
                          </span>
                        </span>
                        <span>
                          Order:{" "}
                          <span className="font-semibold">
                            {task.order_index}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-600 hover:text-blue-800 px-2 py-1"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="text-red-600 hover:text-red-800 px-2 py-1"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingAssessment
                  ? "Edit Assessment"
                  : "Create New Assessment"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assessment Code *
                </label>
                <input
                  type="text"
                  value={assessmentForm.code}
                  onChange={(e) =>
                    setAssessmentForm({
                      ...assessmentForm,
                      code: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., TECH-101"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={assessmentForm.title}
                  onChange={(e) =>
                    setAssessmentForm({
                      ...assessmentForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Technical Skills Assessment"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={assessmentForm.description}
                  onChange={(e) =>
                    setAssessmentForm({
                      ...assessmentForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Optional description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={assessmentForm.duration_minutes}
                  onChange={(e) =>
                    setAssessmentForm({
                      ...assessmentForm,
                      duration_minutes: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssessment}
                className="px-4 py-2 bg-icstars-blue text-white rounded hover:bg-blue-700"
              >
                {editingAssessment ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      <TaskConfigModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
    </div>
  );
};

export default AssessmentManagementPage;
