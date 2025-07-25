import axios from "axios";

// Use environment variable with fallback
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (userData) => api.post("/auth/login", userData),
  logout: () => api.get("/auth/logout"),
  profile: () => api.get("/auth/profile"),
  forgetPassword: (email) => api.post("/auth/forget-password", { email }),
  resetPassword: (token, password) =>
    api.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify/${token}`),
  resendVerification: () => api.post("/auth/resend-verification"),
};

// Quiz API calls
export const quizAPI = {
  getAllQuizes: () => api.get("/quize/all-quizes"),
  getQuizById: (id) => api.get(`/quize/quiz/${id}`),
  createQuiz: (quizData) => api.post("/quize/create-quize", quizData),
  updateQuiz: (id, quizData) => api.put(`/quize/update-quize/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/quize/delete-quize/${id}`),
  getUserQuizes: () => api.get("/quize/my-quizes"),
};

// Result API calls
export const resultAPI = {
  submitQuiz: (quizId, answers, timeTaken) =>
    api.post(`/result/submit-quiz/${quizId}`, { answers, timeTaken }),
  getUserHistory: (page = 1, limit = 10) =>
    api.get(`/result/history?page=${page}&limit=${limit}`),
  getUserStats: () => api.get("/result/stats"),
  getAttemptDetails: (resultId) => api.get(`/result/attempt/${resultId}`),
};

export default api;
