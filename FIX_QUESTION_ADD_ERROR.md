# Fix: Error Adding Questions to Exam

## Problem
Getting an error when trying to add questions to an exam.

## Root Causes Identified

### 1. ExamQuestion Model Missing Foreign Keys
The ExamQuestion junction table model was missing the `examId` and `questionId` fields.

### 2. Duplicate Question Prevention
The original controller didn't check for duplicate questions, which could cause unique constraint errors.

### 3. Display Order Issues
Display order wasn't being calculated correctly when adding new questions to an exam that already has questions.

---

## Fixes Applied

### 1. Updated ExamQuestion Model
**File**: `backend/src/models/ExamQuestion.js`

Added explicit foreign key definitions:
```javascript
examId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'exams',
    key: 'id',
  },
},
questionId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'questions',
    key: 'id',
  },
},
displayOrder: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 1,
},
```

### 2. Enhanced addQuestionsToExam Controller
**File**: `backend/src/controllers/questionController.js`

Improvements:
- ✅ Validates questionIds array
- ✅ Checks for duplicate questions
- ✅ Calculates correct display order
- ✅ Provides detailed response with counts
- ✅ Better error handling

```javascript
const addQuestionsToExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { questionIds } = req.body;

    // Validate input
    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of question IDs' });
    }

    // Check exam exists
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Get existing questions
    const existingQuestions = await ExamQuestion.findAll({
      where: { examId },
      attributes: ['questionId']
    });
    const existingQuestionIds = existingQuestions.map(eq => eq.questionId);

    // Calculate display order
    const maxOrder = existingQuestions.length > 0 
      ? Math.max(...existingQuestions.map(eq => eq.displayOrder || 0))
      : 0;

    let addedCount = 0;
    let skippedCount = 0;

    // Add questions
    for (let i = 0; i < questionIds.length; i++) {
      const questionId = questionIds[i];
      
      // Skip duplicates
      if (existingQuestionIds.includes(questionId)) {
        skippedCount++;
        continue;
      }

      const question = await Question.findByPk(questionId);
      if (question) {
        await ExamQuestion.create({
          examId,
          questionId,
          displayOrder: maxOrder + addedCount + 1,
        });
        addedCount++;
      }
    }

    const message = addedCount > 0 
      ? `${addedCount} question(s) added successfully${skippedCount > 0 ? `, ${skippedCount} already existed` : ''}`
      : 'No new questions were added';

    res.status(201).json({ 
      message, 
      addedCount, 
      skippedCount 
    });
  } catch (error) {
    console.error('Error adding questions to exam:', error);
    res.status(500).json({ message: 'Error adding questions to exam', error: error.message });
  }
};
```

---

## Testing

### Test Script Created
**File**: `backend/test-question-add.js`

Run this script to test the question addition functionality:

```bash
cd backend
node test-question-add.js
```

This will:
1. Connect to the database
2. Find an exam
3. Find questions
4. Attempt to add questions to the exam
5. Verify the questions were added
6. Check the association works

### Manual Testing Steps

1. **Start the backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Login to the application**:
   - Email: admin@gmail.com
   - Password: Admin@123

3. **Create or open an exam**:
   - Go to Exams page
   - Click on an existing exam or create a new one

4. **Add questions**:
   - Click the "Questions" tab
   - Click "Create New Question" or "Add Existing Questions"
   - Fill in the form and submit

5. **Verify**:
   - Questions should appear in the Questions tab
   - Total questions count should update
   - Total marks should update

---

## Common Errors and Solutions

### Error: "Cannot read property 'length' of undefined"
**Cause**: questionIds is not being sent correctly from frontend
**Solution**: Check the API call in ExamPage.js

### Error: "Duplicate entry for key 'PRIMARY'"
**Cause**: Trying to add the same question twice
**Solution**: Fixed by checking for duplicates before adding

### Error: "Column 'examId' cannot be null"
**Cause**: ExamQuestion model missing foreign key definitions
**Solution**: Fixed by adding examId and questionId fields to model

### Error: "displayOrder cannot be null"
**Cause**: displayOrder not being set
**Solution**: Fixed by calculating displayOrder correctly

---

## Database Schema

### exam_questions Table

```sql
CREATE TABLE exam_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  examId INT NOT NULL,
  questionId INT NOT NULL,
  displayOrder INT NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_exam_question (examId, questionId)
);
```

---

## API Endpoints

### Add Questions to Exam
```
POST /api/questions/:examId/add-questions
```

**Request Body**:
```json
{
  "questionIds": [1, 2, 3, 4, 5]
}
```

**Response** (Success):
```json
{
  "message": "5 question(s) added successfully",
  "addedCount": 5,
  "skippedCount": 0
}
```

**Response** (With Duplicates):
```json
{
  "message": "3 question(s) added successfully, 2 already existed",
  "addedCount": 3,
  "skippedCount": 2
}
```

**Response** (Error):
```json
{
  "message": "Error adding questions to exam",
  "error": "Error message here"
}
```

### Remove Question from Exam
```
DELETE /api/questions/:examId/questions/:questionId
```

**Response**:
```json
{
  "message": "Question removed from exam successfully"
}
```

---

## Frontend API Calls

### Add Questions
```javascript
await api.post(`/questions/${examId}/add-questions`, { 
  questionIds: [1, 2, 3] 
});
```

### Remove Question
```javascript
await api.delete(`/questions/${examId}/questions/${questionId}`);
```

---

## Verification Checklist

After applying fixes:

- [ ] Backend starts without errors
- [ ] Can create a new question
- [ ] Can add existing questions to exam
- [ ] Can add newly created question to exam
- [ ] Duplicate questions are skipped (not added twice)
- [ ] Display order is correct
- [ ] Total questions count updates
- [ ] Total marks sum updates
- [ ] Can remove questions from exam
- [ ] Questions display correctly in Questions tab
- [ ] Correct answers are highlighted

---

## Next Steps

1. **Restart the backend** to load the updated models:
   ```bash
   cd backend
   npm start
   ```

2. **Run the test script** to verify:
   ```bash
   node backend/test-question-add.js
   ```

3. **Test in the UI**:
   - Login as admin
   - Open an exam
   - Try adding questions
   - Verify they appear correctly

4. **Check browser console** for any errors

5. **Check backend logs** for detailed error messages

---

## Summary

The issue was caused by:
1. Missing foreign key definitions in ExamQuestion model
2. No duplicate checking in the controller
3. Incorrect display order calculation

All issues have been fixed. The question addition functionality should now work correctly.

If you still encounter errors, please check:
- Database connection is working
- Exam exists in the database
- Questions exist in the database
- User has proper permissions (Admin, Examiner, or Super Admin)
- Backend logs for detailed error messages
