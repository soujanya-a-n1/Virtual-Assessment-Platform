import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (firstName, lastName, email, password, phone) =>
    api.post('/auth/register', { firstName, lastName, email, password, phone }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (firstName, lastName, phone) =>
    api.put('/auth/profile', { firstName, lastName, phone }),
};

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  assignRole: (userId, roleId) => api.post('/users/assign-role', { userId, roleId }),
  removeRole: (userId, roleId) => api.post('/users/remove-role', { userId, roleId }),
};

// Exam APIs
export const examAPI = {
  createExam: (examData) => api.post('/exams', examData),
  getAllExams: () => api.get('/exams'),
  getExamById: (id) => api.get(`/exams/${id}`),
  updateExam: (id, examData) => api.put(`/exams/${id}`, examData),
  deleteExam: (id) => api.delete(`/exams/${id}`),
  publishExam: (id) => api.post(`/exams/${id}/publish`, {}),
};

// Question APIs
export const questionAPI = {
  createQuestion: (questionData) => api.post('/questions', questionData),
  getAllQuestions: () => api.get('/questions'),
  getQuestionById: (id) => api.get(`/questions/${id}`),
  updateQuestion: (id, questionData) => api.put(`/questions/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
  uploadQuestionsCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/questions/upload/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  addQuestionsToExam: (examId, questionIds) =>
    api.post(`/questions/${examId}/add-questions`, { questionIds }),
  removeQuestionFromExam: (examId, questionId) =>
    api.delete(`/questions/${examId}/questions/${questionId}`),
};

// Submission APIs
export const submissionAPI = {
  startExam: (examId) => api.post(`/submissions/exams/${examId}/start`, {}),
  autoSaveAnswer: (submissionId, questionId, answer) =>
    api.post('/submissions/auto-save', { submissionId, questionId, answer }),
  submitExam: (submissionId) => api.post(`/submissions/${submissionId}/submit`, {}),
  getSubmissionDetails: (submissionId) => api.get(`/submissions/${submissionId}`),
  getAllSubmissions: () => api.get('/submissions'),
  evaluateSubmission: (submissionId, evaluationNotes) =>
    api.post(`/submissions/${submissionId}/evaluate`, { evaluationNotes }),
};

// Proctoring APIs
export const proctoringAPI = {
  logEvent: (submissionId, eventType, severity, description, metadata) =>
    api.post('/proctoring/log', { submissionId, eventType, severity, description, metadata }),
  getProctoringLogs: (submissionId) => api.get(`/proctoring/${submissionId}/logs`),
  getProctoringReport: (submissionId) => api.get(`/proctoring/${submissionId}/report`),
};

// Analytics APIs
export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics'),
  getExamAnalytics: (examId) => api.get(`/analytics/exams/${examId}`),
  getStudentAnalytics: (studentId) => api.get(`/analytics/students/${studentId}`),
};

// Student APIs
export const studentAPI = {
  getAllStudents: () => api.get('/students'),
  getStudentById: (id) => api.get(`/students/${id}`),
  createStudent: (studentData) => api.post('/students', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  importStudentsCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/students/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Department APIs
export const departmentAPI = {
  getAllDepartments: () => api.get('/departments'),
  getDepartmentById: (id) => api.get(`/departments/${id}`),
  createDepartment: (departmentData) => api.post('/departments', departmentData),
  updateDepartment: (id, departmentData) => api.put(`/departments/${id}`, departmentData),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
};

// Class APIs
export const classAPI = {
  getAllClasses: () => api.get('/classes'),
  getClassById: (id) => api.get(`/classes/${id}`),
  createClass: (classData) => api.post('/classes', classData),
  updateClass: (id, classData) => api.put(`/classes/${id}`, classData),
  deleteClass: (id) => api.delete(`/classes/${id}`),
};

export default api;
