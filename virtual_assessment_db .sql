-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2026 at 08:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `virtual_assessment_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `academicYear` varchar(20) DEFAULT NULL,
  `semester` varchar(20) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `code`, `departmentId`, `academicYear`, `semester`, `isActive`, `createdAt`, `updatedAt`) VALUES
(2, 'CSE First Year - A', 'CSE1A', 2, '2024-2025', '1', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(3, 'CSE Second Year - A', 'CSE2A', 2, '2024-2025', '3', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(4, 'CSE Third Year - A', 'CSE3A', 2, '2024-2025', '5', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(5, 'ECE First Year - A', 'ECE1A', 3, '2024-2025', '1', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(6, 'ECE Second Year - A', 'ECE2A', 3, '2024-2025', '3', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(7, 'ECE Third Year - A', 'ECE3A', 3, '2024-2025', '5', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(8, 'MECH First Year - A', 'MECH1A', 4, '2024-2025', '1', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(9, 'MECH Second Year - A', 'MECH2A', 4, '2024-2025', '3', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(10, 'MECH Third Year - A', 'MECH3A', 4, '2024-2025', '5', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(11, 'CIVIL First Year - A', 'CIVIL1A', 5, '2024-2025', '1', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(12, 'CIVIL Second Year - A', 'CIVIL2A', 5, '2024-2025', '3', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(13, 'CIVIL Third Year - A', 'CIVIL3A', 5, '2024-2025', '5', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(14, 'MBA First Year - A', 'MBA1A', 6, '2024-2025', '1', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(15, 'MBA Second Year - A', 'MBA2A', 6, '2024-2025', '3', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(16, 'MBA Second Year - B', 'MBA2B', 6, '2024-2025', '4', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `credits` int(11) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `code`, `description`, `credits`, `departmentId`, `isActive`, `createdAt`, `updatedAt`) VALUES
(2, 'Programming in C', 'CS101', 'Basics of C programming and problem solving.', 4, 2, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37'),
(3, 'Object Oriented Programming', 'CS102', 'OOP concepts using Java.', 4, 2, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37'),
(4, 'Data Structures', 'CS201', 'Stacks, queues, linked lists, trees, and graphs.', 4, 2, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37'),
(5, 'Database Management Systems', 'CS301', 'SQL, normalization, and database design.', 4, 2, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37'),
(6, 'Operating Systems', 'CS302', 'Process management and memory management concepts.', 3, 2, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37'),
(7, 'Digital Electronics', 'EC101', 'Logic gates and digital circuits.', 3, 3, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37'),
(8, 'Microprocessors', 'EC201', 'Architecture and programming of microprocessors.', 3, 3, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37'),
(9, 'Engineering Mechanics', 'ME101', 'Fundamentals of forces and equilibrium.', 3, 4, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37'),
(10, 'Structural Analysis', 'CIV101', 'Analysis of beams and structures.', 3, 5, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37'),
(11, 'Principles of Management', 'MBA101', 'Basics of management and organizational behavior.', 3, 6, 1, '2026-02-19 08:26:37', '2026-02-19 08:26:37');

-- --------------------------------------------------------

--
-- Table structure for table `course_lecturers`
--

CREATE TABLE `course_lecturers` (
  `id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `lecturerId` int(11) NOT NULL,
  `assignedDate` date DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_lecturers`
--

INSERT INTO `course_lecturers` (`id`, `courseId`, `lecturerId`, `assignedDate`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 4, 11, '2026-02-19', 1, '2026-02-19 09:23:10', '2026-02-19 09:23:10');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `description`, `isActive`, `createdAt`, `updatedAt`) VALUES
(2, 'Computer Science and Engineering', 'CSE', 'Department handling programming, software development, and AI courses.', 1, '2026-02-19 08:17:34', '2026-02-19 08:17:34'),
(3, 'Electronics and Communication Engineering', 'ECE', 'Department focused on electronics, communication systems, and embedded systems.', 1, '2026-02-19 08:17:34', '2026-02-19 08:17:34'),
(4, 'Mechanical Engineering', 'MECH', 'Department covering manufacturing, thermal, and design engineering.', 1, '2026-02-19 08:17:34', '2026-02-19 08:17:34'),
(5, 'Civil Engineering', 'CIVIL', 'Department specializing in construction, structural, and environmental engineering.', 1, '2026-02-19 08:17:34', '2026-02-19 08:17:34'),
(6, 'Master of Business Administration', 'MBA', 'Department managing business, finance, and management studies.', 1, '2026-02-19 08:17:34', '2026-02-19 08:17:34');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `totalQuestions` int(11) NOT NULL,
  `totalMarks` decimal(10,2) NOT NULL,
  `passingMarks` decimal(10,2) NOT NULL,
  `examType` enum('Online','Offline') DEFAULT 'Online',
  `status` enum('Draft','Published','Scheduled','Active','Completed') DEFAULT 'Draft',
  `startTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `requiresProctoring` tinyint(1) DEFAULT 1,
  `shuffleQuestions` tinyint(1) DEFAULT 0,
  `negativeMarkingEnabled` tinyint(1) DEFAULT 0,
  `negativeMarks` decimal(10,2) DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `courseId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `title`, `description`, `duration`, `totalQuestions`, `totalMarks`, `passingMarks`, `examType`, `status`, `startTime`, `endTime`, `requiresProctoring`, `shuffleQuestions`, `negativeMarkingEnabled`, `negativeMarks`, `createdBy`, `courseId`, `createdAt`, `updatedAt`) VALUES
(7, 'C Programming Mid Exam', 'Mid-semester exam covering C basics, loops, arrays, and functions.', 60, 10, 50.00, 20.00, 'Online', 'Published', '2025-03-10 03:30:00', '2025-03-10 04:30:00', 1, 0, 0, NULL, 1, 2, '2026-02-19 10:10:29', '2026-02-19 10:10:29'),
(8, 'OOP Internal Assessment', 'Exam covering OOP concepts and Java fundamentals.', 60, 10, 50.00, 20.00, 'Online', 'Published', '2025-03-12 03:30:00', '2025-03-12 04:30:00', 1, 0, 0, NULL, 1, 3, '2026-02-19 10:10:29', '2026-02-19 10:10:29'),
(9, 'Data Structures Mid Exam', 'Exam on stacks, queues, linked lists, and trees.', 90, 15, 75.00, 30.00, 'Online', 'Published', '2025-03-15 03:30:00', '2025-03-15 05:00:00', 1, 0, 0, NULL, 1, 4, '2026-02-19 10:10:29', '2026-02-19 10:10:29'),
(10, 'DBMS Internal Test', 'SQL queries, normalization, and ER diagrams.', 60, 10, 50.00, 20.00, 'Online', 'Published', '2025-03-18 03:30:00', '2025-03-18 04:30:00', 1, 0, 0, NULL, 1, 5, '2026-02-19 10:10:29', '2026-02-19 10:10:29'),
(11, 'Operating Systems Test', 'Process scheduling and memory management concepts.', 60, 10, 50.00, 20.00, 'Online', 'Published', '2025-03-20 03:30:00', '2025-03-20 04:30:00', 1, 0, 0, NULL, 1, 6, '2026-02-19 10:10:30', '2026-02-19 10:10:30'),
(12, 'Digital Electronics Exam', 'Logic gates, flip-flops, and number systems.', 60, 10, 50.00, 20.00, 'Online', 'Published', '2025-03-22 03:30:00', '2025-03-22 04:30:00', 1, 0, 0, NULL, 1, 7, '2026-02-19 10:10:30', '2026-02-19 10:10:30'),
(13, 'Microprocessors Test', 'Microprocessor architecture and programming.', 90, 15, 75.00, 30.00, 'Online', 'Published', '2025-03-25 03:30:00', '2025-03-25 05:00:00', 1, 0, 0, NULL, 1, 8, '2026-02-19 10:10:30', '2026-02-19 10:10:30'),
(14, 'Engineering Mechanics Exam', 'Force systems and equilibrium problems.', 60, 10, 50.00, 20.00, 'Online', 'Published', '2025-03-27 03:30:00', '2025-03-27 04:30:00', 1, 0, 0, NULL, 1, 9, '2026-02-19 10:10:30', '2026-02-19 10:10:30'),
(15, 'Structural Analysis Test', 'Beam analysis and structural calculations.', 60, 10, 50.00, 20.00, 'Online', 'Published', '2025-03-29 03:30:00', '2025-03-29 04:30:00', 1, 0, 0, NULL, 1, 10, '2026-02-19 10:10:30', '2026-02-19 10:10:30'),
(16, 'Principles of Management Exam', 'Management theories and organizational behavior.', 60, 10, 50.00, 20.00, 'Online', 'Published', '2025-04-02 03:30:00', '2025-04-02 04:30:00', 1, 0, 0, NULL, 1, 11, '2026-02-19 10:10:30', '2026-02-19 10:10:30');

-- --------------------------------------------------------

--
-- Table structure for table `exam_questions`
--

CREATE TABLE `exam_questions` (
  `id` int(11) NOT NULL,
  `examId` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `displayOrder` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_questions`
