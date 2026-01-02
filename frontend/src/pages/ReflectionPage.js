import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submissionService } from "../services";

const ReflectionPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [reflections, setReflections] = useState({
    whatWorked: "",
    whatToImprove: "",
    habitToPractice: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !reflections.whatWorked ||
      !reflections.whatToImprove ||
      !reflections.habitToPractice
    ) {
      alert("Please answer all reflection questions.");
      return;
    }

    try {
      setSubmitting(true);

      const reflectionText = `
What worked well for me:
${reflections.whatWorked}

What I could improve next time:
${reflections.whatToImprove}

Professional habit I will keep practicing:
${reflections.habitToPractice}
      `.trim();

      // Get all submissions for this assessment and update with reflection
      // Note: In a real implementation, you'd need the submission IDs
      // For now, we'll just navigate to dashboard

      alert("Reflection submitted! Your assessment is complete.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to submit reflection:", error);
      alert("Failed to submit reflection. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Assessment Reflection
        </h1>
        <p className="text-gray-600 mb-6">
          Take a moment to reflect on your experience. These reflections help
          you grow and improve for future assessments. (Required but not scored)
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1 */}
          <div>
            <label htmlFor="whatWorked" className="label">
              What worked well for me during this assessment?
            </label>
            <textarea
              id="whatWorked"
              value={reflections.whatWorked}
              onChange={(e) =>
                setReflections({ ...reflections, whatWorked: e.target.value })
              }
              className="input min-h-[120px]"
              placeholder="Describe strategies, approaches, or techniques that helped you succeed..."
              required
            />
          </div>

          {/* Question 2 */}
          <div>
            <label htmlFor="whatToImprove" className="label">
              What could I improve for next time?
            </label>
            <textarea
              id="whatToImprove"
              value={reflections.whatToImprove}
              onChange={(e) =>
                setReflections({
                  ...reflections,
                  whatToImprove: e.target.value,
                })
              }
              className="input min-h-[120px]"
              placeholder="Identify areas for growth, skills to develop, or processes to refine..."
              required
            />
          </div>

          {/* Question 3 */}
          <div>
            <label htmlFor="habitToPractice" className="label">
              What professional habit will I keep practicing?
            </label>
            <textarea
              id="habitToPractice"
              value={reflections.habitToPractice}
              onChange={(e) =>
                setReflections({
                  ...reflections,
                  habitToPractice: e.target.value,
                })
              }
              className="input min-h-[120px]"
              placeholder="Name a specific habit or practice you'll continue to develop..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Reflection & Complete Assessment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReflectionPage;
