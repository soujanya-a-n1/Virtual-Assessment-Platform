-- Insert Departments
-- This script adds the core departments to the system

USE virtual_assessment_platform;

-- Clear existing departments (optional - comment out if you want to keep existing data)
-- DELETE FROM departments;

-- Insert departments
INSERT INTO departments (code, name, description, isActive, createdAt, updatedAt) VALUES
('CSE', 'Computer Science and Engineering', 'Department handling programming, software development, and AI courses.', 1, NOW(), NOW()),
('ECE', 'Electronics and Communication Engineering', 'Department focused on electronics, communication systems, and embedded systems.', 1, NOW(), NOW()),
('MECH', 'Mechanical Engineering', 'Department covering manufacturing, thermal, and design engineering.', 1, NOW(), NOW()),
('CIVIL', 'Civil Engineering', 'Department specializing in construction, structural, and environmental engineering.', 1, NOW(), NOW()),
('MBA', 'Master of Business Administration', 'Department managing business, finance, and management studies.', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  isActive = VALUES(isActive),
  updatedAt = NOW();

-- Verify insertion
SELECT * FROM departments ORDER BY code;
