# Exam Data Setup Guide

## Overview
This guide explains how to populate your database with comprehensive exam data linked to courses.

## What's Included

### Courses (18 total)
- **Computer Science** (5 courses): CS101, CS201, CS301, CS202, CS302
- **Mathematics** (4 courses): MATH101, MATH201, MATH202, MATH301
- **Physics** (3 courses): PHY101, PHY102, PHY301
- **English** (3 courses): ENG101, ENG201, ENG301
- **Business** (3 courses): BUS101, BUS201, BUS202

### Questions (30+ questions)
- Questions organized by course
- Multiple difficulty levels (Easy, Medium, Hard)
- Topics specified for each question
- Complete with explanations

### Exams (9 exams)
- Linked to specific courses
- Various statuses (Published, Scheduled, Draft)
- Different durations and mark distributions
- Proctoring and shuffle settings configured

## Setup Instructions

### Option 1: Quick Setup (Recommended)

Run this single command to add all exam data:

```bash
mysql -u root -p virtual_assessment_db < database/insert_exam_data.sql
```

This will add:
- 30+ course-specific questions
- 9 exams linked to courses
- All properly configured

### Option 2: Step-by-Step Setup

1. **Ensure Prerequisites**
   ```bash
   # Make sure you have:
   # - Departments created
   # - Courses created
   # - Users created (especially examiner with ID 3)
   ```

2. **Run Master Data Schema** (if not already done)
   ```bash
   mysql -u root -p virtual_assessment_db < database/master_data_schema.sql
   ```

3. **Insert Exam Data**
   ```bash
   mysql -u root -p virtual_assessment_db < database/insert_exam_data.sql
   ```

### Option 3: Comprehensive Setup (Full Data)

For complete data including departments and courses:

```bash
mysql -u root -p virtual_assessment_db < database/exam_data_with_courses.sql
```

## Verify Installation

After running the scripts, verify the data:

```sql
USE virtual_assessment_db;

-- Check courses
SELECT COUNT(*) AS 'Total Courses' FROM courses;

-- Check questions with courses
SELECT COUNT(*) AS 'Questions with Courses' FROM questions WHERE courseId IS NOT NULL;

-- Check exams with courses
SELECT COUNT(*) AS 'Exams with Courses' FROM exams WHERE courseId IS NOT NULL;

-- View exams by course
SELECT 
    e.id,
    e.title,
    c.code AS course_code,
    c.name AS course_name,
    e.status,
    e.totalQuestions,
    e.totalMarks
FROM exams e
JOIN courses c ON e.courseId = c.id
ORDER BY c.code, e.title;

-- View questions by course
SELECT 
    c.code,
    c.name,
    COUNT(q.id) AS question_count
FROM courses c
LEFT JOIN questions q ON c.id = q.courseId
GROUP BY c.id, c.code, c.name
ORDER BY c.code;
```

## Exam Details

### CS101: Introduction to Programming
**Exams:**
1. **CS101 Midterm Exam**
   - Duration: 90 minutes
   - Questions: 5
   - Total Marks: 10
   - Status: Published
   - Topics: Variables, Syntax, Functions, Operators, Loops

2. **CS101 Final Exam**
   - Duration: 120 minutes
   - Questions: 5
   - Total Marks: 10
   - Status: Scheduled
   - Comprehensive coverage

### CS201: Data Structures
**Exam:**
- **Data Structures Midterm**
  - Duration: 90 minutes
  - Questions: 4
  - Total Marks: 12
  - Status: Published
  - Negative marking enabled
  - Topics: Arrays, Stacks, Linked Lists, Sorting

### CS301: Database Systems
**Exam:**
- **Database Systems Midterm**
  - Duration: 90 minutes
  - Questions: 4
  - Total Marks: 10
  - Status: Published
  - Topics: SQL, Primary Keys, Normalization

### MATH101: Calculus I
**Exam:**
- **Calculus I Midterm**
  - Duration: 90 minutes
  - Questions: 4
  - Total Marks: 11
  - Status: Published
  - Topics: Derivatives, Integration, Limits, Trigonometry

