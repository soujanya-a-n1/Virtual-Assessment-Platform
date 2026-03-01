-- Insert Classes with Department Links
-- This script adds 15 classes for academic year 2024-2025

USE virtual_assessment_platform;

-- Insert classes
-- Note: departmentId will be looked up from departments table

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'CSE1A', 'CSE First Year - A', d.id, '2024-2025', '1', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CSE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'CSE2A', 'CSE Second Year - A', d.id, '2024-2025', '3', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CSE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'CSE3A', 'CSE Third Year - A', d.id, '2024-2025', '5', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CSE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'ECE1A', 'ECE First Year - A', d.id, '2024-2025', '1', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'ECE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'ECE2A', 'ECE Second Year - A', d.id, '2024-2025', '3', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'ECE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'ECE3A', 'ECE Third Year - A', d.id, '2024-2025', '5', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'ECE'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'MECH1A', 'MECH First Year - A', d.id, '2024-2025', '1', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'MECH'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'MECH2A', 'MECH Second Year - A', d.id, '2024-2025', '3', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'MECH'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'MECH3A', 'MECH Third Year - A', d.id, '2024-2025', '5', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'MECH'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'CIVIL1A', 'CIVIL First Year - A', d.id, '2024-2025', '1', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CIVIL'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'CIVIL2A', 'CIVIL Second Year - A', d.id, '2024-2025', '3', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CIVIL'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'CIVIL3A', 'CIVIL Third Year - A', d.id, '2024-2025', '5', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'CIVIL'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'MBA1A', 'MBA First Year - A', d.id, '2024-2025', '1', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'MBA'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'MBA2A', 'MBA Second Year - A', d.id, '2024-2025', '3', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'MBA'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

INSERT INTO classes (code, name, departmentId, academicYear, semester, isActive, createdAt, updatedAt)
SELECT 'MBA2B', 'MBA Second Year - B', d.id, '2024-2025', '4', 1, NOW(), NOW()
FROM departments d WHERE d.code = 'MBA'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  departmentId = VALUES(departmentId),
  academicYear = VALUES(academicYear),
  semester = VALUES(semester),
  isActive = VALUES(isActive),
  updatedAt = NOW();

-- Verify insertion
SELECT 
  c.code,
  c.name,
  c.semester,
  c.academicYear,
  d.code as department_code,
  d.name as department_name,
  c.isActive
FROM classes c
LEFT JOIN departments d ON c.departmentId = d.id
ORDER BY c.code;
