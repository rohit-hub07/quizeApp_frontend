import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { quizAPI } from "../utils/api";
import { BookOpen, Clock, Edit, Trash2, Plus, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyQuizzes();
  }, []);

  const fetchMyQuizzes = async () => {
    try {
      const response = await quizAPI.getUserQuizes();
      if (response.data.success) {
        setQuizzes(response.data.quizes);
      }
    } catch (error) {
      toast.error("Failed to fetch your quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await quizAPI.deleteQuiz(quizId);
        toast.success("Quiz deleted successfully");
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete quiz";
        toast.error(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
          <p className="text-gray-600 mt-2">Manage your created quizzes</p>
        </div>
        <Link
          to="/create-quiz"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No quizzes yet
          </h3>
          <p className="mt-2 text-gray-500">
            Get started by creating your first quiz.
          </p>
          <Link
            to="/create-quiz"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{quiz.questions.length} questions</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>~{quiz.questions.length * 2} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/edit-quiz/${quiz._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit quiz"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(quiz._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete quiz"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm text-gray-500 mb-3">
                    Created on{" "}
                    {new Date(quiz.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Preview Quiz →
                    </Link>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Public</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Section */}
      {quizzes.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Quiz Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {quizzes.length}
              </div>
              <div className="text-sm text-gray-600">Total Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {quizzes.reduce(
                  (total, quiz) => total + quiz.questions.length,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(
                  quizzes.reduce(
                    (total, quiz) => total + quiz.questions.length,
                    0
                  ) / quizzes.length
                )}
              </div>
              <div className="text-sm text-gray-600">
                Avg Questions per Quiz
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
