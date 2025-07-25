import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  User,
  BookOpen,
  PlusCircle,
  Home,
  Clock,
  FileText,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, icon: Icon, className = "", onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActivePath(to)
          ? "bg-blue-100 text-blue-700 shadow-sm"
          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
      } ${className}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors duration-200">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">QuizApp</span>
                <p className="text-xs text-gray-500">Learn & Test</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={Home}>
              Home
            </NavLink>
            <NavLink to="/quizzes" icon={BookOpen}>
              Quizzes
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/history" icon={Clock}>
                  History
                </NavLink>
                <NavLink to="/my-quizzes" icon={FileText}>
                  My Quizzes
                </NavLink>
                <NavLink to="/create-quiz" icon={PlusCircle}>
                  Create Quiz
                </NavLink>
              </>
            )}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                icon={Home}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                Home
              </NavLink>
              <NavLink
                to="/quizzes"
                icon={BookOpen}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                Quizzes
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/history"
                    icon={Clock}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    History
                  </NavLink>
                  <NavLink
                    to="/my-quizzes"
                    icon={FileText}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    My Quizzes
                  </NavLink>
                  <NavLink
                    to="/create-quiz"
                    icon={PlusCircle}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    Create Quiz
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile User Section */}
            <div className="border-t px-2 py-3">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Backdrop for user dropdown */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
