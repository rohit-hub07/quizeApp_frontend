import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Crown,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const response = await authAPI.resendVerification();

      if (response.data.success) {
        setEmailSent(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-3">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <div className="ml-6 text-white">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-blue-100 flex items-center mt-2">
                {user.role === "admin" && <Crown className="h-4 w-4 mr-2" />}
                {user.role === "admin" ? "Administrator" : "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-6 py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{user.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    {user.isVerified ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Unverified</span>
                      </div>
                    )}
                  </div>
                </div>
                {!user.isVerified && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-800">
                          Please verify your email to participate in quizzes.
                        </p>
                        {emailSent && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Verification email sent! Check your inbox.
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleResendVerification}
                        disabled={loading || emailSent}
                        className="ml-3 px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <Loader2 className="animate-spin h-3 w-3 mr-1" />
                            Sending...
                          </div>
                        ) : emailSent ? (
                          "Email Sent"
                        ) : (
                          "Resend Email"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Crown className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900 capitalize">{user.role}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div
                    className={`h-3 w-3 rounded-full mr-3 ${
                      user.isVerified ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="text-gray-900">
                    {user.isVerified ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              </div>

              {user.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Account Statistics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email Verified:</span>
                    <span
                      className={`font-medium ${
                        user.isVerified ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {user.isVerified ? "Yes" : "No"}
                    </span>
                  </div>
                  {user.role === "admin" && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        As an administrator, you have access to:
                      </p>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        <li>• Create and manage quizzes</li>
                        <li>• Edit existing quizzes</li>
                        <li>• Delete quizzes</li>
                        <li>• View all quiz results</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <a
                    href="/quizzes"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Browse Quizzes
                  </a>
                  {user.role === "admin" && (
                    <a
                      href="/create-quiz"
                      className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Create New Quiz
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
