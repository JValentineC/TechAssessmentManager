import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCohort } from "../context/CohortContext";
import { assessmentService, submissionService } from "../services";
import Timer from "../components/Timer";
import FileUpload from "../components/FileUpload";
import WebcamProctoring from "../components/WebcamProctoring";
import { FaExclamationTriangle } from "react-icons/fa";

const AssessmentRunnerPage = () => {
  const { assessmentId } = useParams();
  const { user } = useAuth();
  const { selectedCohort } = useCohort();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proctoringConsent, setProctoringConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(true);

  useEffect(() => {
    initializeAssessment();
  }, []);

  const initializeAssessment = async () => {
    try {
      setLoading(true);

      // Get assessment details
      const assessments = await assessmentService.getAll();
      const currentAssessment = assessments.find(
        (a) => a.id === parseInt(assessmentId)
      );

      if (!currentAssessment) {
        throw new Error("Assessment not found");
      }

      setAssessment(currentAssessment);

      // Get tasks
      const taskList = await assessmentService.getTasks(assessmentId);
      setTasks(taskList);

      // Start assessment (creates submission records)
      const result = await submissionService.start(
        assessmentId,
        selectedCohort.id
      );
      setStartTime(result.started_at);

      // Initialize submission tracking
      const submissionMap = {};
      result.submission_ids.forEach((id, index) => {
        submissionMap[taskList[index].id] = {
          id,
          status: "in_progress",
          file: null,
        };
      });
      setSubmissions(submissionMap);
    } catch (error) {
      console.error("Failed to initialize assessment:", error);
      alert(error.response?.data?.error || "Failed to start assessment");
      navigate("/assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeout = async () => {
    alert("Time is up! Your assessment will be auto-submitted.");
    await autoSubmitAll();
  };

  const autoSubmitAll = async () => {
    try {
      const promises = Object.values(submissions).map((sub) => {
        if (sub.status === "in_progress") {
          return submissionService.timeout(sub.id);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      navigate(`/assessments/${assessmentId}/reflection`);
    } catch (error) {
      console.error("Auto-submit failed:", error);
    }
  };

  const handleFileUpload = async (taskId, file) => {
    const submission = submissions[taskId];

    try {
      await submissionService.uploadFile(submission.id, taskId, file);

      setSubmissions((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          status: "submitted",
          file: file.name,
        },
      }));
    } catch (error) {
      throw new Error(error.response?.data?.error || "Upload failed");
    }
  };

  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      // Last task - go to reflection
      navigate(`/assessments/${assessmentId}/reflection`);
    }
  };

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const handleConsentAccept = () => {
    setProctoringConsent(true);
    setShowConsentModal(false);
  };

  const handleConsentDecline = () => {
    alert("Proctoring is required to take this assessment.");
    navigate("/assessments");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (showConsentModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Proctoring Consent Required
          </h2>
          <p className="text-gray-700 mb-4">
            This assessment uses randomized proctoring. Your webcam will capture
            periodic snapshots during the assessment for verification purposes.
          </p>
          <p className="text-gray-700 mb-6">
            By clicking "I Agree", you consent to this proctoring method.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleConsentAccept}
              className="btn-primary flex-1"
            >
              I Agree
            </button>
            <button
              onClick={handleConsentDecline}
              className="btn-secondary flex-1"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentTask = tasks[currentTaskIndex];
  const currentSubmission = submissions[currentTask?.id];
  const allCompleted = Object.values(submissions).every(
    (s) => s.status === "submitted"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Proctoring Component */}
      {proctoringConsent && <WebcamProctoring assessmentId={assessmentId} />}

      {/* Fixed Header with Timer */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Assessment {assessment?.code}
              </h1>
              <p className="text-sm text-gray-600">
                Task {currentTaskIndex + 1} of {tasks.length}
              </p>
            </div>
            <Timer
              durationMinutes={assessment?.duration_minutes}
              startTime={startTime}
              onTimeout={handleTimeout}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Warning Banner */}
        <div className="card bg-yellow-50 border border-yellow-200 mb-6">
          <div className="flex items-start space-x-3">
            <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Do not refresh or close this page</li>
                <li>Your work is auto-saved when you upload files</li>
                <li>The assessment will auto-submit when time expires</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Task Content */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {currentTask?.title}
          </h2>

          <div className="prose max-w-none mb-6">
            <div
              className="text-gray-700 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: currentTask?.instructions }}
            />
          </div>

          {currentTask?.template_url && (
            <div className="mb-6">
              <a
                href={currentTask.template_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-block"
              >
                Download Template
              </a>
            </div>
          )}

          {/* File Upload */}
          {currentTask?.max_points > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Upload Your Solution
              </h3>
              <FileUpload
                key={currentTask.id}
                taskId={currentTask.id}
                onUpload={handleFileUpload}
                acceptedTypes={[
                  ".txt",
                  ".sql",
                  ".md",
                  ".pdf",
                  ".png",
                  ".jpg",
                  ".jpeg",
                ]}
                maxSizeMB={10}
              />
              {currentSubmission?.file && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ File uploaded: {currentSubmission.file}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousTask}
            disabled={currentTaskIndex === 0}
            className="btn-secondary disabled:opacity-50"
          >
            Previous Task
          </button>

          <div className="text-sm text-gray-600">
            {
              Object.values(submissions).filter((s) => s.status === "submitted")
                .length
            }{" "}
            of {tasks.length} tasks submitted
          </div>

          <button onClick={handleNextTask} className="btn-primary">
            {currentTaskIndex === tasks.length - 1
              ? "Finish & Reflect"
              : "Next Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentRunnerPage;
