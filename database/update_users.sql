-- Update Users Only - Change emails to @gmail.com and password to Admin@143

USE virtual_assessment_db;

-- Delete only user_roles and users (other data will remain)
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
