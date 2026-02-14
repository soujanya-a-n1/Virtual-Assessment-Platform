-- Dummy Data for Virtual Assessment Platform

USE virtual_assessment_db;

-- Delete all existing users and related data
DELETE FROM proctoring_logs;
DELETE FROM student_answers;
DELETE FROM exam_submissions;
DELETE FROM student_exam_enrollments;
DELETE FROM exam_questions;
DELETE FROM exams;
DELETE FROM user_roles;
DELETE FROM users;

-- Reset auto increment
ALTER TABLE users AUTO_INCREMENT = 1;

-- Insert Users (Password: Admin@143 hashed)
INSERT INTO users (firstName, lastName, email, password, phone, isActive) VALUES
('Super', 'Admin', 'superadmin@gmail.com', '$2a$10$WBR8tqYq8rQZqCQVWjnB/.V11MIm8EOmcpfXf0JCRjwDho9KPfiF6', '+1-800-ADMIN', TRUE),
('John', 'Admin', 'admin@gmail.com', '$2a$10$WBR8tqYq8rQZqCQVWjnB/.V11MIm8EOmcpfXf0JCRjwDho9KPfiF6', '+1-800-0001', TRUE),
('Jane', 'Examiner', 'examiner@gmail.com', '$2a$10$WBR8tqYq8rQZqCQVWjnB/.V11MIm8EOmcpfXf0JCRjwDho9KPfiF6', '+1-800-0002', TRUE),
('Alice', 'Proctor', 'proctor@gmail.com', '$2a$10$WBR8tqYq8rQZqCQVWjnB/.V11MIm8EOmcpfXf0JCRjwDho9KPfiF6', '+1-800-0003', TRUE),
('Bob', 'Student', 'student1@gmail.com', '$2a$10$WBR8tqYq8rQZqCQVWjnB/.V11MIm8EOmcpfXf0JCRjwDho9KPfiF6', '+1-800-0004', TRUE),
('Carol', 'Student', 'student2@gmail.com', '$2a$10$WBR8tqYq8rQZqCQVWjnB/.V11MIm8EOmcpfXf0JCRjwDho9KPfiF6', '+1-800-0005', TRUE),
('David', 'Student', 'student3@gmail.com', '$2a$10$WBR8tqYq8rQZqCQVWjnB/.V11MIm8EOmcpfXf0JCRjwDho9KPfiF6', '+1-800-0006', TRUE);

-- Insert User Roles
INSERT INTO user_roles (userId, roleId) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 5),
(7, 5);

-- Insert Questions
INSERT INTO questions (questionText, questionType, marks, difficulty, optionA, optionB, optionC, optionD, correctAnswer, explanation) VALUES
('What is the capital of France?', 'Multiple Choice', 1, 'Easy', 'London', 'Berlin', 'Paris', 'Madrid', 'C', 'Paris is the capital and most populated city of France.'),
('Which planet is the largest in our solar system?', 'Multiple Choice', 1, 'Easy', 'Saturn', 'Jupiter', 'Neptune', 'Uranus', 'B', 'Jupiter is the largest planet in the solar system.'),
('What is the chemical symbol for Gold?', 'Multiple Choice', 1, 'Medium', 'Go', 'Gd', 'Au', 'Ag', 'C', 'The chemical symbol for Gold is Au, from its Latin name Aurum.'),
('What is the smallest prime number?', 'Multiple Choice', 1, 'Easy', '1', '2', '3', '5', 'B', 'The smallest prime number is 2.'),
('How many continents are there?', 'Multiple Choice', 1, 'Easy', '5', '6', '7', '8', 'C', 'There are 7 continents in the world.'),
('What is the chemical formula for water?', 'Multiple Choice', 1, 'Easy', 'H2O2', 'H2O', 'HO', 'H3O', 'B', 'The chemical formula for water is H2O.'),
('Which country has the largest population?', 'Multiple Choice', 1, 'Medium', 'India', 'China', 'USA', 'Indonesia', 'B', 'As of 2023, China has the largest population.'),
('What is the boiling point of water at sea level?', 'Multiple Choice', 1, 'Medium', '90°C', '100°C', '110°C', '120°C', 'B', 'Water boils at 100°C at sea level.'),
('Who wrote Romeo and Juliet?', 'Multiple Choice', 1, 'Easy', 'John Milton', 'Christopher Marlowe', 'William Shakespeare', 'Ben Jonson', 'C', 'William Shakespeare wrote Romeo and Juliet.'),
('What is the currency of Japan?', 'Multiple Choice', 1, 'Easy', 'Yuan', 'Won', 'Yen', 'Peso', 'C', 'The currency of Japan is the Yen.');

