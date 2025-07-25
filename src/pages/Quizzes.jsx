import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { quizAPI } from "../utils/api";
import { BookOpen, Clock, Users, Play, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const QuizCard = ({ quiz, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isOwner = quiz.createdBy?._id === user?._id;
  const canManage = isAdmin || isOwner;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await quizAPI.deleteQuiz(quiz._id);
        toast.success("Quiz deleted successfully");
        onDelete(quiz._id);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete quiz";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {quiz.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{quiz.questions.length} questions</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>~{quiz.questions.length * 2} min</span>
              </div>
              {quiz.createdBy && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>By {quiz.createdBy.name}</span>
                  {isOwner && (
                    <span className="ml-1 text-blue-600 font-medium">
                      (You)
                    </span>
                  )}
                  {isAdmin && !isOwner && (
                    <span className="ml-1 text-green-600 font-medium">
                      (Admin)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          {canManage && (
            <div className="flex space-x-2">
              <Link
                to={`/edit-quiz/${quiz._id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                title={isOwner ? "Edit your quiz" : "Edit quiz (Admin)"}
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                title={isOwner ? "Delete your quiz" : "Delete quiz (Admin)"}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Link
            to={`/quiz/${quiz._id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAllQuizes();
      if (response.data.success) {
        setQuizzes(response.data.quizes);
      }
    } catch (error) {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Available Quizzes
            </h1>
            <p className="mt-2 text-gray-600">
              Choose a quiz to test your knowledge
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No quizzes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Get started by creating a new quiz."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                onDelete={handleDeleteQuiz}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
