# Fix All Database Issues - Complete Solution

## Quick Fix (Run This First)

Open terminal and run:

```bash
cd backend
node fix-all-database-issues.js
```

This will automatically fix:
1. ✓ Questions table enum values (Multiple Choice, True/False, etc.)
2. ✓ Exam_questions table structure
3. ✓ Database indexes
4. ✓ Foreign key relationships
5. ✓ Test all operations

## What Gets Fixed

### 1. Questions Table
- questionType enum: 'Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching'
- difficulty enum: 'Easy', 'Medium', 'Hard'

### 2. Exam_Questions Table
- Ensures displayOrder column exists
- Adds unique constraint on (examId, questionId)
- Verifies foreign keys to exams and questions tables

### 3. Database Operations
- Tests creating questions
- Tests linking questions to exams
- Verifies all CRUD operations work

## After Running the Fix

1. **Restart Backend Server**:
   ```bash
   # Stop current backend (Ctrl+C)
   # Then start again:
   npm start
   ```

2. **Test in UI**:
   - Go to Exam Management
   - Click "Create New Question"
   - Fill in the form
   - Click "Create Question"
   - Should work without errors! ✓

## If You Want to Check First

Run this to see what issues exist:

```bash
cd backend
node check-all-tables.js
```

## Individual Fix Scripts

If you want to fix specific issues only:

- `node fix-question-enums.js` - Fix only question enums
- `node fix-exam-questions-table.js` - Fix only exam_questions table
- `node diagnose-question-error.js` - Diagnose question creation issues

## Expected Output

You should see:
```
=== Fixing All Database Issues ===

1. Fixing questions table enums...
✓ questionType enum fixed
✓ difficulty enum fixed

2. Checking exam_questions table...
✓ exam_questions structure is correct

3. Checking indexes...
✓ Indexes are correct

4. Checking foreign keys...
✓ Foreign keys are configured

5. Testing question creation...
✓ Test question created with ID: 123
✓ Test question deleted

6. Testing exam-question association...
✓ Test association created
✓ Test association deleted

=== Fix Complete ===
```

## Troubleshooting

If the script fails:
1. Make sure MySQL/XAMPP is running
2. Check that backend/.env has correct database credentials
3. Ensure database 'virtual_assessment_platform' exists
4. Share the error message with me

## Manual SQL Fix (Alternative)

If you prefer to run SQL manually in phpMyAdmin:

```sql
-- Fix questions table
ALTER TABLE questions 
MODIFY COLUMN questionType ENUM('Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching') 
NOT NULL;

ALTER TABLE questions 
MODIFY COLUMN difficulty ENUM('Easy', 'Medium', 'Hard') 
DEFAULT 'Medium';

-- Fix exam_questions table
ALTER TABLE exam_questions 
ADD COLUMN IF NOT EXISTS displayOrder INT DEFAULT 0 AFTER questionId;

-- Add unique constraint
ALTER TABLE exam_questions 
ADD UNIQUE KEY IF NOT EXISTS unique_exam_question (examId, questionId);
```

Then restart your backend server!
