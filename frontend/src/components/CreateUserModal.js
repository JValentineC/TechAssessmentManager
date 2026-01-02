import React, { useState } from "react";
import api from "../services/api";
import { FaTimes, FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";

const CreateUserModal = ({ onClose, onSuccess, cohorts }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "intern",
    current_cohort_id: "",
    status: "active",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const generatePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password }));
    setShowPassword(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        setError("Name and email are required");
        setLoading(false);
        return;
      }

      // Prepare data
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      };

      // Add optional fields
      if (formData.password) {
        userData.password = formData.password;
      }

      if (formData.current_cohort_id) {
        userData.current_cohort_id = parseInt(formData.current_cohort_id);
      }

      const response = await api.post("/users", userData);

      if (response.data.success) {
        setSuccess(`User created successfully!`);
        if (response.data.temp_password) {
          setTempPassword(response.data.temp_password);
        }

        // Close after 2 seconds if no temp password, otherwise wait for user
        if (!response.data.temp_password) {
          setTimeout(() => {
            onSuccess(response.data.data);
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && !tempPassword && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {tempPassword && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <p className="font-semibold text-blue-800 mb-2">
                User Created Successfully!
              </p>
              <p className="text-sm text-blue-700 mb-3">
                Temporary password (save this, it won't be shown again):
              </p>
              <div className="flex items-center gap-2 bg-white p-3 rounded border border-blue-300">
                <code className="flex-1 font-mono text-sm">{tempPassword}</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(tempPassword)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Copy to clipboard"
                >
                  <FaCopy />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onSuccess()}
                className="btn btn-primary w-full mt-4"
              >
                Done
              </button>
            </div>
          )}

          {!tempPassword && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="john.doe@icstars.org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input"
                  >
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
                    name="current_cohort_id"
                    value={formData.current_cohort_id}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">No Cohort</option>
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
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input pr-10"
                        placeholder="Leave empty to auto-generate"
                      />
                      {formData.password && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="btn btn-secondary whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    If empty, a temporary password will be generated
                  </p>
                </div>
              </div>

              {/* Actions */}
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
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
