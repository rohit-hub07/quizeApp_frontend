import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { quizAPI, authAPI } from "../utils/api";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import EmailVerificationAlert from "../components/EmailVerificationAlert";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [userProfile, setUserProfile] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Assume verified by default

  useEffect(() => {
    checkUserProfile();
    if (isEditing) {
      fetchQuiz();
    }
  }, [id, isEditing]);

  const checkUserProfile = async () => {
    try {
      const response = await authAPI.profile();
      if (response.data.success) {
        setUserProfile(response.data.user);
        setIsEmailVerified(response.data.user.isVerified);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // If we can't get profile, assume they need to login
      navigate("/login");
    }
  };

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getQuizById(id);
      if (response.data.success) {
        setFormData({
          title: response.data.quize.title,
          questions: response.data.quize.questions,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch quiz");
      navigate("/quizzes");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    });
  };

  const removeQuestion = (questionIndex) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter(
        (_, index) => index !== questionIndex
      );
      setFormData({
        ...formData,
        questions: updatedQuestions,
      });
    } else {
      toast.error("Quiz must have at least one question");
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Quiz title is required");
      return false;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const question = formData.questions[i];

      if (!question.question.trim()) {
        toast.error(`Question ${i + 1} is required`);
        return false;
      }

      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          toast.error(`All options for question ${i + 1} are required`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      toast.error("Please verify your email address before creating quizzes");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isEditing) {
        response = await quizAPI.updateQuiz(id, formData);
      } else {
        response = await quizAPI.createQuiz(formData);
      }

      if (response.data) {
        toast.success(
          isEditing
            ? "Quiz updated successfully!"
            : "Quiz created successfully!"
        );
        navigate("/quizzes");
      }
    } catch (error) {
      console.error("Quiz creation/update error:", error);
      let errorMessage = isEditing
        ? "Failed to update quiz"
        : "Failed to create quiz";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error.response?.status === 403 &&
        error.response?.data?.requiresVerification
      ) {
        errorMessage =
          "Please verify your email address before creating quizzes";
        setIsEmailVerified(false); // Update the state to show verification alert
      } else if (error.response?.status === 401) {
        errorMessage = "Please login first";
        navigate("/login");
        return;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate("/quizzes")}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? "Edit Quiz" : "Create New Quiz"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing
            ? "Update your quiz details and questions"
            : "Create an engaging quiz with multiple-choice questions"}
        </p>
      </div>

      {/* Email Verification Alert */}
      {!isEmailVerified && (
        <EmailVerificationAlert showForQuizCreation={true} />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Quiz Title */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quiz Details
          </h2>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quiz Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Enter quiz title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {formData.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {questionIndex + 1}
                </h3>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question *
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        "question",
                        e.target.value
                      )
                    }
                    placeholder="Enter your question..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options *
                  </label>
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="radio"
                          name={`correct-answer-${questionIndex}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() =>
                            handleQuestionChange(
                              questionIndex,
                              "correctAnswer",
                              optionIndex
                            )
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Option ${optionIndex + 1}...`}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              question.correctAnswer === optionIndex
                                ? "border-green-300 bg-green-50"
                                : "border-gray-300"
                            }`}
                            required
                          />
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            question.correctAnswer === optionIndex
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {question.correctAnswer === optionIndex
                            ? "Correct"
                            : `Option ${optionIndex + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Select the radio button next to the correct answer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Question
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/quizzes")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isEmailVerified}
            className={`inline-flex items-center px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
              !isEmailVerified
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {!isEmailVerified
              ? "Verify Email to Create"
              : loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Quiz"
              : "Create Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
