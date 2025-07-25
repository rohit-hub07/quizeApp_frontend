import React, { useState, useEffect } from "react";
import { resultAPI } from "../utils/api";
import {
  Clock,
  Calendar,
  Trophy,
  TrendingUp,
  ChevronRight,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [historyResponse, statsResponse] = await Promise.all([
        resultAPI.getUserHistory(currentPage, 10),
        resultAPI.getUserStats(),
      ]);

      if (historyResponse.data.success) {
        setHistory(historyResponse.data.data.results);
        setPagination(historyResponse.data.data.pagination);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load quiz history");
    } finally {
      setLoading(false);
    }
  };

  const viewAttemptDetails = async (resultId) => {
    try {
      const response = await resultAPI.getAttemptDetails(resultId);
      if (response.data.success) {
        setAttemptDetails(response.data.data);
        setSelectedAttempt(resultId);
      }
    } catch (error) {
      console.error("Error fetching attempt details:", error);
      toast.error("Failed to load attempt details");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quiz Performance</h1>
          <p className="text-gray-600 mt-2">
            Track your progress and review your quiz attempts
          </p>
        </div>

        {/* Performance Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Average Score
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageScore.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Best Score
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.bestScore}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Attempts
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalQuizzesTaken}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Unique Quizzes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.uniqueQuizzesAttempted}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Quiz Attempts
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {history.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Trophy className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No quiz attempts yet
                </h3>
                <p className="mt-2 text-gray-500">
                  Start taking quizzes to see your performance history here.
                </p>
              </div>
            ) : (
              history.map((attempt) => (
                <div key={attempt._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {attempt.quiz?.title || "Quiz Title"}
                          </h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(attempt.completedAt)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatTime(attempt.timeTaken)}
                            </span>
                            <span>Attempt #{attempt.attempt}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                              attempt.percentage
                            )}`}
                          >
                            {attempt.percentage}%
                          </div>
                          <div className="text-sm text-gray-600">
                            {attempt.score}/{attempt.total}
                          </div>
                          <button
                            onClick={() => viewAttemptDetails(attempt._id)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quiz Performance by Quiz */}
        {stats && stats.quizPerformance && stats.quizPerformance.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Performance by Quiz
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.quizPerformance.map((quiz) => (
                <div key={quiz._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {quiz.quizTitle}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Last attempt: {formatDate(quiz.lastAttempt)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-gray-600">
                        {quiz.attempts} attempt{quiz.attempts > 1 ? "s" : ""}
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(
                          quiz.bestScore
                        )}`}
                      >
                        Best: {quiz.bestScore.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Avg: {quiz.avgScore.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Attempt Details Modal */}
      {selectedAttempt && attemptDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Quiz Attempt Details
              </h2>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {attemptDetails.result.quiz?.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>
                    Score: {attemptDetails.result.score}/
                    {attemptDetails.result.total}
                  </span>
                  <span>Percentage: {attemptDetails.result.percentage}%</span>
                  <span>
                    Time: {formatTime(attemptDetails.result.timeTaken)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {attemptDetails.detailedAnalysis.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        Question {question.questionNumber}: {question.question}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          question.isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {question.isCorrect ? "Correct" : "Wrong"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === question.correctAnswer
                              ? "bg-green-50 border border-green-200 text-green-800"
                              : optionIndex === question.userAnswer &&
                                !question.isCorrect
                              ? "bg-red-50 border border-red-200 text-red-800"
                              : "bg-gray-50"
                          }`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>{" "}
                          {option}
                          {optionIndex === question.correctAnswer && (
                            <span className="ml-2 text-green-600 font-medium">
                              (Correct)
                            </span>
                          )}
                          {optionIndex === question.userAnswer &&
                            optionIndex !== question.correctAnswer && (
                              <span className="ml-2 text-red-600 font-medium">
                                (Your answer)
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
