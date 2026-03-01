# Exam Management Module - Complete Documentation

## Overview
A comprehensive Exam Management system integrated with Course Management, allowing Admins and Examiners to create, manage, and assign exams to students based on courses, classes, or individual selection.

## Features

### 1. Exam Creation & Management
- Create exams with detailed configuration
- Link exams to specific courses
- Set exam duration, marks, and passing criteria
- Configure proctoring and anti-cheating settings
- Manage exam status (Draft, Published, Active, Completed)
- Schedule exams with start and end times

### 2. Course Integration
- Associate exams with courses from Course Management
- Filter exams by course
- Display course information on exam cards
- Auto-filter questions by course when creating exams
- Course-based student assignment

### 3. Student Assignment
Three flexible assignment methods:
- **Individual Assignment**: Select specific students
- **Class-Based Assignment**: Assign entire classes
- **Course-Based Assignment**: Assign all students in a course

### 4. Enrollment Management
- View all enrolled students for an exam
- Remove students from exams
- Track enrollment status (Active, Pending, Completed, Cancelled)
- Prevent duplicate enrollments
- Real-time enrollment counts

### 5. Question Management
- Create questions linked to courses
- Filter questions by course, type, and difficulty
- Add existing questions to exams
- Bulk question import via CSV
- Question bank organization by course

## User Roles & Permissions

### Admin / Super Admin
- Full access to all exam management features
- Create, edit, delete any exam
- Assign students to exams
- Manage enrollments
- View all analytics

### Examiner
- Create and manage own exams
- Assign students to own exams
- Manage questions
- View exam analytics

### Proctor
- View exam enrollments
- Monitor exam sessions
- Access proctoring logs

### Student
- View assigned exams
- Take published/active exams
- View own results

## Database Schema

### Exams Table
```sql
CREATE TABLE exams (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INT NOT NULL,
  totalQuestions INT NOT NULL,
  totalMarks DECIMAL(10,2) NOT NULL,
  passingMarks DECIMAL(10,2) NOT NULL,
  examType ENUM('Online', 'Offline'),
  status ENUM('Draft', 'Published', 'Scheduled', 'Active', 'Completed'),
  startTime DATETIME,
  endTime DATETIME,
  requiresProctoring BOOLEAN,
  shuffleQuestions BOOLEAN,
  negativeMarkingEnabled BOOLEAN,
  negativeMarks DECIMAL(10,2),
  courseId INT,
  createdBy INT,
  FOREIGN KEY (courseId) REFERENCES courses(id),
  FOREIGN KEY (createdBy) REFERENCES users(id)
);
```

### Questions Table
```sql
CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  questionText TEXT NOT NULL,
  questionType ENUM('Multiple Choice', 'True/False', 'Short Answer'),
  marks DECIMAL(10,2) NOT NULL,
  difficulty ENUM('Easy', 'Medium', 'Hard'),
  topic VARCHAR(100),
  courseId INT,
  optionA TEXT,
  optionB TEXT,
  optionC TEXT,
  optionD TEXT,
  correctAnswer VARCHAR(100) NOT NULL,
  explanation TEXT,
  FOREIGN KEY (courseId) REFERENCES courses(id)
);
```

### Student Exam Enrollments Table
```sql
CREATE TABLE student_exam_enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  examId INT NOT NULL,
  enrollmentStatus ENUM('Active', 'Completed', 'Cancelled', 'Pending'),
  enrolledAt DATETIME,
  startedAt DATETIME,
  completedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (examId) REFERENCES exams(id),
  UNIQUE KEY unique_user_exam (userId, examId)
);
```

## API Endpoints

### Exam Management

#### Create Exam
```
POST /api/exams
Authorization: Bearer <token>
Roles: Admin, Examiner

Body:
{
  "title": "Midterm Exam",
  "description": "Midterm examination",
  "duration": 120,
  "totalQuestions": 50,
  "totalMarks": 100,
  "passingMarks": 40,
  "examType": "Online",
  "status": "Draft",
  "courseId": 1,
  "requiresProctoring": true,
  "shuffleQuestions": true
}
```

#### Get All Exams
```
GET /api/exams?courseId=1
Authorization: Bearer <token>
```

#### Get Exam by ID
```
GET /api/exams/:id
Authorization: Bearer <token>
```

#### Update Exam
```
PUT /api/exams/:id
Authorization: Bearer <token>
Roles: Admin, Examiner (own exams)
```

#### Delete Exam
```
DELETE /api/exams/:id
Authorization: Bearer <token>
Roles: Admin, Examiner (own exams)
```

#### Publish Exam
```
POST /api/exams/:id/publish
Authorization: Bearer <token>
Roles: Admin, Examiner
```

### Student Assignment

#### Assign Students to Exam
```
POST /api/exams/:examId/assign
Authorization: Bearer <token>
Roles: Admin, Examiner

Body (Individual):
{
  "studentIds": [1, 2, 3, 4]
}

Body (Class-based):
{
  "classIds": [1, 2]
}

Body (Course-based):
{
  "courseId": 1
}
```

#### Get Exam Enrollments
```
GET /api/exams/:examId/enrollments
Authorization: Bearer <token>
Roles: Admin, Examiner, Proctor
```

#### Remove Student from Exam
```
DELETE /api/exams/:examId/enrollments/:userId
Authorization: Bearer <token>
Roles: Admin, Examiner
```

#### Get Available Students
```
GET /api/exams/:examId/available-students?classId=1
Authorization: Bearer <token>
Roles: Admin, Examiner
```

