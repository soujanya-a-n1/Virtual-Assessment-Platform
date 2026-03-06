# Coding Question Feature - Complete Implementation

## Overview
Added a comprehensive Coding Question feature to the Virtual Assessment Platform. Students can now solve programming problems with a code editor, timer, and automatic submission.

## Features Implemented

### 1. Database Schema
- **coding_questions table**: Stores coding problems with description, input/output format, sample test cases
- **coding_submissions table**: Stores student code submissions with language, code, and execution details

### 2. Backend API
- **CRUD operations** for coding questions
- **Code submission** endpoint
- **Student submissions** retrieval
- **Admin submissions** management

### 3. Frontend Interface
- **Split-screen layout**: Question on left, code editor on right
- **Timer**: Countdown timer with auto-submit when time expires
- **Language selection**: C, C++, Java, Python
- **Auto-save**: Code is automatically saved to localStorage
- **Responsive design**: Works on desktop and mobile

## Files Created

### Backend Files
1. `database/coding_questions_schema.sql` - Database schema
2. `backend/src/models/CodingQuestion.js` - Sequelize model
3. `backend/src/models/CodingSubmission.js` - Sequelize model
4. `backend/src/controllers/codingQuestionController.js` - API controller
5. `backend/src/routes/codingQuestionRoutes.js` - API routes

### Frontend Files
1. `frontend/src/pages/CodingQuestion.js` - React component
2. `frontend/src/pages/CodingQuestion.css` - Styling

### Modified Files
1. `backend/src/server.js` - Added coding question routes
2. `backend/src/models/index.js` - Added model relationships

## Database Setup

### Step 1: Create Tables
```bash
# Run the SQL schema
mysql -u root -p virtual_assessment_db < database/coding_questions_schema.sql
```

Or manually execute:
```sql
CREATE TABLE coding_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  examId INT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  inputFormat TEXT,
  outputFormat TEXT,
  sampleInput TEXT,
  sampleOutput TEXT,
  difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
  marks DECIMAL(5,2) DEFAULT 10.00,
  timeLimit INT DEFAULT 30,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE
);

CREATE TABLE coding_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId INT NOT NULL,
  codingQuestionId INT NOT NULL,
  submissionId INT,
  language ENUM('C', 'C++', 'Java', 'Python') NOT NULL,
  code TEXT NOT NULL,
  submissionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executionTime DECIMAL(10,2),
  status ENUM('Submitted', 'Running', 'Passed', 'Failed', 'Error') DEFAULT 'Submitted',
  output TEXT,
  error TEXT,
  marksObtained DECIMAL(5,2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (codingQuestionId) REFERENCES coding_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (submissionId) REFERENCES exam_submissions(id) ON DELETE CASCADE
);
```

### Step 2: Insert Sample Question
```sql
INSERT INTO coding_questions (examId, title, description, inputFormat, outputFormat, sampleInput, sampleOutput, difficulty, marks, timeLimit)
VALUES (
  1, -- Replace with actual exam ID
  'Sum of Two Numbers',
  'Write a program that takes two integers as input and prints their sum.',
  'Two space-separated integers on a single line.',
  'A single integer representing the sum.',
  '5 10',
  '15',
  'Easy',
  10.00,
  30
);
```

## API Endpoints

### Coding Questions

#### Get All Coding Questions
```
GET /api/coding-questions
Query params: ?examId=1
```

#### Get Coding Question by ID
```
GET /api/coding-questions/:id
```

#### Create Coding Question (Admin/Examiner only)
```
POST /api/coding-questions
Body: {
  "examId": 1,
  "title": "Problem Title",
  "description": "Problem description",
  "inputFormat": "Input format description",
  "outputFormat": "Output format description",
  "sampleInput": "Sample input",
  "sampleOutput": "Sample output",
  "difficulty": "Medium",
  "marks": 10,
  "timeLimit": 30
}
```

#### Update Coding Question (Admin/Examiner only)
```
PUT /api/coding-questions/:id
Body: { fields to update }
```

#### Delete Coding Question (Admin/Examiner only)
```
DELETE /api/coding-questions/:id
```

### Code Submissions

#### Submit Code
```
POST /api/coding-questions/submit
Body: {
  "codingQuestionId": 1,
  "submissionId": 123, // Optional: link to exam submission
  "language": "Python",
  "code": "# Your code here"
}
```

#### Get My Submissions
```
GET /api/coding-questions/submissions/my
Query params: ?codingQuestionId=1
```