--

INSERT INTO `exam_questions` (`id`, `examId`, `questionId`, `displayOrder`, `createdAt`, `updatedAt`) VALUES
(22, 9, 42, 1, '2026-03-01 06:50:34', '2026-03-01 06:50:34'),
(23, 9, 43, 2, '2026-03-01 06:52:17', '2026-03-01 06:52:17'),
(24, 9, 44, 3, '2026-03-01 06:53:45', '2026-03-01 06:53:45'),
(25, 9, 45, 4, '2026-03-01 06:54:40', '2026-03-01 06:54:40'),
(26, 9, 46, 5, '2026-03-01 06:56:30', '2026-03-01 06:56:30'),
(27, 9, 47, 6, '2026-03-01 06:57:26', '2026-03-01 06:57:26'),
(28, 9, 48, 7, '2026-03-01 06:59:02', '2026-03-01 06:59:02'),
(29, 9, 49, 8, '2026-03-01 07:00:35', '2026-03-01 07:00:35'),
(30, 9, 50, 9, '2026-03-01 07:01:40', '2026-03-01 07:01:40'),
(31, 9, 51, 10, '2026-03-01 07:03:57', '2026-03-01 07:03:57'),
(32, 9, 52, 11, '2026-03-01 07:05:23', '2026-03-01 07:05:23'),
(33, 9, 53, 12, '2026-03-01 07:06:30', '2026-03-01 07:06:30'),
(34, 9, 54, 13, '2026-03-01 07:07:14', '2026-03-01 07:07:14'),
(35, 9, 55, 14, '2026-03-01 07:08:04', '2026-03-01 07:08:04'),
(36, 9, 56, 15, '2026-03-01 07:09:19', '2026-03-01 07:09:19');

