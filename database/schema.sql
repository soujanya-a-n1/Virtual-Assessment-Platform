-- Virtual Assessment Platform Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS virtual_assessment_db;
USE virtual_assessment_db;

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  isActive BOOLEAN DEFAULT TRUE,
  lastLogin DATETIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_isActive (isActive)
);

-- User Roles Junction Table
CREATE TABLE IF NOT EXISTS user_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  roleId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_role (userId, roleId)
);

-- Exams Table
CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INT NOT NULL,
  totalQuestions INT NOT NULL,
  totalMarks DECIMAL(10,2) NOT NULL,
  passingMarks DECIMAL(10,2) NOT NULL,
  examType ENUM('Online', 'Offline') DEFAULT 'Online',
  status ENUM('Draft', 'Published', 'Scheduled', 'Active', 'Completed') DEFAULT 'Draft',
  startTime DATETIME,
  endTime DATETIME,
  requiresProctoring BOOLEAN DEFAULT TRUE,
  shuffleQuestions BOOLEAN DEFAULT FALSE,
  negativeMarkingEnabled BOOLEAN DEFAULT FALSE,
  negativeMarks DECIMAL(10,2),
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_createdBy (createdBy)
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  questionText TEXT NOT NULL,
  questionType ENUM('Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching') NOT NULL,
  marks DECIMAL(10,2) NOT NULL,
  difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
  optionA TEXT,
  optionB TEXT,
  optionC TEXT,
  optionD TEXT,
  correctAnswer VARCHAR(100) NOT NULL,
  explanation TEXT,
  imageUrl VARCHAR(255),
  displayOrder INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_questionType (questionType),
  INDEX idx_difficulty (difficulty)
);

-- Exam Questions Junction Table
CREATE TABLE IF NOT EXISTS exam_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  examId INT NOT NULL,
  questionId INT NOT NULL,
  displayOrder INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_exam_question (examId, questionId)
);

-- Student Exam Enrollments
CREATE TABLE IF NOT EXISTS student_exam_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  examId INT NOT NULL,
  enrollmentStatus ENUM('Active', 'Completed', 'Cancelled', 'Pending') DEFAULT 'Active',
  enrolledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  startedAt DATETIME,
  completedAt DATETIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_exam (userId, examId)
);

-- Exam Submissions Table
CREATE TABLE IF NOT EXISTS exam_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  examId INT NOT NULL,
  submitTime DATETIME,
  totalTimeSpent INT,
  status ENUM('Not Started', 'In Progress', 'Submitted', 'Evaluated', 'Failed') DEFAULT 'Not Started',
  obtainedMarks DECIMAL(10,2),
  evaluatedBy INT,
  evaluationNotes TEXT,
  evaluatedAt DATETIME,
  isPassed BOOLEAN,
  autoSubmitted BOOLEAN DEFAULT FALSE,
  cheatingDetected BOOLEAN DEFAULT FALSE,
  cheatingDetails JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (evaluatedBy) REFERENCES users(id),
  INDEX idx_userId (userId),
  INDEX idx_examId (examId),
  INDEX idx_status (status)
);

-- Student Answers Table
CREATE TABLE IF NOT EXISTS student_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submissionId INT NOT NULL,
  questionId INT NOT NULL,
  studentAnswer TEXT,
  isCorrect BOOLEAN,
  marksObtained DECIMAL(10,2),
  answeredAt DATETIME,
  lastModifiedAt DATETIME,
  isReviewed BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (submissionId) REFERENCES exam_submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_submission_question (submissionId, questionId)
);

-- Proctoring Logs Table
CREATE TABLE IF NOT EXISTS proctoring_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  submissionId INT NOT NULL,
  eventType ENUM('Tab Switch', 'Copy Paste', 'Right Click', 'Fullscreen Exit', 'Camera Off', 'Microphone Off') NOT NULL,
  severity ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  description TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata JSON,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (submissionId) REFERENCES exam_submissions(id) ON DELETE CASCADE,
  INDEX idx_eventType (eventType),
  INDEX idx_severity (severity),
  INDEX idx_timestamp (timestamp),
  INDEX idx_submissionId (submissionId)
);

-- Insert Default Roles
INSERT INTO roles (name, description) VALUES
  ('Super Admin', 'System administrator with full access'),
  ('Admin', 'Administrator with exam and user management'),
  ('Examiner', 'Can create and manage exams'),
  ('Proctor', 'Can invigilate exams and manage anti-cheating'),
  ('Student', 'Can take exams');
