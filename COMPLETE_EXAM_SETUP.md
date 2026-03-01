# Complete Exam Setup - Step by Step

## Overview

This guide will help you:
1. ✅ Create 5 missing courses (CS102, EC101, EC201, CIV101, MBA101)
2. ✅ Create 10 exams with Published status
3. ✅ Link exams to correct courses

## Prerequisites

- ✅ MySQL/XAMPP running
- ✅ Backend dependencies installed (`npm install` in backend folder)
- ✅ Database created (`exam_management_system`)

## Step-by-Step Instructions

### Step 1: Open Terminal in VS Code

Press `` Ctrl+` `` or go to **Terminal → New Terminal**

### Step 2: Navigate to Backend Folder

```bash
cd backend
```

### Step 3: Create Missing Courses

```bash
node add-missing-courses.js
```

**What this does:**
- Checks if CS102, EC101, EC201, CIV101, MBA101 exist
- Creates missing courses with Active = true
- Links to correct departments
- Skips courses that already exist (no duplicates)

**Expected output:**
```
✅ Created course: CS102 - Object Oriented Programming
✅ Created course: EC101 - Digital Electronics
...
📊 SUMMARY
✅ Courses added: 5
```

### Step 4: Create 10 Exams

```bash
node add-10-exams.js
```

**What this does:**
- Creates 10 exams with Published status
- Links each exam to correct course
- Sets exam dates (March-April 2025)
- Configures start/end times
- Sets passing marks (40% of total)

**Expected output:**
```
✅ Created exam: C Programming Mid Exam
   Course: CS101 - Introduction to Programming
   Date: 2025-03-10 at 09:00 AM
   Status: Published
...
📊 SUMMARY
✅ Exams created: 10
```

### Step 5: Verify in Browser

1. Open your application (usually http://localhost:3000)
2. Login as Admin/Examiner
3. Go to **Exam Management** module
4. You should see all 10 exams with "Published" status

## Quick Commands (Copy & Paste)

Run these commands one by one:

```bash
cd backend
node add-missing-courses.js
node add-10-exams.js
```

## The 10 Exams Created

| Date | Exam Title | Course | Marks | Duration |
|------|-----------|--------|-------|----------|
| 10 Mar 2025 | C Programming Mid Exam | CS101 | 50 | 60 min |
| 12 Mar 2025 | OOP Internal Assessment | CS102 | 50 | 60 min |
| 15 Mar 2025 | Data Structures Mid Exam | CS201 | 75 | 90 min |
| 18 Mar 2025 | DBMS Internal Test | CS301 | 50 | 60 min |
| 20 Mar 2025 | Operating Systems Test | CS302 | 50 | 60 min |
| 22 Mar 2025 | Digital Electronics Exam | EC101 | 50 | 60 min |
| 25 Mar 2025 | Microprocessors Test | EC201 | 75 | 90 min |
| 27 Mar 2025 | Engineering Mechanics Exam | ME101 | 50 | 60 min |
| 29 Mar 2025 | Structural Analysis Test | CIV101 | 50 | 60 min |
| 02 Apr 2025 | Principles of Management Exam | MBA101 | 50 | 60 min |

## Exam Properties

All exams are created with:
- ✅ Status: Published (visible to students)
- ✅ Exam Type: Online
- ✅ Proctoring: Enabled
- ✅ Start Time: 09:00 AM on exam date
- ✅ End Time: Based on duration
- ✅ Passing Marks: 40% of total marks
- ✅ Shuffle Questions: Disabled
- ✅ Negative Marking: Disabled

## Troubleshooting

### Error: Department not found

**Problem:** Departments CS, EC, CE, or BA don't exist

**Solution:** Create departments first
```bash
node add-departments.js
```

### Error: Cannot find module

**Problem:** You're not in the backend folder

**Solution:**
```bash
cd backend
node add-missing-courses.js
```

### Error: Database connection failed

**Problem:** MySQL is not running

**Solution:** Start MySQL/XAMPP first

### Error: Course not found when creating exams

**Problem:** Required courses don't exist

**Solution:** Run the courses script first
```bash
node add-missing-courses.js
```

### Exams not visible in browser

**Solution:**
1. Refresh the browser (Ctrl+F5)
2. Check that you're logged in as Admin/Examiner
3. Verify exams were created (check script output)

## Verification

After running both scripts, verify:

1. **Check Courses:**
   - Go to Course Management
   - Look for CS102, EC101, EC201, CIV101, MBA101
   - All should have Active status

2. **Check Exams:**
   - Go to Exam Management
   - Look for all 10 exams
   - Status should show "Published"
   - Course names should be displayed

## Next Steps

After exams are created:

1. **Add Questions to Exams**
   - Go to each exam
   - Click "Add Questions"
   - Create 10-15 questions per exam

2. **Assign Exams to Students**
   - Use Exam Assignment feature
   - Assign by individual, class, or course

3. **Test the Flow**
   - Login as a student
   - Take a sample exam
   - Verify submission and results

## Files Created

- `backend/add-missing-courses.js` - Creates 5 courses
- `backend/add-10-exams.js` - Creates 10 exams
- `ADD_MISSING_COURSES_NOW.md` - Course creation guide
- `COMPLETE_EXAM_SETUP.md` - This file

## Benefits of Node.js Scripts

✅ More reliable than SQL scripts
✅ Checks for existing data (no duplicates)
✅ Better error handling
✅ Clear output and summaries
✅ Works on all platforms (Windows, Mac, Linux)
✅ No PowerShell/CMD issues

---

**Ready to start?**

```bash
cd backend
node add-missing-courses.js
node add-10-exams.js
```

That's it! Your exams will be ready in seconds.
