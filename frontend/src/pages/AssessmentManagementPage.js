import React, { useState, useEffect } from "react";
import { assessmentService, taskService, rubricService } from "../services";
import TaskConfigModal from "../components/TaskConfigModal";
import RubricModal from "../components/RubricModal";

const AssessmentManagementPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingRubric, setEditingRubric] = useState(null);
  const [rubricTaskId, setRubricTaskId] = useState(null);

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
      loadRubrics(selectedAssessment.id);
    }
  }, [selectedAssessment]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAll();
      setAssessments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load assessments: " + err.message);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (assessmentId) => {
    try {
      const data = await assessmentService.getTasks(assessmentId);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load tasks: " + err.message);
      setTasks([]);
    }
  };

  const loadRubrics = async (assessmentId) => {
    try {
      const data = await rubricService.getAll(assessmentId);
      setRubrics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load rubrics:", err);
      setRubrics([]);
    }
  };

  const handleCreateAssessmentRubric = () => {
    // Check if an assessment-level rubric already exists
    const existingAssessmentRubric = rubrics.find((r) => !r.task_id);
    if (existingAssessmentRubric) {
      // Edit the existing rubric instead
      setEditingRubric(existingAssessmentRubric);
      setRubricTaskId(null);
    } else {
      // Create new rubric
      setEditingRubric(null);
      setRubricTaskId(null);
    }
    setShowRubricModal(true);
  };

  const handleCreateTaskRubric = (taskId) => {
    // Check if a rubric already exists for this task
    const existingTaskRubric = rubrics.find((r) => r.task_id === taskId);
    if (existingTaskRubric) {
      // Edit the existing rubric instead
      setEditingRubric(existingTaskRubric);
      setRubricTaskId(taskId);
    } else {
      // Create new rubric
      setEditingRubric(null);
      setRubricTaskId(taskId);
    }
    setShowRubricModal(true);
  };

  const handleEditRubric = (rubric) => {
    setEditingRubric(rubric);
    setRubricTaskId(rubric.task_id);
    setShowRubricModal(true);
  };

  const handleDeleteRubric = async (rubric) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the rubric "${rubric.title}"?`
      )
    ) {
      return;
    }

    try {
      await rubricService.delete(rubric.id);
      await loadRubrics(selectedAssessment.id);
      setError(null);
    } catch (err) {
      setError("Failed to delete rubric: " + err.message);
    }
  };

  const handleSaveRubric = async () => {
    await loadRubrics(selectedAssessment.id);
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
      setError(
        "Failed to delete task: " +
          (err.response?.data?.error || err.message)
      );
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

      {/* Rubrics Section */}
      {selectedAssessment && (
        <div className="mt-6 bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b flex justify-between items-center bg-purple-50">
            <div>
              <h2 className="text-xl font-bold text-purple-900">
                📋 Scoring Rubrics for {selectedAssessment.code}
              </h2>
              <p className="text-sm text-purple-700 mt-1">
                Define scoring criteria to guide facilitators
              </p>
            </div>
            <button
              onClick={handleCreateAssessmentRubric}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              + Add Assessment Rubric
            </button>
          </div>

          <div className="p-6">
            {rubrics.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-lg font-medium">No rubrics defined yet</p>
                <p className="text-sm mt-2">
                  Create rubrics to provide clear scoring guidelines for this
                  assessment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Assessment-level rubric */}
                {rubrics
                  .filter((r) => !r.task_id)
                  .map((rubric) => (
                    <div
                      key={rubric.id}
                      className="border border-purple-200 rounded-lg p-4 bg-purple-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                              ASSESSMENT-WIDE
                            </span>
                            <h3 className="font-bold text-lg">
                              {rubric.title}
                            </h3>
                          </div>
                          {rubric.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {rubric.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRubric(rubric)}
                            className="text-blue-600 hover:text-blue-800 px-2 py-1"
                            title="Edit Rubric"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteRubric(rubric)}
                            className="text-red-600 hover:text-red-800 px-2 py-1"
                            title="Delete Rubric"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div className="bg-red-100 p-2 rounded">
                          <div className="font-bold text-red-700 mb-1">
                            1 - Limited
                          </div>
                          <p className="text-gray-700">
                            {rubric.level_1_criteria}
                          </p>
                        </div>
                        <div className="bg-orange-100 p-2 rounded">
                          <div className="font-bold text-orange-700 mb-1">
                            2 - Emerging
                          </div>
                          <p className="text-gray-700">
                            {rubric.level_2_criteria}
                          </p>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded">
                          <div className="font-bold text-yellow-700 mb-1">
                            3 - Developing
                          </div>
                          <p className="text-gray-700">
                            {rubric.level_3_criteria}
                          </p>
                        </div>
                        <div className="bg-blue-100 p-2 rounded">
                          <div className="font-bold text-blue-700 mb-1">
                            4 - Proficient
                          </div>
                          <p className="text-gray-700">
                            {rubric.level_4_criteria}
                          </p>
                        </div>
                        <div className="bg-green-100 p-2 rounded">
                          <div className="font-bold text-green-700 mb-1">
                            5 - Advanced
                          </div>
                          <p className="text-gray-700">
                            {rubric.level_5_criteria}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Task-specific rubrics */}
                {tasks.map((task) => {
                  const taskRubric = rubrics.find((r) => r.task_id === task.id);
                  return (
                    <div
                      key={task.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold">
                              TASK #{task.order_index + 1}
                            </span>
                            <h4 className="font-semibold">{task.title}</h4>
                          </div>
                        </div>
                        {taskRubric ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditRubric(taskRubric)}
                              className="text-blue-600 hover:text-blue-800 px-2 py-1"
                              title="Edit Rubric"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteRubric(taskRubric)}
                              className="text-red-600 hover:text-red-800 px-2 py-1"
                              title="Delete Rubric"
                            >
                              🗑️
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCreateTaskRubric(task.id)}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            + Add Rubric
                          </button>
                        )}
                      </div>
                      {taskRubric ? (
                        <>
                          <h5 className="font-bold mt-2 mb-2">
                            {taskRubric.title}
                          </h5>
                          {taskRubric.description && (
                            <p className="text-xs text-gray-600 mb-2">
                              {taskRubric.description}
                            </p>
                          )}
                          <div className="grid grid-cols-5 gap-2 text-xs">
                            <div className="bg-red-100 p-2 rounded">
                              <div className="font-bold text-red-700 mb-1">
                                1
                              </div>
                              <p className="text-gray-700">
                                {taskRubric.level_1_criteria}
                              </p>
                            </div>
                            <div className="bg-orange-100 p-2 rounded">
                              <div className="font-bold text-orange-700 mb-1">
                                2
                              </div>
                              <p className="text-gray-700">
                                {taskRubric.level_2_criteria}
                              </p>
                            </div>
                            <div className="bg-yellow-100 p-2 rounded">
                              <div className="font-bold text-yellow-700 mb-1">
                                3
                              </div>
                              <p className="text-gray-700">
                                {taskRubric.level_3_criteria}
                              </p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded">
                              <div className="font-bold text-blue-700 mb-1">
                                4
                              </div>
                              <p className="text-gray-700">
                                {taskRubric.level_4_criteria}
                              </p>
                            </div>
                            <div className="bg-green-100 p-2 rounded">
                              <div className="font-bold text-green-700 mb-1">
                                5
                              </div>
                              <p className="text-gray-700">
                                {taskRubric.level_5_criteria}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 italic mt-2">
                          No rubric defined for this task. The assessment-wide
                          rubric will be used if available.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

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

      {/* Rubric Modal */}
      <RubricModal
        show={showRubricModal}
        onClose={() => setShowRubricModal(false)}
        assessmentId={selectedAssessment?.id}
        taskId={rubricTaskId}
        existingRubric={editingRubric}
        onSave={handleSaveRubric}
      />
    </div>
  );
};

export default AssessmentManagementPage;
