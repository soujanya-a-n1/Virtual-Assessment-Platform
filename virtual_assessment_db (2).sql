-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2026 at 03:25 PM
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
(8, 'MECH First Year - A', 'MECH1A', 4, '2024-2025', '7', 1, '2026-02-19 08:51:21', '2026-03-03 14:18:54'),
(9, 'MECH Second Year - A', 'MECH2A', 4, '2024-2025', '3', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(10, 'MECH Third Year - A', 'MECH3A', 4, '2024-2025', '5', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(11, 'CIVIL First Year - A', 'CIVIL1A', 5, '2024-2025', '1', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(12, 'CIVIL Second Year - A', 'CIVIL2A', 5, '2024-2025', '3', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(13, 'CIVIL Third Year - A', 'CIVIL3A', 5, '2024-2025', '5', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(14, 'MBA First Year - A', 'MBA1A', 6, '2024-2025', '6', 1, '2026-02-19 08:51:21', '2026-03-03 14:19:04'),
(15, 'MBA Second Year - A', 'MBA2A', 6, '2024-2025', '3', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21'),
(16, 'MBA Second Year - B', 'MBA2B', 6, '2024-2025', '4', 1, '2026-02-19 08:51:21', '2026-02-19 08:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `coding_questions`
--

CREATE TABLE `coding_questions` (
  `id` int(11) NOT NULL,
  `examId` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `inputFormat` text DEFAULT NULL,
  `outputFormat` text DEFAULT NULL,
  `sampleInput` text DEFAULT NULL,
  `sampleOutput` text DEFAULT NULL,
  `difficulty` enum('Easy','Medium','Hard') DEFAULT 'Medium',
  `marks` decimal(5,2) DEFAULT 10.00,
  `timeLimit` int(11) DEFAULT 30,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coding_submissions`
--

CREATE TABLE `coding_submissions` (
  `id` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `codingQuestionId` int(11) NOT NULL,
  `submissionId` int(11) DEFAULT NULL,
  `language` enum('C','C++','Java','C#','Node.js','Python','JavaScript') NOT NULL,
  `code` text NOT NULL,
  `submissionTime` datetime DEFAULT NULL,
  `executionTime` decimal(10,2) DEFAULT NULL,
  `status` enum('Submitted','Running','Passed','Failed','Error') DEFAULT 'Submitted',
  `output` text DEFAULT NULL,
  `error` text DEFAULT NULL,
  `compilationError` text DEFAULT NULL,
  `marksObtained` decimal(5,2) DEFAULT 0.00,
  `totalTestCases` int(11) DEFAULT 0,
  `passedTestCases` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 4, 11, '2026-02-19', 1, '2026-02-19 09:23:10', '2026-02-19 09:23:10'),
(2, 5, 8, '2026-03-03', 1, '2026-03-03 14:17:17', '2026-03-03 14:17:17'),
(3, 8, 10, '2026-03-03', 1, '2026-03-03 14:17:27', '2026-03-03 14:17:27'),
(4, 8, 9, '2026-03-03', 1, '2026-03-03 14:17:27', '2026-03-03 14:17:27'),
(5, 3, 2, '2026-03-03', 1, '2026-03-03 14:17:34', '2026-03-03 14:17:34'),
(6, 6, 3, '2026-03-03', 1, '2026-03-03 14:17:49', '2026-03-03 14:17:49'),
(7, 6, 4, '2026-03-03', 1, '2026-03-03 14:17:49', '2026-03-03 14:17:49'),
(8, 11, 8, '2026-03-03', 1, '2026-03-03 14:17:56', '2026-03-03 14:17:56'),
(9, 2, 9, '2026-03-03', 1, '2026-03-03 14:18:04', '2026-03-03 14:18:04'),
(10, 2, 7, '2026-03-03', 1, '2026-03-03 14:18:04', '2026-03-03 14:18:04'),
(11, 10, 5, '2026-03-03', 1, '2026-03-03 14:18:11', '2026-03-03 14:18:11'),
(12, 7, 6, '2026-03-03', 1, '2026-03-03 14:18:19', '2026-03-03 14:18:19'),
(13, 7, 5, '2026-03-03', 1, '2026-03-03 14:18:19', '2026-03-03 14:18:19'),
(14, 9, 4, '2026-03-03', 1, '2026-03-03 14:18:29', '2026-03-03 14:18:29'),
(15, 9, 5, '2026-03-03', 1, '2026-03-03 14:18:29', '2026-03-03 14:18:29');

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
(7, 'C Programming Mid Exam', 'Mid-semester exam covering C basics, loops, arrays, and functions.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-05-09 16:30:00', '2026-05-09 17:30:00', 1, 0, 0, 0.00, 1, 2, '2026-02-19 10:10:29', '2026-03-06 09:03:17'),
(8, 'OOP Internal Assessment', 'Exam covering OOP concepts and Java fundamentals.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-05-11 16:30:00', '2026-05-11 17:30:00', 1, 0, 0, 0.00, 1, 3, '2026-02-19 10:10:29', '2026-03-06 09:03:54'),
(9, 'Data Structures Mid Exam', 'Exam on stacks, queues, linked lists, and trees.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-05-14 11:00:00', '2026-05-14 11:30:00', 1, 0, 0, 0.00, 1, 4, '2026-02-19 10:10:29', '2026-03-06 09:04:18'),
(10, 'DBMS Internal Test', 'SQL queries, normalization, and ER diagrams.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-05-17 05:30:00', '2026-05-17 06:00:00', 1, 0, 0, 0.00, 1, 5, '2026-02-19 10:10:29', '2026-03-06 09:03:38'),
(11, 'Operating Systems Test', 'Process scheduling and memory management concepts.', 50, 24, 60.00, 20.00, 'Online', 'Published', '2026-03-19 00:00:00', '2026-03-19 01:00:00', 1, 1, 0, 0.00, 1, 6, '2026-02-19 10:10:30', '2026-03-06 10:25:02'),
(12, 'Digital Electronics Exam', 'Logic gates, flip-flops, and number systems.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-03-21 06:00:00', '2026-03-21 06:30:00', 1, 0, 0, 0.00, 1, 7, '2026-02-19 10:10:30', '2026-03-06 09:05:57'),
(13, 'Microprocessors Test', 'Microprocessor architecture and programming.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-03-23 23:30:00', '2026-03-24 00:00:00', 1, 0, 0, 0.00, 1, 8, '2026-02-19 10:10:30', '2026-03-06 09:06:08'),
(14, 'Engineering Mechanics Exam', 'Force systems and equilibrium problems.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-03-26 12:00:00', '2026-03-26 12:30:00', 1, 0, 0, 0.00, 1, 9, '2026-02-19 10:10:30', '2026-03-06 09:05:23'),
(15, 'Structural Analysis Test', 'Beam analysis and structural calculations.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-03-28 16:30:00', '2026-03-28 17:30:00', 1, 0, 0, 0.00, 1, 10, '2026-02-19 10:10:30', '2026-03-06 09:05:08'),
(16, 'Principles of Management Exam', 'Management theories and organizational behavior.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-04-01 16:30:00', '2026-04-01 17:30:00', 1, 0, 0, 0.00, 1, 11, '2026-02-19 10:10:30', '2026-03-06 09:04:55');

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
(36, 9, 56, 15, '2026-03-01 07:09:19', '2026-03-01 07:09:19'),
(37, 10, 57, 1, '2026-03-03 08:41:45', '2026-03-03 08:41:45'),
(38, 10, 58, 2, '2026-03-03 08:42:32', '2026-03-03 08:42:32'),
(39, 10, 59, 3, '2026-03-03 08:43:44', '2026-03-03 08:43:44'),
(40, 10, 60, 4, '2026-03-03 08:44:20', '2026-03-03 08:44:20'),
(41, 10, 61, 5, '2026-03-03 08:45:06', '2026-03-03 08:45:06'),
(42, 10, 62, 6, '2026-03-03 08:46:18', '2026-03-03 08:46:18'),
(43, 10, 63, 7, '2026-03-03 08:47:30', '2026-03-03 08:47:30'),
(44, 10, 64, 8, '2026-03-03 08:48:36', '2026-03-03 08:48:36'),
(45, 10, 65, 9, '2026-03-03 08:49:21', '2026-03-03 08:49:21'),
(46, 10, 66, 10, '2026-03-03 08:50:11', '2026-03-03 08:50:11'),
(47, 12, 67, 1, '2026-03-03 12:45:51', '2026-03-03 12:45:51'),
(48, 12, 68, 2, '2026-03-03 12:46:42', '2026-03-03 12:46:42'),
(49, 12, 69, 3, '2026-03-03 12:47:41', '2026-03-03 12:47:41'),
(50, 12, 70, 4, '2026-03-03 12:48:57', '2026-03-03 12:48:57'),
(51, 12, 71, 5, '2026-03-03 12:49:46', '2026-03-03 12:49:46'),
(52, 12, 72, 6, '2026-03-03 12:51:59', '2026-03-03 12:51:59'),
(53, 12, 73, 7, '2026-03-03 12:53:00', '2026-03-03 12:53:00'),
(54, 12, 74, 8, '2026-03-03 12:54:02', '2026-03-03 12:54:02'),
(55, 12, 75, 9, '2026-03-03 12:55:21', '2026-03-03 12:55:21'),
(56, 12, 76, 10, '2026-03-03 12:58:00', '2026-03-03 12:58:00'),
(57, 12, 77, 11, '2026-03-03 12:58:57', '2026-03-03 12:58:57'),
(58, 12, 78, 12, '2026-03-03 13:00:22', '2026-03-03 13:00:22'),
(59, 12, 79, 13, '2026-03-03 13:01:57', '2026-03-03 13:01:57'),
(60, 12, 80, 14, '2026-03-03 13:10:41', '2026-03-03 13:10:41'),
(61, 12, 81, 15, '2026-03-03 13:11:37', '2026-03-03 13:11:37'),
(62, 12, 82, 16, '2026-03-03 13:12:59', '2026-03-03 13:12:59'),
(63, 12, 83, 17, '2026-03-03 13:15:17', '2026-03-03 13:15:17'),
(64, 12, 84, 18, '2026-03-03 13:16:06', '2026-03-03 13:16:06'),
(65, 12, 85, 19, '2026-03-03 13:17:19', '2026-03-03 13:17:19'),
(66, 12, 86, 20, '2026-03-03 13:18:48', '2026-03-03 13:18:48'),
(67, 14, 87, 1, '2026-03-03 13:23:20', '2026-03-03 13:23:20'),
(68, 14, 88, 2, '2026-03-03 13:24:42', '2026-03-03 13:24:42'),
(69, 14, 89, 3, '2026-03-03 13:26:06', '2026-03-03 13:26:06'),
(70, 14, 90, 4, '2026-03-03 13:27:18', '2026-03-03 13:27:18'),
(71, 14, 91, 5, '2026-03-03 13:29:51', '2026-03-03 13:29:51'),
(72, 14, 92, 6, '2026-03-03 13:31:00', '2026-03-03 13:31:00'),
(73, 14, 93, 7, '2026-03-03 13:31:59', '2026-03-03 13:31:59'),
(74, 14, 94, 8, '2026-03-03 13:33:04', '2026-03-03 13:33:04'),
(75, 14, 95, 9, '2026-03-03 13:34:14', '2026-03-03 13:34:14'),
(76, 14, 96, 10, '2026-03-03 13:35:06', '2026-03-03 13:35:06'),
(77, 14, 97, 11, '2026-03-03 13:36:25', '2026-03-03 13:36:25'),
(78, 14, 98, 12, '2026-03-03 13:37:45', '2026-03-03 13:37:45'),
(79, 14, 99, 13, '2026-03-03 13:38:48', '2026-03-03 13:38:48'),
(80, 14, 100, 14, '2026-03-03 13:43:00', '2026-03-03 13:43:00'),
(81, 14, 101, 15, '2026-03-03 13:44:01', '2026-03-03 13:44:01'),
(82, 14, 102, 16, '2026-03-03 13:44:43', '2026-03-03 13:44:43'),
(83, 14, 103, 17, '2026-03-03 13:45:29', '2026-03-03 13:45:29'),
(84, 14, 104, 18, '2026-03-03 13:46:16', '2026-03-03 13:46:16'),
(85, 14, 105, 19, '2026-03-03 13:46:58', '2026-03-03 13:46:58'),
(86, 14, 106, 20, '2026-03-03 13:47:36', '2026-03-03 13:47:36'),
(87, 13, 107, 1, '2026-03-03 13:52:41', '2026-03-03 13:52:41'),
(88, 13, 108, 2, '2026-03-03 13:54:00', '2026-03-03 13:54:00'),
(89, 13, 109, 3, '2026-03-03 13:55:08', '2026-03-03 13:55:08'),
(90, 13, 110, 4, '2026-03-03 13:56:44', '2026-03-03 13:56:44'),
(91, 13, 111, 5, '2026-03-03 14:01:08', '2026-03-03 14:01:08'),
(92, 13, 112, 6, '2026-03-03 14:02:14', '2026-03-03 14:02:14'),
(93, 13, 113, 7, '2026-03-03 14:03:16', '2026-03-03 14:03:16'),
(94, 13, 114, 8, '2026-03-03 14:04:15', '2026-03-03 14:04:15'),
(95, 13, 115, 9, '2026-03-03 14:05:48', '2026-03-03 14:05:48'),
(96, 13, 116, 10, '2026-03-03 14:06:40', '2026-03-03 14:06:40'),
(97, 13, 117, 11, '2026-03-03 14:07:42', '2026-03-03 14:07:42'),
(98, 13, 118, 12, '2026-03-03 14:08:52', '2026-03-03 14:08:52'),
(99, 13, 119, 13, '2026-03-03 14:09:52', '2026-03-03 14:09:52'),
(100, 13, 120, 14, '2026-03-03 14:10:46', '2026-03-03 14:10:46'),
(101, 13, 121, 15, '2026-03-03 14:11:54', '2026-03-03 14:11:54'),
(102, 13, 122, 16, '2026-03-03 14:12:46', '2026-03-03 14:12:46'),
(103, 13, 123, 17, '2026-03-03 14:13:47', '2026-03-03 14:13:47'),
(104, 13, 124, 18, '2026-03-03 14:14:43', '2026-03-03 14:14:43'),
(105, 13, 125, 19, '2026-03-03 14:15:25', '2026-03-03 14:15:25'),
(106, 13, 126, 20, '2026-03-03 14:16:13', '2026-03-03 14:16:13'),
(107, 8, 127, 1, '2026-03-04 07:40:32', '2026-03-04 07:40:32'),
(108, 8, 128, 2, '2026-03-04 07:43:05', '2026-03-04 07:43:05'),
(109, 8, 129, 3, '2026-03-04 07:45:04', '2026-03-04 07:45:04'),
(110, 8, 130, 4, '2026-03-04 07:45:50', '2026-03-04 07:45:50'),
(111, 8, 131, 5, '2026-03-04 07:46:55', '2026-03-04 07:46:55'),
(112, 8, 132, 6, '2026-03-04 07:47:36', '2026-03-04 07:47:36'),
(113, 8, 133, 7, '2026-03-04 07:48:27', '2026-03-04 07:48:27'),
(114, 8, 134, 8, '2026-03-04 07:50:18', '2026-03-04 07:50:18'),
(115, 8, 135, 9, '2026-03-04 07:51:30', '2026-03-04 07:51:30'),
(116, 8, 136, 10, '2026-03-04 07:53:05', '2026-03-04 07:53:05'),
(117, 8, 137, 11, '2026-03-04 07:54:08', '2026-03-04 07:54:08'),
(118, 8, 138, 12, '2026-03-04 07:55:04', '2026-03-04 07:55:04'),
(119, 8, 139, 13, '2026-03-04 07:56:00', '2026-03-04 07:56:00'),
(120, 8, 140, 14, '2026-03-04 07:57:29', '2026-03-04 07:57:29'),
(121, 8, 141, 15, '2026-03-04 07:59:47', '2026-03-04 07:59:47'),
(122, 8, 142, 16, '2026-03-04 08:01:26', '2026-03-04 08:01:26'),
(123, 8, 143, 17, '2026-03-04 08:04:49', '2026-03-04 08:04:49'),
(124, 8, 144, 18, '2026-03-04 08:05:37', '2026-03-04 08:05:37'),
(125, 8, 145, 19, '2026-03-04 08:06:24', '2026-03-04 08:06:24'),
(126, 8, 146, 20, '2026-03-04 08:07:31', '2026-03-04 08:07:31'),
(127, 11, 147, 1, '2026-03-04 08:39:44', '2026-03-04 08:39:44'),
(128, 11, 148, 2, '2026-03-04 08:40:37', '2026-03-04 08:40:37'),
(129, 11, 149, 3, '2026-03-04 08:41:39', '2026-03-04 08:41:39'),
(130, 11, 150, 4, '2026-03-04 08:42:37', '2026-03-04 08:42:37'),
(131, 11, 151, 5, '2026-03-04 08:43:22', '2026-03-04 08:43:22'),
(132, 11, 152, 6, '2026-03-04 08:44:26', '2026-03-04 08:44:26'),
(133, 11, 153, 7, '2026-03-04 08:45:31', '2026-03-04 08:45:31'),
(134, 11, 154, 8, '2026-03-04 08:46:32', '2026-03-04 08:46:32'),
(135, 11, 155, 9, '2026-03-04 08:47:46', '2026-03-04 08:47:46'),
(136, 11, 156, 10, '2026-03-04 08:48:45', '2026-03-04 08:48:45'),
(137, 11, 157, 11, '2026-03-04 08:49:24', '2026-03-04 08:49:24'),
(138, 11, 158, 12, '2026-03-04 08:50:07', '2026-03-04 08:50:07'),
(139, 11, 159, 13, '2026-03-04 08:51:00', '2026-03-04 08:51:00'),
(140, 11, 160, 14, '2026-03-04 08:51:54', '2026-03-04 08:51:54'),
(141, 11, 161, 15, '2026-03-04 08:52:46', '2026-03-04 08:52:46'),
(142, 11, 162, 16, '2026-03-04 08:53:29', '2026-03-04 08:53:29'),
(143, 11, 163, 17, '2026-03-04 08:54:15', '2026-03-04 08:54:15'),
(144, 11, 164, 18, '2026-03-04 08:55:19', '2026-03-04 08:55:19'),
(145, 11, 165, 19, '2026-03-04 08:57:40', '2026-03-04 08:57:40'),
(146, 11, 166, 20, '2026-03-04 08:58:27', '2026-03-04 08:58:27'),
(147, 16, 167, 1, '2026-03-04 12:49:42', '2026-03-04 12:49:42'),
(148, 16, 168, 2, '2026-03-04 12:50:22', '2026-03-04 12:50:22'),
(149, 16, 169, 3, '2026-03-04 12:51:10', '2026-03-04 12:51:10'),
(150, 16, 170, 4, '2026-03-04 12:51:46', '2026-03-04 12:51:46'),
(151, 16, 171, 5, '2026-03-04 12:52:45', '2026-03-04 12:52:45'),
(152, 7, 172, 1, '2026-03-04 12:55:19', '2026-03-04 12:55:19'),
(153, 7, 173, 2, '2026-03-04 12:56:17', '2026-03-04 12:56:17'),
(154, 7, 174, 3, '2026-03-04 12:56:56', '2026-03-04 12:56:56'),
(155, 7, 175, 4, '2026-03-04 12:57:46', '2026-03-04 12:57:46'),
(156, 7, 176, 5, '2026-03-04 12:58:30', '2026-03-04 12:58:30'),
(157, 15, 177, 1, '2026-03-04 12:59:31', '2026-03-04 12:59:31'),
(158, 15, 178, 2, '2026-03-04 13:00:11', '2026-03-04 13:00:11'),
(159, 15, 179, 3, '2026-03-04 13:01:08', '2026-03-04 13:01:08'),
(160, 15, 180, 4, '2026-03-04 13:01:57', '2026-03-04 13:01:57'),
(161, 16, 181, 6, '2026-03-04 13:05:38', '2026-03-04 13:05:38'),
(162, 16, 182, 7, '2026-03-04 13:06:28', '2026-03-04 13:06:28'),
(163, 16, 183, 8, '2026-03-04 13:07:12', '2026-03-04 13:07:12'),
(164, 16, 184, 9, '2026-03-04 13:08:05', '2026-03-04 13:08:05'),
(165, 16, 185, 10, '2026-03-04 13:15:23', '2026-03-04 13:15:23'),
(166, 16, 186, 11, '2026-03-04 13:16:12', '2026-03-04 13:16:12'),
(167, 16, 187, 12, '2026-03-04 13:18:09', '2026-03-04 13:18:09'),
(168, 16, 188, 13, '2026-03-04 13:19:23', '2026-03-04 13:19:23'),
(169, 16, 189, 14, '2026-03-04 13:20:26', '2026-03-04 13:20:26'),
(170, 16, 190, 15, '2026-03-04 13:21:20', '2026-03-04 13:21:20'),
(171, 16, 191, 16, '2026-03-04 13:22:24', '2026-03-04 13:22:24'),
(172, 16, 192, 17, '2026-03-04 13:23:20', '2026-03-04 13:23:20'),
(173, 16, 193, 18, '2026-03-04 13:24:29', '2026-03-04 13:24:29'),
(174, 16, 194, 19, '2026-03-04 13:25:28', '2026-03-04 13:25:28'),
(175, 16, 195, 20, '2026-03-04 13:26:22', '2026-03-04 13:26:22'),
(176, 7, 196, 6, '2026-03-04 13:29:33', '2026-03-04 13:29:33'),
(177, 7, 197, 7, '2026-03-04 13:30:29', '2026-03-04 13:30:29'),
(178, 7, 198, 8, '2026-03-04 13:31:24', '2026-03-04 13:31:24'),
(179, 7, 199, 9, '2026-03-04 13:32:45', '2026-03-04 13:32:45'),
(180, 7, 200, 10, '2026-03-04 13:36:16', '2026-03-04 13:36:16'),
(181, 7, 201, 11, '2026-03-04 13:37:22', '2026-03-04 13:37:22'),
(182, 7, 202, 12, '2026-03-04 13:38:27', '2026-03-04 13:38:27'),
(183, 7, 203, 13, '2026-03-04 13:39:47', '2026-03-04 13:39:47'),
(184, 7, 204, 14, '2026-03-04 13:40:53', '2026-03-04 13:40:53'),
(185, 7, 205, 15, '2026-03-04 13:42:09', '2026-03-04 13:42:09'),
(186, 7, 206, 16, '2026-03-04 13:43:16', '2026-03-04 13:43:16'),
(187, 7, 207, 17, '2026-03-04 13:45:17', '2026-03-04 13:45:17'),
(188, 7, 208, 18, '2026-03-04 13:47:13', '2026-03-04 13:47:13'),
(189, 7, 209, 19, '2026-03-04 13:48:49', '2026-03-04 13:48:49'),
(190, 7, 210, 20, '2026-03-04 13:55:28', '2026-03-04 13:55:28'),
(191, 15, 211, 5, '2026-03-04 14:04:23', '2026-03-04 14:04:23'),
(192, 15, 212, 6, '2026-03-04 14:05:41', '2026-03-04 14:05:41'),
(193, 15, 213, 7, '2026-03-04 14:07:11', '2026-03-04 14:07:11'),
(194, 15, 214, 8, '2026-03-04 14:08:15', '2026-03-04 14:08:15'),
(195, 15, 215, 9, '2026-03-04 14:09:37', '2026-03-04 14:09:37'),
(196, 15, 216, 10, '2026-03-04 14:12:03', '2026-03-04 14:12:03'),
(197, 15, 217, 11, '2026-03-04 14:12:38', '2026-03-04 14:12:38'),
(198, 15, 218, 12, '2026-03-04 14:13:34', '2026-03-04 14:13:34'),
(199, 15, 219, 13, '2026-03-04 14:14:08', '2026-03-04 14:14:08'),
(200, 15, 220, 14, '2026-03-04 14:16:14', '2026-03-04 14:16:14'),
(201, 15, 221, 15, '2026-03-04 14:17:24', '2026-03-04 14:17:24'),
(202, 15, 222, 16, '2026-03-04 14:19:17', '2026-03-04 14:19:17'),
(203, 15, 223, 17, '2026-03-04 14:20:27', '2026-03-04 14:20:27'),
(204, 15, 224, 18, '2026-03-04 14:21:40', '2026-03-04 14:21:40'),
(205, 15, 225, 19, '2026-03-04 14:22:47', '2026-03-04 14:22:47'),
(206, 15, 226, 20, '2026-03-04 14:23:56', '2026-03-04 14:23:56'),
(208, 9, 228, 16, '2026-03-06 05:40:42', '2026-03-06 05:40:42'),
(209, 9, 229, 17, '2026-03-06 05:42:02', '2026-03-06 05:42:02'),
(210, 9, 230, 18, '2026-03-06 05:43:20', '2026-03-06 05:43:20'),
(211, 9, 231, 19, '2026-03-06 05:44:24', '2026-03-06 05:44:24'),
(212, 9, 232, 20, '2026-03-06 05:45:30', '2026-03-06 05:45:30'),
(213, 9, 233, 21, '2026-03-06 05:57:48', '2026-03-06 05:57:48'),
(214, 9, 234, 22, '2026-03-06 05:58:36', '2026-03-06 05:58:36'),
(215, 9, 235, 23, '2026-03-06 06:01:48', '2026-03-06 06:01:48'),
(216, 9, 236, 24, '2026-03-06 06:04:44', '2026-03-06 06:04:44'),
(217, 10, 237, 11, '2026-03-06 07:30:34', '2026-03-06 07:30:34'),
(218, 10, 238, 12, '2026-03-06 07:32:08', '2026-03-06 07:32:08'),
(219, 10, 239, 13, '2026-03-06 07:34:45', '2026-03-06 07:34:45'),
(220, 10, 240, 14, '2026-03-06 07:37:16', '2026-03-06 07:37:16'),
(221, 10, 241, 15, '2026-03-06 07:38:42', '2026-03-06 07:38:42'),
(222, 10, 242, 16, '2026-03-06 07:40:01', '2026-03-06 07:40:01'),
(223, 10, 243, 17, '2026-03-06 07:41:21', '2026-03-06 07:41:21'),
(224, 10, 244, 18, '2026-03-06 07:45:44', '2026-03-06 07:45:44'),
(225, 10, 245, 19, '2026-03-06 07:47:18', '2026-03-06 07:47:18'),
(226, 10, 246, 20, '2026-03-06 07:48:50', '2026-03-06 07:48:50'),
(227, 10, 247, 21, '2026-03-06 07:51:36', '2026-03-06 07:51:36'),
(228, 10, 248, 22, '2026-03-06 07:52:07', '2026-03-06 07:52:07'),
(229, 10, 249, 23, '2026-03-06 07:53:51', '2026-03-06 07:53:51'),
(230, 10, 250, 24, '2026-03-06 07:54:37', '2026-03-06 07:54:37'),
(231, 12, 251, 21, '2026-03-06 07:56:34', '2026-03-06 07:56:34'),
(232, 12, 252, 22, '2026-03-06 07:57:10', '2026-03-06 07:57:10'),
(233, 12, 253, 23, '2026-03-06 07:58:30', '2026-03-06 07:58:30'),
(234, 12, 254, 24, '2026-03-06 07:59:25', '2026-03-06 07:59:25'),
(235, 14, 255, 21, '2026-03-06 08:09:37', '2026-03-06 08:09:37'),
(236, 14, 256, 22, '2026-03-06 08:10:08', '2026-03-06 08:10:08'),
(237, 14, 257, 23, '2026-03-06 08:10:44', '2026-03-06 08:10:44'),
(238, 14, 258, 24, '2026-03-06 08:11:18', '2026-03-06 08:11:18'),
(239, 13, 259, 21, '2026-03-06 08:12:34', '2026-03-06 08:12:34'),
(240, 13, 260, 22, '2026-03-06 08:13:00', '2026-03-06 08:13:00'),
(241, 13, 261, 23, '2026-03-06 08:14:00', '2026-03-06 08:14:00'),
(242, 13, 262, 24, '2026-03-06 08:14:36', '2026-03-06 08:14:36'),
(243, 8, 263, 21, '2026-03-06 08:16:05', '2026-03-06 08:16:05'),
(244, 8, 264, 22, '2026-03-06 08:16:35', '2026-03-06 08:16:35'),
(245, 8, 265, 23, '2026-03-06 08:17:08', '2026-03-06 08:17:08'),
(246, 8, 266, 24, '2026-03-06 08:18:27', '2026-03-06 08:18:27'),
(247, 11, 267, 21, '2026-03-06 08:20:10', '2026-03-06 08:20:10'),
(248, 11, 268, 22, '2026-03-06 08:20:41', '2026-03-06 08:20:41'),
(249, 11, 269, 23, '2026-03-06 08:21:21', '2026-03-06 08:21:21'),
(250, 11, 270, 24, '2026-03-06 08:21:53', '2026-03-06 08:21:53'),
(251, 16, 271, 21, '2026-03-06 08:23:09', '2026-03-06 08:23:09'),
(252, 16, 272, 22, '2026-03-06 08:24:13', '2026-03-06 08:24:13'),
(253, 16, 273, 23, '2026-03-06 08:24:51', '2026-03-06 08:24:51'),
(254, 16, 274, 24, '2026-03-06 08:25:25', '2026-03-06 08:25:25'),
(255, 7, 275, 21, '2026-03-06 08:26:36', '2026-03-06 08:26:36'),
(256, 7, 276, 22, '2026-03-06 08:26:58', '2026-03-06 08:26:58'),
(257, 7, 277, 23, '2026-03-06 08:27:44', '2026-03-06 08:27:44'),
(258, 7, 278, 24, '2026-03-06 08:28:06', '2026-03-06 08:28:06'),
(259, 15, 279, 21, '2026-03-06 08:29:07', '2026-03-06 08:29:07'),
(260, 15, 280, 22, '2026-03-06 08:29:35', '2026-03-06 08:29:35'),
(261, 15, 281, 23, '2026-03-06 08:30:23', '2026-03-06 08:30:23'),
(262, 15, 282, 24, '2026-03-06 08:30:46', '2026-03-06 08:30:46');

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

--
-- Dumping data for table `exam_submissions`
--

INSERT INTO `exam_submissions` (`id`, `userId`, `examId`, `submitTime`, `totalTimeSpent`, `status`, `startedAt`, `obtainedMarks`, `evaluatedBy`, `evaluationNotes`, `evaluatedAt`, `isPassed`, `autoSubmitted`, `cheatingDetected`, `cheatingDetails`, `createdAt`, `updatedAt`) VALUES
(9, 39, 9, '2026-03-03 10:19:25', 79, 'Evaluated', '2026-03-03 10:18:06', 24.00, NULL, NULL, NULL, 1, 0, 0, NULL, '2026-03-03 10:18:06', '2026-03-06 10:09:42'),
(12, 5, 7, '2026-03-06 09:12:26', 269, 'Evaluated', '2026-03-06 09:07:57', 36.00, NULL, NULL, NULL, 1, 0, 0, NULL, '2026-03-06 09:07:57', '2026-03-06 10:09:42'),
(16, 41, 9, '2026-03-06 15:03:08', 507, 'Evaluated', '2026-03-06 14:54:41', 26.00, NULL, NULL, NULL, 1, 0, 0, NULL, '2026-03-06 14:54:41', '2026-03-07 01:04:04'),
(20, 5, 10, '2026-03-06 16:47:03', 46, 'Evaluated', '2026-03-06 16:46:17', 18.00, NULL, NULL, NULL, 0, 0, 0, NULL, '2026-03-06 16:46:17', '2026-03-07 01:04:04'),
(21, 5, 9, NULL, NULL, 'In Progress', '2026-03-07 01:14:47', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, '2026-03-07 01:14:47', '2026-03-07 01:14:47'),
(22, 5, 9, '2026-03-07 01:16:53', 126, 'Evaluated', '2026-03-07 01:14:47', 28.00, NULL, NULL, NULL, 1, 0, 0, NULL, '2026-03-07 01:14:47', '2026-03-07 01:16:53'),
(23, 5, 10, '2026-03-09 14:32:24', 149, 'Evaluated', '2026-03-09 14:29:55', 40.00, NULL, NULL, NULL, 1, 0, 0, NULL, '2026-03-09 14:29:55', '2026-03-09 14:32:24'),
(24, 5, 10, NULL, NULL, 'In Progress', '2026-03-09 14:29:55', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, '2026-03-09 14:29:55', '2026-03-09 14:29:55'),
(25, 42, 11, NULL, NULL, 'In Progress', '2026-03-10 06:43:41', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, '2026-03-10 06:43:41', '2026-03-10 06:43:41'),
(26, 42, 11, '2026-03-10 06:46:27', 166, 'Evaluated', '2026-03-10 06:43:41', 36.00, NULL, NULL, NULL, 1, 0, 0, NULL, '2026-03-10 06:43:41', '2026-03-10 06:46:27');

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
(42, 'Which Data Structure follows LIFO?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Queue', 'Stack', 'Array', 'Tree', 'B', NULL, NULL, NULL, '2026-03-01 06:50:34', '2026-03-03 08:53:54'),
(43, 'Time complexity of Binary Search?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'O(n)', 'O(logn)', 'O(n2)', 'O(1)', 'B', NULL, NULL, NULL, '2026-03-01 06:52:17', '2026-03-03 08:54:03'),
(44, 'Queue follows which principle?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'LIFO', 'FIFO', 'FILO', 'Random', 'B', NULL, NULL, NULL, '2026-03-01 06:53:44', '2026-03-03 08:54:12'),
(45, 'Maximum children in binary tree node', 'Multiple Choice', 2.00, 'Medium', '', 4, '1', '3', 'unlimited', '2', 'D', NULL, NULL, NULL, '2026-03-01 06:54:40', '2026-03-03 08:54:22'),
(46, 'Inorder traversal order?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Root-Left-Right', 'Left-Right-Root', 'Left-Root-Right', 'Right-Left-Root', 'C', NULL, NULL, NULL, '2026-03-01 06:56:30', '2026-03-03 08:54:32'),
(47, 'Stack overflow occurs when?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Empty', 'Full', 'Sorted', 'Reversed', 'B', NULL, NULL, NULL, '2026-03-01 06:57:26', '2026-03-03 08:54:44'),
(48, 'Merge sort technique?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Greedy', 'Divede &Conquer', 'Dynamic', 'Backtracking', 'B', NULL, NULL, NULL, '2026-03-01 06:59:02', '2026-03-03 08:54:59'),
(49, 'AVL tree is?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Heap', 'Graph', 'Self-balancing BST', 'Queue', 'D', NULL, NULL, NULL, '2026-03-01 07:00:35', '2026-03-03 08:55:09'),
(50, 'BFS uses ?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Stack', 'Queue', 'Tree', 'Array', 'B', NULL, NULL, NULL, '2026-03-01 07:01:40', '2026-03-03 08:55:17'),
(51, 'DFS uses?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Stack', 'Queue', 'Heap', 'Graph', 'A', NULL, NULL, NULL, '2026-03-01 07:03:57', '2026-03-03 08:55:26'),
(52, 'Linked List stores data in?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Continuous memory', 'Non-Continuous memory', 'Stack', 'Cache', 'B', NULL, NULL, NULL, '2026-03-01 07:05:23', '2026-03-03 08:55:35'),
(53, 'Best case Quick sort?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'o(n2)', 'O(nlogn)', 'O(n)', 'O(logn)', 'B', NULL, NULL, NULL, '2026-03-01 07:06:30', '2026-03-03 08:55:51'),
(54, 'Hashing used in?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Stack', 'Queue', 'Hash Table', 'Tree', 'C', NULL, NULL, NULL, '2026-03-01 07:07:14', '2026-03-03 08:56:03'),
(55, 'Heap used for?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Searching', 'Heap Sort', 'Printing', 'Memory', 'B', NULL, NULL, NULL, '2026-03-01 07:08:04', '2026-03-03 08:56:17'),
(56, 'prefix evaluation uses?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Stack', 'Queue', 'Array', 'Graph', 'A', NULL, NULL, NULL, '2026-03-01 07:09:19', '2026-03-03 08:56:26'),
(57, 'SQL stands for ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Simple Query Language', 'Structure Query Language', 'System Query Language', 'None of the above', 'B', NULL, NULL, NULL, '2026-03-03 08:41:45', '2026-03-03 08:41:45'),
(58, 'Primary Key is ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Duplicate', 'Unique & not null', 'Optional', 'Foreign', 'B', NULL, NULL, NULL, '2026-03-03 08:42:31', '2026-03-03 08:46:41'),
(59, '3NF removes ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Partial dependency', 'Transitive Dependency', 'Redundancy', 'Keys', 'B', NULL, NULL, NULL, '2026-03-03 08:43:44', '2026-03-03 08:43:44'),
(60, 'ACID Ensures ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Security', 'Speed', 'Reliability', 'Storage', 'C', NULL, NULL, NULL, '2026-03-03 08:44:20', '2026-03-03 08:44:20'),
(61, 'DDL command ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'INSERT', 'SELECT', 'CREATE', 'UPDATE', 'C', NULL, NULL, NULL, '2026-03-03 08:45:05', '2026-03-03 08:45:05'),
(62, 'Foreign Key References ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'View', 'Index', 'Trigger', 'Primary Kay', 'D', NULL, NULL, NULL, '2026-03-03 08:46:18', '2026-03-03 08:46:18'),
(63, 'Normalization Reduces ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Speed', 'Redudancy', 'Index', 'Query', 'B', NULL, NULL, NULL, '2026-03-03 08:47:30', '2026-03-03 08:47:30'),
(64, 'COMMIT does ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Roll bcak', 'Delete', 'Save Transaction', 'Stop', 'C', NULL, NULL, NULL, '2026-03-03 08:48:36', '2026-03-03 08:48:36'),
(65, 'View is ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Real Table', 'Virtual table', 'Index', 'Key', 'B', NULL, NULL, NULL, '2026-03-03 08:49:21', '2026-03-03 08:49:21'),
(66, 'Deadlock means ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Crash', 'Infinite waiting', 'Backup', 'Speed', 'B', NULL, NULL, NULL, '2026-03-03 08:50:11', '2026-03-03 08:50:11'),
(67, 'NAND gate is Known as ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Basic gate', 'Universal gate', 'Exclusive gate', 'Buffer', 'B', NULL, NULL, NULL, '2026-03-03 12:45:51', '2026-03-03 13:19:20'),
(68, 'Binary number system base is ?', 'Multiple Choice', 2.00, 'Medium', '', 7, '2', '8', '10', '16', 'A', NULL, NULL, NULL, '2026-03-03 12:46:42', '2026-03-03 12:46:56'),
(69, 'Full adder has how many inputs ?', 'Multiple Choice', 2.00, 'Hard', '', 7, '2', '3', '4', '5', 'B', NULL, NULL, NULL, '2026-03-03 12:47:41', '2026-03-03 13:19:08'),
(70, 'Flip-flop stores ?', 'Multiple Choice', 2.00, 'Medium', '', 7, '2 bits', '4 bits', '1 bits', '8 bits', 'C', NULL, NULL, NULL, '2026-03-03 12:48:57', '2026-03-03 12:48:57'),
(71, 'XOR outputs 1 when inputs are ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Same', 'Different', '0', '1', 'B', NULL, NULL, NULL, '2026-03-03 12:49:46', '2026-03-03 13:19:36'),
(72, 'Decimal 10 in binary ?', 'Multiple Choice', 2.00, 'Hard', '', 7, '1001', '1010', '1110', '1100', 'B', NULL, NULL, NULL, '2026-03-03 12:51:59', '2026-03-03 12:51:59'),
(73, 'NOR gate is ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Univarsal gate', 'Memory', 'Encoder', 'Decoder', 'A', NULL, NULL, NULL, '2026-03-03 12:53:00', '2026-03-03 13:19:46'),
(74, 'K-map is used for ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'Storage', 'Simplification', 'Addition', 'Conversion', 'B', NULL, NULL, NULL, '2026-03-03 12:54:02', '2026-03-03 12:55:49'),
(75, 'AND gate output is 1 when ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'Any input 1', 'All input 1', 'All inputs 0', 'Any input 0', 'B', NULL, NULL, NULL, '2026-03-03 12:55:21', '2026-03-03 12:55:58'),
(76, 'Truth table shows ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Code', 'Output combinations', 'Memory', 'Storage', 'B', NULL, NULL, NULL, '2026-03-03 12:58:00', '2026-03-03 13:20:01'),
(77, 'Multiplexer selects ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'One inputs', 'Two inputs', 'All inputs', 'None', 'A', NULL, NULL, NULL, '2026-03-03 12:58:57', '2026-03-03 12:59:10'),
(78, 'Decoder converts ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Binary to decimal', 'Decimal to binary', 'Analog to digital', 'Digital to analog', 'A', NULL, NULL, NULL, '2026-03-03 13:00:22', '2026-03-03 13:20:12'),
(79, 'SR flip-flop invalid state ?', 'Multiple Choice', 2.00, 'Medium', '', 7, '00', '01', '10', '11', 'D', NULL, NULL, NULL, '2026-03-03 13:01:57', '2026-03-03 13:01:57'),
(80, 'BCS Stands for ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Binary Code Decimal', 'Binary Coded Decimal', 'Bit Code Decimal', 'Base Code Decimal', 'B', NULL, NULL, NULL, '2026-03-03 13:10:41', '2026-03-03 13:10:41'),
(81, 'Not gate output of 1 ?', 'Multiple Choice', 2.00, 'Hard', '', 7, '1', '0', '2', 'Undefined', 'B', NULL, NULL, NULL, '2026-03-03 13:11:37', '2026-03-03 13:11:37'),
(82, 'Half adder produces ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'Sum & Carry', 'Sum Only', 'Carry Only', 'None', 'A', NULL, NULL, NULL, '2026-03-03 13:12:59', '2026-03-03 13:12:59'),
(83, 'Encoder converts ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Many input to fewer outputs ', 'few to many', 'Analog to analog ', 'Digital to analog', 'A', NULL, NULL, NULL, '2026-03-03 13:15:17', '2026-03-03 13:20:28'),
(84, 'Combinational Circuit depends on ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'Past output', 'Current input ', 'Memory ', 'Clock', 'B', NULL, NULL, NULL, '2026-03-03 13:16:06', '2026-03-03 13:16:06'),
(85, 'Flip-flop triggered by ?', 'Multiple Choice', 2.00, 'Hard', '', 7, 'Voltage', 'Clock pulse', 'Heat', 'Current', 'B', NULL, NULL, NULL, '2026-03-03 13:17:19', '2026-03-03 13:17:19'),
(86, 'Sequential circuit use ?', 'Multiple Choice', 2.00, 'Hard', '', 7, 'Resistor', 'Capacity', 'Memory', 'Transformer', 'C', NULL, NULL, NULL, '2026-03-03 13:18:48', '2026-03-03 13:18:48'),
(87, 'SI unit of force ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Joule', 'Watt', 'Newton', 'Pascal', 'C', NULL, NULL, NULL, '2026-03-03 13:23:20', '2026-03-03 13:23:20'),
(88, 'force is ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Scalar', 'Vector', 'Energy', 'Speed', 'B', NULL, NULL, NULL, '2026-03-03 13:24:42', '2026-03-03 13:24:42'),
(89, 'Newton\'s Second Law ?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'F = ma', 'F = mv', 'E = mc2', 'W = fd', 'A', NULL, NULL, NULL, '2026-03-03 13:26:06', '2026-03-03 13:26:06'),
(90, 'Work ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'F/d', 'F * d', 'm*a', 'd/t', 'B', NULL, NULL, NULL, '2026-03-03 13:27:18', '2026-03-03 13:27:18'),
(91, 'Acceleration due to gravity ?', 'Multiple Choice', 2.00, 'Hard', '', 9, '9.8 m/s2', '8 m/s2', '10 m/s2', '12 m/s2', 'A', NULL, NULL, NULL, '2026-03-03 13:29:51', '2026-03-03 13:29:51'),
(92, 'Torgue is ?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Linear force', 'Rotational force', 'Energy ', 'Speed', 'B', NULL, NULL, NULL, '2026-03-03 13:31:00', '2026-03-03 13:31:00'),
(93, 'Unit of stress ?', 'Multiple Choice', 2.00, 'Hard', '', 9, 'Newton', 'N/m2', 'Joule', 'Watt', 'B', NULL, NULL, NULL, '2026-03-03 13:31:59', '2026-03-03 13:31:59'),
(94, 'Equilibrium means ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Motion', 'Balanced force', 'Speed', 'Friction', 'B', NULL, NULL, NULL, '2026-03-03 13:33:04', '2026-03-03 13:33:04'),
(95, 'Resultant force is ?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Difference', 'Product', 'Sum of forces', 'Division', 'C', NULL, NULL, NULL, '2026-03-03 13:34:14', '2026-03-03 13:34:14'),
(96, 'Inertia resists change in ?', 'Multiple Choice', 2.00, 'Hard', '', 9, 'Speed', 'Motion', 'Weight', 'Gravity', 'B', NULL, NULL, NULL, '2026-03-03 13:35:06', '2026-03-03 13:35:06'),
(97, 'Vector has ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Magnitude only', 'Direction only', 'Magnitude & Direction', 'None', 'C', NULL, NULL, NULL, '2026-03-03 13:36:25', '2026-03-03 13:36:25'),
(98, 'Static friction acts when ?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Moving', 'Falling', 'At rest', 'Accelerating', 'C', NULL, NULL, NULL, '2026-03-03 13:37:45', '2026-03-03 13:37:45'),
(99, 'Free body diagram shows ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Energy', 'Forces', 'Speed', 'Mass', 'B', NULL, NULL, NULL, '2026-03-03 13:38:48', '2026-03-03 13:38:48'),
(100, 'Beam supports?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Load ', 'Speed', 'Time', 'Energy', 'A', NULL, NULL, NULL, '2026-03-03 13:43:00', '2026-03-03 13:43:00'),
(101, 'Moment formula?', 'Multiple Choice', 2.00, 'Hard', '', 9, ' m × a', 'P × t', ' F × d', 'V × I', 'C', NULL, NULL, NULL, '2026-03-03 13:44:01', '2026-03-03 13:44:01'),
(102, 'Power unit?', 'Multiple Choice', 2.00, 'Hard', '', 9, 'Watt ', 'Newton', 'Joule', 'Pascal', 'A', NULL, NULL, NULL, '2026-03-03 13:44:43', '2026-03-03 13:44:43'),
(103, 'Centroid relates to?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Speed', 'Volume', 'Area ', 'Weight', 'C', NULL, NULL, NULL, '2026-03-03 13:45:29', '2026-03-03 13:45:29'),
(104, 'Shear force acts?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Parallel', 'Random', 'Circular', 'Perpendicular ', 'D', NULL, NULL, NULL, '2026-03-03 13:46:16', '2026-03-03 13:47:55'),
(105, 'First law of motion is law of?', 'Multiple Choice', 2.00, 'Hard', '', 9, 'Action', 'Reaction', 'Inertia ', 'Motion', 'C', NULL, NULL, NULL, '2026-03-03 13:46:58', '2026-03-03 13:46:58'),
(106, 'Friction opposes?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Gravity', 'Motion ', 'Speed', 'Force', 'B', NULL, NULL, NULL, '2026-03-03 13:47:36', '2026-03-03 13:47:36'),
(107, '8086 is?', 'Multiple Choice', 2.00, 'Easy', '', 8, '8-bit', '16-bit', '32-bit', '64-bit', 'B', NULL, NULL, NULL, '2026-03-03 13:52:41', '2026-03-03 13:52:41'),
(108, 'ALU performs?', 'Multiple Choice', 2.00, 'Medium', '', 8, 'Storage', 'Input', 'Arithmetic & Logic', 'Output', 'C', NULL, NULL, NULL, '2026-03-03 13:54:00', '2026-03-03 13:54:00'),
(109, 'Program Counter stores?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Data', 'Output', 'Address of next instruction', 'Flag', 'C', NULL, NULL, NULL, '2026-03-03 13:55:08', '2026-03-03 13:55:08'),
(110, 'RAM is?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Permanent', 'ROM', 'Cache', 'Temporary memory', 'D', NULL, NULL, NULL, '2026-03-03 13:56:44', '2026-03-03 13:56:44'),
(111, 'ROM stands for?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Read Only Memory', ' Random Only Memory', 'Run Only Memory', 'Rapid Memory', 'A', NULL, NULL, NULL, '2026-03-03 14:01:08', '2026-03-03 14:01:08'),
(112, 'Stack works on?', 'Multiple Choice', 2.00, 'Medium', '', 8, 'FIFO', 'None', 'Random', 'LIFO', 'D', NULL, NULL, NULL, '2026-03-03 14:02:14', '2026-03-03 14:02:14'),
(113, 'Flag register stores?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Data', 'Address', 'Code', 'Status flags ', 'D', NULL, NULL, NULL, '2026-03-03 14:03:16', '2026-03-03 14:03:16'),
(114, 'Interrupt is?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Memory', 'Bus', 'Program', 'Signal to CPU', 'D', NULL, NULL, NULL, '2026-03-03 14:04:15', '2026-03-03 14:04:15'),
(115, 'Microcontroller includes?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'CPU only', 'CPU + Memory + I/O', 'RAM only', 'ALU only', 'B', NULL, NULL, NULL, '2026-03-03 14:05:48', '2026-03-03 14:05:48'),
(116, 'Address bus carries?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Data', 'Address ', 'Control', 'Power', 'B', NULL, NULL, NULL, '2026-03-03 14:06:40', '2026-03-03 14:06:40'),
(117, 'Data bus carries?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Address', 'Control', 'Data ', 'Voltage', 'C', NULL, NULL, NULL, '2026-03-03 14:07:42', '2026-03-03 14:07:42'),
(118, 'Control bus carries?', 'Multiple Choice', 2.00, 'Medium', '', 8, 'Data', 'Control signals', 'Address', 'Power', 'B', NULL, NULL, NULL, '2026-03-03 14:08:52', '2026-03-03 14:08:52'),
(119, 'Instruction cycle includes?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Fetch', 'Decode', 'Execute', 'All of these', 'D', NULL, NULL, NULL, '2026-03-03 14:09:52', '2026-03-03 14:09:52'),
(120, 'Accumulator used for?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Arithmetic operations', 'Output', 'Storage', 'Input', 'A', NULL, NULL, NULL, '2026-03-03 14:10:46', '2026-03-03 14:10:46'),
(121, '8086 has how many bits data bus?', 'Multiple Choice', 2.00, 'Easy', '', 8, '8', '16 ', '64', '32', 'B', NULL, NULL, NULL, '2026-03-03 14:11:54', '2026-03-03 14:11:54'),
(122, 'Clock controls?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Speed of processor', 'Memory size', 'Power', 'Heat', 'A', NULL, NULL, NULL, '2026-03-03 14:12:46', '2026-03-03 14:12:46'),
(123, 'Segment register used for?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Memory segmentation', 'Input', 'Output', 'None', 'A', NULL, NULL, NULL, '2026-03-03 14:13:47', '2026-03-03 14:13:47'),
(124, 'Stack pointer stores?', 'Multiple Choice', 2.00, 'Medium', '', 8, 'Data', 'Flag', 'Top of stack address', 'Output', 'C', NULL, NULL, NULL, '2026-03-03 14:14:43', '2026-03-03 14:14:43'),
(125, 'Interrupt can be?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Hardware', 'Software', 'Both ', 'None', 'C', NULL, NULL, NULL, '2026-03-03 14:15:25', '2026-03-03 14:15:25'),
(126, 'Microprocessor is?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Single chip CPU ', 'Memory', 'Bus', 'Register', 'A', NULL, NULL, NULL, '2026-03-03 14:16:13', '2026-03-03 14:16:13'),
(127, 'OOP stands for?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Object Organized Programming', 'Only Object Programming', 'Object Oriented Programming', 'Open Object Programming', 'C', NULL, NULL, NULL, '2026-03-04 07:40:32', '2026-03-04 07:40:32'),
(128, 'Encapsulation means?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'Data sharing', 'Data hiding', 'Data deleting', 'Data copying', 'B', NULL, NULL, NULL, '2026-03-04 07:43:05', '2026-03-04 07:43:05'),
(129, 'Polymorphism means?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'One form', 'No form', 'Many forms', 'Hidden form', 'C', NULL, NULL, NULL, '2026-03-04 07:45:04', '2026-03-04 07:45:04'),
(130, 'Inheritance provides?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'Deletion', 'Hiding', 'Code reusability', 'Stopping execution', 'C', NULL, NULL, NULL, '2026-03-04 07:45:50', '2026-03-04 07:45:50'),
(131, 'Constructor is used to?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'Destroy object', 'Initialize object', 'Hide data', 'Delete class', 'B', NULL, NULL, NULL, '2026-03-04 07:46:55', '2026-03-04 07:46:55'),
(132, 'Which keyword creates object in Java?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'class', 'object', 'new ', 'create', 'C', NULL, NULL, NULL, '2026-03-04 07:47:36', '2026-03-04 07:47:36'),
(133, 'Method overloading is?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Runtime polymorphism', 'Compile-time polymorphism', 'Abstraction', 'Inheritance', 'B', NULL, NULL, NULL, '2026-03-04 07:48:27', '2026-03-04 07:48:27'),
(134, 'Abstraction hides?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Data', 'Implementation details', 'Variables', 'Objects', 'B', NULL, NULL, NULL, '2026-03-04 07:50:18', '2026-03-04 07:50:18'),
(135, 'Interface supports?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Single inheritance', 'Multiple inheritance', 'No inheritance', 'Hybrid', 'B', NULL, NULL, NULL, '2026-03-04 07:51:30', '2026-03-04 07:51:30'),
(136, 'super keyword refers to?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Object', 'Child class', 'Parent class', 'Method', 'C', NULL, NULL, NULL, '2026-03-04 07:53:05', '2026-03-04 07:53:05'),
(137, 'This keyword refers to?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Parent', 'Current object', 'Interface', 'Package', 'B', NULL, NULL, NULL, '2026-03-04 07:54:08', '2026-03-04 07:54:08'),
(138, 'Class is?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Object', 'Method', 'Blueprint of object ', 'Variable', 'C', NULL, NULL, NULL, '2026-03-04 07:55:04', '2026-03-04 07:55:04'),
(139, 'Object is?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Variable', 'Instance of class', 'Method', 'Package', 'B', NULL, NULL, NULL, '2026-03-04 07:56:00', '2026-03-04 07:56:00'),
(140, 'Private access modifier means?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Accessible only within class', 'Public access', 'Protected', 'Global', 'A', NULL, NULL, NULL, '2026-03-04 07:57:29', '2026-03-04 07:57:29'),
(141, 'Destructor is used to?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Create object', 'Destroy object', 'Hide method', 'Override', 'B', NULL, NULL, NULL, '2026-03-04 07:59:47', '2026-03-04 07:59:47'),
(142, 'Inheritance types in Java?', 'Multiple Choice', 2.00, 'Hard', '', 3, ' Multiple (class)', 'Multilevel ', 'Circular', 'None', 'B', NULL, NULL, NULL, '2026-03-04 08:01:26', '2026-03-04 08:01:26'),
(143, 'Encapsulation improves?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'Speed', 'Security ', 'Memory', 'Execution', 'B', NULL, NULL, NULL, '2026-03-04 08:04:49', '2026-03-04 08:04:49'),
(144, 'Abstract class contains?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Only concrete methods', 'Abstract methods', 'Variables only', 'Main method', 'B', NULL, NULL, NULL, '2026-03-04 08:05:37', '2026-03-04 08:05:37'),
(145, 'Getter and Setter used for?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Looping', 'Accessing private data', 'Sorting', 'Printing', 'B', NULL, NULL, NULL, '2026-03-04 08:06:24', '2026-03-04 08:06:24'),
(146, 'Method overriding is?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Compile-time', 'Constructor', 'Interface', 'Runtime polymorphism', 'D', NULL, NULL, NULL, '2026-03-04 08:07:31', '2026-03-04 08:09:06'),
(147, 'OS acts as?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Compiler', 'Interface between user & hardware', 'Browser', 'Editor', 'B', NULL, NULL, NULL, '2026-03-04 08:39:44', '2026-03-04 08:39:44'),
(148, 'SJF stands for?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'Simple Job First', 'System Job First', 'Small Job First', 'Shortest Job First', 'D', NULL, NULL, NULL, '2026-03-04 08:40:37', '2026-03-04 08:40:37'),
(149, 'Deadlock means?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Crash', 'Infinite waiting', 'Speed', 'Halt', 'B', NULL, NULL, NULL, '2026-03-04 08:41:39', '2026-03-04 08:41:39'),
(150, 'Paging avoids?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'External fragmentation', 'Both internal & external fragmentation partially', 'Memory', 'CPU', 'B', NULL, NULL, NULL, '2026-03-04 08:42:37', '2026-03-04 08:42:37'),
(151, 'FIFO scheduling is?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'First In First Out', 'Fast In Fast Out', 'File In File Out', 'None', 'A', NULL, NULL, NULL, '2026-03-04 08:43:22', '2026-03-04 08:43:22'),
(152, 'Semaphore used for?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Scheduling', 'Process synchronization ', 'Memory', 'Storage', 'B', NULL, NULL, NULL, '2026-03-04 08:44:26', '2026-03-04 08:44:26'),
(153, 'Process is?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Program in disk', 'Thread', 'Program in execution', 'File', 'C', NULL, NULL, NULL, '2026-03-04 08:45:31', '2026-03-04 08:45:31'),
(154, 'Thread is?', 'Multiple Choice', 2.00, 'Medium', '', 6, 'Heavyweight', 'File', 'CPU', 'Lightweight process', 'D', NULL, NULL, NULL, '2026-03-04 08:46:32', '2026-03-04 08:46:32'),
(155, 'Context switching means?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Memory delete', 'Shutdown', 'Switching CPU between processe', 'Boot', 'C', NULL, NULL, NULL, '2026-03-04 08:47:46', '2026-03-04 08:47:46'),
(156, 'Virtual memory uses?', 'Multiple Choice', 2.00, 'Medium', '', 6, ' RAM only', 'Disk as extension of RAM', 'ROM', 'Cache', 'B', NULL, NULL, NULL, '2026-03-04 08:48:45', '2026-03-04 08:48:45'),
(157, 'Banker\'s algorithm used for?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'Scheduling', 'Memory', 'Deadlock avoidance', 'Storage', 'C', NULL, NULL, NULL, '2026-03-04 08:49:24', '2026-03-04 08:49:24'),
(158, 'CPU scheduling decides?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Memory', 'Which process runs next', 'File', 'Disk', 'B', NULL, NULL, NULL, '2026-03-04 08:50:07', '2026-03-04 08:50:07'),
(159, 'Kernel is?', 'Multiple Choice', 2.00, 'Medium', '', 6, 'Application', 'Hardware', ' Core of OS', 'Driver', 'C', NULL, NULL, NULL, '2026-03-04 08:51:00', '2026-03-04 08:51:00'),
(160, 'Round Robin uses?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'Priority', 'Time quantum', 'FIFO', 'None', 'B', NULL, NULL, NULL, '2026-03-04 08:51:54', '2026-03-04 08:51:54'),
(161, 'Starvation occurs due to?', 'Multiple Choice', 2.00, 'Medium', '', 6, 'Deadlock', 'Paging', 'Low priority process waiting long', 'Boot', 'C', NULL, NULL, NULL, '2026-03-04 08:52:46', '2026-03-04 08:52:46'),
(162, 'Interrupt is?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'File', 'Signal to CPU ', 'Memory', 'Cache', 'B', NULL, NULL, NULL, '2026-03-04 08:53:28', '2026-03-04 08:53:28'),
(163, 'File system manages?', 'Multiple Choice', 2.00, 'Medium', '', 6, 'CPU', 'Files & directories', 'RAM', 'Printer', 'B', NULL, NULL, NULL, '2026-03-04 08:54:15', '2026-03-04 08:54:15'),
(164, 'Multitasking means?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Single task', 'No task', 'Multiple tasks simultaneously ', 'Manual task', 'C', NULL, NULL, NULL, '2026-03-04 08:55:19', '2026-03-04 08:55:19'),
(165, 'Swapping transfers process between?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'CPU & Cache', 'RAM & Disk', 'ROM & RAM', 'Disk & Printer', 'B', NULL, NULL, NULL, '2026-03-04 08:57:40', '2026-03-04 08:57:40'),
(166, 'Deadlock requires?', 'Multiple Choice', 2.00, 'Hard', '', 6, '2 conditions', ' 3 conditions', '4 conditions', '5 conditions', 'C', NULL, NULL, NULL, '2026-03-04 08:58:27', '2026-03-04 08:58:27'),
(167, 'Father of Scientific Management?', 'Multiple Choice', 2.00, 'Easy', '', 11, 'Fayol', 'F.W. Taylor ', 'Drucker', 'Weber', 'B', NULL, NULL, NULL, '2026-03-04 12:49:42', '2026-03-04 12:49:42'),
(168, 'First function of management?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'Organizing', 'Controlling', 'Planning ', 'Staffing', 'C', NULL, NULL, NULL, '2026-03-04 12:50:22', '2026-03-04 12:50:22'),
(169, 'SWOT stands for?', 'Multiple Choice', 2.00, 'Easy', '', 11, 'Strength Weakness Opportunity Threat', 'System Work Operation Tool', 'Strategy Work Output Target', 'None', 'A', NULL, NULL, NULL, '2026-03-04 12:51:10', '2026-03-04 12:51:10'),
(170, 'Leadership is?', 'Multiple Choice', 2.00, 'Hard', '', 11, 'Controlling', 'Influencing people', 'Accounting', 'Planning', 'B', NULL, NULL, NULL, '2026-03-04 12:51:46', '2026-03-04 12:51:46'),
(171, 'Delegation means?', 'Multiple Choice', 2.00, 'Hard', '', 11, 'Removing power', 'Stopping work', 'Assigning authority & responsibility', 'Hiring', 'C', NULL, NULL, NULL, '2026-03-04 12:52:45', '2026-03-04 12:52:45'),
(172, 'C developed by?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'James Gosling', 'Dennis Ritchie', 'Guido', 'Bjarne', 'B', NULL, NULL, NULL, '2026-03-04 12:55:19', '2026-03-04 12:55:19'),
(173, 'Header file for printf?', 'Multiple Choice', 2.00, 'Medium', '', 2, 'math.h', 'conio.h', 'string.h', ' stdio.h', 'D', NULL, NULL, NULL, '2026-03-04 12:56:17', '2026-03-04 12:56:17'),
(174, 'main() is?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'Variable', 'Entry point of program', 'Loop', 'Array', 'B', NULL, NULL, NULL, '2026-03-04 12:56:56', '2026-03-04 12:56:56'),
(175, 'sizeof(int) typically?', 'Multiple Choice', 2.00, 'Medium', '', 2, '1', '2', '4 (system dependent)', '8', 'C', NULL, NULL, NULL, '2026-03-04 12:57:46', '2026-03-04 12:57:46'),
(176, 'Pointer stores?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'Value', 'Address of variable', 'Data type', 'File', 'B', NULL, NULL, NULL, '2026-03-04 12:58:30', '2026-03-04 12:58:30'),
(177, 'Stress = ?', 'Multiple Choice', 2.00, 'Medium', '', 10, ' Force/Area', 'Area/Force', ' Force×Area', 'None', 'A', NULL, NULL, NULL, '2026-03-04 12:59:31', '2026-03-04 12:59:31'),
(178, 'Strain is?', 'Multiple Choice', 2.00, 'Hard', '', 10, 'Force', 'Energy', 'Deformation/Original length', 'Weight', 'C', NULL, NULL, NULL, '2026-03-04 13:00:11', '2026-03-04 13:00:11'),
(179, 'Young’s modulus formula?', 'Multiple Choice', 2.00, 'Medium', '', 10, 'Stress × Strain', 'Stress / Strain', ' Force × Length', 'None', 'B', NULL, NULL, NULL, '2026-03-04 13:01:08', '2026-03-04 13:01:08'),
(180, 'Bending moment unit?', 'Multiple Choice', 2.00, 'Easy', '', 10, 'N', ' N/m', 'Nm ', 'Joule', 'C', NULL, NULL, NULL, '2026-03-04 13:01:57', '2026-03-04 13:01:57'),
(181, 'Which function of management involves setting objectives and determining the course of action?', 'Multiple Choice', 2.00, 'Hard', '', 11, 'Controlling', 'Planning', 'Directing', 'Staffing', 'B', NULL, NULL, NULL, '2026-03-04 13:05:38', '2026-03-04 13:05:38'),
(182, 'Unity of Command means ?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'One manager controls many workers', 'One department controls all', 'One employee receives orders from one superior', 'Employees work in teams', 'C', NULL, NULL, NULL, '2026-03-04 13:06:28', '2026-03-04 13:06:28'),
(183, 'Span of Control refers to?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'Number of departments', 'Number of subordinates reporting to a manager', 'Level of authority', 'Number of policies', 'B', NULL, NULL, NULL, '2026-03-04 13:07:12', '2026-03-04 13:07:12'),
(184, 'Which level of management is responsible for strategic decisions?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'Top-level management', 'Middle-level management', 'Lower-level management', 'Supervisory level', 'A', NULL, NULL, NULL, '2026-03-04 13:08:05', '2026-03-04 13:08:05'),
(185, 'Planning is concerned with?', 'Multiple Choice', 2.00, 'Easy', '', 11, 'Past performance', 'Present problems', 'Future course of action', 'Employee motivation', 'C', NULL, NULL, NULL, '2026-03-04 13:15:23', '2026-03-04 13:15:23'),
(186, 'Which is not a function of management?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'Planning', 'Sleeping', 'Organizing', 'Controlling', 'B', NULL, NULL, NULL, '2026-03-04 13:16:12', '2026-03-04 13:16:12'),
(187, 'Unity of Direction means?', 'Multiple Choice', 2.00, 'Hard', '', 11, 'One boss for one employee', 'One plan for one group of activities', 'One department', 'One manager', 'B', NULL, NULL, NULL, '2026-03-04 13:18:09', '2026-03-04 13:18:09'),
(188, 'Scalar chain refers to?', 'Multiple Choice', 2.00, 'Easy', '', 11, 'Chain of command', 'Material chain', 'Production chain', 'Supply chain', 'A', NULL, NULL, NULL, '2026-03-04 13:19:23', '2026-03-04 13:19:23'),
(189, 'Which level of management focuses on policy making?', 'Multiple Choice', 2.00, 'Hard', '', 11, 'Middle level', 'Top level', 'Lower level', 'Supervisory level', 'B', NULL, NULL, NULL, '2026-03-04 13:20:26', '2026-03-04 13:20:26'),
(190, 'Delegation means?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'Giving responsibility only', 'Giving authority only', 'Assigning authority and responsibility', 'Avoiding work', 'C', NULL, NULL, NULL, '2026-03-04 13:21:20', '2026-03-04 13:21:20'),
(191, 'Motivation improves?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'Conflict', 'Productivity', 'Loss', 'Delay', 'B', NULL, NULL, NULL, '2026-03-04 13:22:24', '2026-03-04 13:22:24'),
(192, 'Controlling function compares?', 'Multiple Choice', 2.00, 'Easy', '', 11, 'Plans with goals', 'Employees with managers', 'Actual performance with standards', 'Cost with price', 'C', NULL, NULL, NULL, '2026-03-04 13:23:20', '2026-03-04 13:23:20'),
(193, 'Which theory was given by McGregor?', 'Multiple Choice', 2.00, 'Easy', '', 11, 'X and Y Theory', 'Need Hierarchy', 'Scientific Theory', 'Equity Theory', 'A', NULL, NULL, NULL, '2026-03-04 13:24:29', '2026-03-04 13:24:29'),
(194, 'Span of control refers to:', 'Multiple Choice', 2.00, 'Easy', '', 11, 'Number of subordinates under a manager', 'Number of managers', 'Number of departments', 'Number of policies', 'A', NULL, NULL, NULL, '2026-03-04 13:25:28', '2026-03-04 13:25:28'),
(195, 'Which is an example of non-financial incentive?', 'Multiple Choice', 2.00, 'Easy', '', 11, 'Bonus', 'Salary', 'Promotion', 'Commission', 'C', NULL, NULL, NULL, '2026-03-04 13:26:22', '2026-03-04 13:26:22'),
(196, 'Which of the following is a valid C variable name?', 'Multiple Choice', 2.00, 'Medium', '', 2, '1number', 'number_1', 'number-1', 'float', 'B', NULL, NULL, NULL, '2026-03-04 13:29:33', '2026-03-04 13:29:33'),
(197, 'Which data type stores decimal values?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'int', 'char', 'float', 'void', 'C', NULL, NULL, NULL, '2026-03-04 13:30:29', '2026-03-04 13:30:29'),
(198, 'Which symbol is used for single-line comments?', 'Multiple Choice', 2.00, 'Easy', '', 2, '//', '/* */', '#', '--', 'A', NULL, NULL, NULL, '2026-03-04 13:31:24', '2026-03-04 13:31:24'),
(199, 'Which function is used to read input?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'printf()', 'scanf()', 'print()', 'input()', 'B', NULL, NULL, NULL, '2026-03-04 13:32:45', '2026-03-04 13:32:45'),
(200, 'Which operator is used for modulus?', 'Multiple Choice', 2.00, 'Medium', '', 2, '/', '%', '*', '&', 'B', NULL, NULL, NULL, '2026-03-04 13:36:16', '2026-03-04 13:36:16'),
(201, 'Array index in C starts from:', 'Multiple Choice', 2.00, 'Medium', '', 2, '1', '-1', '0', '2', 'C', NULL, NULL, NULL, '2026-03-04 13:37:22', '2026-03-04 13:37:22'),
(202, 'Which loop checks condition first?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'do-while', 'for', 'while', 'Both B and C', 'D', NULL, NULL, NULL, '2026-03-04 13:38:27', '2026-03-04 13:38:27'),
(203, 'Which header file is required for string functions?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'stdio.h', 'string.h', 'math.h', 'conio.h', 'B', NULL, NULL, NULL, '2026-03-04 13:39:47', '2026-03-04 13:39:47'),
(204, 'What is the output type of printf()?', 'Multiple Choice', 2.00, 'Hard', '', 2, 'int', 'void', 'char', 'float', 'A', NULL, NULL, NULL, '2026-03-04 13:40:53', '2026-03-04 13:40:53'),
(205, 'Pointer stores:', 'Multiple Choice', 2.00, 'Easy', '', 2, 'Value', 'Address', 'Character', 'Index', 'B', NULL, NULL, NULL, '2026-03-04 13:42:09', '2026-03-04 13:42:09'),
(206, 'Which keyword is used to define a constant?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'var', 'const', 'define', 'static', 'B', NULL, NULL, NULL, '2026-03-04 13:43:16', '2026-03-04 13:43:16'),
(207, 'sizeof() is used to:', 'Multiple Choice', 2.00, 'Hard', '', 2, 'Print value', 'Find memory size', 'Count elements', 'Loop', 'B', NULL, NULL, NULL, '2026-03-04 13:45:17', '2026-03-04 13:45:17'),
(208, 'Break statement is used to:', 'Multiple Choice', 2.00, 'Easy', '', 2, 'Continue loop', 'Exit loop', 'Start loop', 'Pause program', 'B', NULL, NULL, NULL, '2026-03-04 13:47:13', '2026-03-04 13:47:13'),
(209, 'Function without return value uses', 'Multiple Choice', 2.00, 'Hard', '', 2, 'int', 'float', 'void', 'char', 'C', NULL, NULL, NULL, '2026-03-04 13:48:48', '2026-03-04 13:48:48'),
(210, 'Which is a logical operator?\n', 'Multiple Choice', 2.00, 'Easy', '', 2, '&&', '%', '=', '++', 'A', NULL, NULL, NULL, '2026-03-04 13:55:28', '2026-03-04 13:55:28'),
(211, 'Bending moment is maximum at:', 'Multiple Choice', 2.00, 'Hard', '', 10, 'Point of zero shear force', 'Supports only', 'Ends only', 'Midpoint always', 'A', NULL, NULL, NULL, '2026-03-04 14:04:23', '2026-03-04 14:04:23'),
(212, 'Unit of bending moment is', 'Multiple Choice', 2.00, 'Easy', '', 10, 'N', 'N/m', 'N·m', 'm²', 'C', NULL, NULL, NULL, '2026-03-04 14:05:41', '2026-03-04 14:05:41'),
(213, 'Unit of shear force is', 'Multiple Choice', 2.00, 'Medium', '', 10, 'N', 'Nm', 'm', 'N/m', 'A', NULL, NULL, NULL, '2026-03-04 14:07:11', '2026-03-04 14:07:11'),
(214, 'Maximum bending moment occurs where', 'Multiple Choice', 2.00, 'Hard', '', 10, 'Shear force is zero', 'Load is zero', 'Support only', 'End only', 'A', NULL, NULL, NULL, '2026-03-04 14:08:14', '2026-03-04 14:08:14'),
(215, 'A cantilever beam is fixed at', 'Multiple Choice', 2.00, 'Medium', '', 10, 'Middle', 'Both ends', 'One end', 'Free end', 'C', NULL, NULL, NULL, '2026-03-04 14:09:37', '2026-03-04 14:09:37'),
(216, 'Truss members carry', 'Multiple Choice', 2.00, 'Hard', '', 10, 'Bending', 'Axial force', 'Shear', 'Torsion', 'B', NULL, NULL, NULL, '2026-03-04 14:12:03', '2026-03-04 14:12:03'),
(217, 'Degree of static indeterminacy for simply supported beam is', 'Multiple Choice', 2.00, 'Medium', '', 10, '0', '1', '2', '3', 'A', NULL, NULL, NULL, '2026-03-04 14:12:38', '2026-03-04 14:12:38'),
(218, 'Moment distribution method was developed by', 'Multiple Choice', 2.00, 'Easy', '', 10, 'Hardy Cross', 'Newton', 'Euler', 'Rankine', 'A', NULL, NULL, NULL, '2026-03-04 14:13:34', '2026-03-04 14:13:34'),
(219, 'Fixed beam has how many end moments?', 'Multiple Choice', 2.00, 'Easy', '', 10, '0', '1', '2', '3', 'C', NULL, NULL, NULL, '2026-03-04 14:14:08', '2026-03-04 14:14:08'),
(220, 'Shear Force Diagram (SFD) represents', 'Multiple Choice', 2.00, 'Medium', '', 10, 'Load variation', 'Bending variation', 'Shear variation', 'Stress variation', 'C', NULL, NULL, NULL, '2026-03-04 14:16:14', '2026-03-04 14:16:31'),
(221, 'Bending Moment Diagram (BMD) represents', 'Multiple Choice', 2.00, 'Easy', '', 10, 'Load', 'Moment variation', 'Stress', 'Deflection', 'B', NULL, NULL, NULL, '2026-03-04 14:17:24', '2026-03-04 14:17:24'),
(222, 'Point of contraflexure is where', 'Multiple Choice', 2.00, 'Medium', '', 10, 'Shear zero', 'Moment zero', 'Reaction zero', 'Load zero', 'B', NULL, NULL, NULL, '2026-03-04 14:19:17', '2026-03-04 14:19:17'),
(223, 'Young’s Modulus is denoted by', 'Multiple Choice', 2.00, 'Easy', '', 10, 'G', 'K', 'E', 'M', 'C', NULL, NULL, NULL, '2026-03-04 14:20:27', '2026-03-04 14:20:27'),
(224, 'Unit of Young’s Modulus is', 'Multiple Choice', 2.00, 'Medium', '', 10, 'N', 'N/m²', 'm', 'Nm', 'B', NULL, NULL, NULL, '2026-03-04 14:21:40', '2026-03-04 14:21:40'),
(225, 'Deflection in beam depends on', 'Multiple Choice', 2.00, 'Easy', '', 10, 'Load', 'Length', 'Material', 'All of the above', 'D', NULL, NULL, NULL, '2026-03-04 14:22:47', '2026-03-04 14:22:47'),
(226, 'In portal frame, loads are resisted by', 'Multiple Choice', 2.00, 'Hard', '', 10, 'Axial only', 'Bending only', 'Combined forces', 'Shear only', 'C', NULL, NULL, NULL, '2026-03-04 14:23:56', '2026-03-04 14:23:56'),
(227, 'A stack follows FIFO principle', 'True/False', 2.00, 'Medium', '', 4, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 05:38:31', '2026-03-06 05:38:31'),
(228, 'Non Linear structure?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Array', 'Stack', 'Queue', 'Tree', 'D', NULL, NULL, NULL, '2026-03-06 05:40:42', '2026-03-06 05:40:42'),
(229, 'Circular queue avoids?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Sorting', 'Searching', 'Wastage of space', 'Overflow', 'C', NULL, NULL, NULL, '2026-03-06 05:42:02', '2026-03-06 05:42:02'),
(230, 'Underflow occurs when?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Deleting from empty structure', 'Insert full', 'Sort', 'Search', 'A', NULL, NULL, NULL, '2026-03-06 05:43:20', '2026-03-06 05:43:20'),
(231, 'Binary tree node has?', 'Multiple Choice', 2.00, 'Medium', '', 4, '1 Child', '3 Child', 'At most 2 children', 'Unlimited', 'C', NULL, NULL, NULL, '2026-03-06 05:44:24', '2026-03-06 05:44:24'),
(232, 'Height of complete binary tree=?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'log2n', 'n', 'n2', '1', 'A', NULL, NULL, NULL, '2026-03-06 05:45:29', '2026-03-06 05:46:20'),
(233, 'A stack follows FIFO principle.', 'True/False', 2.00, 'Medium', '', 4, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 05:57:48', '2026-03-06 05:57:48'),
(234, 'Binary search works only on sorted arrays.', 'True/False', 2.00, 'Hard', '', 4, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 05:58:36', '2026-03-06 05:58:36'),
(235, 'Define Linked List?', 'Short Answer', 2.00, 'Medium', '', 4, '', '', '', '', 'A linked list is a linear data structure where elements are connected using pointers.each node conta', NULL, NULL, NULL, '2026-03-06 06:01:48', '2026-03-06 06:01:48'),
(236, 'Difference between stack and queue with example', 'Short Answer', 2.00, 'Medium', '', 4, '', '', '', '', 'A stack follows LIFO principle.\nexample : Stack of plates.\nA queue follows FIFO principle.\nexample :', NULL, NULL, NULL, '2026-03-06 06:04:44', '2026-03-06 06:06:54'),
(237, 'ER diagram represents?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Code', 'Entities & Relationships', ' Table only', 'Query', 'B', NULL, NULL, NULL, '2026-03-06 07:30:34', '2026-03-06 07:35:14'),
(238, 'INNER JOIN returns?', 'Multiple Choice', 2.00, 'Medium', '', 5, ' All records', 'Matching records ', 'Left records ', ' Right records', 'B', NULL, NULL, NULL, '2026-03-06 07:32:08', '2026-03-06 07:32:08'),
(239, 'DELETE removes?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Structure ', ' Rows', 'Database ', 'Schema', 'B', NULL, NULL, NULL, '2026-03-06 07:34:45', '2026-03-06 07:35:27'),
(240, 'WHERE clause?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Group ', ' Filter records ', 'Join', '  Order', 'B', NULL, NULL, NULL, '2026-03-06 07:37:15', '2026-03-06 07:37:15'),
(241, 'Aggregate function?', 'Multiple Choice', 2.00, 'Medium', '', 5, ' UPDATE', 'COUNT ', 'DROP  ALTER', 'ALTER', 'B', NULL, NULL, NULL, '2026-03-06 07:38:42', '2026-03-06 07:38:42'),
(242, 'Schema defines?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Query  Backup', 'Backup', ' Data Structure', 'Structure', 'D', NULL, NULL, NULL, '2026-03-06 07:40:00', '2026-03-06 07:40:00'),
(243, 'TRUNCATE removes?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'All rows quickly ', 'Single row ', 'Column Key', 'Key', 'A', NULL, NULL, NULL, '2026-03-06 07:41:21', '2026-03-06 07:41:21'),
(244, 'Transaction ends with?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'CLOSE  COMMIT/ROLLBACK ', ' STOP  ', 'COMMIT/ROLLBACK ', ' EXIT', 'C', NULL, NULL, NULL, '2026-03-06 07:45:44', '2026-03-06 07:45:44'),
(245, 'RDBMS stores data in?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Files ', ' Tables ', 'Tree', 'Stack ', 'B', NULL, NULL, NULL, '2026-03-06 07:47:18', '2026-03-06 07:47:18'),
(246, 'Aggregate function?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'UPDATE', 'DROP  ', ' COUNT ', 'ALTER', 'C', NULL, NULL, NULL, '2026-03-06 07:48:50', '2026-03-06 07:48:50'),
(247, 'A primary key can contain NULL values. ', 'True/False', 2.00, 'Medium', '', 5, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 07:51:36', '2026-03-06 07:51:36'),
(248, 'Normalization reduces data redundancy.', 'True/False', 2.00, 'Medium', '', 5, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 07:52:07', '2026-03-06 07:52:07'),
(249, 'What is normalization? \n', 'Short Answer', 2.00, 'Medium', '', 5, '', '', '', '', 'Answer:\nNormalization is the process of organizing data to reduce redundancy and improve integrity.', NULL, NULL, NULL, '2026-03-06 07:53:51', '2026-03-06 07:53:51'),
(250, 'What is a foreign key? Why is it important?\n', 'Short Answer', 2.00, 'Medium', '', 5, '', '', '', '', 'Answer:\nA foreign key is a field in one table that refers to the primary key in another table.\nIt ma', NULL, NULL, NULL, '2026-03-06 07:54:37', '2026-03-06 07:54:37'),
(251, 'NAND gate is a universal gate.', 'True/False', 2.00, 'Medium', '', 7, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 07:56:34', '2026-03-06 07:56:34'),
(252, '\nFlip-flop is a combinational circuit.', 'True/False', 2.00, 'Medium', '', 7, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 07:57:09', '2026-03-06 07:57:09'),
(253, 'What is a logic gate?\n', 'Short Answer', 2.00, 'Medium', '', 7, '', '', '', '', 'Answer:\nA logic gate is a basic digital circuit that performs a logical operation on one or more bin', NULL, NULL, NULL, '2026-03-06 07:58:30', '2026-03-06 07:58:30'),
(254, 'Explain the working of a full adder.\n', 'Short Answer', 2.00, 'Medium', '', 7, '', '', '', '', 'Answer:\nA full adder adds three binary inputs (A, B, Carry-in) and produces two outputs: Sum and Car', NULL, NULL, NULL, '2026-03-06 07:59:25', '2026-03-06 07:59:25'),
(255, 'Force is a push or pull acting on a body.', 'True/False', 2.00, 'Medium', '', 9, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 08:09:37', '2026-03-06 08:09:37'),
(256, 'Velocity and speed have the same meaning in mechanics.', 'True/False', 2.00, 'Medium', '', 9, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 08:10:08', '2026-03-06 08:10:08'),
(257, ' What is force?\n', 'Short Answer', 2.00, 'Medium', '', 9, '', '', '', '', 'Answer: Force is a push or pull that can change the motion or shape of an object', NULL, NULL, NULL, '2026-03-06 08:10:44', '2026-03-06 08:10:44'),
(258, ' What is equilibrium?\n', 'Short Answer', 2.00, 'Medium', '', 9, '', '', '', '', 'Answer: Equilibrium is the state where all forces acting on a body are balanced.', NULL, NULL, NULL, '2026-03-06 08:11:18', '2026-03-06 08:11:18'),
(259, 'Microprocessors cannot perform arithmetic operations.', 'True/False', 2.00, 'Medium', '', 8, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 08:12:34', '2026-03-06 08:12:34'),
(260, 'A microprocessor acts as the brain of a computer.', 'True/False', 2.00, 'Medium', '', 8, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 08:13:00', '2026-03-06 08:13:00'),
(261, 'What is a microprocessor?\n', 'Short Answer', 2.00, 'Medium', '', 8, '', '', '', '', 'Answer: A microprocessor is an integrated circuit that performs the functions of a CPU.', NULL, NULL, NULL, '2026-03-06 08:14:00', '2026-03-06 08:14:00'),
(262, 'What is an instruction set?\n', 'Short Answer', 2.00, 'Medium', '', 8, '', '', '', '', 'Answer: An instruction set is a group of commands that a microprocessor can execute.', NULL, NULL, NULL, '2026-03-06 08:14:36', '2026-03-06 08:14:36'),
(263, 'Inheritance allows a class to acquire properties of another class.\n', 'True/False', 2.00, 'Medium', '', 3, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 08:16:05', '2026-03-06 08:16:05'),
(264, 'OOP does not use classes or objects', 'True/False', 2.00, 'Medium', '', 3, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 08:16:35', '2026-03-06 08:16:35'),
(265, 'What is a class?\n', 'Short Answer', 2.00, 'Medium', '', 3, '', '', '', '', 'Answer: A class is a blueprint used to create objects.', NULL, NULL, NULL, '2026-03-06 08:17:07', '2026-03-06 08:17:07'),
(266, 'What is an object?\n', 'Short Answer', 2.00, 'Medium', '', 3, '', '', '', '', 'Answer: An object is an instance of a class.', NULL, NULL, NULL, '2026-03-06 08:18:27', '2026-03-06 08:18:27'),
(267, 'An operating system manages computer hardware and software resources.', 'True/False', 2.00, 'Medium', '', 6, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 08:20:10', '2026-03-06 08:20:10'),
(268, 'Operating systems are only used in mobile phones', 'True/False', 2.00, 'Medium', '', 6, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 08:20:41', '2026-03-06 08:20:41'),
(269, 'What is an operating system?\n', 'Short Answer', 2.00, 'Medium', '', 6, '', '', '', '', 'Answer: An operating system is system software that manages hardware and software resources.', NULL, NULL, NULL, '2026-03-06 08:21:21', '2026-03-06 08:21:21'),
(270, ' Give one example of an operating system.\n', 'Short Answer', 2.00, 'Medium', '', 6, '', '', '', '', 'Answer: Windows, Linux, or macOS.', NULL, NULL, NULL, '2026-03-06 08:21:53', '2026-03-06 08:21:53'),
(271, 'Planning is one of the basic functions of management.', 'True/False', 2.00, 'Medium', '', 11, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 08:23:09', '2026-03-06 08:23:09'),
(272, 'Management is not required in organizations.', 'True/False', 2.00, 'Medium', '', 11, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 08:24:13', '2026-03-06 08:24:13'),
(273, ' What is management?\n', 'Short Answer', 2.00, 'Medium', '', 11, '', '', '', '', 'Answer: Management is the process of planning, organizing, leading, and controlling resources.', NULL, NULL, NULL, '2026-03-06 08:24:51', '2026-03-06 08:24:51'),
(274, ' What is planning in management?\n', 'Short Answer', 2.00, 'Medium', '', 11, '', '', '', '', 'Answer: Planning is deciding goals and the best way to achieve them.', NULL, NULL, NULL, '2026-03-06 08:25:25', '2026-03-06 08:25:25'),
(275, 'C is a procedural programming language.\n', 'True/False', 2.00, 'Medium', '', 2, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 08:26:36', '2026-03-06 08:26:36'),
(276, '\nC programs cannot use loops.\n', 'True/False', 2.00, 'Medium', '', 2, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 08:26:58', '2026-03-06 08:26:58'),
(277, 'Question: What is a variable in C?\n', 'Short Answer', 2.00, 'Medium', '', 2, '', '', '', '', 'Answer: A variable is a named memory location used to store data.\n', NULL, NULL, NULL, '2026-03-06 08:27:44', '2026-03-06 08:27:44'),
(278, 'Question: What is a loop?\n', 'Short Answer', 2.00, 'Medium', '', 2, '', '', '', '', 'Answer: A loop is used to repeat a set of instructions multiple time', NULL, NULL, NULL, '2026-03-06 08:28:06', '2026-03-06 08:28:06'),
(279, 'Structural analysis studies forces acting on structures.', 'True/False', 2.00, 'Medium', '', 10, '', '', '', '', 'A', NULL, NULL, NULL, '2026-03-06 08:29:07', '2026-03-06 08:29:07'),
(280, 'Structural analysis is not used in bridge construction.', 'True/False', 2.00, 'Medium', '', 10, '', '', '', '', 'B', NULL, NULL, NULL, '2026-03-06 08:29:35', '2026-03-06 08:29:35'),
(281, ' What is structural analysis?\n', 'Short Answer', 2.00, 'Medium', '', 10, '', '', '', '', 'Answer: Structural analysis is the study of how structures respond to loads and forces.\n', NULL, NULL, NULL, '2026-03-06 08:30:23', '2026-03-06 08:30:23'),
(282, 'Question: Give one example of a structure.\n', 'Short Answer', 2.00, 'Medium', '', 10, '', '', '', '', 'Answer: Bridge, building, or dam.', NULL, NULL, NULL, '2026-03-06 08:30:46', '2026-03-06 08:30:46');

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

--
-- Dumping data for table `student_answers`
--

INSERT INTO `student_answers` (`id`, `submissionId`, `questionId`, `studentAnswer`, `isCorrect`, `marksObtained`, `answeredAt`, `lastModifiedAt`, `isReviewed`, `createdAt`, `updatedAt`) VALUES
(40, 9, 42, 'B', 1, 2.00, '2026-03-03 10:18:12', '2026-03-03 10:18:12', 0, '2026-03-03 10:18:12', '2026-03-03 10:19:25'),
(41, 9, 43, 'B', 1, 2.00, '2026-03-03 10:18:17', '2026-03-03 10:18:18', 0, '2026-03-03 10:18:17', '2026-03-03 10:19:25'),
(42, 9, 44, 'B', 1, 2.00, '2026-03-03 10:18:21', '2026-03-03 10:18:21', 0, '2026-03-03 10:18:21', '2026-03-03 10:19:25'),
(43, 9, 45, 'D', 1, 2.00, '2026-03-03 10:18:24', '2026-03-03 10:18:24', 0, '2026-03-03 10:18:24', '2026-03-03 10:19:25'),
(44, 9, 46, 'C', 1, 2.00, '2026-03-03 10:18:28', '2026-03-03 10:18:28', 0, '2026-03-03 10:18:28', '2026-03-03 10:19:25'),
(45, 9, 47, 'B', 1, 2.00, '2026-03-03 10:18:31', '2026-03-03 10:18:31', 0, '2026-03-03 10:18:31', '2026-03-03 10:19:25'),
(46, 9, 48, 'B', 1, 2.00, '2026-03-03 10:18:34', '2026-03-03 10:18:34', 0, '2026-03-03 10:18:34', '2026-03-03 10:19:25'),
(47, 9, 49, 'C', 0, 0.00, '2026-03-03 10:18:37', '2026-03-03 10:18:37', 0, '2026-03-03 10:18:37', '2026-03-03 10:19:25'),
(48, 9, 50, 'B', 1, 2.00, '2026-03-03 10:18:41', '2026-03-03 10:18:41', 0, '2026-03-03 10:18:41', '2026-03-03 10:19:25'),
(49, 9, 51, 'A', 1, 2.00, '2026-03-03 10:18:44', '2026-03-03 10:18:44', 0, '2026-03-03 10:18:44', '2026-03-03 10:19:25'),
(50, 9, 52, 'B', 1, 2.00, '2026-03-03 10:18:50', '2026-03-03 10:18:50', 0, '2026-03-03 10:18:50', '2026-03-03 10:19:25'),
(51, 9, 53, 'C', 0, 0.00, '2026-03-03 10:18:53', '2026-03-03 10:18:53', 0, '2026-03-03 10:18:53', '2026-03-03 10:19:25'),
(52, 9, 54, 'C', 1, 2.00, '2026-03-03 10:18:56', '2026-03-03 10:18:56', 0, '2026-03-03 10:18:56', '2026-03-03 10:19:25'),
(53, 9, 55, 'B', 1, 2.00, '2026-03-03 10:19:00', '2026-03-03 10:19:00', 0, '2026-03-03 10:19:00', '2026-03-03 10:19:25'),
(54, 9, 56, 'C', 0, 0.00, '2026-03-03 10:19:04', '2026-03-03 10:19:04', 0, '2026-03-03 10:19:04', '2026-03-03 10:19:25'),
(55, 12, 172, 'B', 1, 2.00, '2026-03-06 09:08:05', '2026-03-06 09:08:05', 0, '2026-03-06 09:08:05', '2026-03-06 09:12:26'),
(56, 12, 173, 'D', 1, 2.00, '2026-03-06 09:08:13', '2026-03-06 09:08:13', 0, '2026-03-06 09:08:13', '2026-03-06 09:12:26'),
(57, 12, 174, 'B', 1, 2.00, '2026-03-06 09:08:19', '2026-03-06 09:08:19', 0, '2026-03-06 09:08:19', '2026-03-06 09:12:26'),
(58, 12, 175, 'C', 1, 2.00, '2026-03-06 09:08:26', '2026-03-06 09:08:26', 0, '2026-03-06 09:08:26', '2026-03-06 09:12:26'),
(59, 12, 176, 'B', 1, 2.00, '2026-03-06 09:08:30', '2026-03-06 09:08:30', 0, '2026-03-06 09:08:30', '2026-03-06 09:12:26'),
(60, 12, 196, 'B', 1, 2.00, '2026-03-06 09:08:41', '2026-03-06 09:08:41', 0, '2026-03-06 09:08:41', '2026-03-06 09:12:26'),
(61, 12, 197, 'C', 1, 2.00, '2026-03-06 09:08:48', '2026-03-06 09:08:48', 0, '2026-03-06 09:08:48', '2026-03-06 09:12:26'),
(62, 12, 198, 'B', 0, 0.00, '2026-03-06 09:08:59', '2026-03-06 09:08:59', 0, '2026-03-06 09:08:59', '2026-03-06 09:12:26'),
(63, 12, 199, 'B', 1, 2.00, '2026-03-06 09:09:06', '2026-03-06 09:09:06', 0, '2026-03-06 09:09:06', '2026-03-06 09:12:26'),
(64, 12, 200, 'B', 1, 2.00, '2026-03-06 09:09:15', '2026-03-06 09:09:15', 0, '2026-03-06 09:09:15', '2026-03-06 09:12:26'),
(65, 12, 202, 'A', 0, 0.00, '2026-03-06 09:09:31', '2026-03-06 09:09:31', 0, '2026-03-06 09:09:31', '2026-03-06 09:12:26'),
(66, 12, 203, 'B', 1, 2.00, '2026-03-06 09:09:36', '2026-03-06 09:09:36', 0, '2026-03-06 09:09:36', '2026-03-06 09:12:26'),
(67, 12, 204, 'B', 0, 0.00, '2026-03-06 09:09:46', '2026-03-06 09:09:46', 0, '2026-03-06 09:09:46', '2026-03-06 09:12:26'),
(68, 12, 205, 'B', 1, 2.00, '2026-03-06 09:09:53', '2026-03-06 09:09:53', 0, '2026-03-06 09:09:53', '2026-03-06 09:12:26'),
(69, 12, 206, 'B', 1, 2.00, '2026-03-06 09:09:58', '2026-03-06 09:09:58', 0, '2026-03-06 09:09:58', '2026-03-06 09:12:26'),
(70, 12, 207, 'B', 1, 2.00, '2026-03-06 09:10:01', '2026-03-06 09:10:01', 0, '2026-03-06 09:10:01', '2026-03-06 09:12:26'),
(71, 12, 208, 'B', 1, 2.00, '2026-03-06 09:10:06', '2026-03-06 09:10:06', 0, '2026-03-06 09:10:06', '2026-03-06 09:12:26'),
(72, 12, 209, 'C', 1, 2.00, '2026-03-06 09:10:22', '2026-03-06 09:10:22', 0, '2026-03-06 09:10:22', '2026-03-06 09:12:26'),
(73, 12, 210, 'A', 1, 2.00, '2026-03-06 09:10:30', '2026-03-06 09:10:30', 0, '2026-03-06 09:10:30', '2026-03-06 09:12:26'),
(74, 12, 275, 'A', 1, 2.00, '2026-03-06 09:10:36', '2026-03-06 09:10:36', 0, '2026-03-06 09:10:36', '2026-03-06 09:12:26'),
(75, 12, 276, 'B', 1, 2.00, '2026-03-06 09:10:41', '2026-03-06 09:10:41', 0, '2026-03-06 09:10:41', '2026-03-06 09:12:26'),
(76, 12, 278, 'iterate overs the number of items', 0, 0.00, '2026-03-06 09:11:13', '2026-03-06 09:12:18', 0, '2026-03-06 09:11:13', '2026-03-06 09:12:26'),
(77, 12, 277, 'it is name of the memory location used to store the data', 0, 0.00, '2026-03-06 09:11:31', '2026-03-06 09:11:57', 0, '2026-03-06 09:11:31', '2026-03-06 09:12:26'),
(78, 16, 42, 'B', 1, 2.00, '2026-03-06 14:54:46', '2026-03-06 14:54:46', 0, '2026-03-06 14:54:46', '2026-03-07 01:04:04'),
(79, 16, 43, 'B', 1, 2.00, '2026-03-06 14:54:51', '2026-03-06 14:54:51', 0, '2026-03-06 14:54:51', '2026-03-07 01:04:04'),
(80, 16, 44, 'A', 0, 0.00, '2026-03-06 14:54:59', '2026-03-06 14:54:59', 0, '2026-03-06 14:54:59', '2026-03-07 01:04:04'),
(81, 16, 45, 'D', 1, 2.00, '2026-03-06 14:55:04', '2026-03-06 14:55:04', 0, '2026-03-06 14:55:04', '2026-03-07 01:04:04'),
(82, 16, 46, 'C', 1, 2.00, '2026-03-06 14:55:08', '2026-03-06 14:55:08', 0, '2026-03-06 14:55:08', '2026-03-07 01:04:04'),
(83, 16, 47, 'B', 1, 2.00, '2026-03-06 14:55:15', '2026-03-06 14:55:15', 0, '2026-03-06 14:55:15', '2026-03-07 01:04:04'),
(84, 16, 48, 'B', 1, 2.00, '2026-03-06 14:55:19', '2026-03-06 14:55:19', 0, '2026-03-06 14:55:19', '2026-03-07 01:04:04'),
(85, 16, 49, 'C', 0, 0.00, '2026-03-06 14:55:25', '2026-03-06 14:55:25', 0, '2026-03-06 14:55:25', '2026-03-07 01:04:04'),
(86, 16, 50, 'B', 1, 2.00, '2026-03-06 14:55:36', '2026-03-06 14:55:36', 0, '2026-03-06 14:55:36', '2026-03-07 01:04:04'),
(87, 16, 51, 'A', 1, 2.00, '2026-03-06 14:55:42', '2026-03-06 14:55:42', 0, '2026-03-06 14:55:42', '2026-03-07 01:04:04'),
(88, 16, 52, 'B', 1, 2.00, '2026-03-06 14:55:47', '2026-03-06 14:55:47', 0, '2026-03-06 14:55:47', '2026-03-07 01:04:04'),
(89, 16, 53, 'A', 0, 0.00, '2026-03-06 14:59:35', '2026-03-06 14:59:35', 0, '2026-03-06 14:59:35', '2026-03-07 01:04:04'),
(90, 16, 54, 'C', 1, 2.00, '2026-03-06 14:59:42', '2026-03-06 14:59:42', 0, '2026-03-06 14:59:42', '2026-03-07 01:04:04'),
(91, 16, 55, 'B', 1, 2.00, '2026-03-06 14:59:45', '2026-03-06 14:59:45', 0, '2026-03-06 14:59:45', '2026-03-07 01:04:04'),
(92, 16, 56, 'D', 0, 0.00, '2026-03-06 14:59:52', '2026-03-06 14:59:52', 0, '2026-03-06 14:59:52', '2026-03-07 01:04:04'),
(93, 16, 228, 'C', 0, 0.00, '2026-03-06 15:00:01', '2026-03-06 15:00:01', 0, '2026-03-06 15:00:01', '2026-03-07 01:04:04'),
(94, 16, 229, 'C', 1, 2.00, '2026-03-06 15:00:09', '2026-03-06 15:00:09', 0, '2026-03-06 15:00:09', '2026-03-07 01:04:04'),
(95, 16, 230, 'B', 0, 0.00, '2026-03-06 15:00:17', '2026-03-06 15:00:17', 0, '2026-03-06 15:00:17', '2026-03-07 01:04:04'),
(96, 16, 231, 'C', 1, 2.00, '2026-03-06 15:00:22', '2026-03-06 15:00:22', 0, '2026-03-06 15:00:22', '2026-03-07 01:04:04'),
(97, 16, 233, 'A', 0, 0.00, '2026-03-06 15:00:32', '2026-03-06 15:00:32', 0, '2026-03-06 15:00:32', '2026-03-07 01:04:04'),
(98, 16, 234, 'B', 0, 0.00, '2026-03-06 15:00:39', '2026-03-06 15:00:39', 0, '2026-03-06 15:00:39', '2026-03-07 01:04:04'),
(99, 16, 235, '', 0, 0.00, '2026-03-06 15:01:08', '2026-03-06 15:02:49', 0, '2026-03-06 15:01:08', '2026-03-07 01:04:04'),
(100, 16, 236, 'iy', 0, 0.00, '2026-03-06 15:03:03', '2026-03-06 15:03:04', 0, '2026-03-06 15:03:03', '2026-03-07 01:04:04'),
(101, 20, 57, 'B', 1, 2.00, '2026-03-06 16:46:21', '2026-03-06 16:46:21', 0, '2026-03-06 16:46:21', '2026-03-07 01:04:04'),
(102, 20, 58, 'B', 1, 2.00, '2026-03-06 16:46:26', '2026-03-06 16:46:26', 0, '2026-03-06 16:46:26', '2026-03-07 01:04:04'),
(103, 20, 59, 'B', 1, 2.00, '2026-03-06 16:46:30', '2026-03-06 16:46:30', 0, '2026-03-06 16:46:30', '2026-03-07 01:04:04'),
(104, 20, 61, 'C', 1, 2.00, '2026-03-06 16:46:36', '2026-03-06 16:46:36', 0, '2026-03-06 16:46:36', '2026-03-07 01:04:04'),
(105, 20, 62, 'D', 1, 2.00, '2026-03-06 16:46:39', '2026-03-06 16:46:39', 0, '2026-03-06 16:46:39', '2026-03-07 01:04:04'),
(106, 20, 63, 'B', 1, 2.00, '2026-03-06 16:46:42', '2026-03-06 16:46:42', 0, '2026-03-06 16:46:42', '2026-03-07 01:04:04'),
(107, 20, 64, 'C', 1, 2.00, '2026-03-06 16:46:45', '2026-03-06 16:46:45', 0, '2026-03-06 16:46:45', '2026-03-07 01:04:04'),
(108, 20, 65, 'B', 1, 2.00, '2026-03-06 16:46:50', '2026-03-06 16:46:50', 0, '2026-03-06 16:46:50', '2026-03-07 01:04:04'),
(109, 20, 66, 'B', 1, 2.00, '2026-03-06 16:46:53', '2026-03-06 16:46:53', 0, '2026-03-06 16:46:53', '2026-03-07 01:04:04'),
(110, 22, 42, 'B', 1, 2.00, '2026-03-07 01:14:50', '2026-03-07 01:14:50', 0, '2026-03-07 01:14:50', '2026-03-07 01:16:52'),
(111, 22, 43, 'B', 1, 2.00, '2026-03-07 01:14:59', '2026-03-07 01:14:59', 0, '2026-03-07 01:14:59', '2026-03-07 01:16:52'),
(112, 22, 44, 'B', 1, 2.00, '2026-03-07 01:15:05', '2026-03-07 01:15:05', 0, '2026-03-07 01:15:05', '2026-03-07 01:16:52'),
(113, 22, 45, 'D', 1, 2.00, '2026-03-07 01:15:09', '2026-03-07 01:15:09', 0, '2026-03-07 01:15:09', '2026-03-07 01:16:52'),
(114, 22, 47, 'B', 1, 2.00, '2026-03-07 01:15:15', '2026-03-07 01:15:17', 0, '2026-03-07 01:15:15', '2026-03-07 01:16:52'),
(115, 22, 48, 'B', 1, 2.00, '2026-03-07 01:15:20', '2026-03-07 01:15:20', 0, '2026-03-07 01:15:20', '2026-03-07 01:16:52'),
(116, 22, 49, 'C', 0, 0.00, '2026-03-07 01:15:23', '2026-03-07 01:15:23', 0, '2026-03-07 01:15:23', '2026-03-07 01:16:52'),
(117, 22, 50, 'B', 1, 2.00, '2026-03-07 01:15:27', '2026-03-07 01:15:27', 0, '2026-03-07 01:15:27', '2026-03-07 01:16:52'),
(118, 22, 51, 'A', 1, 2.00, '2026-03-07 01:15:30', '2026-03-07 01:15:32', 0, '2026-03-07 01:15:30', '2026-03-07 01:16:52'),
(119, 22, 52, 'B', 1, 2.00, '2026-03-07 01:15:36', '2026-03-07 01:15:36', 0, '2026-03-07 01:15:36', '2026-03-07 01:16:52'),
(120, 22, 53, 'B', 1, 2.00, '2026-03-07 01:15:40', '2026-03-07 01:15:40', 0, '2026-03-07 01:15:40', '2026-03-07 01:16:52'),
(121, 22, 54, 'C', 1, 2.00, '2026-03-07 01:15:44', '2026-03-07 01:15:44', 0, '2026-03-07 01:15:44', '2026-03-07 01:16:52'),
(122, 22, 55, 'B', 1, 2.00, '2026-03-07 01:15:49', '2026-03-07 01:15:49', 0, '2026-03-07 01:15:49', '2026-03-07 01:16:52'),
(123, 22, 56, 'C', 0, 0.00, '2026-03-07 01:15:53', '2026-03-07 01:15:53', 0, '2026-03-07 01:15:53', '2026-03-07 01:16:52'),
(124, 22, 228, 'C', 0, 0.00, '2026-03-07 01:15:57', '2026-03-07 01:15:57', 0, '2026-03-07 01:15:57', '2026-03-07 01:16:52'),
(125, 22, 229, 'C', 1, 2.00, '2026-03-07 01:16:01', '2026-03-07 01:16:01', 0, '2026-03-07 01:16:01', '2026-03-07 01:16:52'),
(126, 22, 230, 'B', 0, 0.00, '2026-03-07 01:16:08', '2026-03-07 01:16:08', 0, '2026-03-07 01:16:08', '2026-03-07 01:16:52'),
(127, 22, 231, 'C', 1, 2.00, '2026-03-07 01:16:12', '2026-03-07 01:16:12', 0, '2026-03-07 01:16:12', '2026-03-07 01:16:52'),
(128, 22, 232, 'C', 0, 0.00, '2026-03-07 01:16:15', '2026-03-07 01:16:15', 0, '2026-03-07 01:16:15', '2026-03-07 01:16:53'),
(129, 22, 233, 'A', 0, 0.00, '2026-03-07 01:16:19', '2026-03-07 01:16:19', 0, '2026-03-07 01:16:19', '2026-03-07 01:16:53'),
(130, 22, 234, 'B', 0, 0.00, '2026-03-07 01:16:22', '2026-03-07 01:16:22', 0, '2026-03-07 01:16:22', '2026-03-07 01:16:53'),
(131, 22, 235, 'it is linear stucture data', 0, 0.00, '2026-03-07 01:16:25', '2026-03-07 01:16:43', 0, '2026-03-07 01:16:25', '2026-03-07 01:16:53'),
(132, 23, 57, 'B', 1, 2.00, '2026-03-09 14:29:58', '2026-03-09 14:29:58', 0, '2026-03-09 14:29:58', '2026-03-09 14:32:24'),
(133, 23, 58, 'B', 1, 2.00, '2026-03-09 14:30:04', '2026-03-09 14:30:04', 0, '2026-03-09 14:30:04', '2026-03-09 14:32:24'),
(134, 23, 59, 'B', 1, 2.00, '2026-03-09 14:30:08', '2026-03-09 14:30:08', 0, '2026-03-09 14:30:08', '2026-03-09 14:32:24'),
(135, 23, 60, 'C', 1, 2.00, '2026-03-09 14:30:12', '2026-03-09 14:30:12', 0, '2026-03-09 14:30:12', '2026-03-09 14:32:24'),
(136, 23, 61, 'C', 1, 2.00, '2026-03-09 14:30:23', '2026-03-09 14:30:23', 0, '2026-03-09 14:30:23', '2026-03-09 14:32:24'),
(137, 23, 62, 'D', 1, 2.00, '2026-03-09 14:30:27', '2026-03-09 14:30:27', 0, '2026-03-09 14:30:27', '2026-03-09 14:32:24'),
(138, 23, 63, 'B', 1, 2.00, '2026-03-09 14:30:35', '2026-03-09 14:30:35', 0, '2026-03-09 14:30:35', '2026-03-09 14:32:24'),
(139, 23, 64, 'C', 1, 2.00, '2026-03-09 14:30:38', '2026-03-09 14:30:38', 0, '2026-03-09 14:30:38', '2026-03-09 14:32:24'),
(140, 23, 65, 'B', 1, 2.00, '2026-03-09 14:30:41', '2026-03-09 14:30:41', 0, '2026-03-09 14:30:41', '2026-03-09 14:32:24'),
(141, 23, 66, 'B', 1, 2.00, '2026-03-09 14:30:45', '2026-03-09 14:30:45', 0, '2026-03-09 14:30:45', '2026-03-09 14:32:24'),
(142, 23, 237, 'B', 1, 2.00, '2026-03-09 14:30:48', '2026-03-09 14:30:48', 0, '2026-03-09 14:30:48', '2026-03-09 14:32:24'),
(143, 23, 238, 'B', 1, 2.00, '2026-03-09 14:30:57', '2026-03-09 14:30:57', 0, '2026-03-09 14:30:57', '2026-03-09 14:32:24'),
(144, 23, 239, 'B', 1, 2.00, '2026-03-09 14:31:05', '2026-03-09 14:31:05', 0, '2026-03-09 14:31:05', '2026-03-09 14:32:24'),
(145, 23, 240, 'B', 1, 2.00, '2026-03-09 14:31:11', '2026-03-09 14:31:11', 0, '2026-03-09 14:31:11', '2026-03-09 14:32:24'),
(146, 23, 241, 'B', 1, 2.00, '2026-03-09 14:31:18', '2026-03-09 14:31:18', 0, '2026-03-09 14:31:18', '2026-03-09 14:32:24'),
(147, 23, 242, 'C', 0, 0.00, '2026-03-09 14:31:24', '2026-03-09 14:31:24', 0, '2026-03-09 14:31:24', '2026-03-09 14:32:24'),
(148, 23, 243, 'A', 1, 2.00, '2026-03-09 14:31:33', '2026-03-09 14:31:33', 0, '2026-03-09 14:31:33', '2026-03-09 14:32:24'),
(149, 23, 244, 'C', 1, 2.00, '2026-03-09 14:31:38', '2026-03-09 14:31:38', 0, '2026-03-09 14:31:38', '2026-03-09 14:32:24'),
(150, 23, 245, 'B', 1, 2.00, '2026-03-09 14:31:44', '2026-03-09 14:31:44', 0, '2026-03-09 14:31:44', '2026-03-09 14:32:24'),
(151, 23, 246, 'C', 1, 2.00, '2026-03-09 14:31:48', '2026-03-09 14:31:48', 0, '2026-03-09 14:31:48', '2026-03-09 14:32:24'),
(152, 23, 247, 'B', 1, 2.00, '2026-03-09 14:31:55', '2026-03-09 14:31:58', 0, '2026-03-09 14:31:55', '2026-03-09 14:32:24'),
(153, 23, 250, 'it is unique key', 0, 0.00, '2026-03-09 14:32:11', '2026-03-09 14:32:19', 0, '2026-03-09 14:32:11', '2026-03-09 14:32:24'),
(154, 26, 147, 'B', 1, 2.00, '2026-03-10 06:43:47', '2026-03-10 06:43:47', 0, '2026-03-10 06:43:47', '2026-03-10 06:46:27'),
(155, 26, 148, 'D', 1, 2.00, '2026-03-10 06:44:00', '2026-03-10 06:44:00', 0, '2026-03-10 06:44:00', '2026-03-10 06:46:27'),
(156, 26, 149, 'B', 1, 2.00, '2026-03-10 06:44:09', '2026-03-10 06:44:09', 0, '2026-03-10 06:44:09', '2026-03-10 06:46:27'),
(157, 26, 150, 'B', 1, 2.00, '2026-03-10 06:44:18', '2026-03-10 06:44:18', 0, '2026-03-10 06:44:18', '2026-03-10 06:46:27'),
(158, 26, 151, 'A', 1, 2.00, '2026-03-10 06:44:24', '2026-03-10 06:44:24', 0, '2026-03-10 06:44:24', '2026-03-10 06:46:27'),
(159, 26, 152, 'B', 1, 2.00, '2026-03-10 06:44:32', '2026-03-10 06:44:32', 0, '2026-03-10 06:44:32', '2026-03-10 06:46:27'),
(160, 26, 153, 'C', 1, 2.00, '2026-03-10 06:44:37', '2026-03-10 06:44:37', 0, '2026-03-10 06:44:37', '2026-03-10 06:46:27'),
(161, 26, 154, 'D', 1, 2.00, '2026-03-10 06:44:46', '2026-03-10 06:44:46', 0, '2026-03-10 06:44:46', '2026-03-10 06:46:27'),
(162, 26, 155, 'C', 1, 2.00, '2026-03-10 06:44:52', '2026-03-10 06:44:52', 0, '2026-03-10 06:44:52', '2026-03-10 06:46:27'),
(163, 26, 156, 'B', 1, 2.00, '2026-03-10 06:44:59', '2026-03-10 06:44:59', 0, '2026-03-10 06:44:59', '2026-03-10 06:46:27'),
(164, 26, 157, 'C', 1, 2.00, '2026-03-10 06:45:04', '2026-03-10 06:45:04', 0, '2026-03-10 06:45:04', '2026-03-10 06:46:27'),
(165, 26, 158, 'B', 1, 2.00, '2026-03-10 06:45:09', '2026-03-10 06:45:09', 0, '2026-03-10 06:45:09', '2026-03-10 06:46:27'),
(166, 26, 159, 'C', 1, 2.00, '2026-03-10 06:45:18', '2026-03-10 06:45:18', 0, '2026-03-10 06:45:18', '2026-03-10 06:46:27'),
(167, 26, 160, 'B', 1, 2.00, '2026-03-10 06:45:26', '2026-03-10 06:45:26', 0, '2026-03-10 06:45:26', '2026-03-10 06:46:27'),
(168, 26, 161, 'C', 1, 2.00, '2026-03-10 06:45:31', '2026-03-10 06:45:31', 0, '2026-03-10 06:45:31', '2026-03-10 06:46:27'),
(169, 26, 162, 'B', 1, 2.00, '2026-03-10 06:45:39', '2026-03-10 06:45:39', 0, '2026-03-10 06:45:39', '2026-03-10 06:46:27'),
(170, 26, 163, 'B', 1, 2.00, '2026-03-10 06:45:44', '2026-03-10 06:45:44', 0, '2026-03-10 06:45:44', '2026-03-10 06:46:27'),
(171, 26, 164, 'C', 1, 2.00, '2026-03-10 06:45:48', '2026-03-10 06:45:48', 0, '2026-03-10 06:45:48', '2026-03-10 06:46:27'),
(172, 26, 165, 'C', 0, 0.00, '2026-03-10 06:45:51', '2026-03-10 06:45:51', 0, '2026-03-10 06:45:51', '2026-03-10 06:46:27'),
(173, 26, 166, 'B', 0, 0.00, '2026-03-10 06:45:59', '2026-03-10 06:45:59', 0, '2026-03-10 06:45:59', '2026-03-10 06:46:27'),
(174, 26, 267, 'B', 0, 0.00, '2026-03-10 06:46:05', '2026-03-10 06:46:05', 0, '2026-03-10 06:46:05', '2026-03-10 06:46:27'),
(175, 26, 268, 'A', 0, 0.00, '2026-03-10 06:46:08', '2026-03-10 06:46:08', 0, '2026-03-10 06:46:08', '2026-03-10 06:46:27'),
(176, 26, 270, 'Linux', 0, 0.00, '2026-03-10 06:46:20', '2026-03-10 06:46:21', 0, '2026-03-10 06:46:20', '2026-03-10 06:46:27');

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
-- Table structure for table `test_cases`
--

CREATE TABLE `test_cases` (
  `id` int(11) NOT NULL,
  `codingQuestionId` int(11) NOT NULL,
  `input` text NOT NULL,
  `expectedOutput` text NOT NULL,
  `isVisible` tinyint(1) DEFAULT 0,
  `orderIndex` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `test_results`
--

CREATE TABLE `test_results` (
  `id` int(11) NOT NULL,
  `submissionId` int(11) NOT NULL,
  `testCaseId` int(11) NOT NULL,
  `passed` tinyint(1) NOT NULL,
  `actualOutput` text DEFAULT NULL,
  `executionTime` decimal(10,2) DEFAULT NULL,
  `errorMessage` text DEFAULT NULL,
  `createdAt` datetime NOT NULL
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
(1, 'Super', 'Admin', 'superadmin@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-ADMIN', 1, '2026-03-18 09:27:46', '2026-02-16 05:27:19', '2026-03-18 09:27:46'),
(2, 'John', 'Admin', 'admin@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0001', 1, '2026-03-04 08:03:33', '2026-02-16 05:27:19', '2026-03-04 08:03:33'),
(3, 'Jane', 'Examiner', 'examiner@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0002', 1, '2026-03-10 06:46:45', '2026-02-16 05:27:19', '2026-03-10 06:46:45'),
(4, 'Alice', 'Proctor', 'proctor@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0003', 1, NULL, '2026-02-16 05:27:19', '2026-02-16 05:27:19'),
(5, 'Bob', 'Student', 'student1@gmail.com', '$2a$10$Gv3XaCbjpPvcfD./tIPNCukL2ZyGQGgo3S3P8.0E3qfpFKs3lh2q.', '+1-800-0004', 1, '2026-03-10 06:47:34', '2026-02-16 05:27:19', '2026-03-10 06:47:34'),
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
(37, 'Akash', 'Kulkarni', 'akash.kulkarni@student.com', '$2a$10$cJrIZUFqgRyy.6W9dgwPi.b4E3BnmzTl/FFbGfdrt.eulz0tQpYdO', '9000000015', 1, NULL, '2026-02-19 09:02:57', '2026-02-19 09:02:57'),
(38, 'Basavaraj', 'Mokashi', 'basu@gmail.com', '$2a$10$HYCtoMD821itkazSfdCtEOSwhwLFBSVgDtILFnMySkE30EdkvbXxa', '7996224936', 1, NULL, '2026-03-03 10:08:03', '2026-03-03 10:08:03'),
(39, 'BG', 'Mokashi', 'bgm@gmail.com', '$2a$10$UnXUx/WnYVcMJC2pRUxXZusDNyaWAsY9GlGQD.4VA/Wkbb.Uhr19u', '98765433456', 1, NULL, '2026-03-03 10:17:58', '2026-03-03 10:17:58'),
(40, 'Vaish', 'Magadum', 'vaish@gmail.com', '$2a$10$WA1TOsKleZ0rQKHbF8Vy.uqlZA70QwrkpjUaUyDKGCtrnWKjALW/O', '3456785678', 1, NULL, '2026-03-03 10:28:24', '2026-03-03 10:28:24'),
(41, 'Vaishnavi', 'Magadum', 'vaishnavimagadum283@gmail.com', '$2a$10$REenTSHhYgl3f63lbQQgvem8UPKm6j5ZbjMu2XapGcFo0L0DfC1AC', '2134567547', 1, NULL, '2026-03-06 14:54:25', '2026-03-06 14:54:25'),
(42, 'sheetal', 'Padanad', 'sheetal683@gmail.com', '$2a$10$/5Fs9BcLZlWBkF.hW5Qb.uCnl5lE5nD/vlpaHLBqNPnsx3wNryhiu', '2134567549', 1, NULL, '2026-03-10 06:43:26', '2026-03-10 06:43:26');

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
(37, 37, 5, '2026-02-19 09:02:58', '2026-02-19 09:02:58'),
(38, 38, 5, '2026-03-03 10:08:03', '2026-03-03 10:08:03'),
(39, 39, 5, '2026-03-03 10:17:59', '2026-03-03 10:17:59'),
(40, 40, 5, '2026-03-03 10:28:24', '2026-03-03 10:28:24'),
(41, 41, 5, '2026-03-06 14:54:32', '2026-03-06 14:54:32'),
(42, 42, 5, '2026-03-10 06:43:26', '2026-03-10 06:43:26');

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
-- Indexes for table `coding_questions`
--
ALTER TABLE `coding_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `examId` (`examId`);

--
-- Indexes for table `coding_submissions`
--
ALTER TABLE `coding_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `codingQuestionId` (`codingQuestionId`),
  ADD KEY `submissionId` (`submissionId`);

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
-- Indexes for table `test_cases`
--
ALTER TABLE `test_cases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `codingQuestionId` (`codingQuestionId`);

--
-- Indexes for table `test_results`
--
ALTER TABLE `test_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submissionId` (`submissionId`),
  ADD KEY `testCaseId` (`testCaseId`);

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
-- AUTO_INCREMENT for table `coding_questions`
--
ALTER TABLE `coding_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coding_submissions`
--
ALTER TABLE `coding_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `course_lecturers`
--
ALTER TABLE `course_lecturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=263;

--
-- AUTO_INCREMENT for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=283;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;

--
-- AUTO_INCREMENT for table `student_exam_enrollments`
--
ALTER TABLE `student_exam_enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `test_cases`
--
ALTER TABLE `test_cases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `test_results`
--
ALTER TABLE `test_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `coding_questions`
--
ALTER TABLE `coding_questions`
  ADD CONSTRAINT `coding_questions_ibfk_1` FOREIGN KEY (`examId`) REFERENCES `exams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `coding_submissions`
--
ALTER TABLE `coding_submissions`
  ADD CONSTRAINT `coding_submissions_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coding_submissions_ibfk_2` FOREIGN KEY (`codingQuestionId`) REFERENCES `coding_questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coding_submissions_ibfk_3` FOREIGN KEY (`submissionId`) REFERENCES `exam_submissions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
-- Constraints for table `test_cases`
--
ALTER TABLE `test_cases`
  ADD CONSTRAINT `test_cases_ibfk_1` FOREIGN KEY (`codingQuestionId`) REFERENCES `coding_questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `test_results`
--
ALTER TABLE `test_results`
  ADD CONSTRAINT `test_results_ibfk_1` FOREIGN KEY (`submissionId`) REFERENCES `coding_submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `test_results_ibfk_2` FOREIGN KEY (`testCaseId`) REFERENCES `test_cases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