-- --------------------------------------------------------

--
-- Table structure for table `exam_submissions`
--

CREATE TABLE `exam_submissions` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `examId` int(11) NOT NULL,
  `submitTime` datetime DEFAULT NULL,
  `totalTimeSpent` int(11) DEFAULT NULL,
  `status` enum('Not Started','In Progress','Submitted','Evaluated','Failed') DEFAULT 'Not Started',
  `startedAt` datetime DEFAULT NULL,
  `obtainedMarks` decimal(10,2) DEFAULT NULL,
  `evaluatedBy` int(11) DEFAULT NULL,
  `evaluationNotes` text DEFAULT NULL,
  `evaluatedAt` datetime DEFAULT NULL,
  `isPassed` tinyint(1) DEFAULT NULL,
  `autoSubmitted` tinyint(1) DEFAULT 0,
  `cheatingDetected` tinyint(1) DEFAULT 0,
  `cheatingDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cheatingDetails`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lecturers`
--

CREATE TABLE `lecturers` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `employeeId` varchar(50) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `qualification` varchar(100) DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `joiningDate` date DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lecturers`
--

INSERT INTO `lecturers` (`id`, `userId`, `employeeId`, `departmentId`, `qualification`, `specialization`, `joiningDate`, `isActive`, `createdAt`, `updatedAt`) VALUES
(2, 13, 'EMP001', 2, 'M.Tech', 'Data Structures', '2022-06-01', 1, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(3, 14, 'EMP002', 2, 'Ph.D', 'Artificial Intelligence', '2021-07-15', 1, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(4, 15, 'EMP003', 3, 'M.Tech', 'Embedded Systems', '2020-06-10', 1, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(5, 16, 'EMP004', 3, 'Ph.D', 'Digital Electronics', '2019-08-20', 1, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(6, 17, 'EMP005', 4, 'M.Tech', 'Thermal Engineering', '2021-06-05', 1, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(7, 18, 'EMP006', 5, 'M.Tech', 'Structural Engineering', '2020-07-12', 1, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(8, 19, 'EMP007', 4, 'Ph.D', 'Manufacturing Technology', '2018-01-01', 1, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(9, 20, 'EMP008', 6, 'MBA, Ph.D', 'Finance', '2022-06-18', 1, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(10, 21, 'EMP009', 6, 'MBA', 'Marketing', '2023-05-25', 1, '2026-02-19 08:57:00', '2026-02-19 08:57:00'),
(11, 22, 'EMP010', 2, 'M.Tech', 'Cyber Security', '2024-02-02', 1, '2026-02-19 08:57:00', '2026-02-19 08:57:00');

-- --------------------------------------------------------

--
-- Table structure for table `proctoring_logs`
--

CREATE TABLE `proctoring_logs` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `submissionId` int(11) NOT NULL,
  `eventType` enum('Tab Switch','Copy Paste','Right Click','Fullscreen Exit','Camera Off','Microphone Off') NOT NULL,
  `severity` enum('Low','Medium','High') DEFAULT 'Medium',
  `description` text DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `questionText` text NOT NULL,
  `questionType` enum('Multiple Choice','True/False','Short Answer','Essay','Matching') NOT NULL,
  `marks` decimal(10,2) NOT NULL,
  `difficulty` enum('Easy','Medium','Hard') DEFAULT 'Medium',
  `topic` varchar(100) DEFAULT NULL,
  `courseId` int(11) DEFAULT NULL,
  `optionA` text DEFAULT NULL,
  `optionB` text DEFAULT NULL,
  `optionC` text DEFAULT NULL,
  `optionD` text DEFAULT NULL,
  `correctAnswer` varchar(100) NOT NULL,
  `explanation` text DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `displayOrder` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `questionText`, `questionType`, `marks`, `difficulty`, `topic`, `courseId`, `optionA`, `optionB`, `optionC`, `optionD`, `correctAnswer`, `explanation`, `imageUrl`, `displayOrder`, `createdAt`, `updatedAt`) VALUES
(42, 'Which Data Structure follows LIFO?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Queue', 'Stack', 'Array', 'Tree', 'B', NULL, NULL, NULL, '2026-03-01 06:50:34', '2026-03-01 06:50:34'),
(43, 'Time complexity of Binary Search?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'O(n)', 'O(logn)', 'O(n2)', 'O(1)', 'B', NULL, NULL, NULL, '2026-03-01 06:52:17', '2026-03-01 06:52:17'),
(44, 'Queue follows which principle?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'LIFO', 'FIFO', 'FILO', 'Random', 'B', NULL, NULL, NULL, '2026-03-01 06:53:44', '2026-03-01 06:53:44'),
(45, 'Maximum children in binary tree node', 'Multiple Choice', 1.00, 'Medium', '', 4, '1', '3', 'unlimited', '2', 'D', NULL, NULL, NULL, '2026-03-01 06:54:40', '2026-03-01 06:54:40'),
(46, 'Inorder traversal order?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Root-Left-Right', 'Left-Right-Root', 'Left-Root-Right', 'Right-Left-Root', 'C', NULL, NULL, NULL, '2026-03-01 06:56:30', '2026-03-01 06:56:30'),
(47, 'Stack overflow occurs when?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Empty', 'Full', 'Sorted', 'Reversed', 'B', NULL, NULL, NULL, '2026-03-01 06:57:26', '2026-03-01 06:57:26'),
(48, 'Merge sort technique?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Greedy', 'Divede &Conquer', 'Dynamic', 'Backtracking', 'B', NULL, NULL, NULL, '2026-03-01 06:59:02', '2026-03-01 06:59:02'),
(49, 'AVL tree is?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Heap', 'Graph', 'Self-balancing BST', 'Queue', 'D', NULL, NULL, NULL, '2026-03-01 07:00:35', '2026-03-01 07:00:35'),
(50, 'BFS uses ?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Stack', 'Queue', 'Tree', 'Array', 'B', NULL, NULL, NULL, '2026-03-01 07:01:40', '2026-03-01 07:01:40'),
(51, 'DFS uses?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Stack', 'Queue', 'Heap', 'Graph', 'A', NULL, NULL, NULL, '2026-03-01 07:03:57', '2026-03-01 07:03:57'),
(52, 'Linked List stores data in?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Continuous memory', 'Non-Continuous memory', 'Stack', 'Cache', 'B', NULL, NULL, NULL, '2026-03-01 07:05:23', '2026-03-01 07:05:23'),
(53, 'Best case Quick sort?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'o(n2)', 'O(nlogn)', 'O(n)', 'O(logn)', 'B', NULL, NULL, NULL, '2026-03-01 07:06:30', '2026-03-01 07:06:30'),
(54, 'Hashing used in?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Stack', 'Queue', 'Hash Table', 'Tree', 'C', NULL, NULL, NULL, '2026-03-01 07:07:14', '2026-03-01 07:07:14'),
(55, 'Heap used for?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Searching', 'Heap Sort', 'Printing', 'Memory', 'B', NULL, NULL, NULL, '2026-03-01 07:08:04', '2026-03-01 07:08:04'),
(56, 'prefix evaluation uses?', 'Multiple Choice', 1.00, 'Medium', '', 4, 'Stack', 'Queue', 'Array', 'Graph', 'A', NULL, NULL, NULL, '2026-03-01 07:09:19', '2026-03-01 07:09:19');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Super Admin', 'Full system access', '2026-02-16 05:27:19', '2026-02-19 08:26:37'),
(2, 'Admin', 'Administrative access', '2026-02-16 05:27:19', '2026-02-19 08:26:37'),
(3, 'Examiner', 'Can create and manage exams', '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(4, 'Proctor', 'Can monitor exams', '2026-02-16 05:27:19', '2026-02-19 08:26:37'),
(5, 'Student', 'Can take exams', '2026-02-16 05:27:19', '2026-02-16 05:27:19');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `studentId` varchar(50) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `enrollmentYear` int(11) DEFAULT NULL,
  `currentSemester` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `userId`, `studentId`, `classId`, `departmentId`, `enrollmentYear`, `currentSemester`, `isActive`, `createdAt`, `updatedAt`) VALUES
(5, 23, 'STU001', 2, 2, 2024, 1, 1, '2026-02-19 09:02:54', '2026-02-19 09:02:54'),
(6, 24, 'STU002', 3, 2, 2023, 3, 1, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(7, 25, 'STU003', 5, 3, 2024, 1, 1, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(8, 26, 'STU004', 6, 3, 2023, 3, 1, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(9, 27, 'STU005', 8, 4, 2024, 1, 1, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(10, 28, 'STU006', 9, 4, 2023, 3, 1, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(11, 29, 'STU007', 11, 5, 2024, 1, 1, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(12, 30, 'STU008', 12, 5, 2023, 3, 1, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(13, 31, 'STU009', 14, 6, 2024, 1, 1, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(14, 32, 'STU010', 15, 6, 2023, 3, 1, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(15, 33, 'STU011', 4, 2, 2022, 5, 1, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(16, 34, 'STU012', 7, 3, 2022, 5, 1, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(17, 35, 'STU013', 10, 4, 2022, 5, 1, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(18, 36, 'STU014', 13, 5, 2022, 5, 1, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(19, 37, 'STU015', 16, 6, 2023, 4, 1, '2026-02-19 09:02:58', '2026-02-19 09:02:58');

-- --------------------------------------------------------

--
-- Table structure for table `student_answers`
--

CREATE TABLE `student_answers` (
  `id` int(11) NOT NULL,
  `submissionId` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `studentAnswer` text DEFAULT NULL,
  `isCorrect` tinyint(1) DEFAULT NULL,
  `marksObtained` decimal(10,2) DEFAULT NULL,
  `answeredAt` datetime DEFAULT NULL,
  `lastModifiedAt` datetime DEFAULT NULL,
  `isReviewed` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_exam_enrollments`
--

CREATE TABLE `student_exam_enrollments` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `examId` int(11) NOT NULL,
  `enrollmentStatus` enum('Active','Completed','Cancelled','Pending') DEFAULT 'Active',
  `enrolledAt` datetime DEFAULT current_timestamp(),
  `startedAt` datetime DEFAULT NULL,
  `completedAt` datetime DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `phone`, `isActive`, `lastLogin`, `createdAt`, `updatedAt`) VALUES
(1, 'Super', 'Admin', 'superadmin@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-ADMIN', 1, '2026-03-01 05:43:03', '2026-02-16 05:27:19', '2026-03-01 05:43:03'),
(2, 'John', 'Admin', 'admin@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0001', 1, '2026-02-19 09:07:14', '2026-02-16 05:27:19', '2026-02-19 09:07:14'),
(3, 'Jane', 'Examiner', 'examiner@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0002', 1, '2026-03-01 05:42:47', '2026-02-16 05:27:19', '2026-03-01 05:42:47'),
(4, 'Alice', 'Proctor', 'proctor@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0003', 1, NULL, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(5, 'Bob', 'Student', 'student1@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0004', 1, '2026-02-19 09:52:07', '2026-02-16 05:27:19', '2026-02-19 09:52:07'),
(6, 'Carol', 'Student', 'student2@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0005', 1, NULL, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(7, 'David', 'Student', 'student3@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0006', 1, NULL, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(8, 'Vaishnavi', 'M', 'vaishu@gmail.com', '$2a$10$/NA9NZlX8Trb762VLzS4au7xRzwUll78M2Tj9nflvrsWtrshKNdLe', '7975819768', 1, NULL, '2026-02-16 05:37:49', '2026-02-16 05:37:49'),
(9, 'Soujanay', 'Navi', 'soujanya@gmail.com', '$2a$10$2lX/GOR1YoGpjR9d0Vl1Ee4x5ebqiGGoTK2W936PSJGVdj7qEHDP2', '2346786436', 1, NULL, '2026-02-16 05:38:31', '2026-02-16 05:38:31'),
(10, 'Soujanay', 'Navi', 'soujanya1@gmail.com', '$2a$10$Sugy30bfc4E3xtx6Upn07.qLMlgqnWodxFN6dulqUBscu26g0gU9.', '2346786436', 1, NULL, '2026-02-16 05:38:51', '2026-02-16 05:38:51'),
(11, 'Soujanay', 'Navi', 'soujanya31@gmail.com', '$2a$10$2EHt9giafuwnK6p/0lHDu.0eCtwxcpbnlb2dQYBq9EpXGVMFXKxBe', '2346786436', 1, NULL, '2026-02-16 05:41:43', '2026-02-16 05:41:43'),
(13, 'Ravi', 'Kumar', 'ravi.kumar@college.com', '$2a$10$H.U4f5ieKmkbWuq2whPbTe65043mrG/RpgJVrnzZhvLahcSgMys7q', '9876543210', 1, NULL, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(14, 'Sneha', 'Patil', 'sneha.patil@college.com', '$2a$10$XTmiWcgzg0k4eSU1GkiueuVD8iHZWKUub7L4h/NGDMRSuLe.94JfW', '9876543211', 1, NULL, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(15, 'Arjun', 'Reddy', 'arjun.reddy@college.com', '$2a$10$6Na0AGjCDagcbpYS9C8qTONqx3bb39uVjYuIADwQeAA.gf/zOLRk6', '9876543212', 1, NULL, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(16, 'Meera', 'Sharma', 'meera.sharma@college.com', '$2a$10$N7iLwef9WbbFtMUXuefuJO989MuQ28VGOF2pLfGVrntBzOiTfzUUO', '9876543213', 1, NULL, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(17, 'Vikram', 'Singh', 'vikram.singh@college.com', '$2a$10$1S45GH2rmrpy1e.WXA2HEO97RSVCROUHryQ9c0JhKC1H4MvfTvCoa', '9876543214', 1, NULL, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(18, 'Pooja', 'Desai', 'pooja.desai@college.com', '$2a$10$O14rO8kl86xKDL3had75teWN7Ffal7ZfmHUgss3ilC9uKlVwXjdb.', '9876543215', 1, NULL, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(19, 'Karan', 'Joshi', 'karan.joshi@college.com', '$2a$10$o2oO83l3ZiNgICk4rZjlruDiW5Wm6j/8PrgySVCyM4ldu/TS8EEmO', '9876543216', 1, NULL, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(20, 'Neha', 'Kulkarni', 'neha.kulkarni@college.com', '$2a$10$dxjMuigqvptr99yOpJxHU.Pr4G1ZPEt0iE8v.ErCg10Mq9SsJJnPe', '9876543217', 1, NULL, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(21, 'Rohit', 'Gupta', 'rohit.gupta@college.com', '$2a$10$zgN4m1oELn6U/l7kKDEa1exT72RR4ogv6RGFHKwTMuHOI6vNohOCK', '9876543218', 1, NULL, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(22, 'Anjali', 'Nair', 'anjali.nair@college.com', '$2a$10$lH.GnlFwE1XahAsmEf.zjuMHDmDUEV1flVcQHvrak0uEFZb4eQ15m', '9876543219', 1, NULL, '2026-02-19 08:57:00', '2026-02-19 08:57:00'),
(23, 'Rahul', 'Patil', 'rahul.patil@student.com', '$2a$10$4bT4tafp2ADvN3zxNkvqw.jwDgThUX/A3ETEGVugVlRHLgB3Cdt96', '9000000001', 1, NULL, '2026-02-19 09:02:54', '2026-02-19 09:02:54'),
(24, 'Priya', 'Sharma', 'priya.sharma@student.com', '$2a$10$rPsB7mLiYdvRDdEW9KmJj.4FcZmfS.aRJd1x/9TXz53esw0NTsrkO', '9000000002', 1, NULL, '2026-02-19 09:02:54', '2026-02-19 09:02:54'),
(25, 'Amit', 'Verma', 'amit.verma@student.com', '$2a$10$qCzjVD1Af2y2X0HIBzhg7ud4yvwCNWqjfEaIhZQqvBmei.mOO3pm2', '9000000003', 1, NULL, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(26, 'Sneha', 'Reddy', 'sneha.reddy@student.com', '$2a$10$UV/MErmUGDJQX8Xy7zK0i.4Q61zspIRVXvYgMhYb65zbnqfOFQ8cC', '9000000004', 1, NULL, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(27, 'Kiran', 'Naik', 'kiran.naik@student.com', '$2a$10$cxaEDBkHFEB8rJrxLyePe.Ypk0W3NEerPkanSmnXcDTXP8pqVlW1G', '9000000005', 1, NULL, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(28, 'Pooja', 'Kulkarni', 'pooja.kulkarni@student.com', '$2a$10$4N8sXH9o.sXNUK0iANP2fewP/1bGGynv9ZFju6e9EglqNPb7U4kN2', '9000000006', 1, NULL, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(29, 'Arjun', 'Rao', 'arjun.rao@student.com', '$2a$10$1EYZXCDmEeaEAVaj.8Ut9OoCBRB0whyPIy9F3Q18BwLY0.78WJdPm', '9000000007', 1, NULL, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(30, 'Neha', 'Desai', 'neha.desai@student.com', '$2a$10$7SIhXD7d6g3V.OmTqoHhtO4iqBna3m3ljwOi8Afg6c0cRk1rhYZVS', '9000000008', 1, NULL, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(31, 'Rohit', 'Mehta', 'rohit.mehta@student.com', '$2a$10$vG5fThJ5toriuOuuSKSYwey5WGEqUptijquKOE.1aFaACVOfrE65S', '9000000009', 1, NULL, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(32, 'Anjali', 'Singh', 'anjali.singh@student.com', '$2a$10$Mnr3Eic3WvDK3.3vUaUirOv1OilDc5QMrPBSEfLDC8MJGmB0vX7aW', '9000000010', 1, NULL, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(33, 'Vivek', 'Joshi', 'vivek.joshi@student.com', '$2a$10$qKW/h6A7mHlKGsgaH93I/Oek/6BNq4ybM1tjj147IAKECHHr/anq2', '9000000011', 1, NULL, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(34, 'Kavya', 'Iyer', 'kavya.iyer@student.com', '$2a$10$kYqJPAgeUQXemaHi64X2bOatklPMrB5s01EegxnvRnsW.OyOZO8bK', '9000000012', 1, NULL, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(35, 'Manish', 'Gupta', 'manish.gupta@student.com', '$2a$10$h6WsCOmPt8AtolcI0o2eGu0hSJPOzYOkki4VQcWa0MryiAyNOa7u.', '9000000013', 1, NULL, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(36, 'Shreya', 'Nair', 'shreya.nair@student.com', '$2a$10$WJPxj7inbW6g8JtnAtzHielXdeCc0jMRcCOV5mdQUu/QqhG4isnba', '9000000014', 1, NULL, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(37, 'Akash', 'Kulkarni', 'akash.kulkarni@student.com', '$2a$10$cJrIZUFqgRyy.6W9dgwPi.b4E3BnmzTl/FFbGfdrt.eulz0tQpYdO', '9000000015', 1, NULL, '2026-02-19 09:02:57', '2026-02-19 09:02:57');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `userId`, `roleId`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(2, 2, 2, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(3, 3, 3, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(4, 4, 4, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(5, 5, 5, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(6, 6, 5, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(7, 7, 5, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(8, 8, 3, '2026-02-16 05:37:49', '2026-02-16 05:37:49'),
(9, 9, 5, '2026-02-16 05:38:31', '2026-02-16 05:38:31'),
(10, 10, 5, '2026-02-16 05:38:51', '2026-02-16 05:38:51'),
(11, 11, 5, '2026-02-16 05:41:43', '2026-02-16 05:41:43'),
(13, 13, 3, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(14, 14, 3, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(15, 15, 3, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(16, 16, 3, '2026-02-19 08:56:58', '2026-02-19 08:56:58'),
(17, 17, 3, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(18, 18, 3, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(19, 19, 3, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(20, 20, 3, '2026-02-19 08:56:59', '2026-02-19 08:56:59'),
(21, 21, 3, '2026-02-19 08:57:00', '2026-02-19 08:57:00'),
(22, 22, 3, '2026-02-19 08:57:00', '2026-02-19 08:57:00'),
(23, 23, 5, '2026-02-19 09:02:54', '2026-02-19 09:02:54'),
(24, 24, 5, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(25, 25, 5, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(26, 26, 5, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(27, 27, 5, '2026-02-19 09:02:55', '2026-02-19 09:02:55'),
(28, 28, 5, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(29, 29, 5, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(30, 30, 5, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(31, 31, 5, '2026-02-19 09:02:56', '2026-02-19 09:02:56'),
(32, 32, 5, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(33, 33, 5, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(34, 34, 5, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(35, 35, 5, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(36, 36, 5, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(37, 37, 5, '2026-02-19 09:02:58', '2026-02-19 09:02:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `departmentId` (`departmentId`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `departmentId` (`departmentId`);

--
-- Indexes for table `course_lecturers`
--
ALTER TABLE `course_lecturers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_lecturers_lecturerId_courseId_unique` (`courseId`,`lecturerId`),
  ADD KEY `lecturerId` (`lecturerId`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_createdBy` (`createdBy`),
  ADD KEY `courseId` (`courseId`);

--
-- Indexes for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_exam_question` (`examId`,`questionId`),
  ADD KEY `questionId` (`questionId`);

--
-- Indexes for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluatedBy` (`evaluatedBy`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_examId` (`examId`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `lecturers`
--
ALTER TABLE `lecturers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD UNIQUE KEY `employeeId` (`employeeId`),
  ADD KEY `departmentId` (`departmentId`);

--
-- Indexes for table `proctoring_logs`
--
ALTER TABLE `proctoring_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `idx_eventType` (`eventType`),
  ADD KEY `idx_severity` (`severity`),
  ADD KEY `idx_timestamp` (`timestamp`),
  ADD KEY `idx_submissionId` (`submissionId`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_questionType` (`questionType`),
  ADD KEY `idx_difficulty` (`difficulty`),
  ADD KEY `fk_questions_courseId` (`courseId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD UNIQUE KEY `studentId` (`studentId`),
  ADD KEY `classId` (`classId`),
  ADD KEY `departmentId` (`departmentId`);

--
-- Indexes for table `student_answers`
--
ALTER TABLE `student_answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_submission_question` (`submissionId`,`questionId`),
  ADD KEY `questionId` (`questionId`);

--
-- Indexes for table `student_exam_enrollments`
--
ALTER TABLE `student_exam_enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_exam` (`userId`,`examId`),
  ADD KEY `examId` (`examId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_isActive` (`isActive`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_role` (`userId`,`roleId`),
  ADD KEY `roleId` (`roleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `course_lecturers`
--
ALTER TABLE `course_lecturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lecturers`
--
ALTER TABLE `lecturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `proctoring_logs`
--
ALTER TABLE `proctoring_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `student_answers`
--
ALTER TABLE `student_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_exam_enrollments`
--
ALTER TABLE `student_exam_enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course_lecturers`
--
ALTER TABLE `course_lecturers`
  ADD CONSTRAINT `course_lecturers_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_lecturers_ibfk_2` FOREIGN KEY (`lecturerId`) REFERENCES `lecturers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exams_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD CONSTRAINT `exam_questions_ibfk_1` FOREIGN KEY (`examId`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exam_questions_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  ADD CONSTRAINT `exam_submissions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exam_submissions_ibfk_2` FOREIGN KEY (`examId`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exam_submissions_ibfk_3` FOREIGN KEY (`evaluatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `lecturers`
--
ALTER TABLE `lecturers`
  ADD CONSTRAINT `lecturers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lecturers_ibfk_2` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `proctoring_logs`
--
ALTER TABLE `proctoring_logs`
  ADD CONSTRAINT `proctoring_logs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proctoring_logs_ibfk_2` FOREIGN KEY (`submissionId`) REFERENCES `exam_submissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_questions_courseId` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_3` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_answers`
--
ALTER TABLE `student_answers`
  ADD CONSTRAINT `student_answers_ibfk_1` FOREIGN KEY (`submissionId`) REFERENCES `exam_submissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_answers_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_exam_enrollments`
--
ALTER TABLE `student_exam_enrollments`
  ADD CONSTRAINT `student_exam_enrollments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_exam_enrollments_ibfk_2` FOREIGN KEY (`examId`) REFERENCES `exams` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
