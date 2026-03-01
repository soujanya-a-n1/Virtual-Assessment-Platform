# Course-Based Question Management

## Overview
The exam management system now supports creating and managing questions based on courses. This allows for better organization and filtering of questions by their associated courses.

## Features

### 1. Course Selection in Exams
- When creating or editing an exam, you can now select a course from the dropdown
- The course selection is optional but recommended for better organization
- Once a course is selected, the question pool will automatically filter to show only questions from that course

### 2. Course-Based Question Creation
- When creating a new question within an exam, the course is automatically pre-selected based on the exam's course
- You can also manually select a different course or leave it blank for general questions
- Questions can be tagged with:
  - Course (optional)
  - Topic (optional)
  - Difficulty level (Easy, Medium, Hard)
  - Question type (Multiple Choice, True/False, Short Answer)

### 3. Question Filtering
When adding existing questions to an exam, you can filter by:
- Search term (searches in question text)
- Question type
- Difficulty level
- Course (automatically filtered if exam has a course selected)

### 4. Question Bank Organization
- Questions are now organized by course in the question bank
- API endpoint `/questions?courseId=X` returns questions for a specific course
- Questions without a course are still accessible and can be added to any exam

## Database Schema

### Exams Table
```sql
ALTER TABLE exams 
ADD COLUMN courseId INT,
ADD FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL;
```

### Questions Table
```sql
ALTER TABLE questions 
ADD COLUMN courseId INT,
ADD COLUMN topic VARCHAR(100),
ADD FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL;
```

## API Endpoints

### Get Questions by Course
```
GET /questions?courseId={courseId}
```
Returns all questions for a specific course.

### Get Exams by Course
```
GET /exams?courseId={courseId}
```
Returns all exams for a specific course.

### Create Question with Course
```
POST /questions
{
  "questionText": "What is...",
  "questionType": "Multiple Choice",
  "marks": 2,
  "difficulty": "Medium",
  "topic": "Introduction",
  "courseId": 1,
  "optionA": "Option A",
  "optionB": "Option B",
  "correctAnswer": "A"
}
```

### Create Exam with Course
```
POST /exams
{
  "title": "Midterm Exam",
  "courseId": 1,
  "duration": 60,
  ...
}
```

## Migration

If you have an existing database, run the migration script:

```bash
mysql -u root -p < database/add_course_support.sql
```

This will add the `courseId` columns to both `exams` and `questions` tables without affecting existing data.

## Usage Workflow

### Creating a Course-Based Exam

1. Navigate to Exam Management
2. Click "Create New Exam"
3. Fill in exam details
4. Select a course from the dropdown (optional)
5. Save the exam
6. Go to the "Questions" tab
7. Click "Create New Question" - the course will be pre-selected
8. Or click "Add Existing Questions" - questions will be filtered by the exam's course

### Creating Questions for a Course

1. Open an exam that has a course selected
2. Go to the "Questions" tab
3. Click "Create New Question"
4. The course field will be pre-filled with the exam's course
5. Fill in question details
6. Save the question

### Adding Existing Questions

1. In the exam's "Questions" tab
2. Click "Add Existing Questions"
3. Questions are automatically filtered by the exam's course
4. Use additional filters (type, difficulty, search) to narrow down
5. Select questions and click "Add"

## Benefits

- **Better Organization**: Questions are organized by course
- **Easier Management**: Filter questions by course when creating exams
- **Reusability**: Build a question bank per course for reuse across multiple exams
- **Consistency**: Ensure exams only include relevant questions from the course
- **Scalability**: As your question bank grows, course-based filtering keeps it manageable

## Notes

- Course selection is optional - you can still create exams and questions without a course
- Questions without a course are available to all exams
- Deleting a course sets the courseId to NULL in related exams and questions (they are not deleted)
- The course relationship is established through the master data management system
