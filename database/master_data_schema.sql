-- Master Data Tables for Virtual Assessment Platform

USE virtual_assessment_db;

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_isActive (isActive)
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  credits INT,
  departmentId INT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_code (code),
  INDEX idx_departmentId (departmentId),
  INDEX idx_isActive (isActive)
);

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  departmentId INT,
  academicYear VARCHAR(20),
  semester VARCHAR(20),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_code (code),
  INDEX idx_departmentId (departmentId),
  INDEX idx_isActive (isActive)
);

-- Lecturers Table (Extended User Information)
CREATE TABLE IF NOT EXISTS lecturers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL UNIQUE,
  employeeId VARCHAR(50) UNIQUE,
  departmentId INT,
  qualification VARCHAR(100),
  specialization VARCHAR(100),
  joiningDate DATE,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_employeeId (employeeId),
  INDEX idx_departmentId (departmentId)
);

-- Students Table (Extended User Information)
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL UNIQUE,
  studentId VARCHAR(50) UNIQUE,
  classId INT,
  departmentId INT,
  enrollmentYear INT,
  currentSemester INT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE SET NULL,
  FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_studentId (studentId),
  INDEX idx_classId (classId),
  INDEX idx_departmentId (departmentId)
);

-- Course Lecturer Assignment Table
CREATE TABLE IF NOT EXISTS course_lecturers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT NOT NULL,
  lecturerId INT NOT NULL,
  assignedDate DATE DEFAULT (CURRENT_DATE),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (lecturerId) REFERENCES lecturers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_course_lecturer (courseId, lecturerId),
  INDEX idx_courseId (courseId),
  INDEX idx_lecturerId (lecturerId)
);

-- Class Student Enrollment Table
CREATE TABLE IF NOT EXISTS class_students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  classId INT NOT NULL,
  studentId INT NOT NULL,
  enrollmentDate DATE DEFAULT (CURRENT_DATE),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_class_student (classId, studentId),
  INDEX idx_classId (classId),
  INDEX idx_studentId (studentId)
);

-- Update Exams table to include course reference
ALTER TABLE exams 
ADD COLUMN courseId INT AFTER createdBy,
ADD FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL;

-- Update Questions table to include course and lecturer reference
ALTER TABLE questions 
ADD COLUMN courseId INT AFTER displayOrder,
ADD COLUMN createdBy INT AFTER courseId,
ADD FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL,
ADD FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL;
