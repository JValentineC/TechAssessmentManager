import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload, FaFile, FaTimes, FaCheckCircle } from "react-icons/fa";

const FileUpload = ({
  taskId,
  onUpload,
  acceptedTypes = [],
  maxSizeMB = 10,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Build proper accept object for react-dropzone
  const acceptConfig =
    acceptedTypes.length > 0
      ? {
          "text/plain": [".txt"],
          "application/sql": [".sql"],
          "text/markdown": [".md"],
          "application/pdf": [".pdf"],
          "image/png": [".png"],
          "image/jpeg": [".jpg", ".jpeg"],
        }
      : undefined;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptConfig,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0].code === "file-too-large") {
          setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
        } else if (rejection.errors[0].code === "file-invalid-type") {
          setError(
            `Invalid file type. Accepted types: ${acceptedTypes.join(", ")}`
          );
        } else {
          setError("File upload failed. Please try again.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploading(true);

        try {
          await onUpload(taskId, file);
          setUploadedFile(file);
          setError(null);
        } catch (err) {
          setError(err.message || "Upload failed. Please try again.");
          setUploadedFile(null);
        } finally {
          setUploading(false);
        }
      }
    },
  });

  const handleRemove = () => {
    setUploadedFile(null);
    setError(null);
  };

  return (
    <div className="space-y-3">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-icstars-blue bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <FaUpload className="text-4xl text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop the file here..."
                : "Drag and drop a file here, or click to select"}
            </p>
            {acceptedTypes.length > 0 && (
              <p className="text-xs text-gray-500">
                Accepted: {acceptedTypes.join(", ")}
              </p>
            )}
            <p className="text-xs text-gray-500">Max size: {maxSizeMB}MB</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <FaCheckCircle className="text-green-600 text-xl" />
            <div>
              <div className="flex items-center space-x-2">
                <FaFile className="text-gray-600" />
                <span className="text-sm font-medium text-gray-800">
                  {uploadedFile.name}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Remove file"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <div className="spinner"></div>
          <span>Uploading...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
