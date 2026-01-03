import React, { useState } from "react";

const TaskRenderer = ({ task, value, onChange, readOnly = false }) => {
  const config = task.task_config
    ? typeof task.task_config === "string"
      ? JSON.parse(task.task_config)
      : task.task_config
    : {};

  const renderTaskByType = () => {
    switch (task.task_type) {
      case "single_input":
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={config.placeholder || "Enter your answer..."}
              disabled={readOnly}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icstars-blue"
              minLength={config.validation?.minLength}
              maxLength={config.validation?.maxLength}
              required={config.validation?.required}
            />
            {config.validation?.maxLength && (
              <p className="text-sm text-gray-500">
                {(value || "").length} / {config.validation.maxLength}{" "}
                characters
              </p>
            )}
          </div>
        );

      case "multiple_inputs":
        const answers = value || {};
        return (
          <div className="space-y-4">
            {config.questions?.map((question, index) => (
              <div key={index} className="space-y-2">
                <label className="block font-medium text-gray-700">
                  {question.label}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <input
                  type={question.type || "text"}
                  value={answers[`question_${index}`] || ""}
                  onChange={(e) =>
                    onChange({
                      ...answers,
                      [`question_${index}`]: e.target.value,
                    })
                  }
                  placeholder={question.placeholder}
                  disabled={readOnly}
                  required={question.required}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icstars-blue"
                />
              </div>
            ))}
          </div>
        );

      case "file_upload":
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-icstars-blue transition">
              <input
                type="file"
                onChange={(e) => onChange(e.target.files[0])}
                accept={config.acceptedTypes?.join(",")}
                multiple={config.multiple}
                disabled={readOnly}
                className="hidden"
                id={`file-upload-${task.id}`}
              />
              <label
                htmlFor={`file-upload-${task.id}`}
                className="cursor-pointer"
              >
                <div className="text-4xl mb-2">📁</div>
                <p className="text-lg font-medium text-gray-700">
                  {config.instructions || "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Accepted: {config.acceptedTypes?.join(", ") || "Any file"}
                </p>
                {config.maxFileSize && (
                  <p className="text-sm text-gray-500">
                    Max size: {(config.maxFileSize / 1048576).toFixed(0)}MB
                  </p>
                )}
              </label>
            </div>
            {value && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-800">
                  ✓ File uploaded: {value.name || value}
                </p>
              </div>
            )}
          </div>
        );

      case "code_editor":
        // Simplified code editor (without external dependencies)
        return (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-2 text-sm">
              {config.language || "code"}
            </div>
            <textarea
              value={value || config.starterCode || ""}
              onChange={(e) => onChange(e.target.value)}
              readOnly={readOnly || config.readOnly}
              className="w-full p-4 font-mono text-sm bg-gray-900 text-green-400 border-0 focus:ring-2 focus:ring-icstars-blue"
              rows={20}
              spellCheck={false}
              style={{ resize: "vertical" }}
            />
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-700 mb-4">{config.question}</p>
            {config.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  value === option.value
                    ? "border-icstars-blue bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name={`task-${task.id}`}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={readOnly}
                  className="mr-3"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox_list":
        const selections = value || [];
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-700 mb-4">{config.question}</p>
            {config.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  selections.includes(option.value)
                    ? "border-icstars-blue bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selections.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selections, option.value]);
                    } else {
                      onChange(selections.filter((v) => v !== option.value));
                    }
                  }}
                  disabled={readOnly}
                  className="mr-3"
                />
                <span>{option.label}</span>
              </label>
            ))}
            {(config.minSelections || config.maxSelections) && (
              <p className="text-sm text-gray-500 mt-2">
                Select {config.minSelections || 1} to{" "}
                {config.maxSelections || config.options?.length || "all"}
              </p>
            )}
          </div>
        );

      case "text_area":
        return (
          <div className="space-y-2">
            <textarea
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={config.placeholder || "Enter your answer..."}
              disabled={readOnly}
              rows={config.rows || 6}
              minLength={config.minLength}
              maxLength={config.maxLength}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icstars-blue resize-y"
            />
            {config.maxLength && (
              <p className="text-sm text-gray-500">
                {(value || "").length} / {config.maxLength} characters
              </p>
            )}
          </div>
        );

      case "drag_drop_upload":
        return (
          <DragDropUpload
            value={value}
            onChange={onChange}
            config={config}
            readOnly={readOnly}
            taskId={task.id}
          />
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded text-gray-600">
            Unknown task type: {task.task_type}
          </div>
        );
    }
  };

  return <div className="task-renderer">{renderTaskByType()}</div>;
};

// Drag and Drop Upload Component
const DragDropUpload = ({ value, onChange, config, readOnly, taskId }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!readOnly && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
        isDragging
          ? "border-icstars-blue bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <input
        type="file"
        onChange={(e) => onChange(e.target.files[0])}
        accept={config.acceptedTypes?.join(",")}
        multiple={config.multiple}
        disabled={readOnly}
        className="hidden"
        id={`drag-drop-${taskId}`}
      />
      <label htmlFor={`drag-drop-${taskId}`} className="cursor-pointer">
        <div className="text-6xl mb-4">⬆️</div>
        <p className="text-xl font-medium text-gray-700">
          Drag files here or click to browse
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {config.acceptedTypes?.join(", ") || "Any file type"}
        </p>
      </label>
      {value && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
          <p className="text-green-800">✓ {value.name || value}</p>
        </div>
      )}
    </div>
  );
};

export default TaskRenderer;
