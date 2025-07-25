import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizAPI, resultAPI } from "../utils/api";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import EmailVerificationAlert from "../components/EmailVerificationAlert";

const QuizTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && !quizSubmitted) {
      // Set timer for 2 minutes per question
      const totalTime = quiz.questions.length * 120; // 2 minutes per question in seconds
      setTimeLeft(totalTime);
      setStartTime(Date.now()); // Record start time

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, quizSubmitted]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getQuizById(id);
      if (response.data.success) {
        setQuiz(response.data.quize);
      }
    } catch (error) {
      if (error.response?.data?.requiresVerification) {
        setShowVerificationAlert(true);
        setLoading(false);
        return;
      }
      toast.error("Failed to fetch quiz");
      navigate("/quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (quizSubmitted) return;

    try {
      // Convert answers object to array format expected by backend
      const answersArray = new Array(quiz.questions.length);
      Object.keys(answers).forEach((questionIndex) => {
        answersArray[parseInt(questionIndex)] = answers[questionIndex];
      });

      // Calculate time taken in seconds
      const timeTaken = startTime
        ? Math.floor((Date.now() - startTime) / 1000)
        : null;

      console.log("Submitting quiz:", {
        quizId: id,
        answers: answersArray,
        timeTaken,
      });

      const response = await resultAPI.submitQuiz(id, answersArray, timeTaken);

      console.log("Quiz submission response:", response.data);

      if (response.data.success) {
        setResult(response.data.result);
        setQuizSubmitted(true);
        toast.success("Quiz submitted successfully!");
      } else {
        toast.error(response.data.message || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Quiz submission error:", error);
      if (error.response?.data?.requiresVerification) {
        setShowVerificationAlert(true);
        return;
      }
      const errorMessage =
        error.response?.data?.message || "Failed to submit quiz";
      toast.error(errorMessage);
    }
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showVerificationAlert) {
    return (
      <EmailVerificationAlert
        onClose={() => {
          setShowVerificationAlert(false);
          navigate("/quizzes");
        }}
      />
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Quiz not found</p>
      </div>
    );
  }

  if (quizSubmitted && result) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            {(result?.percentage || 0) >= 70 ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Quiz Completed!
          </h2>

          <div className="space-y-4 mb-8">
            <div className="text-6xl font-bold text-blue-600">
              {result?.percentage || 0}%
            </div>
            <div className="text-gray-600">
              You scored {result?.score || 0} out of {result?.total || 0}{" "}
              questions correctly
            </div>
            {result?.timeTaken && (
              <div className="text-sm text-gray-500">
                Time taken: {Math.floor(result.timeTaken / 60)}m{" "}
                {result.timeTaken % 60}s
              </div>
            )}
            {result?.attempt && result.attempt > 1 && (
              <div className="text-sm text-gray-500">
                Attempt #{result.attempt}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/quizzes")}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Quizzes
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-orange-600 font-semibold">
                <Clock className="h-5 w-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {getAnsweredCount()} / {quiz.questions.length} answered
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestion + 1) / quiz.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  answers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswerSelect(currentQuestion, index)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    answers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {answers[currentQuestion] === index && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="flex space-x-4">
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Question Overview */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Question Overview
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors duration-200 ${
                index === currentQuestion
                  ? "bg-blue-600 text-white"
                  : answers[index] !== undefined
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;
