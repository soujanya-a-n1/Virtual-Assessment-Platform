# Testing Checklist - Virtual Assessment Platform

## Pre-Testing Setup

- [ ] MySQL server is running
- [ ] Database `virtual_assessment_db` is created
- [ ] All SQL schemas are executed (schema.sql, master_data_schema.sql, dummy_data.sql)
- [ ] Backend .env file is configured
- [ ] Frontend .env file is configured
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000

## Authentication Module

### Login
- [ ] Navigate to http://localhost:3000/login
- [ ] Login with admin@example.com / Admin@123
- [ ] Verify redirect to dashboard
- [ ] Check JWT token in localStorage
- [ ] Verify user info displayed in sidebar

### Logout
- [ ] Click logout button
- [ ] Verify redirect to login page
- [ ] Check token removed from localStorage
- [ ] Verify cannot access protected routes

### Register
- [ ] Navigate to /register
- [ ] Create new account
- [ ] Verify account created
- [ ] Verify automatic Student role assignment
- [ ] Login with new account

### Profile
- [ ] View profile information
- [ ] Update profile details
- [ ] Verify changes saved

## User Management Module (Admin Only)

### View Users
- [ ] Navigate to /users
- [ ] Verify all users displayed
- [ ] Check user roles shown
- [ ] Verify active/inactive status

### Create User
- [ ] Click "Add User" button
- [ ] Fill in user details
- [ ] Select role
- [ ] Submit form
- [ ] Verify user created
- [ ] Check user appears in list

### Edit User
- [ ] Click edit on a user
- [ ] Modify user details
- [ ] Save changes
- [ ] Verify updates reflected

### Delete User
- [ ] Click delete on a user
- [ ] Confirm deletion
- [ ] Verify user removed from list

### Assign Role
- [ ] Select a user
- [ ] Assign new role
- [ ] Verify role assigned
- [ ] Check user permissions updated

## Master Data Module

### Department Management
- [ ] Navigate to /departments
- [ ] View all departments
- [ ] Create new department (code, name, description)
- [ ] Edit existing department
- [ ] Delete department
- [ ] Verify department code is unique
- [ ] Check active/inactive toggle

### Course Management
- [ ] Navigate to /courses
- [ ] View all courses
- [ ] Create new course
- [ ] Assign department to course
- [ ] Set credits
- [ ] Edit course details
- [ ] Delete course
- [ ] Verify course code is unique

### Class Management
- [ ] Navigate to /classes
- [ ] View all classes
- [ ] Create new class
- [ ] Assign department
- [ ] Set academic year and semester
- [ ] Edit class details
- [ ] Delete class
- [ ] Verify class code is unique

### Lecturer Management
- [ ] Navigate to /lecturers
- [ ] View all lecturers
- [ ] Create new lecturer
  - [ ] Verify user account created automatically
  - [ ] Check Examiner role assigned
  - [ ] Verify employee ID is unique
- [ ] Assign department to lecturer
- [ ] Set qualification and specialization
- [ ] Edit lecturer details
- [ ] Delete lecturer
  - [ ] Verify user account also deleted
- [ ] Check lecturer count in department

### Student Management
- [ ] Navigate to /students
- [ ] View all students
- [ ] Create new student
  - [ ] Verify user account created automatically
  - [ ] Check Student role assigned
  - [ ] Verify student ID is unique
- [ ] Assign class and department
- [ ] Set enrollment year and semester
- [ ] Edit student details
- [ ] Delete student
  - [ ] Verify user account also deleted

### CSV Import (Students)
- [ ] Click "Import CSV" button
- [ ] Select sample_students.csv file
- [ ] Upload file
- [ ] Verify import success message
- [ ] Check imported students in list
- [ ] Verify user accounts created
- [ ] Check Student role assigned to all
- [ ] Verify error handling for duplicate emails

### Course-Lecturer Assignment
- [ ] Navigate to courses
- [ ] Select a course
- [ ] Assign lecturer to course
- [ ] Verify assignment successful
- [ ] Check lecturer count updated
- [ ] Remove lecturer from course
- [ ] Verify removal successful

## Exam Management Module

### View Exams
- [ ] Navigate to /exams
- [ ] View all exams
- [ ] Filter by status
- [ ] Search exams

### Create Exam
- [ ] Click "Create Exam"
- [ ] Fill exam details (title, description)
- [ ] Set duration and marks
- [ ] Assign course
- [ ] Set start and end time
- [ ] Configure settings (shuffling, negative marking)
- [ ] Save exam
- [ ] Verify exam created