-- Insert Exams
INSERT INTO exams (title, description, duration, totalQuestions, totalMarks, passingMarks, status, startTime, endTime, requiresProctoring, createdBy) VALUES
('General Knowledge Quiz', 'A comprehensive quiz covering general knowledge topics including geography, science, and literature.', 30, 10, 10, 5, 'Published', '2024-02-15 10:00:00', '2024-02-15 18:00:00', TRUE, 3),
('Mathematics Midterm', 'Midterm examination for Mathematics covering algebra, geometry, and calculus.', 60, 20, 50, 25, 'Published', '2024-02-20 09:00:00', '2024-02-20 17:00:00', TRUE, 3),
('English Literature Final', 'Final examination for English Literature covering poetry, prose, and Shakespeare.', 90, 25, 75, 40, 'Draft', NULL, NULL, TRUE, 3),
('Science Assessment', 'Assessment of basic science concepts including physics, chemistry, and biology.', 45, 15, 30, 15, 'Published', '2024-02-25 14:00:00', '2024-02-25 20:00:00', TRUE, 3),
('Programming Fundamentals', 'Test for basic programming concepts and problem-solving skills.', 120, 30, 100, 50, 'Draft', NULL, NULL, FALSE, 3);

-- Insert Questions for Exams
INSERT INTO exam_questions (examId, questionId, displayOrder) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(1, 4, 4),
(1, 5, 5),
(1, 6, 6),
(1, 7, 7),
(1, 8, 8),
(1, 9, 9),
(1, 10, 10),
(2, 3, 1),
(2, 4, 2),
(2, 8, 3),
(4, 1, 1),
(4, 2, 2),
(4, 3, 3),
(4, 6, 4),
(4, 8, 5);

-- Insert Student Enrollments
INSERT INTO student_exam_enrollments (userId, examId, enrollmentStatus) VALUES
(5, 1, 'Completed'),
(6, 1, 'Active'),
(7, 1, 'Active'),
(5, 2, 'Active'),
(6, 2, 'Pending'),
(5, 4, 'Completed');

-- Insert Sample Submissions
INSERT INTO exam_submissions (userId, examId, status, obtainedMarks, isPassed, submitTime, totalTimeSpent) VALUES
(5, 1, 'Submitted', 8, TRUE, '2024-02-15 10:30:00', 1800),
(6, 1, 'Submitted', 4, FALSE, '2024-02-15 10:45:00', 1500),
(7, 1, 'In Progress', NULL, NULL, NULL, NULL);

-- Insert Sample Student Answers
INSERT INTO student_answers (submissionId, questionId, studentAnswer, isCorrect, marksObtained, answeredAt) VALUES
(1, 1, 'C', TRUE, 1, '2024-02-15 10:05:00'),
(1, 2, 'B', TRUE, 1, '2024-02-15 10:10:00'),
(1, 3, 'C', TRUE, 1, '2024-02-15 10:15:00'),
(1, 4, 'B', TRUE, 1, '2024-02-15 10:20:00'),
(1, 5, 'C', TRUE, 1, '2024-02-15 10:25:00'),
(1, 6, 'B', TRUE, 1, '2024-02-15 10:30:00'),
(2, 1, 'A', FALSE, 0, '2024-02-15 10:20:00'),
(2, 2, 'B', TRUE, 1, '2024-02-15 10:25:00'),
(2, 3, 'A', FALSE, 0, '2024-02-15 10:30:00'),
(2, 4, 'B', TRUE, 1, '2024-02-15 10:35:00'),
(2, 5, 'C', TRUE, 1, '2024-02-15 10:40:00');

-- Insert Sample Proctoring Logs
INSERT INTO proctoring_logs (userId, submissionId, eventType, severity, description) VALUES
(5, 1, 'Tab Switch', 'Low', 'Student switched tab at 10:05'),
(6, 2, 'Copy Paste', 'High', 'Student attempted to copy exam content');

-- Insert Questions
INSERT INTO questions (questionText, questionType, marks, difficulty, optionA, optionB, optionC, optionD, correctAnswer, explanation) VALUES
('What is the capital of France?', 'Multiple Choice', 1, 'Easy', 'London', 'Berlin', 'Paris', 'Madrid', 'C', 'Paris is the capital and most populated city of France.'),
('Which planet is the largest in our solar system?', 'Multiple Choice', 1, 'Easy', 'Saturn', 'Jupiter', 'Neptune', 'Uranus', 'B', 'Jupiter is the largest planet in the solar system.'),
('What is the chemical symbol for Gold?', 'Multiple Choice', 1, 'Medium', 'Go', 'Gd', 'Au', 'Ag', 'C', 'The chemical symbol for Gold is Au, from its Latin name Aurum.'),
('What is the smallest prime number?', 'Multiple Choice', 1, 'Easy', '1', '2', '3', '5', 'B', 'The smallest prime number is 2.'),
('How many continents are there?', 'Multiple Choice', 1, 'Easy', '5', '6', '7', '8', 'C', 'There are 7 continents in the world.'),
('What is the chemical formula for water?', 'Multiple Choice', 1, 'Easy', 'H2O2', 'H2O', 'HO', 'H3O', 'B', 'The chemical formula for water is H2O.'),
('Which country has the largest population?', 'Multiple Choice', 1, 'Medium', 'India', 'China', 'USA', 'Indonesia', 'B', 'As of 2023, China has the largest population.'),
('What is the boiling point of water at sea level?', 'Multiple Choice', 1, 'Medium', '90°C', '100°C', '110°C', '120°C', 'B', 'Water boils at 100°C at sea level.'),
('Who wrote Romeo and Juliet?', 'Multiple Choice', 1, 'Easy', 'John Milton', 'Christopher Marlowe', 'William Shakespeare', 'Ben Jonson', 'C', 'William Shakespeare wrote Romeo and Juliet.'),
('What is the currency of Japan?', 'Multiple Choice', 1, 'Easy', 'Yuan', 'Won', 'Yen', 'Peso', 'C', 'The currency of Japan is the Yen.');

