# Fix 500 Errors - Quick Guide

## Problem

You're seeing these errors in the browser console:
```
Failed to load resource: the server responded with a status of 500
Error fetching questions: AxiosError: Request failed with status code 500
Error fetching results: AxiosError: Request failed with status code 500
```

## Root Cause

**The database is not connected.** The backend `.env` file has an empty MySQL password.

---

## Solution (Choose One)

### Option 1: Automated Setup (Recommended)

Run this interactive script:

```bash
cd backend
node setup-database.js
```

It will:
1. Ask for your MySQL credentials
2. Create the database
3. Update the .env file
4. Configure everything automatically

Then restart the backend:
```bash
npm start
```

---

### Option 2: Manual Setup

#### Step 1: Set MySQL Password

Edit `backend/.env`:

```env
DB_PASSWORD=your_mysql_password
```

If you don't have a password, leave it empty:
```env
DB_PASSWORD=
```

#### Step 2: Create Database

Open MySQL and run:
```sql
CREATE DATABASE virtual_assessment_db;
```

Or use command line:
```bash
mysql -u root -p -e "CREATE DATABASE virtual_assessment_db;"
```

#### Step 3: Restart Backend

Stop the backend (Ctrl+C) and start again:
```bash
cd backend
npm start
```

---

## Verify It's Working

### Test 1: Check Backend Logs

You should see:
```
Database connection established.
Database models synchronized.
Server running on port 5000
```

### Test 2: Run Test Script

```bash
node backend/test-api.js
```

Should show:
```
✅ Database connected
✅ Questions in database: 0
✅ Submissions in database: 0
✅ Users in database: 0
✅ Exams in database: 0
🎉 All models working correctly!
```

### Test 3: Refresh Frontend

1. Go to http://localhost:3000
2. Login with: admin@gmail.com / Admin@123
3. Click "Question Bank" - should load without errors
4. Click "Results" - should load without errors

---

## Add Sample Data

Once database is connected:

```bash
cd backend
node add-sample-questions-with-topics.js
```

This adds 20 sample questions across 9 topics.

---

## Still Having Issues?

### Check MySQL is Running

**Windows:**
- Open Services (services.msc)
- Find "MySQL" service
- Ensure it's running

**Command Line:**
```bash
mysql -u root -p
```

If this works, MySQL is running.

### Check MySQL Password

If you forgot your password:

1. Open MySQL Workbench
2. Server → Users and Privileges
3. Select root user
4. Reset password

### Check .env File

Make sure `backend/.env` has:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=virtual_assessment_db
DB_PORT=3306
```

---

## What Happens After Fix

Once the database is connected:

✅ Question Bank page loads
✅ Results page loads  
✅ Can create questions with topics
✅ Can create exams
✅ Can take exams
✅ Can view submissions
✅ All 500 errors disappear

---

## Quick Commands

**Setup database (interactive):**
```bash
cd backend && node setup-database.js
```

**Test connection:**
```bash
node backend/test-api.js
```

**Start backend:**
```bash
cd backend && npm start
```

**Add sample questions:**
```bash
cd backend && node add-sample-questions-with-topics.js
```

---

## Summary

The 500 errors are happening because:
1. ❌ MySQL password not set in .env
2. ❌ Database not created
3. ❌ Backend can't connect to database

To fix:
1. ✅ Run `node backend/setup-database.js`
2. ✅ Or manually set password in .env
3. ✅ Restart backend
4. ✅ Refresh frontend

**That's it! The system will work perfectly once the database is connected.** 🎉
