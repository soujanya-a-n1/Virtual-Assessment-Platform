# Quick Start Guide - Virtual Assessment Platform

## Prerequisites
- Node.js installed
- MySQL installed and running
- Ports 3000 and 5000 available

## Step 1: Database Setup

1. Open MySQL and create database:
```sql
CREATE DATABASE virtual_assessment_db;
```

2. Update `backend/.env` with your MySQL password:
```env
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=virtual_assessment_db
```

## Step 2: Start Backend

```bash
cd backend
npm start
```

Expected output:
```
Database connection established.
Database models synchronized.
Server running on port 5000
```

## Step 3: Start Frontend

Open a new terminal:
```bash
cd frontend
npm start
```

Browser will open at http://localhost:3000

## Step 4: Login

Use demo credentials from the Login page:
- **Admin**: admin@gmail.com / Admin@123
- **Student**: student@gmail.com / Admin@123
- **Examiner**: examiner@gmail.com / Admin@123

## Step 5: Add Sample Questions (Optional)

```bash
cd backend
node add-sample-questions-with-topics.js
```

This adds 20 sample questions across 9 topics.

## Common Issues & Solutions

### Port 5000 Already in Use
```powershell
$conn = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
if ($conn) { Stop-Process -Id $conn.OwningProcess -Force }
```

### Database Connection Error
- Check MySQL is running
- Verify credentials in `backend/.env`
- Ensure database exists

### Fonts Not Visible
- All CSS files have been fixed with proper colors
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)

## Module Overview

### Question Bank
- Create questions with topics
- Filter by type, difficulty, topic
- Search questions
- Edit/Delete questions

### Exam Management
- Create exams
- Add questions to exams
- Set duration, marks, passing criteria
- Schedule exams

### Take Exam
- Timer countdown
- Auto-save answers
- Question navigator
- Submit exam

### Submissions
- View all student submissions
- Review answers
- Evaluate submissions

### Results
- View exam results
- Statistics dashboard
- Pass/Fail status
- Detailed answer breakdown

## Quick Commands

**Kill Port 5000** (PowerShell):
```powershell
$conn = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue; if ($conn) { Stop-Process -Id $conn.OwningProcess -Force }
```

**Start Backend**:
```bash
cd backend && npm start
```

**Start Frontend**:
```bash
cd frontend && npm start
```

**Add Sample Data**:
```bash
cd backend && node add-sample-questions-with-topics.js
```

## File Structure

```
Virtual-Assessment-Platform/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Auth & error handling
│   ├── .env               # Configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   └── styles/        # CSS files
│   └── package.json
└── database/
    └── schema.sql         # Database schema
```

## Support

For detailed information, see:
- `FIXES_APPLIED.md` - All fixes and improvements
- `DEVELOPER_GUIDE.md` - Development guidelines
- `TESTING_CHECKLIST.md` - Testing procedures
- `README.md` - Project overview
