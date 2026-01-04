import React, { useState, useEffect } from "react";
import { rubricService } from "../services";
import { FaTimes, FaSave, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const RubricModal = ({
  show,
  onClose,
  assessmentId,
  taskId,
  existingRubric,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level_1_criteria: "",
    level_2_criteria: "",
    level_3_criteria: "",
    level_4_criteria: "",
    level_5_criteria: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingRubric) {
      setFormData({
        title: existingRubric.title || "",
        description: existingRubric.description || "",
        level_1_criteria: existingRubric.level_1_criteria || "",
        level_2_criteria: existingRubric.level_2_criteria || "",
        level_3_criteria: existingRubric.level_3_criteria || "",
        level_4_criteria: existingRubric.level_4_criteria || "",
        level_5_criteria: existingRubric.level_5_criteria || "",
      });
    } else {
      // Reset form for new rubric
      setFormData({
        title: "",
        description: "",
        level_1_criteria: "",
        level_2_criteria: "",
        level_3_criteria: "",
        level_4_criteria: "",
        level_5_criteria: "",
      });
    }
  }, [existingRubric, show]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const data = {
        ...formData,
        assessment_id: taskId ? null : assessmentId,
        task_id: taskId || null,
      };

      if (existingRubric) {
        await rubricService.update(existingRubric.id, formData);
      } else {
        await rubricService.create(data);
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save rubric");
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">
            {existingRubric ? "Edit Rubric" : "Create New Rubric"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rubric Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Shared Doc Collaboration"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="General instructions or context for this rubric"
              />
            </div>

            {/* Level Criteria */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Score Level Criteria
              </h3>

              {/* Level 1 - Limited */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <label className="block text-sm font-bold text-red-700 mb-2">
                  🔴 Level 1 - Limited *
                </label>
                <textarea
                  value={formData.level_1_criteria}
                  onChange={(e) =>
                    handleChange("level_1_criteria", e.target.value)
                  }
                  className="w-full border border-red-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="2"
                  placeholder="Describe what a score of 1 looks like..."
                  required
                />
              </div>

              {/* Level 2 - Emerging */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <label className="block text-sm font-bold text-orange-700 mb-2">
                  🟠 Level 2 - Emerging *
                </label>
                <textarea
                  value={formData.level_2_criteria}
                  onChange={(e) =>
                    handleChange("level_2_criteria", e.target.value)
                  }
                  className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="2"
                  placeholder="Describe what a score of 2 looks like..."
                  required
                />
              </div>

              {/* Level 3 - Developing */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <label className="block text-sm font-bold text-yellow-700 mb-2">
                  🟡 Level 3 - Developing *
                </label>
                <textarea
                  value={formData.level_3_criteria}
                  onChange={(e) =>
                    handleChange("level_3_criteria", e.target.value)
                  }
                  className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows="2"
                  placeholder="Describe what a score of 3 looks like..."
                  required
                />
              </div>

              {/* Level 4 - Proficient */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <label className="block text-sm font-bold text-blue-700 mb-2">
                  🔵 Level 4 - Proficient *
                </label>
                <textarea
                  value={formData.level_4_criteria}
                  onChange={(e) =>
                    handleChange("level_4_criteria", e.target.value)
                  }
                  className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Describe what a score of 4 looks like..."
                  required
                />
              </div>

              {/* Level 5 - Advanced */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <label className="block text-sm font-bold text-green-700 mb-2">
                  🟢 Level 5 - Advanced *
                </label>
                <textarea
                  value={formData.level_5_criteria}
                  onChange={(e) =>
                    handleChange("level_5_criteria", e.target.value)
                  }
                  className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="2"
                  placeholder="Describe what a score of 5 looks like..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              disabled={saving}
            >
              <FaSave />
              {saving
                ? "Saving..."
                : existingRubric
                ? "Update Rubric"
                : "Create Rubric"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RubricModal;
