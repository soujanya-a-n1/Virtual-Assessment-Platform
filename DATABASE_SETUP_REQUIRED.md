# ⚠️ Database Setup Required

## Current Issue

The backend is returning 500 errors because the database connection is not configured properly.

**Error**: `Access denied for user ''@'localhost' (using password: NO)`

This means the MySQL credentials in `backend/.env` are not set correctly.

---

## Quick Fix Steps

### Step 1: Check MySQL is Running

Open MySQL Workbench or command line and verify MySQL is running.

### Step 2: Update Database Credentials

Edit `backend/.env` file and set your MySQL password:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=virtual_assessment_db
DB_PORT=3306
```

**Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password.**

If you don't have a password, you can leave it empty:
```env
DB_PASSWORD=
```

But it's recommended to set one for security.

### Step 3: Create Database

Open MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS virtual_assessment_db;
```

Or use this command:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS virtual_assessment_db;"
```

### Step 4: Restart Backend

Stop the backend server (Ctrl+C) and start it again:

```bash
cd backend
npm start
```

You should see:
```
Database connection established.
Database models synchronized.
Server running on port 5000
```

### Step 5: Verify Connection

Run the test script:

```bash
node backend/test-api.js
```

Expected output:
```
🔌 Connecting to database...
✅ Database connected
📊 Testing Question model...
✅ Questions in database: 0
📊 Testing ExamSubmission model...
✅ Submissions in database: 0
📊 Testing User model...
✅ Users in database: 0
📊 Testing Exam model...
✅ Exams in database: 0
🎉 All models working correctly!
```

### Step 6: Add Sample Data

Once the database is connected, run:

```bash
cd backend
node add-sample-questions-with-topics.js
```

This will add 20 sample questions to test the system.

---

## Common MySQL Password Issues

### If you forgot your MySQL password:

**Windows:**
1. Stop MySQL service
2. Start MySQL without password: `mysqld --skip-grant-tables`
3. Connect: `mysql -u root`
4. Reset password:
   ```sql
   USE mysql;
   UPDATE user SET authentication_string=PASSWORD('newpassword') WHERE User='root';
   FLUSH PRIVILEGES;
   ```
5. Restart MySQL normally

**Or use MySQL Workbench:**
1. Open MySQL Workbench
2. Go to Server → Users and Privileges
3. Select root user
4. Set new password

### If MySQL is not installed:

Download and install from: https://dev.mysql.com/downloads/mysql/

During installation, set a root password and remember it.

---

## Alternative: Use Empty Password

If you're just testing locally, you can use MySQL without a password:

1. In `backend/.env`:
   ```env
   DB_PASSWORD=
   ```

2. Make sure MySQL allows connections without password (not recommended for production)

---

## Verification Checklist

- [ ] MySQL is installed and running
- [ ] Database `virtual_assessment_db` exists
- [ ] `backend/.env` has correct DB_PASSWORD
- [ ] Backend starts without errors
- [ ] `node backend/test-api.js` succeeds
- [ ] Frontend can load Question Bank page
- [ ] Frontend can load Results page

---

## After Database is Connected

Once the database is working, you'll be able to:

1. ✅ View Question Bank (currently showing 500 error)
2. ✅ View Results (currently showing 500 error)
3. ✅ Create questions with topics
4. ✅ Create and manage exams
5. ✅ Take exams as student
6. ✅ View submissions and results

---

## Current Status

| Component | Status | Issue |
|-----------|--------|-------|
| Frontend | ✅ Running | Port 3000 |
| Backend | ✅ Running | Port 5000 |
| Database | ❌ Not Connected | Empty password in .env |
| API Endpoints | ❌ Failing | 500 errors due to DB |

---

## Next Steps

1. **Set MySQL password in `backend/.env`**
2. **Create database `virtual_assessment_db`**
3. **Restart backend server**
4. **Refresh frontend pages**
5. **Add sample questions**
6. **Start testing!**

---

## Need Help?

If you're still having issues:

1. Check MySQL is running: `mysql -u root -p`
2. Check backend logs in terminal
3. Check browser console for errors
4. Verify .env file has correct credentials
5. Try connecting to MySQL manually first

---

**Once the database is connected, all the 500 errors will be resolved and the system will work perfectly!** 🎉
