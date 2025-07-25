import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Quizzes from "./pages/Quizzes";
import QuizTaking from "./pages/QuizTaking";
import CreateQuiz from "./pages/CreateQuiz";
import Profile from "./pages/Profile";
import QuizHistory from "./pages/QuizHistory";
import MyQuizzes from "./pages/MyQuizzes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/auth/verify/:token" element={<VerifyEmail />} />

            {/* Protected Routes */}
            <Route
              path="/quizzes"
              element={
                <ProtectedRoute>
                  <Quizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <ProtectedRoute>
                  <QuizTaking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <QuizHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-quizzes"
              element={
                <ProtectedRoute>
                  <MyQuizzes />
                </ProtectedRoute>
              }
            />

            {/* Quiz Management Routes - Available to all authenticated users */}
            <Route
              path="/create-quiz"
              element={
                <ProtectedRoute>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-quiz/:id"
              element={
                <ProtectedRoute>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              theme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
      </Layout>
    </AuthProvider>
  );
}

export default App;
