import React, { useState } from "react";

const TaskRenderer = ({ task, value, onChange, readOnly = false }) => {
  const config = task.task_config
    ? typeof task.task_config === "string"
      ? JSON.parse(task.task_config)
      : task.task_config
    : {};

  // Helper function to render individual components within composite tasks
  const renderComponent = (component, componentValue, onComponentChange) => {
    switch (component.type) {
      case "text_input":
        return (
          <input
            type="text"
            value={componentValue || ""}
            onChange={(e) => onComponentChange(e.target.value)}
            placeholder={component.placeholder || ""}
            disabled={readOnly}
            required={component.required}
            minLength={component.minLength}
            maxLength={component.maxLength}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icstars-blue"
          />
        );

      case "text_area":
        return (
          <textarea
            value={componentValue || ""}
            onChange={(e) => onComponentChange(e.target.value)}
            placeholder={component.placeholder || ""}
            disabled={readOnly}
            required={component.required}
            rows={component.rows || 4}
            minLength={component.minLength}
            maxLength={component.maxLength}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icstars-blue resize-y"
          />
        );

      case "code_block":
        return (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-2 text-sm flex items-center justify-between">
              <span>{component.language || "code"}</span>
              {component.readOnly && (
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                  Read Only
                </span>
              )}
            </div>
            <textarea
              value={componentValue || component.templateCode || ""}
              onChange={(e) => onComponentChange(e.target.value)}
              readOnly={readOnly || component.readOnly}
              className="w-full p-4 font-mono text-sm bg-gray-900 text-green-400 border-0 focus:ring-2 focus:ring-icstars-blue"
              rows={component.rows || 12}
              spellCheck={false}
              style={{ resize: "vertical" }}
            />
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-2">
            {component.options?.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  componentValue === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={componentValue === option.value}
                  onChange={(e) => onComponentChange(e.target.value)}
                  disabled={readOnly}
                  className="mr-3"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        const selections = componentValue || [];
        return (
          <div className="space-y-2">
            {component.options?.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  selections.includes(option.value)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selections.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onComponentChange([...selections, option.value]);
                    } else {
                      onComponentChange(
                        selections.filter((v) => v !== option.value)
                      );
                    }
                  }}
                  disabled={readOnly}
                  className="mr-3"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "number_input":
        return (
          <input
            type="number"
            value={componentValue || ""}
            onChange={(e) => onComponentChange(e.target.value)}
            placeholder={component.placeholder || ""}
            disabled={readOnly}
            required={component.required}
            min={component.min}
            max={component.max}
            step={component.step}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icstars-blue"
          />
        );

      case "divider":
        return <hr className="my-4 border-gray-300" />;

      case "info_text":
        return (
          <div
            className={`p-4 rounded-lg ${
              component.style === "warning"
                ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                : component.style === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-blue-50 border border-blue-200 text-blue-800"
            }`}
          >
            <p className="text-sm">{component.text}</p>
          </div>
        );

      default:
        return (
          <p className="text-gray-500 text-sm">
            Unknown component type: {component.type}
          </p>
        );
    }
  };

  const renderTaskByType = () => {
    switch (task.task_type) {
      case "composite":
        // Multi-component task - allows combining multiple input types
        const compositeValue = value || {};
        return (
          <div className="space-y-6">
            {config.components?.map((component, index) => (
              <div key={index} className="space-y-2">
                {component.label && (
                  <label className="block text-sm font-medium text-gray-700">
                    {component.label}
                    {component.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                )}
                {component.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {component.description}
                  </p>
                )}
                {renderComponent(
                  component,
                  compositeValue[`component_${index}`],
                  (newVal) => {
                    onChange({
                      ...compositeValue,
                      [`component_${index}`]: newVal,
                    });
                  }
                )}
              </div>
            ))}
          </div>
        );

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
        // File upload is handled by the FileUpload component in AssessmentRunnerPage
        return null;

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
