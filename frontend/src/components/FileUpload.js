import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload, FaFile, FaTimes, FaCheckCircle } from "react-icons/fa";
import JSZip from "jszip";

const FileUpload = ({
  taskId,
  onUpload,
  acceptedTypes = [],
  maxSizeMB = 10,
  multiple = true, // Enable multiple files by default
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
    multiple: multiple,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      console.log("🎯 FileUpload onDrop triggered");
      console.log("📁 Accepted files:", acceptedFiles);
      console.log("❌ Rejected files:", rejectedFiles);
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        console.log("🚫 File rejected:", rejection.errors);
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
        console.log(`✅ ${acceptedFiles.length} file(s) accepted`);
        setUploading(true);

        try {
          let fileToUpload;

          // If multiple files selected, zip them together
          if (acceptedFiles.length > 1) {
            console.log("📦 Multiple files detected, creating zip archive...");
            const zip = new JSZip();

            // Add each file to the zip
            acceptedFiles.forEach((file) => {
              zip.file(file.name, file);
            });

            // Generate the zip file
            const zipBlob = await zip.generateAsync({ type: "blob" });

            // Create a File object from the blob
            fileToUpload = new File([zipBlob], `submission-${Date.now()}.zip`, {
              type: "application/zip",
            });

            console.log("✅ Zip created:", fileToUpload.name);
          } else {
            // Single file, upload as-is
            fileToUpload = acceptedFiles[0];
          }

          console.log("🚀 Calling onUpload with taskId:", taskId);
          await onUpload(taskId, fileToUpload);
          console.log("✅ onUpload completed successfully");
          setUploadedFiles(acceptedFiles);
          setError(null);
        } catch (err) {
          console.error("❌ onUpload failed:", err);
          setError(err.message || "Upload failed. Please try again.");
          setUploadedFiles([]);
        } finally {
          setUploading(false);
        }
      } else {
        console.log("⚠️ No accepted files");
      }
    },
  });

  const handleRemove = () => {
    setUploadedFiles([]);
    setError(null);
  };

  const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="space-y-3">
      {uploadedFiles.length === 0 ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div
              className={`transition-transform duration-200 ${
                isDragActive ? "scale-110" : ""
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <FaUpload className="text-3xl text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 mb-1">
                {isDragActive
                  ? "Drop your files here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-500">
                {multiple
                  ? "Select one or multiple files to submit"
                  : "Upload your completed work to submit this task"}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {acceptedTypes.length > 0 ? (
                acceptedTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-mono"
                  >
                    {type}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Any file type accepted</span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Maximum file size: {maxSizeMB}MB per file
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 animate-fadeIn">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800 mb-1">
                  {uploadedFiles.length === 1
                    ? "File uploaded successfully!"
                    : `${uploadedFiles.length} files zipped and uploaded successfully!`}
                </p>
                <p className="text-xs text-gray-600">
                  {uploadedFiles.length > 1
                    ? "Multiple files were automatically combined into a zip archive"
                    : "Your file has been submitted"}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove and upload different file(s)"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* File list */}
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-sm bg-white bg-opacity-50 rounded-lg p-3"
              >
                <FaFile className="text-green-600 flex-shrink-0" />
                <span className="font-medium text-gray-800 truncate flex-1">
                  {file.name}
                </span>
                <span className="text-xs text-gray-600 flex-shrink-0">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>

          {uploadedFiles.length > 1 && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-xs text-gray-600">
                Total size: {(totalSize / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>
      )}

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="spinner"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Uploading your file...
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Please wait while we process your submission
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">Upload failed</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
