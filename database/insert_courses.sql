-- Insert Courses with Department Links
-- This script adds 10 courses linked to their respective departments

USE virtual_assessment_platform;

-- First, get department IDs (for reference)
-- CSE, ECE, MECH, CIVIL, MBA

-- Insert courses
-- Note: departmentId will be looked up from departments table

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'CS101', 'Programming in C', 'Basics of C programming and problem solving.', 4, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CSE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'CS102', 'Object Oriented Programming', 'OOP concepts using Java.', 4, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CSE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'CS201', 'Data Structures', 'Stacks, queues, linked lists, trees, and graphs.', 4, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CSE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'CS301', 'Database Management Systems', 'SQL, normalization, and database design.', 4, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CSE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'CS302', 'Operating Systems', 'Process management and memory management concepts.', 3, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CSE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'EC101', 'Digital Electronics', 'Logic gates and digital circuits.', 3, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'ECE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'EC201', 'Microprocessors', 'Architecture and programming of microprocessors.', 3, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'ECE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'ME101', 'Engineering Mechanics', 'Fundamentals of forces and equilibrium.', 3, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'MECH'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'CIV101', 'Structural Analysis', 'Analysis of beams and structures.', 3, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CIVIL'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO courses (code, name, description, credits, departmentId, isActive, createdAt, updatedAt)
SELECT 'MBA101', 'Principles of Management', 'Basics of management and organizational behavior.', 3, d.id, 1, NOW(), NOW()
FROM departments d WHERE d.code = 'MBA'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  credits = VALUES(credits),
  departmentId = VALUES(departmentId),
  isActive = VALUES(isActive),
  updatedAt = NOW();

-- Verify insertion
SELECT 
  c.code,
  c.name,
  c.credits,
  d.code as department_code,
  d.name as department_name,
  c.isActive
FROM courses c
LEFT JOIN departments d ON c.departmentId = d.id
ORDER BY c.code;