### Edit Exam
- [ ] Select an exam
- [ ] Modify details
- [ ] Save changes
- [ ] Verify updates

### Delete Exam
- [ ] Delete an exam
- [ ] Confirm deletion
- [ ] Verify removal

### Publish Exam
- [ ] Publish a draft exam
- [ ] Verify status changed
- [ ] Check exam visible to students

## Question Bank Module

### View Questions
- [ ] Navigate to questions
- [ ] View all questions
- [ ] Filter by course
- [ ] Filter by difficulty

### Create Question
- [ ] Click "Add Question"
- [ ] Enter question text
- [ ] Select question type
- [ ] Add options (for MCQ)
- [ ] Set correct answer
- [ ] Assign marks
- [ ] Set difficulty
- [ ] Assign course
- [ ] Save question

### Edit Question
- [ ] Select a question
- [ ] Modify details
- [ ] Save changes

### Delete Question
- [ ] Delete a question
- [ ] Confirm deletion

### Add Questions to Exam
- [ ] Select an exam
- [ ] Add questions from bank
- [ ] Set display order
- [ ] Verify questions added

## Exam Attempt Module (Student)

### Browse Exams
- [ ] Login as student
- [ ] Navigate to /exams
- [ ] View available exams
- [ ] Check exam details

### Start Exam
- [ ] Click "Start Exam"
- [ ] Verify exam instructions shown
- [ ] Confirm start
- [ ] Check timer started
- [ ] Verify questions displayed

### Answer Questions
- [ ] Select answers for MCQ
- [ ] Type answers for text questions
- [ ] Navigate between questions
- [ ] Check answer saved indicator

### Auto-Save
- [ ] Answer a question
- [ ] Wait 30 seconds
- [ ] Verify auto-save triggered
- [ ] Check answer persisted

### Submit Exam
- [ ] Click "Submit Exam"
- [ ] Review answers
- [ ] Confirm submission
- [ ] Verify submission successful
- [ ] Check redirect to results

### Auto-Submit
- [ ] Start an exam
- [ ] Wait for timer to expire
- [ ] Verify auto-submit triggered
- [ ] Check submission recorded

### Prevent Duplicate Attempts
- [ ] Try to start same exam again
- [ ] Verify prevented
- [ ] Check error message

## Proctoring Module

### Tab Switch Detection
- [ ] Start an exam
- [ ] Switch to another tab
- [ ] Return to exam
- [ ] Verify violation logged

### Copy-Paste Prevention
- [ ] Try to copy question text
- [ ] Verify prevented
- [ ] Try to paste in answer field
- [ ] Check if blocked

### Right-Click Prevention
- [ ] Right-click on exam page
- [ ] Verify context menu blocked

### Fullscreen Enforcement
- [ ] Exit fullscreen during exam
- [ ] Verify warning shown
- [ ] Check violation logged

### View Proctoring Logs
- [ ] Navigate to proctoring logs (Admin/Proctor)
- [ ] View logs for a submission
- [ ] Check violation types
- [ ] Verify timestamps

## Results Module

### View Results (Student)
- [ ] Login as student
- [ ] Navigate to /results
- [ ] View own results only
- [ ] Check score and percentage
- [ ] View detailed answers
- [ ] Check correct/incorrect indicators

### View Results (Admin/Examiner)
- [ ] Login as admin/examiner
- [ ] Navigate to /results
- [ ] View all results
- [ ] Filter by exam
- [ ] Filter by student
- [ ] Search results

### Result Details
- [ ] Click on a result
- [ ] View detailed breakdown
- [ ] Check question-wise marks
- [ ] View student answers
- [ ] Check correct answers
- [ ] View time spent

### Manual Evaluation
- [ ] Select a submission with essay questions
- [ ] Assign marks manually
- [ ] Add evaluation notes
- [ ] Save evaluation
- [ ] Verify marks updated

## Analytics Module

### Dashboard Analytics
- [ ] Navigate to /analytics
- [ ] View total exams count
- [ ] Check total students count
- [ ] View total lecturers count
- [ ] Check recent activity

### Exam Analytics
- [ ] Select an exam
- [ ] View pass/fail statistics
- [ ] Check average score
- [ ] View score distribution chart
- [ ] Check question difficulty analysis

### Student Analytics
- [ ] Select a student
- [ ] View performance trends
- [ ] Check exam history
- [ ] View score progression

