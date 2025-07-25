import React, { useState } from "react";
import { Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";

const EmailVerificationAlert = ({ onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-8 w-8 text-orange-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Email Verification Required
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Please verify your email address before participating in quizzes.
            This helps us ensure the security of your account.
          </p>

          {emailSent ? (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700 text-sm">
                Verification email sent! Please check your inbox and spam
                folder.
              </span>
            </div>
          ) : (
            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Mail className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-blue-700 text-sm">
                Didn't receive the verification email?
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {!emailSent && (
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            {emailSent ? "Close" : "Cancel"}
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">
            💡 <strong>Tip:</strong> Check your spam/junk folder if you don't
            see the email in your inbox. Make sure to add our email to your
            contacts for future emails.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationAlert;
