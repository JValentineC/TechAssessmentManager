import React, { useState, useEffect } from "react";
import { useCohort } from "../context/CohortContext";
import { scoreService } from "../services";
import CohortSelector from "../components/CohortSelector";
import { FaDownload, FaSpinner, FaChartBar } from "react-icons/fa";

export default function ReportsPage() {
  const { selectedCohort } = useCohort();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (selectedCohort) {
      loadReportData();
    }
  }, [selectedCohort]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scoreService.getReports(selectedCohort.id);
      setReportData(data);
    } catch (err) {
      console.error("Failed to load report data:", err);
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;

    let csv = "";

    // Export each assessment
    reportData.assessments.forEach((assessment, assessmentIndex) => {
      csv += `Assessment ${assessment.code}\n`;

      // Header row
      csv += "Intern Name,Average,";
      assessment.tasks.forEach((task, idx) => {
        csv += `Task ${idx + 1},`;
      });
      csv += "Status\n";

      // Intern rows
      assessment.intern_scores.forEach((internScore) => {
        csv += `"${internScore.intern_name}",`;
        csv += `${internScore.average ?? ""},`;
        internScore.task_scores.forEach((score) => {
          csv += `${score ?? ""},`;
        });
        csv += `${capitalizeStatus(internScore.enrollment_status)}\n`;
      });

      // Average row
      csv += "Average,";
      csv += `${assessment.overall_average ?? ""},`;
      assessment.task_averages.forEach((avg) => {
        csv += `${avg ?? ""},`;
      });
      csv += "\n\n";
    });

    // Summary section
    csv += "SUMMARY: All Assessment Average\n";
    csv += "Intern Name,Score,Status\n";
    reportData.summary.forEach((item) => {
      csv += `"${item.intern_name}",${
        item.overall_average ?? ""
      },${capitalizeStatus(item.enrollment_status)}\n`;
    });
    csv += `Average,${reportData.grand_average ?? ""}\n`;

    // Download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${selectedCohort.name}_Assessment_Report.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const capitalizeStatus = (status) => {
    if (!status) return "Active";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!selectedCohort) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaChartBar className="text-icstars-blue" />
            Assessment Reports
          </h1>
        </div>
        <div className="card">
          <p className="text-gray-600">
            Please select a cohort to view assessment reports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaChartBar className="text-icstars-blue" />
          Assessment Reports
        </h1>
        <CohortSelector />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card text-center py-12">
          <FaSpinner className="animate-spin text-4xl text-icstars-blue mx-auto mb-4" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      ) : reportData ? (
        <>
          {/* Export Button */}
          <div className="flex justify-end">
            <button
              onClick={exportToCSV}
              className="btn btn-primary text-xs py-1.5 px-3"
            >
              <FaDownload className="mr-1 text-xs" />
              Export CSV
            </button>
          </div>

          {/* Assessment Tabs */}
          <div className="card p-3">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-3">
              {reportData.assessments.map((assessment, index) => (
                <button
                  key={assessment.id}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 font-semibold text-xs transition-all relative ${
                    activeTab === index
                      ? "text-icstars-blue border-b-2 border-icstars-blue -mb-px bg-white"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Assessment {assessment.code}
                  {activeTab === index && (
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent opacity-30 rounded-t"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Active Assessment Content */}
            {reportData.assessments[activeTab] && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-gray-800">
                  {reportData.assessments[activeTab].title}
                </h2>
                <div
                  className="overflow-auto"
                  style={{ maxHeight: "calc(100vh - 320px)" }}
                >
                  <table className="min-w-full border border-gray-200 rounded text-xs">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b-2 border-gray-300">
                          Intern Name
                        </th>
                        <th className="px-2 py-1.5 text-center font-semibold text-gray-700 bg-blue-100 border-b-2 border-blue-300">
                          Avg
                        </th>
                        {reportData.assessments[activeTab].tasks.map(
                          (task, idx) => (
                            <th
                              key={task.id}
                              className="px-2 py-1.5 text-center font-semibold text-gray-700 border-b-2 border-gray-300"
                            >
                              T{idx + 1}
                            </th>
                          )
                        )}
                        <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-b-2 border-gray-300">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.assessments[activeTab].intern_scores.map(
                        (internScore, rowIndex) => (
                          <tr
                            key={internScore.intern_id}
                            className={`border-b hover:bg-blue-50 transition-colors ${
                              rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap">
                              {internScore.intern_name}
                            </td>
                            <td className="px-2 py-1 text-center font-bold text-blue-700 bg-blue-50">
                              {internScore.average !== null
                                ? internScore.average.toFixed(1)
                                : "-"}
                            </td>
                            {internScore.task_scores.map((score, idx) => (
                              <td
                                key={idx}
                                className={`px-2 py-1 text-center font-semibold ${
                                  score !== null
                                    ? score >= 4
                                      ? "text-green-700"
                                      : score >= 3
                                      ? "text-yellow-700"
                                      : "text-red-700"
                                    : "text-gray-400"
                                }`}
                              >
                                {score !== null ? score : "-"}
                              </td>
                            ))}
                            <td className="px-2 py-1 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  internScore.enrollment_status === "dismissed"
                                    ? "bg-red-100 text-red-800 border border-red-200"
                                    : internScore.enrollment_status ===
                                      "resigned"
                                    ? "bg-gray-100 text-gray-800 border border-gray-300"
                                    : "bg-green-100 text-green-800 border border-green-200"
                                }`}
                              >
                                {capitalizeStatus(
                                  internScore.enrollment_status
                                )}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                      {/* Task Average Row */}
                      <tr className="bg-gradient-to-r from-blue-100 to-blue-50 border-t-2 border-blue-300 font-bold sticky bottom-0">
                        <td className="px-2 py-1.5 text-gray-800">
                          Task Average
                        </td>
                        <td className="px-2 py-1.5 text-center text-blue-800">
                          {reportData.assessments[activeTab].overall_average !==
                          null
                            ? reportData.assessments[
                                activeTab
                              ].overall_average.toFixed(1)
                            : "-"}
                        </td>
                        {reportData.assessments[activeTab].task_averages.map(
                          (avg, idx) => (
                            <td
                              key={idx}
                              className="px-2 py-1.5 text-center text-blue-800"
                            >
                              {avg !== null ? avg.toFixed(1) : "-"}
                            </td>
                          )
                        )}
                        <td className="px-2 py-1.5"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Summary Table */}
          <div className="card p-3">
            <h2 className="text-lg font-bold mb-2 text-gray-800">
              Overall Summary: All Assessments
            </h2>
            <div
              className="overflow-auto"
              style={{ maxHeight: "calc(100vh - 320px)" }}
            >
              <table className="min-w-full border border-gray-200 rounded text-xs">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b-2 border-gray-300">
                      Intern Name
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-b-2 border-gray-300">
                      Overall Average
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-b-2 border-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.summary.map((item, rowIndex) => (
                    <tr
                      key={item.intern_id}
                      className={`border-b hover:bg-blue-50 transition-colors ${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap">
                        {item.intern_name}
                      </td>
                      <td
                        className={`px-2 py-1 text-center font-bold ${
                          item.overall_average !== null
                            ? item.overall_average >= 3.5
                              ? "text-green-700"
                              : item.overall_average >= 2.5
                              ? "text-yellow-700"
                              : "text-red-700"
                            : "text-gray-400"
                        }`}
                      >
                        {item.overall_average !== null
                          ? item.overall_average.toFixed(1)
                          : "-"}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            item.enrollment_status === "dismissed"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : item.enrollment_status === "resigned"
                              ? "bg-gray-100 text-gray-800 border border-gray-300"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}
                        >
                          {capitalizeStatus(item.enrollment_status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {/* Grand Average Row */}
                  <tr className="bg-gradient-to-r from-blue-100 to-blue-50 border-t-2 border-blue-300 font-bold sticky bottom-0">
                    <td className="px-2 py-1.5 text-gray-800">Grand Average</td>
                    <td className="px-2 py-1.5 text-center text-blue-800">
                      {reportData.grand_average !== null
                        ? reportData.grand_average.toFixed(1)
                        : "-"}
                    </td>
                    <td className="px-2 py-1.5"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <p className="text-gray-600 text-center py-8">
            No report data available for this cohort.
          </p>
        </div>
      )}
    </div>
  );
}