### Performance Charts
- [ ] Verify charts render correctly
- [ ] Check data accuracy
- [ ] Test chart interactions
- [ ] Verify responsive design

## UI/UX Testing

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify sidebar collapses on mobile
- [ ] Check table scrolling on small screens

### Navigation
- [ ] Test all sidebar links
- [ ] Verify active link highlighting
- [ ] Check submenu expansion
- [ ] Test breadcrumbs (if any)

### Forms
- [ ] Test all form validations
- [ ] Check required field indicators
- [ ] Verify error messages
- [ ] Test form reset
- [ ] Check modal open/close

### Tables
- [ ] Test search functionality
- [ ] Check pagination
- [ ] Verify sorting (if implemented)
- [ ] Test row actions (edit, delete)

### Modals
- [ ] Open modal
- [ ] Close with X button
- [ ] Close with Cancel button
- [ ] Close by clicking overlay
- [ ] Verify form data clears on close

### Loading States
- [ ] Check loading indicators
- [ ] Verify skeleton screens (if any)
- [ ] Test error states
- [ ] Check empty states

## Security Testing

### Authentication
- [ ] Try accessing protected routes without login
- [ ] Verify redirect to login
- [ ] Test with expired token
- [ ] Check token refresh

### Authorization
- [ ] Login as Student
- [ ] Try accessing admin routes
- [ ] Verify access denied
- [ ] Login as Admin
- [ ] Verify full access

### Input Validation
- [ ] Try SQL injection in forms
- [ ] Test XSS attacks
- [ ] Submit invalid data
- [ ] Check server-side validation

### Password Security
- [ ] Verify passwords are hashed
- [ ] Check password strength requirements
- [ ] Test password change

## Performance Testing

### Page Load Times
- [ ] Measure dashboard load time
- [ ] Check exam list load time
- [ ] Test with large datasets

### API Response Times
- [ ] Test GET requests
- [ ] Test POST requests
- [ ] Check with concurrent users

### Database Queries
- [ ] Check query execution times
- [ ] Verify indexes are used
- [ ] Test with large tables

## Browser Compatibility

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge

## Error Handling

### Network Errors
- [ ] Stop backend server
- [ ] Try making API calls
- [ ] Verify error messages shown
- [ ] Check graceful degradation

### Database Errors
- [ ] Stop MySQL
- [ ] Try operations
- [ ] Verify error handling

### Validation Errors
- [ ] Submit invalid forms
- [ ] Check error messages
- [ ] Verify field highlighting

## Data Integrity

### Relationships
- [ ] Delete department with courses
- [ ] Verify cascade behavior
- [ ] Delete user with submissions
- [ ] Check data consistency

### Constraints
- [ ] Try duplicate email
- [ ] Try duplicate codes
- [ ] Verify unique constraints
- [ ] Check foreign key constraints

## Backup & Recovery

### Database Backup
- [ ] Create database backup
- [ ] Verify backup file created
- [ ] Test restore from backup
- [ ] Check data integrity after restore

### File Uploads
- [ ] Upload CSV file
- [ ] Verify file saved
- [ ] Check file permissions
- [ ] Test file deletion

## Documentation

- [ ] README.md is complete
- [ ] SETUP_GUIDE.md is accurate
- [ ] API endpoints documented
- [ ] Code comments are clear
- [ ] Environment variables documented

## Final Checks

- [ ] All features working
- [ ] No console errors
- [ ] No broken links
- [ ] All forms functional
- [ ] All buttons working
- [ ] Proper error messages
- [ ] Loading states working
- [ ] Responsive design working
- [ ] Security measures in place
- [ ] Performance acceptable

## Known Issues

Document any issues found:

1. Issue: _______________
   - Steps to reproduce: _______________
   - Expected: _______________
   - Actual: _______________
   - Priority: High/Medium/Low

2. Issue: _______________
   - Steps to reproduce: _______________
   - Expected: _______________
   - Actual: _______________
   - Priority: High/Medium/Low

## Test Results Summary

- Total Tests: ___
- Passed: ___
- Failed: ___
- Skipped: ___
- Pass Rate: ___%

## Sign-off

- [ ] All critical features tested
- [ ] All major bugs fixed
- [ ] Documentation complete
- [ ] Ready for deployment

**Tested By**: _______________
**Date**: _______________
**Version**: 1.0.0

---

**Status**: ✅ Testing Complete / ⚠️ Issues Found / ❌ Failed
