# Virtual Assessment Platform - Setup Guide

## Quick Start (5 Minutes)

### Step 1: Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database and run schemas
source database/schema.sql
source database/master_data_schema.sql
source database/dummy_data.sql
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Sync database
npm run db:sync

# Start server
npm run dev
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with API URL

# Start development server
npm start
```

### Step 4: Login
Open `http://localhost:3000` and login with:
- Email: admin@example.com
- Password: Admin@123

## Detailed Setup Instructions

### Prerequisites
- Node.js v14+ installed
- MySQL v8+ installed and running
- npm or yarn package manager

### Backend Configuration

1. **Environment Variables** (backend/.env):
```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=virtual_assessment_db
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

2. **Install Dependencies**:
```bash
cd backend
npm install
```

3. **Database Setup**:
```bash
# Option 1: Using MySQL CLI
mysql -u root -p < ../database/schema.sql
mysql -u root -p < ../database/master_data_schema.sql
mysql -u root -p < ../database/dummy_data.sql

# Option 2: Using Sequelize
npm run db:sync
```

4. **Start Backend**:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Configuration

1. **Environment Variables** (frontend/.env):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

2. **Install Dependencies**:
```bash
cd frontend
npm install
```

3. **Start Frontend**:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Default User Accounts

After running dummy_data.sql:

### Super Admin
- Email: superadmin@platform.com
- Password: Admin@123456

### Admin
- Email: admin@example.com
- Password: Admin@123

### Examiner
- Email: examiner@example.com
- Password: Examiner@123

### Student
- Email: student@example.com
- Password: Student@123

## Testing the Application

### 1. Test Authentication
- Navigate to `http://localhost:3000/login`
- Login with any default account
- Verify redirect to dashboard

### 2. Test Master Data (Admin/Super Admin)
- Navigate to Departments, Courses, Classes
- Create, edit, delete records
- Verify relationships

### 3. Test Lecturer Management
- Create a new lecturer
- Assign courses to lecturer
- Verify lecturer can see assigned courses

### 4. Test Student Management
- Create a new student
- Import students via CSV (use sample_students.csv)
- Assign class and department

### 5. Test Exam Flow
- Create an exam (as Examiner)
- Add questions to exam
- Publish exam
- Take exam (as Student)
- View results

## CSV Import Format

### Students CSV Format
```csv
firstName,lastName,email,password,phone,studentId,classId,departmentId,enrollmentYear,currentSemester
John,Doe,john@example.com,Student@123,1234567890,STU001,1,1,2024,1
```

Sample file available at: `frontend/public/sample_students.csv`

## Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p

# Verify database exists
SHOW DATABASES;
USE virtual_assessment_db;
SHOW TABLES;
```

### Port Already in Use
```bash
# Backend (Port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (Port 3000)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
Ensure backend .env has:
```env
CORS_ORIGIN=http://localhost:3000
```

### JWT Token Issues
- Clear browser localStorage
- Logout and login again
- Check JWT_SECRET is set in backend .env

## API Testing with Postman/Thunder Client

### 1. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

### 2. Get Departments (with token)
```
GET http://localhost:5000/api/departments
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3. Create Department
```
POST http://localhost:5000/api/departments
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Computer Science",
  "code": "CS",
  "description": "Computer Science Department",
  "isActive": true
}
```

## Production Deployment

### Backend Deployment
1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Enable HTTPS
4. Set up proper CORS
5. Use environment variables for sensitive data
6. Set up database backups
7. Enable logging and monitoring

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve static files with nginx/apache
3. Update REACT_APP_API_URL to production API
4. Enable HTTPS
5. Set up CDN for static assets

### Database
1. Use managed MySQL service (AWS RDS, Google Cloud SQL)
2. Enable automated backups
3. Set up replication
4. Monitor performance
5. Regular security updates

## Performance Optimization

### Backend
- Enable compression
- Use connection pooling
- Add caching (Redis)
- Optimize database queries
- Add indexes to frequently queried columns

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Minimize bundle size
- Use production build

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable CORS properly
- [ ] Use prepared statements
- [ ] Implement CSRF protection
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Backup and Recovery

### Database Backup
```bash
# Backup
mysqldump -u root -p virtual_assessment_db > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p virtual_assessment_db < backup_20240214.sql
```

### Application Backup
```bash
# Backup uploads folder
tar -czf uploads_backup.tar.gz backend/uploads/

# Backup environment files
cp backend/.env backend/.env.backup
cp frontend/.env frontend/.env.backup
```

## Monitoring

### Application Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend console
Open browser DevTools > Console
```

### Database Monitoring
```sql
-- Check active connections
SHOW PROCESSLIST;

-- Check table sizes
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES
WHERE table_schema = "virtual_assessment_db"
ORDER BY (data_length + index_length) DESC;
```

## Support

For issues or questions:
1. Check this guide first
2. Review error logs
3. Check database connections
4. Verify environment variables
5. Test API endpoints directly

## Next Steps

After successful setup:
1. Customize branding and colors
2. Add more question types
3. Implement email notifications
4. Add file upload for questions
5. Enhance analytics dashboard
6. Add more proctoring features
7. Implement real-time notifications
8. Add exam templates
9. Create mobile app
10. Add video proctoring

---

**Setup Complete!** 🎉

Your Virtual Assessment Platform is now ready to use.
