-- Coding Questions Table
CREATE TABLE IF NOT EXISTS coding_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  examId INT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  inputFormat TEXT,
  outputFormat TEXT,
  sampleInput TEXT,
  sampleOutput TEXT,
  difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
  marks DECIMAL(5,2) DEFAULT 10.00,
  timeLimit INT DEFAULT 30, -- Time limit in minutes
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Coding Submissions Table
CREATE TABLE IF NOT EXISTS coding_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId INT NOT NULL,
  codingQuestionId INT NOT NULL,
  submissionId INT, -- Links to exam_submissions
  language ENUM('C', 'C++', 'Java', 'Python') NOT NULL,
  code TEXT NOT NULL,
  submissionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executionTime DECIMAL(10,2), -- Execution time in seconds
  status ENUM('Submitted', 'Running', 'Passed', 'Failed', 'Error') DEFAULT 'Submitted',
  output TEXT,
  error TEXT,
  marksObtained DECIMAL(5,2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (codingQuestionId) REFERENCES coding_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (submissionId) REFERENCES exam_submissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Coding Question
INSERT INTO coding_questions (examId, title, description, inputFormat, outputFormat, sampleInput, sampleOutput, difficulty, marks, timeLimit)
VALUES (
  1, -- Replace with actual exam ID
  'Sum of Two Numbers',
  'Write a program that takes two integers as input and prints their sum.',
  'Two space-separated integers on a single line.',
  'A single integer representing the sum.',
  '5 10',
  '15',
  'Easy',
  10.00,
  30
);
