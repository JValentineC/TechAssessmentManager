import React, { useState, useEffect } from "react";

const TaskConfigModal = ({ isOpen, onClose, onSave, initialTask = null }) => {
  const [taskType, setTaskType] = useState("single_input");
  const [config, setConfig] = useState({});
  const [taskData, setTaskData] = useState({
    title: "",
    instructions: "",
    max_points: 10,
    order_index: 0,
  });

  useEffect(() => {
    if (initialTask) {
      setTaskData({
        title: initialTask.title,
        instructions: initialTask.instructions,
        max_points: initialTask.max_points,
        order_index: initialTask.order_index,
      });
      setTaskType(initialTask.task_type || "single_input");

      // Parse config if it's a string
      const parsedConfig = initialTask.task_config
        ? typeof initialTask.task_config === "string"
          ? JSON.parse(initialTask.task_config)
          : initialTask.task_config
        : {};
      setConfig(parsedConfig);
    }
  }, [initialTask]);

  const renderConfigFields = () => {
    switch (taskType) {
      case "single_input":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Placeholder Text
              </label>
              <input
                type="text"
                value={config.placeholder || ""}
                onChange={(e) =>
                  setConfig({ ...config, placeholder: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter your answer..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Length
                </label>
                <input
                  type="number"
                  value={config.validation?.minLength || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      validation: {
                        ...(config.validation || {}),
                        minLength: parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Length
                </label>
                <input
                  type="number"
                  value={config.validation?.maxLength || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      validation: {
                        ...(config.validation || {}),
                        maxLength: parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        );

      case "multiple_inputs":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Questions</label>
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    questions: [
                      ...(config.questions || []),
                      {
                        label: "",
                        placeholder: "",
                        required: false,
                        type: "text",
                      },
                    ],
                  })
                }
                className="bg-icstars-blue text-white px-3 py-1 rounded text-sm"
              >
                + Add Question
              </button>
            </div>
            {(config.questions || []).map((q, idx) => (
              <div
                key={idx}
                className="border p-3 rounded space-y-2 bg-gray-50"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-sm">
                    Question {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newQuestions = [...config.questions];
                      newQuestions.splice(idx, 1);
                      setConfig({ ...config, questions: newQuestions });
                    }}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Question label"
                  value={q.label}
                  onChange={(e) => {
                    const newQuestions = [...config.questions];
                    newQuestions[idx].label = e.target.value;
                    setConfig({ ...config, questions: newQuestions });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Placeholder text"
                  value={q.placeholder}
                  onChange={(e) => {
                    const newQuestions = [...config.questions];
                    newQuestions[idx].placeholder = e.target.value;
                    setConfig({ ...config, questions: newQuestions });
                  }}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => {
                        const newQuestions = [...config.questions];
                        newQuestions[idx].required = e.target.checked;
                        setConfig({ ...config, questions: newQuestions });
                      }}
                      className="mr-2"
                    />
                    Required
                  </label>
                  <select
                    value={q.type}
                    onChange={(e) => {
                      const newQuestions = [...config.questions];
                      newQuestions[idx].type = e.target.value;
                      setConfig({ ...config, questions: newQuestions });
                    }}
                    className="p-1 border rounded"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="tel">Phone</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        );

      case "file_upload":
      case "drag_drop_upload":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructions
              </label>
              <input
                type="text"
                value={config.instructions || ""}
                onChange={(e) =>
                  setConfig({ ...config, instructions: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Upload your completed project..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Accepted File Types (comma-separated)
              </label>
              <input
                type="text"
                value={config.acceptedTypes?.join(", ") || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    acceptedTypes: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s),
                  })
                }
                className="w-full p-2 border rounded"
                placeholder=".pdf, .docx, .zip"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                value={config.maxFileSize ? config.maxFileSize / 1048576 : 10}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    maxFileSize: parseInt(e.target.value) * 1048576,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.multiple || false}
                onChange={(e) =>
                  setConfig({ ...config, multiple: e.target.checked })
                }
                className="mr-2"
              />
              Allow multiple files
            </label>
          </div>
        );

      case "code_editor":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Programming Language
              </label>
              <select
                value={config.language || "javascript"}
                onChange={(e) =>
                  setConfig({ ...config, language: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Starter Code
              </label>
              <textarea
                value={config.starterCode || ""}
                onChange={(e) =>
                  setConfig({ ...config, starterCode: e.target.value })
                }
                className="w-full p-2 border rounded font-mono text-sm"
                rows={6}
                placeholder="function solution() {&#10;  // Your code here&#10;}"
              />
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.readOnly || false}
                onChange={(e) =>
                  setConfig({ ...config, readOnly: e.target.checked })
                }
                className="mr-2"
              />
              Read-only (for reference)
            </label>
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Question</label>
              <input
                type="text"
                value={config.question || ""}
                onChange={(e) =>
                  setConfig({ ...config, question: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="What is 2 + 2?"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Options</label>
                <button
                  type="button"
                  onClick={() =>
                    setConfig({
                      ...config,
                      options: [
                        ...(config.options || []),
                        { value: "", label: "" },
                      ],
                    })
                  }
                  className="bg-icstars-blue text-white px-3 py-1 rounded text-sm"
                >
                  + Add Option
                </button>
              </div>
              {(config.options || []).map((opt, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Value"
                    value={opt.value}
                    onChange={(e) => {
                      const newOptions = [...config.options];
                      newOptions[idx].value = e.target.value;
                      setConfig({ ...config, options: newOptions });
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Label"
                    value={opt.label}
                    onChange={(e) => {
                      const newOptions = [...config.options];
                      newOptions[idx].label = e.target.value;
                      setConfig({ ...config, options: newOptions });
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...config.options];
                      newOptions.splice(idx, 1);
                      setConfig({ ...config, options: newOptions });
                    }}
                    className="px-3 py-2 bg-red-500 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Correct Answer (value)
              </label>
              <input
                type="text"
                value={config.correctAnswer || ""}
                onChange={(e) =>
                  setConfig({ ...config, correctAnswer: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        );

      case "checkbox_list":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Question</label>
              <input
                type="text"
                value={config.question || ""}
                onChange={(e) =>
                  setConfig({ ...config, question: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Select all technologies you know:"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Options</label>
                <button
                  type="button"
                  onClick={() =>
                    setConfig({
                      ...config,
                      options: [
                        ...(config.options || []),
                        { value: "", label: "" },
                      ],
                    })
                  }
                  className="bg-icstars-blue text-white px-3 py-1 rounded text-sm"
                >
                  + Add Option
                </button>
              </div>
              {(config.options || []).map((opt, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Value"
                    value={opt.value}
                    onChange={(e) => {
                      const newOptions = [...config.options];
                      newOptions[idx].value = e.target.value;
                      setConfig({ ...config, options: newOptions });
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Label"
                    value={opt.label}
                    onChange={(e) => {
                      const newOptions = [...config.options];
                      newOptions[idx].label = e.target.value;
                      setConfig({ ...config, options: newOptions });
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...config.options];
                      newOptions.splice(idx, 1);
                      setConfig({ ...config, options: newOptions });
                    }}
                    className="px-3 py-2 bg-red-500 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Selections
                </label>
                <input
                  type="number"
                  value={config.minSelections || 1}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      minSelections: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Selections
                </label>
                <input
                  type="number"
                  value={config.maxSelections || config.options?.length || 10}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maxSelections: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        );

      case "text_area":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Placeholder
              </label>
              <input
                type="text"
                value={config.placeholder || ""}
                onChange={(e) =>
                  setConfig({ ...config, placeholder: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rows</label>
              <input
                type="number"
                value={config.rows || 6}
                onChange={(e) =>
                  setConfig({ ...config, rows: parseInt(e.target.value) })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Length
                </label>
                <input
                  type="number"
                  value={config.minLength || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      minLength: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Length
                </label>
                <input
                  type="number"
                  value={config.maxLength || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maxLength: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        );

      case "composite":
        const components = config.components || [];
        
        const addComponent = () => {
          setConfig({
            ...config,
            components: [...components, { type: "text_input", label: "", required: false }]
          });
        };

        const removeComponent = (index) => {
          setConfig({
            ...config,
            components: components.filter((_, i) => i !== index)
          });
        };

        const updateComponent = (index, field, value) => {
          const newComponents = [...components];
          newComponents[index] = { ...newComponents[index], [field]: value };
          setConfig({ ...config, components: newComponents });
        };

        const renderComponentConfig = (component, index) => {
          const compType = component.type || "text_input";

          return (
            <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-700">Component {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeComponent(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>

              {/* Component Type Selector */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Component Type</label>
                <select
                  value={compType}
                  onChange={(e) => {
                    // Reset component with new type
                    const newComp = { type: e.target.value, label: component.label || "" };
                    const newComponents = [...components];
                    newComponents[index] = newComp;
                    setConfig({ ...config, components: newComponents });
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="text_input">Text Input</option>
                  <option value="text_area">Text Area</option>
                  <option value="code_block">Code Block</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="checkbox">Checkbox List</option>
                  <option value="number_input">Number Input</option>
                  <option value="divider">Divider</option>
                  <option value="info_text">Info Text</option>
                </select>
              </div>

              {/* Common Fields */}
              {compType !== "divider" && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Label</label>
                    <input
                      type="text"
                      value={component.label || ""}
                      onChange={(e) => updateComponent(index, "label", e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Component label"
                    />
                  </div>

                  {compType !== "info_text" && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Description (optional)</label>
                      <input
                        type="text"
                        value={component.description || ""}
                        onChange={(e) => updateComponent(index, "description", e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Helper text"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Type-Specific Fields */}
              {compType === "text_input" && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={component.placeholder || ""}
                      onChange={(e) => updateComponent(index, "placeholder", e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={component.required || false}
                          onChange={(e) => updateComponent(index, "required", e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Required</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Min Length</label>
                      <input
                        type="number"
                        value={component.minLength || ""}
                        onChange={(e) => updateComponent(index, "minLength", parseInt(e.target.value) || undefined)}
                        className="w-full p-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Max Length</label>
                      <input
                        type="number"
                        value={component.maxLength || ""}
                        onChange={(e) => updateComponent(index, "maxLength", parseInt(e.target.value) || undefined)}
                        className="w-full p-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {compType === "text_area" && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={component.placeholder || ""}
                      onChange={(e) => updateComponent(index, "placeholder", e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs mb-1">Rows</label>
                      <input
                        type="number"
                        value={component.rows || 4}
                        onChange={(e) => updateComponent(index, "rows", parseInt(e.target.value) || 4)}
                        className="w-full p-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center pt-5">
                        <input
                          type="checkbox"
                          checked={component.required || false}
                          onChange={(e) => updateComponent(index, "required", e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Required</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {compType === "code_block" && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Language</label>
                      <input
                        type="text"
                        value={component.language || ""}
                        onChange={(e) => updateComponent(index, "language", e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="python, javascript, sql..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rows</label>
                      <input
                        type="number"
                        value={component.rows || 12}
                        onChange={(e) => updateComponent(index, "rows", parseInt(e.target.value) || 12)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={component.readOnly || false}
                        onChange={(e) => updateComponent(index, "readOnly", e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Read Only (Reference code)</span>
                    </label>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Template Code</label>
                    <textarea
                      value={component.templateCode || ""}
                      onChange={(e) => updateComponent(index, "templateCode", e.target.value)}
                      className="w-full p-2 border rounded font-mono text-sm"
                      rows={4}
                      placeholder="Starter code..."
                    />
                  </div>
                </>
              )}

              {(compType === "multiple_choice" || compType === "checkbox") && (
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-2">Options</label>
                  {(component.options || []).map((opt, optIndex) => (
                    <div key={optIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={opt.value || ""}
                        onChange={(e) => {
                          const newOptions = [...(component.options || [])];
                          newOptions[optIndex] = { ...opt, value: e.target.value };
                          updateComponent(index, "options", newOptions);
                        }}
                        className="w-1/3 p-2 border rounded text-sm"
                        placeholder="Value"
                      />
                      <input
                        type="text"
                        value={opt.label || ""}
                        onChange={(e) => {
                          const newOptions = [...(component.options || [])];
                          newOptions[optIndex] = { ...opt, label: e.target.value };
                          updateComponent(index, "options", newOptions);
                        }}
                        className="flex-1 p-2 border rounded text-sm"
                        placeholder="Label"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = (component.options || []).filter((_, i) => i !== optIndex);
                          updateComponent(index, "options", newOptions);
                        }}
                        className="text-red-600 hover:text-red-800 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...(component.options || []), { value: "", label: "" }];
                      updateComponent(index, "options", newOptions);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Option
                  </button>
                  {compType === "multiple_choice" && (
                    <div className="mt-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={component.required || false}
                          onChange={(e) => updateComponent(index, "required", e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Required</span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {compType === "number_input" && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={component.placeholder || ""}
                      onChange={(e) => updateComponent(index, "placeholder", e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={component.required || false}
                          onChange={(e) => updateComponent(index, "required", e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Required</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Min</label>
                      <input
                        type="number"
                        value={component.min || ""}
                        onChange={(e) => updateComponent(index, "min", parseFloat(e.target.value) || undefined)}
                        className="w-full p-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Max</label>
                      <input
                        type="number"
                        value={component.max || ""}
                        onChange={(e) => updateComponent(index, "max", parseFloat(e.target.value) || undefined)}
                        className="w-full p-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Step</label>
                      <input
                        type="number"
                        value={component.step || ""}
                        onChange={(e) => updateComponent(index, "step", parseFloat(e.target.value) || undefined)}
                        className="w-full p-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {compType === "info_text" && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Text</label>
                    <textarea
                      value={component.text || ""}
                      onChange={(e) => updateComponent(index, "text", e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={3}
                      placeholder="Information message..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Style</label>
                    <select
                      value={component.style || "info"}
                      onChange={(e) => updateComponent(index, "style", e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="warning">Warning (Yellow)</option>
                      <option value="success">Success (Green)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          );
        };

        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Composite tasks</strong> let you combine multiple components. Add components below and configure each one.
              </p>
            </div>

            {/* Component List */}
            <div className="space-y-3">
              {components.map((comp, index) => renderComponentConfig(comp, index))}
            </div>

            {/* Add Component Button */}
            <button
              type="button"
              onClick={addComponent}
              className="w-full p-3 border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50 rounded-lg font-medium transition"
            >
              + Add Component
            </button>

            {components.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    View JSON Configuration
                  </summary>
                  <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-x-auto">
                    {JSON.stringify({ components }, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSave = () => {
    onSave({
      ...taskData,
      task_type: taskType,
      task_config: JSON.stringify(config),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">
            {initialTask ? "Edit Task" : "Create New Task"}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Task Info */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Instructions *
            </label>
            <textarea
              value={taskData.instructions}
              onChange={(e) =>
                setTaskData({ ...taskData, instructions: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Points
              </label>
              <input
                type="number"
                value={taskData.max_points}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    max_points: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={taskData.order_index}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    order_index: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Task Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Task Type *
            </label>
            <select
              value={taskType}
              onChange={(e) => {
                setTaskType(e.target.value);
                setConfig({}); // Reset config when type changes
              }}
              className="w-full p-2 border rounded"
            >
              <option value="single_input">Single Text Input</option>
              <option value="multiple_inputs">Multiple Text Inputs</option>
              <option value="text_area">Text Area (Long Answer)</option>
              <option value="composite">Composite (Multiple Components)</option>
              <option value="file_upload">File Upload</option>
              <option value="drag_drop_upload">Drag & Drop Upload</option>
              <option value="code_editor">Code Editor</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="checkbox_list">Checkbox List</option>
            </select>
          </div>

          {/* Type-specific Configuration */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Task Configuration</h3>
            {renderConfigFields()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-icstars-blue text-white rounded hover:bg-blue-700"
          >
            {initialTask ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskConfigModal;