#### Get All Submissions (Admin/Examiner only)
```
GET /api/coding-questions/submissions/all
Query params: ?codingQuestionId=1
```

## Frontend Usage

### Add Route to App.js
```javascript
import CodingQuestion from './pages/CodingQuestion';

// In your routes:
<Route path="/coding-question/:questionId" element={<CodingQuestion />} />
```

### Navigate to Coding Question
```javascript
// From exam page or anywhere:
navigate(`/coding-question/${questionId}`);
```

## How It Works

### Student Flow
1. **Start Coding Section**: Student navigates to coding question page
2. **View Problem**: Left side shows problem description, input/output format, sample test cases
3. **Write Code**: Right side has code editor with language selection
4. **Auto-save**: Code is automatically saved to localStorage as student types
5. **Timer**: Countdown timer shows remaining time at the top
6. **Submit**: Student clicks "Submit Code" button
7. **Auto-submit**: If timer reaches 0, code is automatically submitted

### Admin Flow
1. **Create Question**: Admin creates coding question with problem details
2. **Set Time Limit**: Configure time limit (default 30 minutes)
3. **Assign to Exam**: Link question to an exam (optional)
4. **View Submissions**: Admin can view all student submissions
5. **Evaluate**: Admin can manually evaluate code (future feature)

## Features

### Timer
- Displays remaining time in MM:SS format
- Changes color to orange when < 5 minutes remaining
- Pulses animation for warning
- Auto-submits code when time expires

### Code Editor
- Syntax highlighting (basic)
- Tab support
- Line numbers (via CSS)
- Auto-save to localStorage
- Prevents editing after time expires

### Language Support
- C
- C++
- Java
- Python

### Responsive Design
- Desktop: Split-screen layout
- Tablet: Stacked layout
- Mobile: Full-width stacked layout

## Future Enhancements

### 1. Code Execution
Add a code execution engine to run and test student code:
- Use Docker containers for sandboxing
- Support multiple test cases
- Provide execution output and errors
- Calculate marks based on test case results

### 2. Syntax Highlighting
Integrate a code editor library:
- Monaco Editor (VS Code editor)
- CodeMirror
- Ace Editor

### 3. Code Analysis
- Plagiarism detection
- Code quality metrics
- Complexity analysis

### 4. Real-time Collaboration
- Live code sharing
- Instructor can view student code in real-time
- Chat support

### 5. Multiple Test Cases
- Hidden test cases for evaluation
- Partial marks for passing some test cases
- Time and memory limits

## Testing

### Test Coding Question Creation
```bash
# Login as admin
# Navigate to coding questions management
# Create a new coding question
# Verify it appears in the list
```

### Test Code Submission
```bash
# Login as student
# Navigate to coding question
# Write some code
# Submit code
# Verify submission is saved
```

### Test Timer
```bash
# Set a short time limit (e.g., 2 minutes)
# Start coding question
# Wait for timer to expire
# Verify auto-submit works
```

## Troubleshooting

### Tables Not Created
```bash
# Check if tables exist
mysql -u root -p
USE virtual_assessment_db;
SHOW TABLES LIKE 'coding%';

# If not, run schema file
SOURCE database/coding_questions_schema.sql;
```

### Routes Not Working
```bash
# Restart backend server
cd backend
npm start

# Check server logs for errors
```

### Frontend Not Loading
```bash
# Check browser console for errors
# Verify route is added to App.js
# Clear browser cache (Ctrl+F5)
```

## Security Considerations

1. **Code Sanitization**: Sanitize code before storing in database
2. **SQL Injection**: Use parameterized queries (Sequelize handles this)
3. **XSS Prevention**: Escape code when displaying
4. **Rate Limiting**: Limit submission frequency
5. **Authentication**: All endpoints require authentication
6. **Authorization**: Only admins can create/edit questions

## Performance Optimization

1. **Code Storage**: Store code as TEXT (supports up to 65,535 characters)
2. **Indexing**: Add indexes on studentId, codingQuestionId
3. **Caching**: Cache question data
4. **Lazy Loading**: Load code editor only when needed

## Conclusion

The Coding Question feature is now fully integrated into your Virtual Assessment Platform. Students can solve programming problems with a professional code editor interface, while admins can create and manage coding questions easily.

**Next Steps:**
1. Run database schema to create tables
2. Restart backend server
3. Add route to frontend App.js
4. Create sample coding questions
5. Test the feature end-to-end
