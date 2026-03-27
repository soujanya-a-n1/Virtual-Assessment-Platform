# Coding Questions - Complete Testing Guide

## Database Schema Overview

### Tables and Relationships:

1. **questions** - Regular exam questions (MCQ, True/False, Short Answer, Coding)
   - `questionType` ENUM includes 'Coding'
   - For coding questions, `correctAnswer` stores reference to coding_question_id

2. **coding_questions** - Detailed coding question data
   - `id` - Primary key
   - `examId` - Optional direct link to exam
   - `courseId` - Link to course
   - `title` - Question title
   - `description` - Problem description
   - `language` - Programming language (python, javascript, java, cpp, c, csharp, nodejs)
   - `starterCode` - Optional template code
   - `difficulty` - Easy/Medium/Hard
   - `marks` - Points for the question
   - `timeLimit` - Execution time limit in seconds
   - `memoryLimit` - Memory limit in MB

3. **test_cases** - Test cases for coding questions
   - `codingQuestionId` - Foreign key to coding_questions
   - `input` - Test input
   - `expectedOutput` - Expected output
   - `isVisible` - Whether students can see this test case
   - `orderIndex` - Order of execution

4. **coding_submissions** - Student submissions
   - `studentId` - Student who submitted
   - `codingQuestionId` - Question being answered
   - `submissionId` - Link to exam_submissions
   - `language` - Language used
   - `code` - Submitted code
   - `status` - Submitted/Running/Passed/Failed/Error
   - `marksObtained` - Score received

5. **test_results** - Results for each test case
   - `submissionId` - Link to coding_submissions
   - `testCaseId` - Which test case
   - `passed` - Boolean pass/fail
   - `actualOutput` - What the code produced
   - `executionTime` - How long it took

---

## Step-by-Step Testing Flow

### Prerequisites:
✅ Database reset completed
✅ Test data seeded
✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:3000

### Test Credentials:
- **Admin**: admin@test.com / password123
- **Examiner**: examiner@test.com / password123
- **Student**: student@test.com / password123

---

## PHASE 1: Login as Examiner

### Step 1: Login
1. Open browser: http://localhost:3000
2. Click "Login"
3. Enter credentials: examiner@test.com / password123
4. Click "Login"
5. ✅ Should redirect to Dashboard

---

## PHASE 2: Create an Exam

### Step 2: Navigate to Exam Management
1. Click "Exam Management" in sidebar
2. Click "Create New Exam" button
3. ✅ Should see exam creation form

### Step 3: Fill Exam Details
Fill in the following:
- **Title**: "Programming Assessment 1"
- **Description**: "Test your coding skills"
- **Duration**: 60 (minutes)
- **Total Marks**: 100
- **Passing Marks*