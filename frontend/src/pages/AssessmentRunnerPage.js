import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCohort } from "../context/CohortContext";
import { assessmentService, submissionService } from "../services";
import Timer from "../components/Timer";
import FileUpload from "../components/FileUpload";
import WebcamProctoring from "../components/WebcamProctoring";
import TaskRenderer from "../components/TaskRenderer";
import { FaExclamationTriangle } from "react-icons/fa";

const AssessmentRunnerPage = () => {
  const { assessmentId } = useParams();
  const { user } = useAuth();
  const { selectedCohort } = useCohort();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [taskAnswers, setTaskAnswers] = useState({});
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
    console.log(
      "🔵 Starting file upload for task:",
      taskId,
      "submission:",
      submission.id
    );
    console.log("📎 File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    try {
      const updatedSubmission = await submissionService.uploadFile(
        submission.id,
        taskId,
        file
      );
      console.log("✅ Upload successful! Backend response:", updatedSubmission);
      console.log("📊 Status updated to:", updatedSubmission.status);

      setSubmissions((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          ...updatedSubmission,
          file: file.name,
        },
      }));
      console.log("✓ Local state updated");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      console.error("❌ Error details:", error.response?.data);
      throw new Error(error.response?.data?.error || "Upload failed");
    }
  };

  const handleTaskSubmit = async (taskId) => {
    const submission = submissions[taskId];
    const answer = taskAnswers[taskId];
    const currentTask = tasks.find((t) => t.id === taskId);

    // Handle different submission types based on task type
    if (
      currentTask?.task_type === "file_upload" ||
      currentTask?.task_type === "drag_drop_upload"
    ) {
      // File upload handled by handleFileUpload
      if (!answer || !answer.name) {
        alert("Please upload a file before submitting.");
        return;
      }
      // File already uploaded via handleFileUpload
      return;
    }

    // Handle text-based submissions
    const submissionText =
      typeof answer === "object" ? JSON.stringify(answer) : answer || "";

    if (!submissionText.trim()) {
      alert("Please provide your answer before submitting.");
      return;
    }

    try {
      const updatedSubmission = await submissionService.submitText(
        submission.id,
        submissionText
      );

      setSubmissions((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          ...updatedSubmission,
          submission_text: submissionText,
        },
      }));
    } catch (error) {
      console.error("❌ Submission failed:", error);
      throw new Error(error.response?.data?.error || "Submission failed");
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

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Task {currentTaskIndex + 1} of {tasks.length}
            </span>
            <span>
              {Math.round(
                (Object.values(submissions).filter(
                  (s) => s.status === "submitted"
                ).length /
                  tasks.length) *
                  100
              )}
              % Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (Object.values(submissions).filter(
                    (s) => s.status === "submitted"
                  ).length /
                    tasks.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Task Content */}
        <div className="card mb-6 overflow-hidden">
          {/* Task Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentTask?.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {currentTask?.max_points} Points
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {currentTask?.task_type
                  ?.replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            </div>
          </div>

          {/* Task Instructions */}
          <div className="p-6">
            <div className="prose max-w-none mb-6">
              <div
                className="text-gray-700 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: currentTask?.instructions
                    ?.replace(/\n\n/g, '</p><p class="mt-4">')
                    ?.replace(
                      /Instructions:/gi,
                      '<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-3">📋 Instructions</h3>'
                    )
                    ?.replace(
                      /What to Submit:/gi,
                      '<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-3">📤 What to Submit</h3>'
                    )
                    ?.replace(
                      /Proficient Performance:/gi,
                      '<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-3">⭐ Proficient Performance</h3>'
                    )
                    ?.replace(/- /g, '<li class="ml-4">'),
                }}
              />
            </div>

            {currentTask?.template_url && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📎</span>
                    <div>
                      <p className="font-medium text-gray-800">
                        Template Available
                      </p>
                      <p className="text-sm text-gray-600">
                        Download the starter template for this task
                      </p>
                    </div>
                  </div>
                  <a
                    href={currentTask.template_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center"
                  >
                    <span>Download</span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Task Submission Area */}
            {currentTask?.max_points > 0 && (
              <div className="border-t border-gray-200 pt-6">
                {currentSubmission?.status === "submitted" ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-8 text-center mb-6 animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full text-3xl mb-4">
                      ✓
                    </div>
                    <h4 className="text-2xl font-bold text-green-800 mb-3">
                      Task Submitted Successfully!
                    </h4>
                    {currentSubmission.file && (
                      <div className="inline-flex items-center px-4 py-2 bg-white border border-green-200 rounded-lg mb-3">
                        <svg
                          className="w-5 h-5 text-green-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-green-700 font-medium">
                          {currentSubmission.file}
                        </span>
                      </div>
                    )}
                    {currentSubmission.submission_text && (
                      <p className="text-green-700 mb-4">✓ Answer saved</p>
                    )}
                    <p className="text-sm text-gray-600 mt-4">
                      You can resubmit to replace your submission, or move to
                      the next task.
                    </p>
                  </div>
                ) : null}

                {/* Dynamic Task Renderer */}
                <div className="mb-4">
                  <TaskRenderer
                    task={currentTask}
                    value={
                      taskAnswers[currentTask.id] ||
                      currentSubmission?.submission_text ||
                      ""
                    }
                    onChange={(newValue) => {
                      setTaskAnswers((prev) => ({
                        ...prev,
                        [currentTask.id]: newValue,
                      }));
                    }}
                    readOnly={false}
                  />
                </div>

                {/* Submit Button */}
                {currentTask.task_type !== "file_upload" &&
                  currentTask.task_type !== "drag_drop_upload" && (
                    <button
                      onClick={() => handleTaskSubmit(currentTask.id)}
                      className="btn-primary"
                      disabled={!taskAnswers[currentTask.id]}
                    >
                      Submit Answer
                    </button>
                  )}

                {/* File upload types handle their own submission via handleFileUpload */}
                {(currentTask.task_type === "file_upload" ||
                  currentTask.task_type === "drag_drop_upload") && (
                  <FileUpload
                    key={currentTask.id}
                    taskId={currentTask.id}
                    onUpload={handleFileUpload}
                    disabled={currentSubmission?.status === "submitted"}
                    acceptedTypes={[
                      ".txt",
                      ".sql",
                      ".md",
                      ".pdf",
                      ".png",
                      ".jpg",
                      ".jpeg",
                      ".zip",
                      ".doc",
                      ".docx",
                    ]}
                    maxSizeMB={10}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousTask}
              disabled={currentTaskIndex === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous Task
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Progress</div>
              <div className="text-2xl font-bold text-gray-800">
                {
                  Object.values(submissions).filter(
                    (s) => s.status === "submitted"
                  ).length
                }
                <span className="text-gray-400 text-lg"> / {tasks.length}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">tasks completed</div>
            </div>

            <button
              onClick={handleNextTask}
              className="btn-primary inline-flex items-center"
            >
              {currentTaskIndex === tasks.length - 1 ? (
                <>
                  Finish & Reflect
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </>
              ) : (
                <>
                  Next Task
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentRunnerPage;
