import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Users, Trophy, ArrowRight } from "lucide-react";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Test Your Knowledge</span>{" "}
                  <span className="block text-blue-600 xl:inline">
                    with QuizApp
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Challenge yourself with interactive quizzes, track your
                  progress, and compete with others. Whether you're learning or
                  teaching, QuizApp makes it fun and engaging.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/quizzes"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        Browse Quizzes
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          to="/create-quiz"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                        >
                          Create Quiz
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-blue-400 to-blue-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <BookOpen className="h-32 w-32 text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for effective learning
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Interactive Quizzes
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Engage with multiple-choice questions designed to test and
                  improve your knowledge across various topics.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Trophy className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Track Progress
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Monitor your performance with detailed results and see how you
                  improve over time.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Admin Controls
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Create, edit, and manage quizzes with our intuitive admin
                  interface.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {isAuthenticated && (
        <div className="bg-blue-600">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Welcome back, {user?.name}!
              </h2>
              <p className="mt-3 text-xl text-blue-200 sm:mt-4">
                Ready to continue your learning journey?
              </p>
              <div className="mt-8">
                <Link
                  to="/quizzes"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
                >
                  Start Taking Quizzes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
