# Fix Course-Exam Mapping

## Problem
The course IDs and exam IDs are not properly mapped because the SQL script used hardcoded IDs that don't match your actual database.

## Solution
Use the new fixed script that dynamically retrieves course IDs and properly maps them to exams.

## How to Use

### Step 1: Run the Fixed Script

```bash
mysql -u root -p virtual_assessment_db < database/insert_exam_data_fixed.sql
```

This script will:
1. ✅ Get actual course IDs from your database
2. ✅ Insert questions with correct course IDs
3. ✅ Create exams with correct course IDs
4. ✅ Link questions to exams properly
5. ✅ Show verification results

### Step 2: Verify the Mapping

After running the script, you'll see a summary table showing:
- Number of courses
- Number of questions with courses
- Number of exams with courses
- Number of exam-question links
- Detailed exam-course mapping

### Step 3: Check in Frontend

1. Restart backend server (if not already done)
2. Login to the application
3. Navigate to Exams Management
4. You should see exams with correct course badges

## What's Different in the Fixed Script

### Old Script (Wrong)
```sql
-- Used hardcoded IDs
INSERT INTO exams (..., courseId, ...) VALUES
(..., 1, ...);  -- Assumes course ID is 1
```

### New Script (Correct)
```sql
-- Gets actual course IDs dynamically
SET @cs101_id = (SELECT id FROM courses WHERE code = 'CS101' LIMIT 1);

-- Uses the retrieved ID
INSERT INTO exams (..., courseId, ...) VALUES
(..., @cs101_id, ...);  -- Uses actual course ID
```

## Verification Queries

After running the script, verify with these queries:

### Check Course-Exam Mapping
```sql
SELECT 
    e.id,
    e.title,
    c.code AS course_code,
    c.name AS course_name
FROM exams e
JOIN courses c ON e.courseId = c.id
ORDER BY c.code;
```

### Check Question-Course Mapping
```sql
SELECT 
    c.code,
    c.name,
    COUNT(q.id) AS question_count
FROM courses c
LEFT JOIN questions q ON c.id = q.courseId
GROUP BY c.id
ORDER BY c.code;
```

### Check Exam-Question Links
```sql
SELECT 
    e.title AS exam,
    c.code AS course,
    COUNT(eq.questionId) AS questions
FROM exams e
JOIN courses c ON e.courseId = c.id
LEFT JOIN exam_questions eq ON e.id = eq.examId
GROUP BY e.id
ORDER BY c.code;
```

## Expected Results

### Exams Created (9 total)

| Course | Exam Title | Questions | Marks |
|--------|-----------|-----------|-------|
| CS101 | CS101 Midterm Exam | 5 | 10 |
| CS101 | CS101 Final Exam | 5 | 10 |
| CS201 | Data Structures Midterm | 4 | 12 |
| CS301 | Database Systems Midterm | 4 | 10 |
| MATH101 | Calculus I Midterm | 4 | 11 |
| MATH201 | Linear Algebra Quiz | 3 | 8 |
| PHY101 | Physics I Midterm | 3 | 7 |
| ENG101 | English Composition Midterm | 3 | 6 |
| BUS101 | Business Management Quiz | 3 | 7 |

### Questions Created (30 total)

- CS101: 5 questions
- CS201: 4 questions
- CS301: 4 questions
- MATH101: 4 questions
- MATH201: 3 questions
- PHY101: 3 questions
- ENG101: 3 questions
- BUS101: 3 questions

## Troubleshooting

### Error: Course not found
**Cause**: The course doesn't exist in your database
**Solution**: Run the master data schema first
```bash
mysql -u root -p virtual_assessment_db < database/master_data_schema.sql
```

### Error: Examiner user not found
**Cause**: No user with email 'examiner@gmail.com'
**Solution**: Run dummy data first or update the script with your examiner email
```bash
mysql -u root -p virtual_assessment_db < database/dummy_data.sql
```

### Error: Duplicate entry
**Cause**: Data already exists
**Solution**: Either:
1. Delete existing data first:
```sql
DELETE FROM exam_questions WHERE examId IN (SELECT id FROM exams WHERE courseId IS NOT NULL);
DELETE FROM exams WHERE courseId IS NOT NULL;
DELETE FROM questions WHERE courseId IS NOT NULL;
```
2. Or skip if you already have the data

### Exams not showing course badges
**Cause**: Backend server not restarted
**Solution**: Restart backend server
```bash
cd backend
# Stop with Ctrl+C
npm start
```

## Complete Setup Order

If starting fresh, run in this order:

1. **Schema**
   ```bash
   mysql -u root -p virtual_assessment_db < database/schema.sql
   ```

2. **Master Data** (departments, courses, classes)
   ```bash
   mysql -u root -p virtual_assessment_db < database/master_data_schema.sql
   ```

3. **Dummy Data** (users, roles)
   ```bash
   mysql -u root -p virtual_assessment_db < database/dummy_data.sql
   ```

4. **Exam Data** (questions, exams with correct mapping)
   ```bash
   mysql -u root -p virtual_assessment_db < database/insert_exam_data_fixed.sql
   ```

5. **Restart Backend**
   ```bash
   cd backend
   npm start
   ```

## Quick Test

After setup, test in MySQL:

```sql
-- Should show 9 exams with courses
SELECT COUNT(*) FROM exams WHERE courseId IS NOT NULL;

-- Should show 30 questions with courses
SELECT COUNT(*) FROM questions WHERE courseId IS NOT NULL;

-- Should show all mappings
SELECT 
    c.code,
    e.title,
    COUNT(eq.questionId) AS questions
FROM courses c
JOIN exams e ON c.id = e.courseId
LEFT JOIN exam_questions eq ON e.id = eq.examId
GROUP BY c.code, e.title;
```

## Summary

The fixed script:
- ✅ Dynamically retrieves course IDs
- ✅ Properly maps courses to exams
- ✅ Links questions to correct exams
- ✅ Provides verification output
- ✅ Works regardless of your actual IDs

Just run it and everything will be correctly mapped! 🎯
