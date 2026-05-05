-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 27, 2026 at 03:08 PM
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
  `updatedAt` datetime NOT NULL,
  `courseId` int(11) DEFAULT NULL,
  `language` enum('python','javascript','java','cpp','c','csharp','nodejs') DEFAULT 'python',
  `starterCode` text DEFAULT NULL,
  `memoryLimit` int(11) DEFAULT 256
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coding_questions`
--

INSERT INTO `coding_questions` (`id`, `examId`, `title`, `description`, `inputFormat`, `outputFormat`, `sampleInput`, `sampleOutput`, `difficulty`, `marks`, `timeLimit`, `createdAt`, `updatedAt`, `courseId`, `language`, `starterCode`, `memoryLimit`) VALUES
(1, NULL, 'Write a Tower of hanoi', 'Write a Tower of hanoi', NULL, NULL, NULL, NULL, 'Hard', 5.00, 5, '2026-03-24 06:53:56', '2026-03-24 06:53:56', 2, 'c', '', 256),
(2, 12, 'write a program', 'write a program', NULL, NULL, NULL, NULL, 'Medium', 1.00, 5, '2026-03-24 07:22:08', '2026-03-24 07:22:08', 4, 'python', '', 256),
(3, NULL, 'write a program', 'write a program', NULL, NULL, NULL, NULL, 'Medium', 1.00, 5, '2026-03-24 07:42:31', '2026-03-24 07:42:31', 4, 'python', '', 256),
(4, 9, 'write hello world prgm', 'write hello world prgm', NULL, NULL, NULL, NULL, 'Medium', 12.00, 5, '2026-03-27 10:05:45', '2026-03-27 10:05:45', 4, 'c', '', 256);

-- --------------------------------------------------------

--
-- Table structure for table `coding_submissions`
--

CREATE TABLE `coding_submissions` (
  `id` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `codingQuestionId` int(11) NOT NULL,
  `submissionId` int(11) DEFAULT NULL,
  `language` enum('C','Java','Python'') NOT NULL,
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
(9, 'Data Structures Mid Exam', 'Exam on stacks, queues, linked lists, and trees.', 50, 24, 60.00, 20.00, 'Online', 'Published', '2026-03-26 22:10:00', '2026-05-14 06:00:00', 1, 0, 0, 0.00, 1, 4, '2026-02-19 10:10:29', '2026-03-27 10:04:52'),
(10, 'DBMS Internal Test', 'SQL queries, normalization, and ER diagrams.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-05-17 05:30:00', '2026-05-17 06:00:00', 1, 0, 0, 0.00, 1, 5, '2026-02-19 10:10:29', '2026-03-06 09:03:38'),
(12, 'Digital Electronics Exam', 'Logic gates, flip-flops, and number systems.', 50, 25, 60.00, 20.00, 'Online', 'Published', '2026-03-26 22:04:00', '2026-03-26 23:00:00', 1, 0, 0, 0.00, 1, 7, '2026-02-19 10:10:30', '2026-03-27 10:03:01'),
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
(262, 15, 282, 24, '2026-03-06 08:30:46', '2026-03-06 08:30:46'),
(265, 12, 284, 25, '2026-03-24 07:22:08', '2026-03-24 07:22:08'),
(268, 9, 287, 25, '2026-03-27 10:05:45', '2026-03-27 10:05:45');

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
(29, 5, 13, NULL, NULL, 'In Progress', '2026-03-24 06:24:15', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, '2026-03-24 06:24:15', '2026-03-24 06:24:15'),
(30, 5, 13, NULL, NULL, 'In Progress', '2026-03-24 06:24:15', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, '2026-03-24 06:24:15', '2026-03-24 06:24:15'),
(33, 5, 14, NULL, NULL, 'In Progress', '2026-03-24 07:02:42', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, '2026-03-24 07:02:42', '2026-03-24 07:02:42'),
(34, 5, 14, '2026-03-24 07:02:53', 10, 'Evaluated', '2026-03-24 07:02:43', 0.00, 3, 'improve', '2026-03-24 07:04:20', 0, 0, 0, NULL, '2026-03-24 07:02:43', '2026-03-24 07:04:20'),
(39, 5, 12, NULL, NULL, 'In Progress', '2026-03-24 07:23:29', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, '2026-03-24 07:23:29', '2026-03-24 07:23:29'),
(40, 5, 12, '2026-03-24 07:25:36', 127, 'Evaluated', '2026-03-24 07:23:29', 0.00, NULL, NULL, NULL, 0, 0, 0, NULL, '2026-03-24 07:23:29', '2026-03-24 07:25:36');

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
  `questionType` enum('Multiple Choice','True/False','Short Answer','Essay','Matching','Coding') NOT NULL,
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
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `codingQuestionId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `questionText`, `questionType`, `marks`, `difficulty`, `topic`, `courseId`, `optionA`, `optionB`, `optionC`, `optionD`, `correctAnswer`, `explanation`, `imageUrl`, `displayOrder`, `createdAt`, `updatedAt`, `codingQuestionId`) VALUES
(42, 'Which Data Structure follows LIFO?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Queue', 'Stack', 'Array', 'Tree', 'B', NULL, NULL, NULL, '2026-03-01 06:50:34', '2026-03-03 08:53:54', NULL),
(43, 'Time complexity of Binary Search?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'O(n)', 'O(logn)', 'O(n2)', 'O(1)', 'B', NULL, NULL, NULL, '2026-03-01 06:52:17', '2026-03-03 08:54:03', NULL),
(44, 'Queue follows which principle?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'LIFO', 'FIFO', 'FILO', 'Random', 'B', NULL, NULL, NULL, '2026-03-01 06:53:44', '2026-03-03 08:54:12', NULL),
(45, 'Maximum children in binary tree node', 'Multiple Choice', 2.00, 'Medium', '', 4, '1', '3', 'unlimited', '2', 'D', NULL, NULL, NULL, '2026-03-01 06:54:40', '2026-03-03 08:54:22', NULL),
(46, 'Inorder traversal order?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Root-Left-Right', 'Left-Right-Root', 'Left-Root-Right', 'Right-Left-Root', 'C', NULL, NULL, NULL, '2026-03-01 06:56:30', '2026-03-03 08:54:32', NULL),
(47, 'Stack overflow occurs when?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Empty', 'Full', 'Sorted', 'Reversed', 'B', NULL, NULL, NULL, '2026-03-01 06:57:26', '2026-03-03 08:54:44', NULL),
(48, 'Merge sort technique?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Greedy', 'Divede &Conquer', 'Dynamic', 'Backtracking', 'B', NULL, NULL, NULL, '2026-03-01 06:59:02', '2026-03-03 08:54:59', NULL),
(49, 'AVL tree is?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Heap', 'Graph', 'Self-balancing BST', 'Queue', 'D', NULL, NULL, NULL, '2026-03-01 07:00:35', '2026-03-03 08:55:09', NULL),
(50, 'BFS uses ?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Stack', 'Queue', 'Tree', 'Array', 'B', NULL, NULL, NULL, '2026-03-01 07:01:40', '2026-03-03 08:55:17', NULL),
(51, 'DFS uses?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Stack', 'Queue', 'Heap', 'Graph', 'A', NULL, NULL, NULL, '2026-03-01 07:03:57', '2026-03-03 08:55:26', NULL),
(52, 'Linked List stores data in?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Continuous memory', 'Non-Continuous memory', 'Stack', 'Cache', 'B', NULL, NULL, NULL, '2026-03-01 07:05:23', '2026-03-03 08:55:35', NULL),
(53, 'Best case Quick sort?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'o(n2)', 'O(nlogn)', 'O(n)', 'O(logn)', 'B', NULL, NULL, NULL, '2026-03-01 07:06:30', '2026-03-03 08:55:51', NULL),
(54, 'Hashing used in?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Stack', 'Queue', 'Hash Table', 'Tree', 'C', NULL, NULL, NULL, '2026-03-01 07:07:14', '2026-03-03 08:56:03', NULL),
(55, 'Heap used for?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Searching', 'Heap Sort', 'Printing', 'Memory', 'B', NULL, NULL, NULL, '2026-03-01 07:08:04', '2026-03-03 08:56:17', NULL),
(56, 'prefix evaluation uses?', 'Multiple Choice', 2.00, 'Medium', '', 4, 'Stack', 'Queue', 'Array', 'Graph', 'A', NULL, NULL, NULL, '2026-03-01 07:09:19', '2026-03-03 08:56:26', NULL),
(57, 'SQL stands for ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Simple Query Language', 'Structure Query Language', 'System Query Language', 'None of the above', 'B', NULL, NULL, NULL, '2026-03-03 08:41:45', '2026-03-03 08:41:45', NULL),
(58, 'Primary Key is ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Duplicate', 'Unique & not null', 'Optional', 'Foreign', 'B', NULL, NULL, NULL, '2026-03-03 08:42:31', '2026-03-03 08:46:41', NULL),
(59, '3NF removes ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Partial dependency', 'Transitive Dependency', 'Redundancy', 'Keys', 'B', NULL, NULL, NULL, '2026-03-03 08:43:44', '2026-03-03 08:43:44', NULL),
(60, 'ACID Ensures ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Security', 'Speed', 'Reliability', 'Storage', 'C', NULL, NULL, NULL, '2026-03-03 08:44:20', '2026-03-03 08:44:20', NULL),
(61, 'DDL command ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'INSERT', 'SELECT', 'CREATE', 'UPDATE', 'C', NULL, NULL, NULL, '2026-03-03 08:45:05', '2026-03-03 08:45:05', NULL),
(62, 'Foreign Key References ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'View', 'Index', 'Trigger', 'Primary Kay', 'D', NULL, NULL, NULL, '2026-03-03 08:46:18', '2026-03-03 08:46:18', NULL),
(63, 'Normalization Reduces ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Speed', 'Redudancy', 'Index', 'Query', 'B', NULL, NULL, NULL, '2026-03-03 08:47:30', '2026-03-03 08:47:30', NULL),
(64, 'COMMIT does ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Roll bcak', 'Delete', 'Save Transaction', 'Stop', 'C', NULL, NULL, NULL, '2026-03-03 08:48:36', '2026-03-03 08:48:36', NULL),
(65, 'View is ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Real Table', 'Virtual table', 'Index', 'Key', 'B', NULL, NULL, NULL, '2026-03-03 08:49:21', '2026-03-03 08:49:21', NULL),
(66, 'Deadlock means ?', 'Multiple Choice', 2.00, 'Medium', '', 5, 'Crash', 'Infinite waiting', 'Backup', 'Speed', 'B', NULL, NULL, NULL, '2026-03-03 08:50:11', '2026-03-03 08:50:11', NULL),
(67, 'NAND gate is Known as ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Basic gate', 'Universal gate', 'Exclusive gate', 'Buffer', 'B', NULL, NULL, NULL, '2026-03-03 12:45:51', '2026-03-03 13:19:20', NULL),
(68, 'Binary number system base is ?', 'Multiple Choice', 2.00, 'Medium', '', 7, '2', '8', '10', '16', 'A', NULL, NULL, NULL, '2026-03-03 12:46:42', '2026-03-03 12:46:56', NULL),
(69, 'Full adder has how many inputs ?', 'Multiple Choice', 2.00, 'Hard', '', 7, '2', '3', '4', '5', 'B', NULL, NULL, NULL, '2026-03-03 12:47:41', '2026-03-03 13:19:08', NULL),
(70, 'Flip-flop stores ?', 'Multiple Choice', 2.00, 'Medium', '', 7, '2 bits', '4 bits', '1 bits', '8 bits', 'C', NULL, NULL, NULL, '2026-03-03 12:48:57', '2026-03-03 12:48:57', NULL),
(71, 'XOR outputs 1 when inputs are ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Same', 'Different', '0', '1', 'B', NULL, NULL, NULL, '2026-03-03 12:49:46', '2026-03-03 13:19:36', NULL),
(72, 'Decimal 10 in binary ?', 'Multiple Choice', 2.00, 'Hard', '', 7, '1001', '1010', '1110', '1100', 'B', NULL, NULL, NULL, '2026-03-03 12:51:59', '2026-03-03 12:51:59', NULL),
(73, 'NOR gate is ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Univarsal gate', 'Memory', 'Encoder', 'Decoder', 'A', NULL, NULL, NULL, '2026-03-03 12:53:00', '2026-03-03 13:19:46', NULL),
(74, 'K-map is used for ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'Storage', 'Simplification', 'Addition', 'Conversion', 'B', NULL, NULL, NULL, '2026-03-03 12:54:02', '2026-03-03 12:55:49', NULL),
(75, 'AND gate output is 1 when ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'Any input 1', 'All input 1', 'All inputs 0', 'Any input 0', 'B', NULL, NULL, NULL, '2026-03-03 12:55:21', '2026-03-03 12:55:58', NULL),
(76, 'Truth table shows ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Code', 'Output combinations', 'Memory', 'Storage', 'B', NULL, NULL, NULL, '2026-03-03 12:58:00', '2026-03-03 13:20:01', NULL),
(77, 'Multiplexer selects ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'One inputs', 'Two inputs', 'All inputs', 'None', 'A', NULL, NULL, NULL, '2026-03-03 12:58:57', '2026-03-03 12:59:10', NULL),
(78, 'Decoder converts ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Binary to decimal', 'Decimal to binary', 'Analog to digital', 'Digital to analog', 'A', NULL, NULL, NULL, '2026-03-03 13:00:22', '2026-03-03 13:20:12', NULL),
(79, 'SR flip-flop invalid state ?', 'Multiple Choice', 2.00, 'Medium', '', 7, '00', '01', '10', '11', 'D', NULL, NULL, NULL, '2026-03-03 13:01:57', '2026-03-03 13:01:57', NULL),
(80, 'BCS Stands for ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Binary Code Decimal', 'Binary Coded Decimal', 'Bit Code Decimal', 'Base Code Decimal', 'B', NULL, NULL, NULL, '2026-03-03 13:10:41', '2026-03-03 13:10:41', NULL),
(81, 'Not gate output of 1 ?', 'Multiple Choice', 2.00, 'Hard', '', 7, '1', '0', '2', 'Undefined', 'B', NULL, NULL, NULL, '2026-03-03 13:11:37', '2026-03-03 13:11:37', NULL),
(82, 'Half adder produces ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'Sum & Carry', 'Sum Only', 'Carry Only', 'None', 'A', NULL, NULL, NULL, '2026-03-03 13:12:59', '2026-03-03 13:12:59', NULL),
(83, 'Encoder converts ?', 'Multiple Choice', 2.00, 'Easy', '', 7, 'Many input to fewer outputs ', 'few to many', 'Analog to analog ', 'Digital to analog', 'A', NULL, NULL, NULL, '2026-03-03 13:15:17', '2026-03-03 13:20:28', NULL),
(84, 'Combinational Circuit depends on ?', 'Multiple Choice', 2.00, 'Medium', '', 7, 'Past output', 'Current input ', 'Memory ', 'Clock', 'B', NULL, NULL, NULL, '2026-03-03 13:16:06', '2026-03-03 13:16:06', NULL),
(85, 'Flip-flop triggered by ?', 'Multiple Choice', 2.00, 'Hard', '', 7, 'Voltage', 'Clock pulse', 'Heat', 'Current', 'B', NULL, NULL, NULL, '2026-03-03 13:17:19', '2026-03-03 13:17:19', NULL),
(86, 'Sequential circuit use ?', 'Multiple Choice', 2.00, 'Hard', '', 7, 'Resistor', 'Capacity', 'Memory', 'Transformer', 'C', NULL, NULL, NULL, '2026-03-03 13:18:48', '2026-03-03 13:18:48', NULL),
(87, 'SI unit of force ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Joule', 'Watt', 'Newton', 'Pascal', 'C', NULL, NULL, NULL, '2026-03-03 13:23:20', '2026-03-03 13:23:20', NULL),
(88, 'force is ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Scalar', 'Vector', 'Energy', 'Speed', 'B', NULL, NULL, NULL, '2026-03-03 13:24:42', '2026-03-03 13:24:42', NULL),
(89, 'Newton\'s Second Law ?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'F = ma', 'F = mv', 'E = mc2', 'W = fd', 'A', NULL, NULL, NULL, '2026-03-03 13:26:06', '2026-03-03 13:26:06', NULL),
(90, 'Work ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'F/d', 'F * d', 'm*a', 'd/t', 'B', NULL, NULL, NULL, '2026-03-03 13:27:18', '2026-03-03 13:27:18', NULL),
(91, 'Acceleration due to gravity ?', 'Multiple Choice', 2.00, 'Hard', '', 9, '9.8 m/s2', '8 m/s2', '10 m/s2', '12 m/s2', 'A', NULL, NULL, NULL, '2026-03-03 13:29:51', '2026-03-03 13:29:51', NULL),
(92, 'Torgue is ?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Linear force', 'Rotational force', 'Energy ', 'Speed', 'B', NULL, NULL, NULL, '2026-03-03 13:31:00', '2026-03-03 13:31:00', NULL),
(93, 'Unit of stress ?', 'Multiple Choice', 2.00, 'Hard', '', 9, 'Newton', 'N/m2', 'Joule', 'Watt', 'B', NULL, NULL, NULL, '2026-03-03 13:31:59', '2026-03-03 13:31:59', NULL),
(94, 'Equilibrium means ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Motion', 'Balanced force', 'Speed', 'Friction', 'B', NULL, NULL, NULL, '2026-03-03 13:33:04', '2026-03-03 13:33:04', NULL),
(95, 'Resultant force is ?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Difference', 'Product', 'Sum of forces', 'Division', 'C', NULL, NULL, NULL, '2026-03-03 13:34:14', '2026-03-03 13:34:14', NULL),
(96, 'Inertia resists change in ?', 'Multiple Choice', 2.00, 'Hard', '', 9, 'Speed', 'Motion', 'Weight', 'Gravity', 'B', NULL, NULL, NULL, '2026-03-03 13:35:06', '2026-03-03 13:35:06', NULL),
(97, 'Vector has ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Magnitude only', 'Direction only', 'Magnitude & Direction', 'None', 'C', NULL, NULL, NULL, '2026-03-03 13:36:25', '2026-03-03 13:36:25', NULL),
(98, 'Static friction acts when ?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Moving', 'Falling', 'At rest', 'Accelerating', 'C', NULL, NULL, NULL, '2026-03-03 13:37:45', '2026-03-03 13:37:45', NULL),
(99, 'Free body diagram shows ?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Energy', 'Forces', 'Speed', 'Mass', 'B', NULL, NULL, NULL, '2026-03-03 13:38:48', '2026-03-03 13:38:48', NULL),
(100, 'Beam supports?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Load ', 'Speed', 'Time', 'Energy', 'A', NULL, NULL, NULL, '2026-03-03 13:43:00', '2026-03-03 13:43:00', NULL),
(101, 'Moment formula?', 'Multiple Choice', 2.00, 'Hard', '', 9, ' m × a', 'P × t', ' F × d', 'V × I', 'C', NULL, NULL, NULL, '2026-03-03 13:44:01', '2026-03-03 13:44:01', NULL),
(102, 'Power unit?', 'Multiple Choice', 2.00, 'Hard', '', 9, 'Watt ', 'Newton', 'Joule', 'Pascal', 'A', NULL, NULL, NULL, '2026-03-03 13:44:43', '2026-03-03 13:44:43', NULL),
(103, 'Centroid relates to?', 'Multiple Choice', 2.00, 'Easy', '', 9, 'Speed', 'Volume', 'Area ', 'Weight', 'C', NULL, NULL, NULL, '2026-03-03 13:45:29', '2026-03-03 13:45:29', NULL),
(104, 'Shear force acts?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Parallel', 'Random', 'Circular', 'Perpendicular ', 'D', NULL, NULL, NULL, '2026-03-03 13:46:16', '2026-03-03 13:47:55', NULL),
(105, 'First law of motion is law of?', 'Multiple Choice', 2.00, 'Hard', '', 9, 'Action', 'Reaction', 'Inertia ', 'Motion', 'C', NULL, NULL, NULL, '2026-03-03 13:46:58', '2026-03-03 13:46:58', NULL),
(106, 'Friction opposes?', 'Multiple Choice', 2.00, 'Medium', '', 9, 'Gravity', 'Motion ', 'Speed', 'Force', 'B', NULL, NULL, NULL, '2026-03-03 13:47:36', '2026-03-03 13:47:36', NULL),
(107, '8086 is?', 'Multiple Choice', 2.00, 'Easy', '', 8, '8-bit', '16-bit', '32-bit', '64-bit', 'B', NULL, NULL, NULL, '2026-03-03 13:52:41', '2026-03-03 13:52:41', NULL),
(108, 'ALU performs?', 'Multiple Choice', 2.00, 'Medium', '', 8, 'Storage', 'Input', 'Arithmetic & Logic', 'Output', 'C', NULL, NULL, NULL, '2026-03-03 13:54:00', '2026-03-03 13:54:00', NULL),
(109, 'Program Counter stores?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Data', 'Output', 'Address of next instruction', 'Flag', 'C', NULL, NULL, NULL, '2026-03-03 13:55:08', '2026-03-03 13:55:08', NULL),
(110, 'RAM is?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Permanent', 'ROM', 'Cache', 'Temporary memory', 'D', NULL, NULL, NULL, '2026-03-03 13:56:44', '2026-03-03 13:56:44', NULL),
(111, 'ROM stands for?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Read Only Memory', ' Random Only Memory', 'Run Only Memory', 'Rapid Memory', 'A', NULL, NULL, NULL, '2026-03-03 14:01:08', '2026-03-03 14:01:08', NULL),
(112, 'Stack works on?', 'Multiple Choice', 2.00, 'Medium', '', 8, 'FIFO', 'None', 'Random', 'LIFO', 'D', NULL, NULL, NULL, '2026-03-03 14:02:14', '2026-03-03 14:02:14', NULL),
(113, 'Flag register stores?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Data', 'Address', 'Code', 'Status flags ', 'D', NULL, NULL, NULL, '2026-03-03 14:03:16', '2026-03-03 14:03:16', NULL),
(114, 'Interrupt is?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Memory', 'Bus', 'Program', 'Signal to CPU', 'D', NULL, NULL, NULL, '2026-03-03 14:04:15', '2026-03-03 14:04:15', NULL),
(115, 'Microcontroller includes?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'CPU only', 'CPU + Memory + I/O', 'RAM only', 'ALU only', 'B', NULL, NULL, NULL, '2026-03-03 14:05:48', '2026-03-03 14:05:48', NULL),
(116, 'Address bus carries?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Data', 'Address ', 'Control', 'Power', 'B', NULL, NULL, NULL, '2026-03-03 14:06:40', '2026-03-03 14:06:40', NULL),
(117, 'Data bus carries?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Address', 'Control', 'Data ', 'Voltage', 'C', NULL, NULL, NULL, '2026-03-03 14:07:42', '2026-03-03 14:07:42', NULL),
(118, 'Control bus carries?', 'Multiple Choice', 2.00, 'Medium', '', 8, 'Data', 'Control signals', 'Address', 'Power', 'B', NULL, NULL, NULL, '2026-03-03 14:08:52', '2026-03-03 14:08:52', NULL),
(119, 'Instruction cycle includes?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Fetch', 'Decode', 'Execute', 'All of these', 'D', NULL, NULL, NULL, '2026-03-03 14:09:52', '2026-03-03 14:09:52', NULL),
(120, 'Accumulator used for?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Arithmetic operations', 'Output', 'Storage', 'Input', 'A', NULL, NULL, NULL, '2026-03-03 14:10:46', '2026-03-03 14:10:46', NULL),
(121, '8086 has how many bits data bus?', 'Multiple Choice', 2.00, 'Easy', '', 8, '8', '16 ', '64', '32', 'B', NULL, NULL, NULL, '2026-03-03 14:11:54', '2026-03-03 14:11:54', NULL),
(122, 'Clock controls?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Speed of processor', 'Memory size', 'Power', 'Heat', 'A', NULL, NULL, NULL, '2026-03-03 14:12:46', '2026-03-03 14:12:46', NULL),
(123, 'Segment register used for?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Memory segmentation', 'Input', 'Output', 'None', 'A', NULL, NULL, NULL, '2026-03-03 14:13:47', '2026-03-03 14:13:47', NULL),
(124, 'Stack pointer stores?', 'Multiple Choice', 2.00, 'Medium', '', 8, 'Data', 'Flag', 'Top of stack address', 'Output', 'C', NULL, NULL, NULL, '2026-03-03 14:14:43', '2026-03-03 14:14:43', NULL),
(125, 'Interrupt can be?', 'Multiple Choice', 2.00, 'Easy', '', 8, 'Hardware', 'Software', 'Both ', 'None', 'C', NULL, NULL, NULL, '2026-03-03 14:15:25', '2026-03-03 14:15:25', NULL),
(126, 'Microprocessor is?', 'Multiple Choice', 2.00, 'Hard', '', 8, 'Single chip CPU ', 'Memory', 'Bus', 'Register', 'A', NULL, NULL, NULL, '2026-03-03 14:16:13', '2026-03-03 14:16:13', NULL),
(127, 'OOP stands for?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Object Organized Programming', 'Only Object Programming', 'Object Oriented Programming', 'Open Object Programming', 'C', NULL, NULL, NULL, '2026-03-04 07:40:32', '2026-03-04 07:40:32', NULL),
(128, 'Encapsulation means?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'Data sharing', 'Data hiding', 'Data deleting', 'Data copying', 'B', NULL, NULL, NULL, '2026-03-04 07:43:05', '2026-03-04 07:43:05', NULL),
(129, 'Polymorphism means?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'One form', 'No form', 'Many forms', 'Hidden form', 'C', NULL, NULL, NULL, '2026-03-04 07:45:04', '2026-03-04 07:45:04', NULL),
(130, 'Inheritance provides?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'Deletion', 'Hiding', 'Code reusability', 'Stopping execution', 'C', NULL, NULL, NULL, '2026-03-04 07:45:50', '2026-03-04 07:45:50', NULL),
(131, 'Constructor is used to?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'Destroy object', 'Initialize object', 'Hide data', 'Delete class', 'B', NULL, NULL, NULL, '2026-03-04 07:46:55', '2026-03-04 07:46:55', NULL),
(132, 'Which keyword creates object in Java?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'class', 'object', 'new ', 'create', 'C', NULL, NULL, NULL, '2026-03-04 07:47:36', '2026-03-04 07:47:36', NULL),
(133, 'Method overloading is?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Runtime polymorphism', 'Compile-time polymorphism', 'Abstraction', 'Inheritance', 'B', NULL, NULL, NULL, '2026-03-04 07:48:27', '2026-03-04 07:48:27', NULL),
(134, 'Abstraction hides?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Data', 'Implementation details', 'Variables', 'Objects', 'B', NULL, NULL, NULL, '2026-03-04 07:50:18', '2026-03-04 07:50:18', NULL),
(135, 'Interface supports?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Single inheritance', 'Multiple inheritance', 'No inheritance', 'Hybrid', 'B', NULL, NULL, NULL, '2026-03-04 07:51:30', '2026-03-04 07:51:30', NULL),
(136, 'super keyword refers to?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Object', 'Child class', 'Parent class', 'Method', 'C', NULL, NULL, NULL, '2026-03-04 07:53:05', '2026-03-04 07:53:05', NULL),
(137, 'This keyword refers to?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Parent', 'Current object', 'Interface', 'Package', 'B', NULL, NULL, NULL, '2026-03-04 07:54:08', '2026-03-04 07:54:08', NULL),
(138, 'Class is?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Object', 'Method', 'Blueprint of object ', 'Variable', 'C', NULL, NULL, NULL, '2026-03-04 07:55:04', '2026-03-04 07:55:04', NULL),
(139, 'Object is?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Variable', 'Instance of class', 'Method', 'Package', 'B', NULL, NULL, NULL, '2026-03-04 07:56:00', '2026-03-04 07:56:00', NULL),
(140, 'Private access modifier means?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Accessible only within class', 'Public access', 'Protected', 'Global', 'A', NULL, NULL, NULL, '2026-03-04 07:57:29', '2026-03-04 07:57:29', NULL),
(141, 'Destructor is used to?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Create object', 'Destroy object', 'Hide method', 'Override', 'B', NULL, NULL, NULL, '2026-03-04 07:59:47', '2026-03-04 07:59:47', NULL),
(142, 'Inheritance types in Java?', 'Multiple Choice', 2.00, 'Hard', '', 3, ' Multiple (class)', 'Multilevel ', 'Circular', 'None', 'B', NULL, NULL, NULL, '2026-03-04 08:01:26', '2026-03-04 08:01:26', NULL),
(143, 'Encapsulation improves?', 'Multiple Choice', 2.00, 'Medium', '', 3, 'Speed', 'Security ', 'Memory', 'Execution', 'B', NULL, NULL, NULL, '2026-03-04 08:04:49', '2026-03-04 08:04:49', NULL),
(144, 'Abstract class contains?', 'Multiple Choice', 2.00, 'Easy', '', 3, 'Only concrete methods', 'Abstract methods', 'Variables only', 'Main method', 'B', NULL, NULL, NULL, '2026-03-04 08:05:37', '2026-03-04 08:05:37', NULL),
(145, 'Getter and Setter used for?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Looping', 'Accessing private data', 'Sorting', 'Printing', 'B', NULL, NULL, NULL, '2026-03-04 08:06:24', '2026-03-04 08:06:24', NULL),
(146, 'Method overriding is?', 'Multiple Choice', 2.00, 'Hard', '', 3, 'Compile-time', 'Constructor', 'Interface', 'Runtime polymorphism', 'D', NULL, NULL, NULL, '2026-03-04 08:07:31', '2026-03-04 08:09:06', NULL),
(147, 'OS acts as?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Compiler', 'Interface between user & hardware', 'Browser', 'Editor', 'B', NULL, NULL, NULL, '2026-03-04 08:39:44', '2026-03-04 08:39:44', NULL),
(148, 'SJF stands for?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'Simple Job First', 'System Job First', 'Small Job First', 'Shortest Job First', 'D', NULL, NULL, NULL, '2026-03-04 08:40:37', '2026-03-04 08:40:37', NULL),
(149, 'Deadlock means?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Crash', 'Infinite waiting', 'Speed', 'Halt', 'B', NULL, NULL, NULL, '2026-03-04 08:41:39', '2026-03-04 08:41:39', NULL),
(150, 'Paging avoids?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'External fragmentation', 'Both internal & external fragmentation partially', 'Memory', 'CPU', 'B', NULL, NULL, NULL, '2026-03-04 08:42:37', '2026-03-04 08:42:37', NULL),
(151, 'FIFO scheduling is?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'First In First Out', 'Fast In Fast Out', 'File In File Out', 'None', 'A', NULL, NULL, NULL, '2026-03-04 08:43:22', '2026-03-04 08:43:22', NULL),
(152, 'Semaphore used for?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Scheduling', 'Process synchronization ', 'Memory', 'Storage', 'B', NULL, NULL, NULL, '2026-03-04 08:44:26', '2026-03-04 08:44:26', NULL),
(153, 'Process is?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Program in disk', 'Thread', 'Program in execution', 'File', 'C', NULL, NULL, NULL, '2026-03-04 08:45:31', '2026-03-04 08:45:31', NULL),
(154, 'Thread is?', 'Multiple Choice', 2.00, 'Medium', '', 6, 'Heavyweight', 'File', 'CPU', 'Lightweight process', 'D', NULL, NULL, NULL, '2026-03-04 08:46:32', '2026-03-04 08:46:32', NULL),
(155, 'Context switching means?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Memory delete', 'Shutdown', 'Switching CPU between processe', 'Boot', 'C', NULL, NULL, NULL, '2026-03-04 08:47:46', '2026-03-04 08:47:46', NULL),
(156, 'Virtual memory uses?', 'Multiple Choice', 2.00, 'Medium', '', 6, ' RAM only', 'Disk as extension of RAM', 'ROM', 'Cache', 'B', NULL, NULL, NULL, '2026-03-04 08:48:45', '2026-03-04 08:48:45', NULL),
(157, 'Banker\'s algorithm used for?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'Scheduling', 'Memory', 'Deadlock avoidance', 'Storage', 'C', NULL, NULL, NULL, '2026-03-04 08:49:24', '2026-03-04 08:49:24', NULL),
(158, 'CPU scheduling decides?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Memory', 'Which process runs next', 'File', 'Disk', 'B', NULL, NULL, NULL, '2026-03-04 08:50:07', '2026-03-04 08:50:07', NULL),
(159, 'Kernel is?', 'Multiple Choice', 2.00, 'Medium', '', 6, 'Application', 'Hardware', ' Core of OS', 'Driver', 'C', NULL, NULL, NULL, '2026-03-04 08:51:00', '2026-03-04 08:51:00', NULL),
(160, 'Round Robin uses?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'Priority', 'Time quantum', 'FIFO', 'None', 'B', NULL, NULL, NULL, '2026-03-04 08:51:54', '2026-03-04 08:51:54', NULL),
(161, 'Starvation occurs due to?', 'Multiple Choice', 2.00, 'Medium', '', 6, 'Deadlock', 'Paging', 'Low priority process waiting long', 'Boot', 'C', NULL, NULL, NULL, '2026-03-04 08:52:46', '2026-03-04 08:52:46', NULL),
(162, 'Interrupt is?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'File', 'Signal to CPU ', 'Memory', 'Cache', 'B', NULL, NULL, NULL, '2026-03-04 08:53:28', '2026-03-04 08:53:28', NULL),
(163, 'File system manages?', 'Multiple Choice', 2.00, 'Medium', '', 6, 'CPU', 'Files & directories', 'RAM', 'Printer', 'B', NULL, NULL, NULL, '2026-03-04 08:54:15', '2026-03-04 08:54:15', NULL),
(164, 'Multitasking means?', 'Multiple Choice', 2.00, 'Easy', '', 6, 'Single task', 'No task', 'Multiple tasks simultaneously ', 'Manual task', 'C', NULL, NULL, NULL, '2026-03-04 08:55:19', '2026-03-04 08:55:19', NULL),
(165, 'Swapping transfers process between?', 'Multiple Choice', 2.00, 'Hard', '', 6, 'CPU & Cache', 'RAM & Disk', 'ROM & RAM', 'Disk & Printer', 'B', NULL, NULL, NULL, '2026-03-04 08:57:40', '2026-03-04 08:57:40', NULL),
(166, 'Deadlock requires?', 'Multiple Choice', 2.00, 'Hard', '', 6, '2 conditions', ' 3 conditions', '4 conditions', '5 conditions', 'C', NULL, NULL, NULL, '2026-03-04 08:58:27', '2026-03-04 08:58:27', NULL),
(167, 'Father of Scientific Management?', 'Multiple Choice', 2.00, 'Easy', '', 11, 'Fayol', 'F.W. Taylor ', 'Drucker', 'Weber', 'B', NULL, NULL, NULL, '2026-03-04 12:49:42', '2026-03-04 12:49:42', NULL),
(168, 'First function of management?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'Organizing', 'Controlling', 'Planning ', 'Staffing', 'C', NULL, NULL, NULL, '2026-03-04 12:50:22', '2026-03-04 12:50:22', NULL),
(169, 'SWOT stands for?', 'Multiple Choice', 2.00, 'Easy', '', 11, 'Strength Weakness Opportunity Threat', 'System Work Operation Tool', 'Strategy Work Output Target', 'None', 'A', NULL, NULL, NULL, '2026-03-04 12:51:10', '2026-03-04 12:51:10', NULL),
(170, 'Leadership is?', 'Multiple Choice', 2.00, 'Hard', '', 11, 'Controlling', 'Influencing people', 'Accounting', 'Planning', 'B', NULL, NULL, NULL, '2026-03-04 12:51:46', '2026-03-04 12:51:46', NULL),
(171, 'Delegation means?', 'Multiple Choice', 2.00, 'Hard', '', 11, 'Removing power', 'Stopping work', 'Assigning authority & responsibility', 'Hiring', 'C', NULL, NULL, NULL, '2026-03-04 12:52:45', '2026-03-04 12:52:45', NULL),
(172, 'C developed by?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'James Gosling', 'Dennis Ritchie', 'Guido', 'Bjarne', 'B', NULL, NULL, NULL, '2026-03-04 12:55:19', '2026-03-04 12:55:19', NULL),
(173, 'Header file for printf?', 'Multiple Choice', 2.00, 'Medium', '', 2, 'math.h', 'conio.h', 'string.h', ' stdio.h', 'D', NULL, NULL, NULL, '2026-03-04 12:56:17', '2026-03-04 12:56:17', NULL),
(174, 'main() is?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'Variable', 'Entry point of program', 'Loop', 'Array', 'B', NULL, NULL, NULL, '2026-03-04 12:56:56', '2026-03-04 12:56:56', NULL),
(175, 'sizeof(int) typically?', 'Multiple Choice', 2.00, 'Medium', '', 2, '1', '2', '4 (system dependent)', '8', 'C', NULL, NULL, NULL, '2026-03-04 12:57:46', '2026-03-04 12:57:46', NULL),
(176, 'Pointer stores?', 'Multiple Choice', 2.00, 'Easy', '', 2, 'Value', 'Address of variable', 'Data type', 'File', 'B', NULL, NULL, NULL, '2026-03-04 12:58:30', '2026-03-04 12:58:30', NULL),
(177, 'Stress = ?', 'Multiple Choice', 2.00, 'Medium', '', 10, ' Force/Area', 'Area/Force', ' Force×Area', 'None', 'A', NULL, NULL, NULL, '2026-03-04 12:59:31', '2026-03-04 12:59:31', NULL),
(178, 'Strain is?', 'Multiple Choice', 2.00, 'Hard', '', 10, 'Force', 'Energy', 'Deformation/Original length', 'Weight', 'C', NULL, NULL, NULL, '2026-03-04 13:00:11', '2026-03-04 13:00:11', NULL),
(179, 'Young’s modulus formula?', 'Multiple Choice', 2.00, 'Medium', '', 10, 'Stress × Strain', 'Stress / Strain', ' Force × Length', 'None', 'B', NULL, NULL, NULL, '2026-03-04 13:01:08', '2026-03-04 13:01:08', NULL),
(180, 'Bending moment unit?', 'Multiple Choice', 2.00, 'Easy', '', 10, 'N', ' N/m', 'Nm ', 'Joule', 'C', NULL, NULL, NULL, '2026-03-04 13:01:57', '2026-03-04 13:01:57', NULL),
(181, 'Which function of management involves setting objectives and determining the course of action?', 'Multiple Choice', 2.00, 'Hard', '', 11, 'Controlling', 'Planning', 'Directing', 'Staffing', 'B', NULL, NULL, NULL, '2026-03-04 13:05:38', '2026-03-04 13:05:38', NULL),
(182, 'Unity of Command means ?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'One manager controls many workers', 'One department controls all', 'One employee receives orders from one superior', 'Employees work in teams', 'C', NULL, NULL, NULL, '2026-03-04 13:06:28', '2026-03-04 13:06:28', NULL),
(183, 'Span of Control refers to?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'Number of departments', 'Number of subordinates reporting to a manager', 'Level of authority', 'Number of policies', 'B', NULL, NULL, NULL, '2026-03-04 13:07:12', '2026-03-04 13:07:12', NULL),
(184, 'Which level of management is responsible for strategic decisions?', 'Multiple Choice', 2.00, 'Medium', '', 11, 'Top-level management', 'Middle-level management', 'Lower-level management', 'Supervisory level', 'A', NULL, NULL, NULL, '2026-03-04 13:08:05', '2026-03-04 13:08:05', NULL),
(185, 'Planning is concerned