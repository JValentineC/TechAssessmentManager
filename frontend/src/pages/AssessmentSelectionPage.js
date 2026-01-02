import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCohort } from "../context/CohortContext";
import { assessmentService, windowService } from "../services";
import {
  FaLock,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { format, isPast, isFuture, isWithinInterval } from "date-fns";

const AssessmentSelectionPage = () => {
  const { selectedCohort } = useCohort();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCohort) {
      loadAssessments();
    }
  }, [selectedCohort]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAvailable(selectedCohort.id);
      setAssessments(data);
    } catch (error) {
      console.error("Failed to load assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (window) => {
    if (!window.visible) {
      return { type: "hidden", label: "Not Available", color: "gray" };
    }

    if (window.locked) {
      return { type: "locked", label: "Locked", color: "red" };
    }

    const now = new Date();
    const opens = new Date(window.opens_at);
    const closes = new Date(window.closes_at);

    if (isFuture(opens)) {
      return {
        type: "upcoming",
        label: `Opens ${format(opens, "MMM d, h:mm a")}`,
        color: "blue",
      };
    }

    if (isPast(closes)) {
      return { type: "closed", label: "Closed", color: "gray" };
    }

    if (isWithinInterval(now, { start: opens, end: closes })) {
      return { type: "open", label: "Available Now", color: "green" };
    }

    return { type: "unavailable", label: "Unavailable", color: "gray" };
  };

  const handleStartAssessment = (assessmentId) => {
    navigate(`/assessments/${assessmentId}/start`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Assessments</h1>
        <p className="text-gray-600 mt-1">
          Cycle {selectedCohort?.cycle_number}
        </p>
      </div>

      {assessments.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">
            No assessments available at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.map((assessment) => {
            const status = getStatus(assessment.window);
            const canStart = status.type === "open";

            return (
              <div
                key={assessment.id}
                className={`card hover:shadow-lg transition-shadow ${
                  !canStart ? "opacity-75" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Assessment {assessment.code}
                    </h2>
                    <p className="text-gray-600 mt-1">{assessment.title}</p>
                  </div>
                  <span
                    className={`badge ${
                      status.color === "green"
                        ? "badge-success"
                        : status.color === "blue"
                        ? "badge-info"
                        : status.color === "red"
                        ? "badge-danger"
                        : "badge-gray"
                    }`}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{assessment.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <FaClock />
                    <span>{assessment.duration_minutes} minutes</span>
                  </div>
                </div>

                {assessment.window?.notes && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                    <strong>Note:</strong> {assessment.window.notes}
                  </div>
                )}

                {status.type === "locked" && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center space-x-2 text-sm text-red-800">
                    <FaLock />
                    <span>
                      This assessment has been locked by your facilitator.
                    </span>
                  </div>
                )}

                {status.type === "upcoming" && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded flex items-center space-x-2 text-sm text-blue-800">
                    <FaClock />
                    <span>
                      Opens on{" "}
                      {format(
                        new Date(assessment.window.opens_at),
                        "MMMM d, yyyy"
                      )}{" "}
                      at{" "}
                      {format(new Date(assessment.window.opens_at), "h:mm a")}
                    </span>
                  </div>
                )}

                {status.type === "closed" && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded flex items-center space-x-2 text-sm text-gray-600">
                    <FaExclamationTriangle />
                    <span>This assessment window has closed.</span>
                  </div>
                )}

                <button
                  onClick={() => handleStartAssessment(assessment.id)}
                  disabled={!canStart}
                  className={`w-full ${
                    canStart
                      ? "btn-primary"
                      : "btn-secondary cursor-not-allowed"
                  }`}
                >
                  {canStart ? "Start Assessment" : "Not Available"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssessmentSelectionPage;
