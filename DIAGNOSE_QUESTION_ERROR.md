# Diagnose Question Creation Error

## Current Status
- Backend is running on port 5000
- Frontend shows "Error creating question" dialog
- Need to see the actual error message from backend

## Step 1: Run Diagnostic Script

Open a NEW terminal (keep backend running) and run:

```bash
cd backend
node diagnose-question-error.js
```

This will:
- Check database connection
- Show the questions table structure
- Test creating a minimal question
- Show any validation errors or database mismatches

## Step 2: Check Backend Terminal

When you try to create a question in the UI, look at the backend terminal for error messages like:

```
Error creating question: [actual error message]
Error details: [specific details]
```

## Step 3: Common Issues to Check

### Issue 1: Enum Value Mismatch
If error says "invalid enum value", the database enum values don't match the model.

**Fix**: Run this SQL in phpMyAdmin:
```sql
ALTER TABLE questions 
MODIFY COLUMN questionType ENUM('Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching');

ALTER TABLE questions 
MODIFY COLUMN difficulty ENUM('Easy', 'Medium', 'Hard');
```

### Issue 2: Missing Required Field
If error says "cannot be null", a required field is missing.

**Check**: The frontend sends these fields:
- questionText ✓
- questionType ✓
- marks ✓
- difficulty ✓
- correctAnswer ✓
- optionA, optionB (for Multiple Choice)
- courseId (optional)
- topic (optional)

### Issue 3: Column Name Mismatch
If error says "unknown column", the database column names don't match the model.

**Fix**: Check column names in phpMyAdmin match exactly:
- questionText (not question_text)
- questionType (not question_type)
- correctAnswer (not correct_answer)

## Step 4: After Running Diagnostic

Reply with the output from the diagnostic script, and I'll provide the exact fix needed.

## Quick Test

Try creating a simple question:
- Question Text: "What is 2+2?"
- Type: Multiple Choice
- Marks: 1
- Difficulty: Easy
- Option A: "3"
- Option B: "4"
- Correct Answer: B

Then check the backend terminal for the error message.
