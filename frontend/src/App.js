import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExamsList from './pages/ExamsList';
import ExamPage from './pages/ExamPage';
import SubmissionsList from './pages/SubmissionsList';
import UsersList from './pages/UsersList';
import Analytics from './pages/Analytics';
import Results from './pages/Results';
import ResultDetails from './pages/ResultDetails';
import DepartmentsList from './pages/DepartmentsList';
import CoursesList from './pages/CoursesList';
import ClassesList from './pages/ClassesList';
import LecturersList from './pages/LecturersList';
import StudentsList from './pages/StudentsList';

// Styles
import './styles/App.css';

const AppContent = () => {
  const { isAuthenticated } = React.useContext(AuthContext);

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Sidebar />}
        <div className={`app-container ${isAuthenticated ? 'with-sidebar' : ''}`}>
          {isAuthenticated && <Header />}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exams"
                element={
                  <ProtectedRoute>
                    <ExamsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exams/:examId"
                element={
                  <ProtectedRoute>
                    <ExamPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/submissions"
                element={
                  <ProtectedRoute>
                    <SubmissionsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results/:submissionId"
                element={
                  <ProtectedRoute>
                    <ResultDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/departments"
                element={
                  <ProtectedRoute>
                    <DepartmentsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <CoursesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes"
                element={
                  <ProtectedRoute>
                    <ClassesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lecturers"
                element={
                  <ProtectedRoute>
                    <LecturersList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <StudentsList />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