### MATH201: Linear Algebra
**Exam:**
- **Linear Algebra Quiz**
  - Duration: 45 minutes
  - Questions: 3
  - Total Marks: 8
  - Status: Published
  - Topics: Vectors, Matrices, Eigenvalues

### PHY101: Physics I
**Exam:**
- **Physics I Midterm**
  - Duration: 90 minutes
  - Questions: 3
  - Total Marks: 7
  - Status: Published
  - Topics: Mechanics, Units, Energy

### ENG101: English Composition
**Exam:**
- **English Composition Midterm**
  - Duration: 90 minutes
  - Questions: 3
  - Total Marks: 6
  - Status: Published
  - Topics: Writing, Grammar, Literary Devices

### BUS101: Business Management
**Exam:**
- **Business Management Quiz**
  - Duration: 30 minutes
  - Questions: 3
  - Total Marks: 7
  - Status: Published
  - Topics: Management Basics, Functions, Strategy

## Testing the Setup

### 1. View Exams in Frontend
1. Login as Admin or Examiner
2. Navigate to Exams Management
3. You should see all 9 exams with course badges
4. Use the course filter to filter by specific courses

### 2. Test Course Filtering
1. In Exams List, select a course from the dropdown
2. Only exams for that course should display
3. Course badge should show on each exam card

### 3. Test Question Management
1. Open any exam
2. Go to Questions tab
3. Click "Add Existing Questions"
4. Questions should be filtered by the exam's course

### 4. Test Assignment
1. Click "Assign" button on any exam
2. Assignment modal should open
3. Select students or classes
4. Assign to exam

## Customization

### Add More Questions

```sql
INSERT INTO questions (questionText, questionType, marks, difficulty, topic, courseId, optionA, optionB, optionC, optionD, correctAnswer, explanation) VALUES
('Your question here?', 'Multiple Choice', 2, 'Medium', 'Your Topic', 1, 'Option A', 'Option B', 'Option C', 'Option D', 'B', 'Explanation here');
```

### Create New Exam

```sql
INSERT INTO exams (title, description, duration, totalQuestions, totalMarks, passingMarks, examType, status, courseId, createdBy) VALUES
('New Exam Title', 'Description', 60, 10, 20, 12, 'Online', 'Draft', 1, 3);
```

### Link Questions to Exam

```sql
-- Get the exam ID first
SET @examId = LAST_INSERT_ID();

-- Link questions
INSERT INTO exam_questions (examId, questionId, displayOrder) 
SELECT @examId, id, ROW_NUMBER() OVER (ORDER BY id) 
FROM questions WHERE courseId = 1 LIMIT 10;
```

## Troubleshooting

### Issue: Foreign Key Constraint Fails
**Solution**: Ensure courses exist before inserting questions/exams
```sql
SELECT * FROM courses;
```

### Issue: No Questions Showing
**Solution**: Check if courseId is set
```sql
SELECT COUNT(*) FROM questions WHERE courseId IS NOT NULL;
```

### Issue: Exams Not Showing Course Badge
**Solution**: Verify exam has courseId
```sql
SELECT id, title, courseId FROM exams WHERE courseId IS NOT NULL;
```

### Issue: Questions Not Filtering by Course
**Solution**: Restart backend server to load updated associations

## Data Structure

```
Departments (5)
    └── Courses (18)
            ├── Questions (30+)
            └── Exams (9)
                    └── Exam Questions (Links)
```

## Next Steps

After setup:
1. ✅ Restart backend server
2. ✅ Login to frontend
3. ✅ Navigate to Exams Management
4. ✅ Verify exams show with course badges
5. ✅ Test course filtering
6. ✅ Test student assignment
7. ✅ Create additional exams as needed

## Additional Resources

- **EXAM_MANAGEMENT_MODULE.md** - Complete module documentation
- **COURSE_BASED_QUESTIONS.md** - Course integration guide
- **API_ERRORS_FIXED.md** - Troubleshooting API issues

## Summary

You now have:
- ✅ 18 courses across 5 departments
- ✅ 30+ questions organized by course
- ✅ 9 exams linked to courses
- ✅ Complete exam management system
- ✅ Course-based filtering
- ✅ Student assignment capabilities

Ready to use! 🚀
