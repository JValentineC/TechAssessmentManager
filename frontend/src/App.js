import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CohortProvider } from "./context/CohortContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import CohortManagementPage from "./pages/CohortManagementPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import AccessControlPage from "./pages/AccessControlPage";
import AssessmentSelectionPage from "./pages/AssessmentSelectionPage";
import AssessmentRunnerPage from "./pages/AssessmentRunnerPage";
import ReflectionPage from "./pages/ReflectionPage";
import ScoringPage from "./pages/ScoringPage";
import ReportsPage from "./pages/ReportsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CohortProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />

              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin/Facilitator Routes */}
              <Route
                path="users"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="cohorts"
                element={
                  <ProtectedRoute roles={["admin", "facilitator"]}>
                    <CohortManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="submissions"
                element={
                  <ProtectedRoute roles={["admin", "facilitator"]}>
                    <SubmissionsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="access-control"
                element={
                  <ProtectedRoute roles={["admin", "facilitator"]}>
                    <AccessControlPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="scoring"
                element={
                  <ProtectedRoute roles={["admin", "facilitator"]}>
                    <ScoringPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="reports"
                element={
                  <ProtectedRoute roles={["admin", "facilitator"]}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* Intern Routes */}
              <Route
                path="assessments"
                element={
                  <ProtectedRoute roles={["intern"]}>
                    <AssessmentSelectionPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="assessments/:assessmentId/start"
                element={
                  <ProtectedRoute roles={["intern"]}>
                    <AssessmentRunnerPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="assessments/:assessmentId/reflection"
                element={
                  <ProtectedRoute roles={["intern"]}>
                    <ReflectionPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CohortProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
