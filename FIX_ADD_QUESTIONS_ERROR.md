# Fix: Error Adding Questions to Exam

## Quick Fix Steps

### Step 1: Run the Fix Script

Open a new terminal and run:

```bash
cd backend
node fix-exam-questions.js
```

This will:
- ✅ Check if exam_questions table exists
- ✅ Create it if missing
- ✅ Add missing columns (examId, questionId, displayOrder)
- ✅ Add foreign key constraints
- ✅ Add unique constraint to prevent duplicates
- ✅ Show the final table structure

### Step 2: Restart Backend

After running the fix script, restart your backend:

1. Stop the backend (Ctrl+C in the terminal where it's running)
2. Start it again:
   ```bash
   npm start
   ```

### Step 3: Test in Browser

1. Refresh your browser
2. Go to Exams page
3. Open an exam
4. Click "Questions" tab
5. Try adding questions - it should work now!

---

## What Was Wrong?

The `exam_questions` table might have been missing or had incorrect structure:
- Missing `examId` column
- Missing `questionId` column
- Missing `displayOrder` column
- Missing foreign key constraints

---

## Verify It's Fixed

After running the fix script, you should see output like:

```
✅ Connected to database

✅ exam_questions table already exists

Current columns: id, examId, questionId, displayOrder, createdAt, updatedAt

📋 Final table structure:
┌─────────┬──────────────┬──────────┬──────┬─────────┬─────────────────────────┐
│ Field   │ Type         │ Null     │ Key  │ Default │ Extra                   │
├─────────┼──────────────┼──────────┼──────┼─────────┼─────────────────────────┤
│ id      │ int          │ NO       │ PRI  │ NULL    │ auto_increment          │
│ examId  │ int          │ NO       │ MUL  │ NULL    │                         │
│ ...     │ ...          │ ...      │ ...  │ ...     │ ...                     │
└─────────┴──────────────┴──────────┴──────┴─────────┴─────────────────────────┘

✅ All fixes applied successfully!
```

---

## Check Backend Logs

When you try to add questions, check the backend terminal for detailed logs:

```
Add questions request: { examId: '5', questionIds: [ 1, 2, 3 ] }
Exam found: Midterm Exam
Existing questions: 0
Max display order: 0
Adding question 1 with order 1
Question 1 added successfully
Adding question 2 with order 2
Question 2 added successfully
...
Final result: { addedCount: 3, skippedCount: 0 }
```

If you see errors, they will be detailed in the logs.

---

## Common Issues

### Issue 1: Table doesn't exist
**Error**: `Table 'virtual_assessment_db.exam_questions' doesn't exist`
**Fix**: Run `node backend/fix-exam-questions.js`

### Issue 2: Column doesn't exist
**Error**: `Unknown column 'examId' in 'field list'`
**Fix**: Run `node backend/fix-exam-questions.js`

### Issue 3: Foreign key constraint fails
**Error**: `Cannot add or update a child row: a foreign key constraint fails`
**Fix**: Make sure the exam and questions exist in the database

### Issue 4: Duplicate entry
**Error**: `Duplicate entry '5-1' for key 'unique_exam_question'`
**Fix**: This is normal - the question is already in the exam. The system will skip it.

---

## Manual Database Check

If you want to check manually:

```sql
-- Check if table exists
SHOW TABLES LIKE 'exam_questions';

-- Check table structure
DESCRIBE exam_questions;

-- Check records
SELECT * FROM exam_questions;

-- Check foreign keys
SELECT 
  CONSTRAINT_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'virtual_assessment_db'
AND TABLE_NAME = 'exam_questions'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

---

## Test the Fix

### Test 1: Create a Question
1. Go to Exams page
2. Open an exam
3. Click "Questions" tab
4. Click "Create New Question"
5. Fill in the form
6. Submit
7. ✅ Question should be added

### Test 2: Add Existing Questions
1. Click "Add Existing Questions"
2. Select some questions
3. Click "Add X Questions"
4. ✅ Questions should be added

### Test 3: View Questions
1. Questions should appear in the list
2. ✅ You should see question cards with options
3. ✅ Total questions count should update
4. ✅ Total marks should update

---

## Still Having Issues?

If you still get errors after running the fix:

1. **Check backend logs** - Look for detailed error messages
2. **Check database connection** - Make sure MySQL is running
3. **Check permissions** - Make sure the database user has CREATE/ALTER permissions
4. **Restart everything**:
   ```bash
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C)
   
   # Start backend
   cd backend
   npm start
   
   # Start frontend (in another terminal)
   cd frontend
   npm start
   ```

---

## Success Indicators

You'll know it's working when:
- ✅ No errors in backend logs
- ✅ Questions appear in the Questions tab
- ✅ Total questions count updates
- ✅ Can add multiple questions
- ✅ Can remove questions
- ✅ Duplicate questions are skipped (not added twice)

---

## Summary

1. Run: `node backend/fix-exam-questions.js`
2. Restart backend
3. Refresh browser
4. Try adding questions
5. It should work! 🎉

The fix script ensures the database table has the correct structure with all required columns and constraints.
