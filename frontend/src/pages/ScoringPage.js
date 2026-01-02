import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaStar,
  FaRegStar,
  FaUser,
  FaCalendar,
  FaClock,
  FaFileAlt,
  FaCamera,
  FaSave,
  FaCheck,
  FaArrowLeft,
} from "react-icons/fa";

const ScoringPage = () => {
  const { isFacilitator, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submissionId = searchParams.get("submission");

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState({
    rubric_score: 0,
    comments: "",
  });
  const [hoverScore, setHoverScore] = useState(0);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (submissionId) {
      loadSubmission();
    }
  }, [submissionId]);

  const loadSubmission = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/submissions/${submissionId}`);

      if (response.data.success) {
        const data = response.data.data;
        setSubmission(data);

        // Pre-fill if already scored
        if (data.rubric_score) {
          setScore({
            rubric_score: data.rubric_score,
            comments: data.score_comments || "",
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load submission");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScore = async (publish = false) => {
    if (score.rubric_score < 1 || score.rubric_score > 5) {
      setError("Please select a score between 1 and 5");
      return;
    }

    try {
      setScoring(true);
      setError(null);

      const response = await api.post("/scores", {
        submission_id: parseInt(submissionId),
        rubric_score: score.rubric_score,
        comments: score.comments,
      });

      if (response.data.success) {
        setSuccess(
          publish ? "Score published successfully!" : "Score saved as draft"
        );

        // Reload submission to get updated score info
        await loadSubmission();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save score");
    } finally {
      setScoring(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setScore({ ...score, rubric_score: star })}
            onMouseEnter={() => setHoverScore(star)}
            onMouseLeave={() => setHoverScore(0)}
            className="text-4xl transition-colors focus:outline-none"
          >
            {star <= (hoverScore || score.rubric_score) ? (
              <FaStar className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-gray-300" />
            )}
          </button>
        ))}
        <span className="ml-4 text-2xl font-bold text-gray-700">
          {score.rubric_score > 0 ? `${score.rubric_score} / 5` : "Not scored"}
        </span>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      in_progress: "bg-yellow-100 text-yellow-800",
      submitted: "bg-blue-100 text-blue-800",
      timed_out: "bg-orange-100 text-orange-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      in_progress: "In Progress",
      submitted: "Completed",
      timed_out: "Auto-Submitted (Timeout)",
    };
    return labels[status] || status;
  };

  if (!isFacilitator() && !isAdmin()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  if (!submissionId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Scoring</h1>
          <p className="text-gray-600 mt-1">
            Select a submission from the Submissions page to score
          </p>
        </div>
        <div className="card text-center py-12">
          <FaStar className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-600 mb-4">No submission selected</p>
          <button
            onClick={() => navigate("/submissions")}
            className="btn btn-primary"
          >
            View Submissions
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Submission not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/submissions")}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Score Submission
            </h1>
            <p className="text-gray-600 mt-1">
              {submission.assessment_title} - {submission.task_title}
            </p>
          </div>
        </div>
        {submission.score_id && (
          <div className="flex items-center gap-2 text-green-600">
            <FaCheck />
            <span className="font-semibold">Scored</span>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Submission Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Intern Info Card */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Intern Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{submission.user_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Cohort</p>
                  <p className="font-semibold">{submission.cohort_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCalendar className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Started</p>
                  <p className="font-semibold">
                    {new Date(submission.started_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-semibold">
                    {submission.submitted_at
                      ? new Date(submission.submitted_at).toLocaleString()
                      : "Not submitted"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(
                  submission.status
                )}`}
              >
                {getStatusLabel(submission.status)}
              </span>
            </div>
          </div>

          {/* Task Instructions */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Task Instructions</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {submission.task_instructions}
              </p>
            </div>
          </div>

          {/* Submission File */}
          {submission.file_path && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Submitted File</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-3xl text-blue-500" />
                  <div>
                    <p className="font-semibold">Submission File</p>
                    <p className="text-sm text-gray-600">
                      {submission.file_path.split("/").pop()}
                    </p>
                  </div>
                </div>
                <a
                  href={`${api.defaults.baseURL}/../${submission.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  Download
                </a>
              </div>
            </div>
          )}

          {/* Reflection Notes */}
          {submission.reflection_notes && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Reflection Notes</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {submission.reflection_notes}
                </p>
              </div>
            </div>
          )}

          {/* Proctoring Snapshots */}
          {submission.snapshots && submission.snapshots.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <FaCamera className="text-gray-400" />
                <h2 className="text-xl font-bold">Proctoring Snapshots</h2>
                <span className="text-sm text-gray-500">
                  ({submission.snapshots.length})
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {submission.snapshots.map((snapshot) => (
                  <div key={snapshot.id} className="relative group">
                    <img
                      src={`${api.defaults.baseURL}/../${snapshot.image_path}`}
                      alt="Snapshot"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                      <p className="text-white text-xs opacity-0 group-hover:opacity-100">
                        {new Date(snapshot.captured_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Scoring Panel */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h2 className="text-xl font-bold mb-6">Rubric Scoring</h2>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Score (1-5)
              </label>
              {renderStarRating()}
              <p className="text-xs text-gray-500 mt-2">
                Click a star to set the score
              </p>
            </div>

            {/* Score Description */}
            {score.rubric_score > 0 && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">
                  {score.rubric_score === 5 &&
                    "Exceptional - Exceeds expectations"}
                  {score.rubric_score === 4 &&
                    "Proficient - Meets all requirements"}
                  {score.rubric_score === 3 &&
                    "Competent - Meets most requirements"}
                  {score.rubric_score === 2 && "Developing - Needs improvement"}
                  {score.rubric_score === 1 && "Beginning - Significant gaps"}
                </p>
              </div>
            )}

            {/* Comments */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments & Feedback
              </label>
              <textarea
                value={score.comments}
                onChange={(e) =>
                  setScore({ ...score, comments: e.target.value })
                }
                rows={6}
                className="input"
                placeholder="Provide detailed feedback on the submission..."
              />
            </div>

            {/* Previous Score Info */}
            {submission.scored_at && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm">
                <p className="text-gray-600">
                  Last scored by{" "}
                  <span className="font-semibold">
                    {submission.scorer_name}
                  </span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(submission.scored_at).toLocaleString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSaveScore(false)}
                disabled={scoring || score.rubric_score === 0}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <FaSave />
                {scoring ? "Saving..." : "Save Draft"}
              </button>

              <button
                onClick={() => handleSaveScore(true)}
                disabled={scoring || score.rubric_score === 0}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <FaCheck />
                {scoring ? "Publishing..." : "Publish Score"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Scores can be updated anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringPage;
