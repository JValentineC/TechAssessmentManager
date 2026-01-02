import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCohort } from "../context/CohortContext";
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout, isAdmin, isFacilitator, isIntern } = useAuth();
  const { selectedCohort, cohorts, selectCohort } = useCohort();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCohortChange = (e) => {
    const cohortId = parseInt(e.target.value);
    const cohort = cohorts.find((c) => c.id === cohortId);
    if (cohort) {
      selectCohort(cohort);
    }
  };

  return (
    <nav className="bg-icstars-blue text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">i.c.stars</span>
            <span className="hidden md:inline text-sm text-blue-200">
              Assessment System
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="hover:text-icstars-gold transition-colors"
            >
              Dashboard
            </Link>

            {isAdmin() && (
              <Link
                to="/users"
                className="hover:text-icstars-gold transition-colors"
              >
                Users
              </Link>
            )}

            {(isAdmin() || isFacilitator()) && (
              <>
                <Link
                  to="/cohorts"
                  className="hover:text-icstars-gold transition-colors"
                >
                  Cohorts
                </Link>
                <Link
                  to="/submissions"
                  className="hover:text-icstars-gold transition-colors"
                >
                  Submissions
                </Link>
                <Link
                  to="/access-control"
                  className="hover:text-icstars-gold transition-colors"
                >
                  Access Control
                </Link>
                <Link
                  to="/scoring"
                  className="hover:text-icstars-gold transition-colors"
                >
                  Scoring
                </Link>
                <Link
                  to="/reports"
                  className="hover:text-icstars-gold transition-colors"
                >
                  Reports
                </Link>
              </>
            )}

            {isIntern() && (
              <Link
                to="/assessments"
                className="hover:text-icstars-gold transition-colors"
              >
                My Assessments
              </Link>
            )}

            {/* Cohort Selector (for facilitators) */}
            {isFacilitator() && cohorts.length > 0 && (
              <select
                value={selectedCohort?.id || ""}
                onChange={handleCohortChange}
                className="bg-blue-700 text-white px-3 py-1 rounded border border-blue-600 focus:outline-none focus:ring-2 focus:ring-icstars-gold"
              >
                {cohorts.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    Cycle {cohort.cycle_number}
                  </option>
                ))}
              </select>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 hover:text-icstars-gold transition-colors"
              >
                <FaUser />
                <span>{user?.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/dashboard"
              className="block py-2 hover:text-icstars-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>

            {isFacilitator() && (
              <>
                <Link
                  to="/cohorts"
                  className="block py-2 hover:text-icstars-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cohorts
                </Link>
                <Link
                  to="/access-control"
                  className="block py-2 hover:text-icstars-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Access Control
                </Link>
                <Link
                  to="/scoring"
                  className="block py-2 hover:text-icstars-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Scoring
                </Link>
                <Link
                  to="/reports"
                  className="block py-2 hover:text-icstars-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reports
                </Link>

                {cohorts.length > 0 && (
                  <select
                    value={selectedCohort?.id || ""}
                    onChange={handleCohortChange}
                    className="w-full bg-blue-700 text-white px-3 py-2 rounded border border-blue-600"
                  >
                    {cohorts.map((cohort) => (
                      <option key={cohort.id} value={cohort.id}>
                        Cycle {cohort.cycle_number}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}

            {isIntern() && (
              <Link
                to="/assessments"
                className="block py-2 hover:text-icstars-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Assessments
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left py-2 hover:text-icstars-gold transition-colors flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