-- Insert Exams
INSERT INTO exams (title, description, duration, totalQuestions, totalMarks, passingMarks, status, startTime, endTime, requiresProctoring, createdBy) VALUES
('General Knowledge Quiz', 'A comprehensive quiz covering general knowledge topics including geography, science, and literature.', 30, 10, 10, 5, 'Published', '2024-02-15 10:00:00', '2024-02-15 18:00:00', TRUE, 3),
('Mathematics Midterm', 'Midterm examination for Mathematics covering algebra, geometry, and calculus.', 60, 20, 50, 25, 'Published', '2024-02-20 09:00:00', '2024-02-20 17:00:00', TRUE, 3),
('English Literature Final', 'Final examination for English Literature covering poetry, prose, and Shakespeare.', 90, 25, 75, 40, 'Draft', NULL, NULL, TRUE, 3),
('Science Assessment', 'Assessment of basic science concepts including physics, chemistry, and biology.', 45, 15, 30, 15, 'Published', '2024-02-25 14:00:00', '2024-02-25 20:00:00', TRUE, 3),
('Programming Fundamentals', 'Test for basic programming concepts and problem-solving skills.', 120, 30, 100, 50, 'Draft', NULL, NULL, FALSE, 3);

-- Insert Questions for Exams
INSERT INTO exam_questions (examId, questionId, displayOrder) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(1, 4, 4),
(1, 5, 5),
(1, 6, 6),
(1, 7, 7),
(1, 8, 8),
(1, 9, 9),
(1, 10, 10),
(2, 3, 1),
(2, 4, 2),
(2, 8, 3),
(4, 1, 1),
(4, 2, 2),
(4, 3, 3),
(4, 6, 4),
(4, 8, 5);

-- Insert Student Enrollments
INSERT INTO student_exam_enrollments (userId, examId, enrollmentStatus) VALUES
(5, 1, 'Completed'),
(6, 1, 'Active'),
(7, 1, 'Active'),
(5, 2, 'Active'),
(6, 2, 'Pending'),
(5, 4, 'Completed');

-- Insert Sample Submissions
INSERT INTO exam_submissions (userId, examId, status, obtainedMarks, isPassed, submitTime, totalTimeSpent) VALUES
(5, 1, 'Submitted', 8, TRUE, '2024-02-15 10:30:00', 1800),
(6, 1, 'Submitted', 4, FALSE, '2024-02-15 10:45:00', 1500),
(7, 1, 'In Progress', NULL, NULL, NULL, NULL);

-- Insert Sample Student Answers
INSERT INTO student_answers (submissionId, questionId, studentAnswer, isCorrect, marksObtained, answeredAt) VALUES
(1, 1, 'C', TRUE, 1, '2024-02-15 10:05:00'),
(1, 2, 'B', TRUE, 1, '2024-02-15 10:10:00'),
(1, 3, 'C', TRUE, 1, '2024-02-15 10:15:00'),
(1, 4, 'B', TRUE, 1, '2024-02-15 10:20:00'),
(1, 5, 'C', TRUE, 1, '2024-02-15 10:25:00'),
(1, 6, 'B', TRUE, 1, '2024-02-15 10:30:00'),
(2, 1, 'A', FALSE, 0, '2024-02-15 10:20:00'),
(2, 2, 'B', TRUE, 1, '2024-02-15 10:25:00'),
(2, 3, 'A', FALSE, 0, '2024-02-15 10:30:00'),
(2, 4, 'B', TRUE, 1, '2024-02-15 10:35:00'),
(2, 5, 'C', TRUE, 1, '2024-02-15 10:40:00');

-- Insert Sample Proctoring Logs
INSERT INTO proctoring_logs (userId, submissionId, eventType, severity, description) VALUES
(5, 1, 'Tab Switch', 'Low', 'Student switched tab at 10:05'),
(6, 2, 'Copy Paste', 'High', 'Student attempted to copy exam content');