#### Get Classes for Assignment
```
GET /api/classes-for-assignment?courseId=1
Authorization: Bearer <token>
Roles: Admin, Examiner
```

#### Update Enrollment Status
```
PUT /api/exams/:examId/enrollments/status
Authorization: Bearer <token>
Roles: Admin, Examiner

Body:
{
  "userIds": [1, 2, 3],
  "status": "Active"
}
```

### Question Management

#### Create Question
```
POST /api/questions
Authorization: Bearer <token>
Roles: Admin, Examiner

Body:
{
  "questionText": "What is 2+2?",
  "questionType": "Multiple Choice",
  "marks": 2,
  "difficulty": "Easy",
  "topic": "Arithmetic",
  "courseId": 1,
  "optionA": "3",
  "optionB": "4",
  "optionC": "5",
  "optionD": "6",
  "correctAnswer": "B",
  "explanation": "2+2 equals 4"
}
```

#### Get Questions
```
GET /api/questions?courseId=1
Authorization: Bearer <token>
```

#### Add Questions to Exam
```
POST /api/questions/:examId/add-questions
Authorization: Bearer <token>
Roles: Admin, Examiner

Body:
{
  "questionIds": [1, 2, 3, 4, 5]
}
```

#### Remove Question from Exam
```
DELETE /api/questions/:examId/questions/:questionId
Authorization: Bearer <token>
Roles: Admin, Examiner
```

## Frontend Components

### ExamsList Component
**Location**: `frontend/src/pages/ExamsList.js`

Features:
- Grid view of all exams
- Filter by status (All, Draft, Published, Active)
- Filter by course
- Create/Edit exam modal
- Student assignment modal
- Course badge display
- Role-based action buttons

### ExamPage Component
**Location**: `frontend/src/pages/ExamPage.js`

Features:
- Detailed exam configuration
- Course selection
- Question management tab
- Add/create questions
- Course-based question filtering
- Real-time marks calculation

### ExamAssignmentModal Component
**Location**: `frontend/src/components/ExamAssignmentModal.js`

Features:
- Three assignment modes (Individual, Class, Course)
- Student search and selection
- Class selection with student counts
- Enrolled students list
- Remove students functionality
- Real-time enrollment updates

## Usage Workflows

### Creating a Course-Based Exam

1. Navigate to Exams Management
2. Click "Create New Exam"
3. Fill in exam details:
   - Title and description
   - Select course from dropdown
   - Set duration and marks
   - Configure proctoring settings
4. Save as Draft
5. Go to exam details page
6. Switch to "Questions" tab
7. Add questions (filtered by course)
8. Publish exam when ready

### Assigning Students to Exam

1. In Exams List, click "Assign" button on exam card
2. Choose assignment method:
   - **Individual**: Search and select specific students
   - **Class**: Select one or more classes
   - **Course**: Assign all students in the course
3. Review selections
4. Click "Assign" button
5. View enrolled students in "Enrolled" tab

### Managing Exam Questions

1. Open exam in edit mode
2. Go to "Questions" tab
3. Options:
   - **Create New Question**: Opens question form with course pre-selected
   - **Add Existing Questions**: Shows filtered question bank
4. Use filters to find questions:
   - Search by text
   - Filter by type
   - Filter by difficulty
5. Select and add questions
6. Questions automatically calculate total marks

## Integration Points

### Course Management Integration
- Exams linked to courses via `courseId`
- Course dropdown populated from Course Management
- Course information displayed on exam cards
- Questions filtered by course

### Student Management Integration
- Student assignment uses Student records
- Class-based assignment uses Class-Student relationships
- Student profiles displayed in enrollment lists

### Analytics Integration
- Exam statistics by course
- Student performance tracking
- Enrollment analytics

## Security Features

- Role-based access control
- JWT authentication required
- Ownership validation (examiners can only edit own exams)
- Duplicate enrollment prevention
- Input validation and sanitization

## Best Practices

### For Admins/Examiners

1. **Always link exams to courses** for better organization
2. **Use Draft status** while building exams
3. **Test exams** before publishing
4. **Assign students early** to give them time to prepare
5. **Set clear schedules** with start and end times
6. **Enable proctoring** for important exams

### For System Setup

1. **Create courses first** in Course Management
2. **Set up classes** and assign students
3. **Build question banks** organized by course
4. **Configure user roles** properly
5. **Test assignment workflows** before production use

## Troubleshooting

### Students Not Appearing in Assignment
- Check if students are active
- Verify class assignments
- Ensure students aren't already enrolled

### Questions Not Filtering by Course
- Verify exam has courseId set
- Check question courseId values
- Ensure course exists and is active

### Assignment Fails
- Check user permissions
- Verify exam exists and is accessible
- Ensure no duplicate enrollments

## Future Enhancements

- Automatic grading for objective questions
- Question randomization per student
- Time-based exam access control
- Bulk operations for enrollment management
- Email notifications for assignments
- Exam templates
- Question difficulty analysis
- Performance predictions

## Migration Guide

If upgrading from a previous version:

1. **Backup database**
   ```bash
   mysqldump -u root -p virtual_assessment_db > backup.sql
   ```

2. **Run migration scripts**
   ```bash
   mysql -u root -p virtual_assessment_db < database/add_course_support.sql
   ```

3. **Update backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Update frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

5. **Restart services**
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend
   cd frontend
   npm start
   ```

## Support

For issues or questions:
- Check the DEVELOPER_GUIDE.md
- Review API documentation
- Check database schema
- Verify user permissions

## License

This module is part of the Virtual Assessment Platform.
