# Add Missing Courses - Quick Guide

## What This Does

Checks if these 5 courses exist and creates them if missing:
- CS102 (Object Oriented Programming)
- EC101 (Digital Electronics)
- EC201 (Microprocessors)
- CIV101 (Structural Analysis)
- MBA101 (Principles of Management)

## How to Run

### Step 1: Open Terminal in VS Code
Press `` Ctrl+` `` or go to Terminal → New Terminal

### Step 2: Navigate to Backend Folder
```bash
cd backend
```

### Step 3: Run the Script
```bash
node add-missing-courses.js
```

That's it! The script will:
- ✅ Check if each course exists
- ✅ Create missing courses with Active = true
- ✅ Link to correct departments
- ✅ Skip courses that already exist (no duplicates)
- ✅ Show you a summary

## Expected Output

```
🔍 Checking for missing courses...

✅ Database connected

✅ Created course: CS102 - Object Oriented Programming
   Department: Computer Science (CS)
   Credits: 4

⏭️  Course EC101 already exists - skipping

============================================================
📊 SUMMARY
============================================================
✅ Courses added: 3
⏭️  Courses already exist: 2
📝 Total courses checked: 5
============================================================

📋 All Courses in Database:
============================================================
CS101      | Introduction to Programming              | CS
CS102      | Object Oriented Programming              | CS
EC101      | Digital Electronics                      | EC
...
============================================================

✅ SUCCESS! Missing courses have been added.
🔄 Please restart your backend server to see the changes.
```

## Troubleshooting

### Error: Department not found
**Problem:** Department CS, EC, CE, or BA doesn't exist

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

## After Running

1. ✅ Courses are created
2. 🔄 Restart backend server: `npm start`
3. 🌐 Check Course Management in browser
4. ✅ All 5 courses should be visible

## Next Step

After courses are created, you can create the 10 exams:
```bash
node add-10-exams.js
```

---

**Quick Command:**
```bash
cd backend && node add-missing-courses.js
```
