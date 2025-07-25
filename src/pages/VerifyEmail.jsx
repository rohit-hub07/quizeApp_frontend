import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../utils/api";
import { CheckCircle, XCircle, Mail, Loader } from "lucide-react";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    if (!token) {
      setVerificationStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    try {
      const response = await authAPI.verifyEmail(token);
      if (response.data.success) {
        setVerificationStatus("success");
        setMessage("Email verified successfully!");
        toast.success(
          "Email verified successfully! You can now access all features."
        );

        // Redirect to home or dashboard after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      setVerificationStatus("error");
      const errorMessage =
        error.response?.data?.message || "Verification failed";
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await authAPI.resendVerification();
      if (response.data.success) {
        toast.success("New verification email sent! Please check your inbox.");
      }
    } catch (error) {
      toast.error(
        "Failed to resend verification email. Please try again later."
      );
    }
  };

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Loader className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verifying Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">{message}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  You're all set!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your email has been successfully verified. You can now:
                    <br />• Create and take quizzes
                    <br />• Track your performance
                    <br />• Access all features
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to Quiz App
            </Link>
          </div>

          <p className="text-center text-xs text-gray-500">
            Redirecting automatically in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verification Failed
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">{message}</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                What went wrong?
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This could happen if:
                  <br />• The verification link has expired
                  <br />• The link was already used
                  <br />• The link is invalid or corrupted
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResendVerification}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send New Verification Email
          </button>

          <Link
            to="/register"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Account
          </Link>

          <Link
            to="/login"
            className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
