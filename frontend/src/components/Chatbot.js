import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Chatbot.css';

// Role details for Virtual Assessment Platform
const roleDetails = {
  student: `🎓 **Student Role**

**Overview:**
The Student is the main user who attends exams in the Virtual Assessment Platform. Students can log in, view assigned exams, attempt tests, submit answers, and check results.

**Responsibilities:**
• Login securely using valid credentials
• View assigned exams from the dashboard
• Read exam instructions before starting
• Attempt MCQ-based questions
• Submit answers within the time limit
• View marks and performance report

**Features:**
• Student Dashboard
• Available Exams
• Online Exam Attempt
• Timer-Based Exam
• Answer Submission
• Result Viewing

**Workflow:**
1. Student logs in
2. Opens dashboard
3. Views assigned exams
4. Starts exam
5. Answers questions
6. Submits exam
7. Views result

**Permissions:**
Students can only access their own exams, answers, results, and profile details.`,

  examiner: `📝 **Examiner Role**

**Overview:**
The Examiner is responsible for creating exams, managing questions, assigning marks, and checking student performance.

**Responsibilities:**
• Create and schedule exams
• Add, edit, and delete questions
• Manage question banks
• Set exam duration and marks
• View submitted answers
• Check student performance

**Features:**
• Examiner Dashboard
• Exam Management
• Question Management
• Result Analysis
• Student Performance View

**Workflow:**
1. Examiner logs in
2. Opens dashboard
3. Creates exam
4. Adds questions
5. Publishes exam
6. Reviews student results

**Permissions:**
Examiners can manage exams, questions, and results but cannot control system settings.`,

  admin: `👨‍💼 **Admin Role**

**Overview:**
The Admin manages users, exams, subjects, and overall system activities in the Virtual Assessment Platform.

**Responsibilities:**
• Manage students and examiners
• Create and update user records
• Assign exams
• Monitor exam activity
• View reports and results
• Maintain system data

**Features:**
• Admin Dashboard
• User Management
• Exam Management
• Result Reports
• Student Records

**Workflow:**
1. Admin logs in
2. Opens admin dashboard
3. Manages users
4. Assigns exams
5. Monitors system activity
6. Views reports

**Permissions:**
Admin can manage users, exams, and reports but may not access super admin settings.`,

  superadmin: `🛡️ **Super Admin Role**

**Overview:**
The Super Admin has the highest control in the Virtual Assessment Platform. This role manages admins, system settings, users, and complete platform operations.

**Responsibilities:**
• Manage admins
• Control all users
• Monitor full system activity
• Manage platform settings
• View complete reports
• Maintain security and access control

**Features:**
• Super Admin Dashboard
• Admin Management
• User Control
• System Settings
• Complete Reports
• Role-Based Access Control

**Workflow:**
1. Super Admin logs in
2. Opens dashboard
3. Manages admins and users
4. Controls system settings
5. Monitors reports and activities

**Permissions:**
Super Admin has full access to the entire platform.`,

  workflow: `🔄 **Virtual Assessment Platform - Project Workflow**

**Overview:**
The Virtual Assessment Platform is an online examination system that allows Admin, Examiner, and Student users to perform exam-related activities securely.

**Step-by-Step Workflow:**

**1. User Login**
• User enters email and password
• System verifies credentials
• JWT token is generated
• User is redirected based on role

**2. Admin Workflow**
• Admin manages students and examiners
• Admin creates users
• Admin assigns roles
• Admin monitors exams and reports

**3. Examiner Workflow**
• Examiner creates exams
• Examiner adds questions
• Examiner sets marks and duration
• Examiner publishes exams

**4. Student Workflow**
• Student logs in
• Student views assigned exams
• Student starts exam
• Student answers questions
• Student submits exam

**5. Evaluation Workflow**
• System checks submitted answers
• Marks are calculated automatically
• Results are stored in database

**6. Result Workflow**
• Student views result
• Examiner views student performance
• Admin views reports

**7. Database Workflow**
• User details, exams, questions, answers, and results are stored securely in MySQL database

**Technologies Used:**
• Frontend: React.js
• Backend: Node.js and Express.js
• Database: MySQL
• Authentication: JWT`
};

// Enhanced knowledge base with detailed responses
const knowledgeBase = {
  'Super Admin': {
    greeting: 'Hello Super Admin! I can help you with system management, user administration, and platform oversight. Ask me anything for detailed explanations!',
    topics: {
      'user management': `📋 **USER MANAGEMENT - COMPLETE GUIDE**

**Overview:**
As a Super Admin, you have full control over all user accounts in the system.

**Step-by-Step Process:**

1️⃣ **Accessing User Management:**
   • Navigate to sidebar → "Users"
   • View all users with roles, status, last activity

2️⃣ **Creating New Users:**
   • Click "Add New User"
   • Fill: Name, Email, Username, Password
   • Select Role: Super Admin/Admin/Examiner/Proctor/Student
   • Assign Department
   • Click "Create"

3️⃣ **Editing Users:**
   • Click "Edit" icon
   • Modify: Personal info, Email, Roles, Status
   • Reset password if needed
   • Save changes

4️⃣ **Role Assignment:**
   • Super Admin: Full system access
   • Admin: User & exam management
   • Examiner: Create & grade exams
   • Proctor: Monitor exams
   • Student: Take exams & view results

5️⃣ **Bulk Operations:**
   • Import users via CSV
   • Export user list
   • Bulk role assignment
   • Bulk activation/deactivation

**Best Practices:**
✅ Verify email addresses
✅ Use strong passwords
✅ Regular permission audits
✅ Deactivate instead of delete
✅ Document role changes

**Common Issues:**
❌ Duplicate email → User exists
❌ Can't delete → Has associated data
❌ Role not applying → Clear cache`,

      'system settings': `⚙️ **SYSTEM SETTINGS - COMPREHENSIVE GUIDE**

**Overview:**
Control platform-wide configurations affecting all users.

**Categories:**

1️⃣ **General Settings:**
   • Platform name & branding
   • Default language & timezone
   • Date/time formats
   • Email templates
   • Notifications

2️⃣ **Security Settings:**
   • Password policies (8+ chars)
   • Complexity requirements
   • Session timeout
   • Two-factor authentication
   • IP whitelisting
   • API rate limiting

3️⃣ **Exam Settings:**
   • Default duration
   • Auto-save interval (30 sec)
   • Proctoring features:
     - Tab switch detection
     - Fullscreen enforcement
     - Copy-paste restrictions
   • Grading policies

4️⃣ **Email Configuration:**
   • SMTP server settings
   • Sender email
   • Templates for:
     - Welcome emails
     - Password resets
     - Exam notifications

5️⃣ **Integration Settings:**
   • LMS integration
   • Single Sign-On (SSO)
   • API keys
   • Webhooks

**Configuration Steps:**
Step 1: Navigate to Settings
Step 2: Select Category
Step 3: Modify Settings
Step 4: Test Configuration
Step 5: Save & Apply

⚠️ Warning: Test before applying major changes!`,

      'analytics': `📊 **ANALYTICS & REPORTING - DETAILED GUIDE**

**Overview:**
Comprehensive insights into platform usage and performance.

**Available Analytics:**

1️⃣ **User Analytics:**
   • Total users by role
   • Active vs inactive
   • Registration trends
   • Login patterns
   • Geographic distribution
   • Device statistics

2️⃣ **Exam Analytics:**
   • Total exams created
   • Exams by status
   • Average duration
   • Completion rates
   • Pass/fail ratios
   • Question difficulty

3️⃣ **Performance Metrics:**
   • Average scores
   • Score distribution
   • Top performers
   • Students needing help
   • Improvement trends

4️⃣ **Proctoring Analytics:**
   • Violation statistics
   • Tab switch frequency
   • Suspicious behavior
   • Flagged submissions

5️⃣ **System Health:**
   • Server uptime
   • Response times
   • Database performance
   • Storage usage
   • Error rates

**How to Use:**
• Navigate to Analytics
• Select report type
• Choose date range
• Apply filters
• Generate report
• Export (PDF/Excel/CSV)

**Key Metrics:**
📈 Growth: User registration rate
📊 Engagement: Daily active users
🎯 Performance: Average scores
⚠️ Risk: Violation rates`,

      'roles': `👥 **ROLES & PERMISSIONS - COMPLETE GUIDE**

**Overview:**
Role-based access control (RBAC) system.

**Available Roles:**

1️⃣ **SUPER ADMIN**
   ✅ Full system access
   ✅ Manage all users & roles
   ✅ Configure system
   ✅ Database management
   ✅ Backup & restore
   ✅ API keys
   ✅ Audit logs

2️⃣ **ADMIN**
   ✅ Manage users (except Super Admins)
   ✅ View all exams
   ✅ Access reports
   ✅ Manage departments
   ❌ Cannot change system settings

3️⃣ **EXAMINER**
   ✅ Create & edit exams
   ✅ Manage questions
   ✅ Grade submissions
   ✅ View analytics
   ❌ Cannot manage users

4️⃣ **PROCTOR**
   ✅ Monitor active exams
   ✅ View proctoring logs
   ✅ Flag violations
   ✅ Generate reports
   ❌ Cannot create exams

5️⃣ **STUDENT**
   ✅ Take assigned exams
   ✅ View own results
   ✅ Update profile
   ❌ Cannot view others' data

**Role Hierarchy:**
Super Admin > Admin > Examiner/Proctor > Student

**Managing Roles:**
1. Go to User Management
2. Select user
3. Click "Manage Roles"
4. Check/uncheck roles
5. Save changes

**Best Practices:**
✅ Least privilege principle
✅ Regular audits
✅ Document changes
✅ Limit Super Admin accounts`,

      'database': `💾 **DATABASE MANAGEMENT - COMPREHENSIVE GUIDE**

**Overview:**
Ensure data integrity, performance, and availability.

**Core Tables:**
• users - User accounts
• roles - Role definitions
• exams - Exam metadata
• questions - Question bank
• submissions - Student submissions
• results - Graded results
• proctoring_logs - Monitoring data

**Operations:**

1️⃣ **BACKUP & RESTORE**
   • Full Backup: Complete database
   • Incremental: Changes since last
   • Differential: Changes since full
   • Schedule: Daily/Weekly/Monthly
   • Test restores monthly

2️⃣ **PERFORMANCE MONITORING**
   • Query execution time
   • Connection pool usage
   • Table sizes
   • Index efficiency
   • Slow query log

3️⃣ **MAINTENANCE**
   • Daily: Monitor performance
   • Weekly: Review slow queries
   • Monthly: Analyze & optimize
   • Quarterly: Archive old data
   • Yearly: Major cleanup

4️⃣ **SECURITY**
   • Database user permissions
   • Connection encryption (SSL/TLS)
   • IP whitelisting
   • Audit logging
   • Password rotation

**Best Practices:**
✅ Backup before changes
✅ Test restores monthly
✅ Monitor disk space
✅ Document schema changes
✅ Regular security audits

**Emergency Procedures:**
🚨 Database crash → Restore from backup
🚨 Data breach → Isolate, investigate
🚨 Corruption → Run repair tools`
    }
  },
  'Admin': {
    greeting: 'Hello Admin! I can assist you with user management, exam oversight, and reporting. Ask for detailed guides!',
    topics: {
      'user management': `👤 **USER MANAGEMENT FOR ADMINS**

**Your Scope:**
Manage all users except Super Admins.

**Creating Students:**
1. Navigate to Students → Add New
2. Enter: Name, Email, Student ID
3. Assign: Department, Course, Class
4. Click "Create Student"
5. System sends welcome email

**Creating Faculty:**
1. Go to Users → Add Faculty
2. Fill: Name, Email
3. Select Role: Examiner/Proctor
4. Assign Department & Courses
5. Set initial password
6. Save & notify

**Bulk Import:**
1. Download CSV template
2. Fill user data (one per row)
3. Upload CSV file
4. Review preview
5. Confirm import

**Managing Users:**
• Search by name/email/ID
• Edit user information
• Change roles
• Reset passwords
• Activate/Deactivate accounts

**Account Status:**
• Active: Can login
• Inactive: Temporary suspension
• Locked: Security lockout
• Pending: Awaiting verification

**Best Practices:**
✅ Verify emails before creating
✅ Use bulk import for >10 users
✅ Deactivate instead of delete
✅ Respond to requests within 24hrs`,

      'exams': `📝 **EXAM OVERSIGHT - COMPREHENSIVE GUIDE**

**Your View:**
See all exams across your institution.

**Exam Lifecycle:**

1️⃣ **DRAFT**
   • Examiner creating
   • Questions being added
   • Not visible to students
   • You can review

2️⃣ **SCHEDULED**
   • Ready but not started
   • Students can see countdown
   • Last chance for changes
   • You can reschedule

3️⃣ **ACTIVE**
   • Currently running
   • Students taking it
   • Real-time monitoring
   • You can extend time

4️⃣ **COMPLETED**
   • All finished
   • Grading in progress
   • Reports available
   • You can view submissions

**Monitoring Active Exams:**
• Number of students taking
• Time remaining
• Submission progress
• Proctoring alerts
• Technical issues

**Intervention Options:**
• Extend exam time
• Pause exam (emergency)
• Send announcements
• Grant extra attempts
• Handle technical issues

**Exam Reports:**
• Pass/fail rate
• Average scores
• Score distribution
• Question analysis
• Proctoring summary

**Handling Issues:**
Student missed exam → Verify issue → Grant attempt
Exam needs extension → Extend Time → Add minutes
Question has error → Remove or award full marks`,

      'reports': `📊 **REPORTING & ANALYTICS**

**Report Types:**

1️⃣ **Student Performance**
   • Individual reports
   • Class performance
   • Department statistics
   • Trend analysis

2️⃣ **Exam Reports**
   • Exam summary
   • Question analysis
   • Comparative reports
   • Difficulty assessment

3️⃣ **User Activity**
   • Login activity
   • Feature usage
   • Faculty activity
   • Engagement metrics

4️⃣ **Compliance Reports**
   • Audit trail
   • Proctoring compliance
   • Policy adherence
   • Incident reports

**Generation Process:**
Step 1: Select report type
Step 2: Set filters (date, dept, course)
Step 3: Preview report
Step 4: Export (PDF/Excel/CSV)
Step 5: Schedule (optional)

**Export Formats:**
• PDF: Presentations
• Excel: Further analysis
• CSV: Data import
• JSON: API integration

**Best Practices:**
✅ Generate weekly
✅ Share with stakeholders
✅ Compare month-over-month
✅ Archive for records`,

      'departments': `🏢 **DEPARTMENT MANAGEMENT**

**Structure:**
Institution → Departments → Courses → Classes → Students

**Creating Department:**
1. Navigate to Departments → Add New
2. Enter:
   • Department Name
   • Department Code (unique)
   • Description
   • Head of Department
   • Contact Email
3. Set department settings
4. Click "Create"

**Managing Courses:**
1. Select department
2. Click "Add Course"
3. Enter:
   • Course Name & Code
   • Credits
   • Description
   • Prerequisites
   • Syllabus (upload PDF)
4. Assign instructors
5. Save course

**Managing Classes:**
1. Select course
2. Click "Add Class"
3. Fill:
   • Class Code
   • Schedule (days/times)
   • Room/Location
   • Capacity
   • Instructor
   • Semester
4. Create class

**Student Enrollment:**
• Manual: Select students individually
• Bulk: Upload CSV with enrollments
• Self-Enrollment: Students enroll themselves

**Faculty Assignment:**
1. Go to course/class
2. Click "Assign Faculty"
3. Select instructor(s)
4. Set role (primary/assistant)
5. Save assignment

**Best Practices:**
✅ Consistent naming conventions
✅ Realistic class capacities
✅ Balance faculty workload
✅ Plan ahead for semesters`,

      'students': `🎓 **STUDENT MANAGEMENT**

**Student Profiles:**
• Personal information
• Contact details
• Academic history
• Enrolled courses
• Exam history
• Performance metrics

**Creating Students:**
1. Students → Add New
2. Enter:
   • Name, Email, Student ID
   • Department, Program
   • Year/Level
   • Enrollment Date
3. Set account status
4. Create account
5. Welcome email sent

**Enrollment Management:**
• Manual enrollment
• Bulk enrollment (CSV)
• Self-enrollment
• Drop courses
• Transfer between classes

**Performance Tracking:**
• Overall GPA
• Semester GPA
• Course grades
• Exam scores
• Attendance
• Improvement trends

**At-Risk Students:**
🚨 Indicators:
   • Failing grades (<50%)
   • Low attendance (<75%)
   • Multiple violations
   • Declining performance
   • No recent activity

**Intervention:**
1. Identify at-risk students
2. Review records
3. Contact student
4. Create improvement plan
5. Assign mentor/tutor
6. Monitor progress

**Communication:**
• Individual emails
• Bulk messages
• SMS notifications
• Announcements
• Meeting scheduling

**Best Practices:**
✅ Keep info updated
✅ Respond within 24hrs
✅ Protect privacy (FERPA)
✅ Document interventions
✅ Proactive communication`
    }
  },
  'Examiner': {
    greeting: 'Hello Examiner! I can help you create exams, manage questions, and evaluate submissions with detailed guides!',
    topics: {
      'create exam': `📝 **CREATING EXAMS - COMPLETE GUIDE**

**Step-by-Step:**

1️⃣ **Navigate:**
   Exams → Create New Exam

2️⃣ **Basic Information:**
   • Title: Clear, descriptive name
   • Description: Brief overview
   • Duration: Time limit (minutes)
   • Total Marks: Maximum score
   • Passing Marks: Minimum to pass
   • Start/End Date & Time

3️⃣ **Configure Settings:**
   • Shuffle Questions: Randomize order
   • Shuffle Options: Randomize answers
   • Show Results: Immediately/After deadline
   • Allow Review: Let students review
   • Attempts Allowed: Usually 1
   • Late Submission: Allow/Block

4️⃣ **Set Proctoring:**
   • Fullscreen Mode: Enforce
   • Tab Switch Detection: Monitor
   • Copy-Paste Restrictions: Block
   • Screenshot Prevention: Disable
   • Webcam Monitoring: Enable
   • Violation Threshold: Auto-submit after X

5️⃣ **Add Questions:**
   • From Question Bank (reuse)
   • Create New Questions
   • Import from CSV (bulk)
   • Set marks per question
   • Add explanations

6️⃣ **Preview:**
   • Take exam as student
   • Verify all questions
   • Check timing
   • Test proctoring

7️⃣ **Publish:**
   • Assign to students/classes
   • Set deadlines
   • Send notifications
   • Monitor submissions

**Question Types:**
• Multiple Choice (MCQ)
• True/False
• Short Answer
• Essay
• Coding Questions

**Best Practices:**
✅ Test before publishing
✅ Clear instructions
✅ Realistic time limits
✅ Mix question types
✅ Proofread everything`,

      'questions': `❓ **QUESTION BANK MANAGEMENT**

**Creating Questions:**

**Multiple Choice:**
1. Click "Add Question" → MCQ
2. Enter question text
3. Add 4-5 options
4. Mark correct answer(s)
5. Set marks (usually 1-5)
6. Add explanation (optional)
7. Save question

**Coding Questions:**
1. Select "Coding Question"
2. Write problem statement
3. Choose language:
   • Python
   • Java
   • C++
   • JavaScript
   • C
   • C#
4. Add test cases:
   • Public (visible to students)
   • Private (hidden)
5. Set time/memory limits
6. Provide starter code (optional)
7. Save question

**Essay Questions:**
1. Select "Essay"
2. Write prompt
3. Set word limit
4. Create rubric for grading
5. Set marks
6. Save question

**Organizing Questions:**
• Tag by topic
• Set difficulty level
• Categorize by course
• Add to collections
• Mark as favorites

**CSV Import:**
1. Download template
2. Fill in questions
3. Upload CSV
4. Map columns
5. Preview & confirm

**Best Practices:**
✅ Clear, unambiguous wording
✅ Avoid trick questions
✅ Test coding questions
✅ Use rubrics for essays
✅ Regular review & update`,

      'grading': `✅ **GRADING & EVALUATION**

**Auto-Graded:**
• Multiple Choice Questions
• True/False
• Coding Questions (test cases)
• Results available immediately

**Manual Grading:**

**Essay Questions:**
1. Go to Submissions
2. Select exam
3. Click on student submission
4. Read essay answer
5. Apply rubric:
   • Content (40%)
   • Organization (30%)
   • Grammar (20%)
   • Originality (10%)
6. Assign marks
7. Add detailed feedback
8. Save grade

**Short Answer:**
1. Review answer
2. Check against model answer
3. Award full/partial credit
4. Provide feedback
5. Save grade

**Coding Questions:**
• Auto-graded by test cases
• Partial credit for passing some tests
• Manual review for code quality (optional)

**Grading Workflow:**
Step 1: Access Submissions
Step 2: Filter by exam/student
Step 3: Grade each submission
Step 4: Provide feedback
Step 5: Finalize grades
Step 6: Release results

**Feedback Guidelines:**
✅ Be specific and constructive
✅ Highlight strengths
✅ Explain mistakes
✅ Suggest improvements
✅ Encourage learning

**Best Practices:**
✅ Grade within 48 hours
✅ Use rubrics consistently
✅ Provide detailed feedback
✅ Double-check calculations
✅ Be fair and objective`,

      'analytics': `📊 **EXAM ANALYTICS**

**Performance Metrics:**
• Overall pass rate
• Average score
• Median score
• Highest/Lowest scores
• Score distribution
• Standard deviation

**Question Analysis:**
• Correct answer percentage
• Most missed questions
• Time spent per question
• Difficulty rating
• Discrimination index

**Student Insights:**
• Top performers
• Students needing help
• Improvement trends
• Attempt patterns
• Time utilization

**Visualizations:**
• Line charts: Trends
• Bar charts: Comparisons
• Pie charts: Distributions
• Histograms: Score ranges
• Heat maps: Activity

**Using Analytics:**
1. Navigate to Analytics
2. Select your exam
3. Choose metric
4. Set date range
5. Apply filters
6. Generate report
7. Export if needed

**Interpreting Data:**
• Pass rate <60% → Review difficulty
• High failure on Q5 → Check question
• Low time usage → Too easy?
• High violations → Strengthen proctoring

**Improvement Actions:**
• Adjust question difficulty
• Clarify confusing questions
• Provide additional resources
• Modify time limits
• Update grading rubrics

**Best Practices:**
✅ Review after each exam
✅ Compare with previous exams
✅ Share insights with colleagues
✅ Use data to improve
✅ Track trends over time`,

      'coding questions': `💻 **CODING QUESTIONS - DETAILED GUIDE**

**Supported Languages:**
• Python 3.x
• Java 11+
• C++ 17
• JavaScript (Node.js)
• C (GCC)
• C# (.NET)

**Creating Coding Question:**

1️⃣ **Problem Statement:**
   • Clear description
   • Input format
   • Output format
   • Constraints
   • Examples (2-3)

2️⃣ **Test Cases:**

**Public Test Cases** (visible):
   • Input: Sample input
   • Expected Output: Correct output
   • Explanation: Why this output
   • Students can see these

**Private Test Cases** (hidden):
   • Edge cases
   • Large inputs
   • Corner cases
   • Students cannot see
   • Used for final grading

3️⃣ **Configuration:**
   • Time Limit: 1-5 seconds
   • Memory Limit: 256-512 MB
   • Language: Allow specific or all
   • Starter Code: Optional template

4️⃣ **Grading:**
   • Each test case has weight
   • Partial credit for passing some
   • Total score = (passed/total) × marks

**Example Problem:**

**Title:** Sum of Two Numbers

**Description:**
Write a function that takes two integers and returns their sum.

**Input:**
Two integers a and b (-10^9 ≤ a, b ≤ 10^9)

**Output:**
Single integer representing sum

**Example:**
Input: 5 3
Output: 8

**Test Cases:**
Public:
  • Input: 5 3 → Output: 8
  • Input: -2 7 → Output: 5

Private:
  • Input: 0 0 → Output: 0
  • Input: 1000000000 1000000000 → Output: 2000000000

**Best Practices:**
✅ Clear problem statement
✅ Multiple test cases (5-10)
✅ Include edge cases
✅ Test your solution first
✅ Reasonable time limits
✅ Provide examples`,

      'csv upload': `📤 **CSV UPLOAD - BULK QUESTIONS**

**Step-by-Step:**

1️⃣ **Download Template:**
   Questions → Import → Download Template

2️⃣ **Fill Template:**

**Required Columns:**
   • question_text: The question
   • question_type: MCQ/TrueFalse/Essay/Coding
   • marks: Points for question
   • difficulty: Easy/Medium/Hard

**For MCQ:**
   • option_a: First option
   • option_b: Second option
   • option_c: Third option
   • option_d: Fourth option
   • correct_answer: A/B/C/D

**For Coding:**
   • language: Python/Java/C++/etc
   • test_cases: JSON format
   • time_limit: Seconds
   • memory_limit: MB

**Optional:**
   • explanation: Answer explanation
   • tags: Comma-separated tags
   • category: Question category

3️⃣ **Format Rules:**
   • Use UTF-8 encoding
   • No special characters in headers
   • One question per row
   • Escape commas in text with quotes
   • Keep file size <5MB

4️⃣ **Upload:**
   • Click "Import Questions"
   • Select your CSV file
   • Map columns (if needed)
   • Preview questions
   • Confirm import

5️⃣ **Verify:**
   • Check imported count
   • Review sample questions
   • Fix any errors
   • Re-import if needed

**Example CSV:**
question_text,question_type,marks,option_a,option_b,option_c,option_d,correct_answer
"What is 2+2?",MCQ,1,3,4,5,6,B
"Python is compiled",TrueFalse,1,True,False,,,B

**Common Errors:**
❌ Missing required columns
❌ Invalid question type
❌ Incorrect answer format
❌ Special characters not escaped
❌ File encoding issues

**Best Practices:**
✅ Test with small file first
✅ Backup existing questions
✅ Use template format
✅ Validate data before upload
✅ Review after import`
    }
  },
  'Proctor': {
    greeting: 'Hello Proctor! I can assist you with exam monitoring and proctoring activities with detailed procedures!',
    topics: {
      'monitoring': `👁️ **REAL-TIME MONITORING - COMPLETE GUIDE**

**Proctoring Dashboard:**
• Active exams list
• Number of students per exam
• Time remaining
• Violation alerts
• Student activity feed

**Before Exam:**
1. Review exam details
2. Check proctoring settings:
   • Fullscreen required?
   • Tab switch detection?
   • Webcam monitoring?
   • Screenshot prevention?
3. Prepare monitoring tools
4. Join monitoring session 10 min early
5. Verify camera/screen access

**During Exam:**

**Monitor:**
   • Student screens (if enabled)
   • Activity logs
   • Violation alerts
   • Time remaining
   • Submission status

**Watch For:**
   🚨 Tab switching
   🚨 Copy-paste attempts
   🚨 Multiple faces on camera
   🚨 Looking away frequently
   🚨 Unauthorized applications
   🚨 Screen sharing
   🚨 Suspicious behavior

**Take Action:**
   • Log violations immediately
   • Send warnings to students
   • Document incidents
   • Contact examiner if needed
   • Handle technical issues

**After Exam:**
1. Review all violation logs
2. Generate proctoring report
3. Flag suspicious submissions
4. Submit report to examiner
5. Document recommendations

**Best Practices:**
✅ Stay alert throughout
✅ Document everything
✅ Be fair and consistent
✅ Respond promptly
✅ Maintain professionalism`,

      'violations': `⚠️ **VIOLATION MANAGEMENT**

**Violation Types:**

🚨 **CRITICAL (Auto-Flag):**
   • Tab Switch (>3 times)
     - Student left exam window
     - Opened other applications
     - Browsed internet
   
   • Copy-Paste from External
     - Pasted from clipboard
     - External source detected
   
   • Multiple Faces Detected
     - More than one person visible
     - Someone helping student
   
   • Screen Sharing
     - Screen being shared
     - Remote access detected
   
   • Unauthorized Software
     - IDE opened
     - Compiler running
     - Chat applications

⚠️ **WARNING (Monitor):**
   • Brief Tab Switch (1-2 times)
     - Accidental switch
     - System notification
   
   • Looking Away from Screen
     - Frequent glances away
     - Reading from notes?
   
   • Background Noise
     - Talking heard
     - Multiple voices
   
   • Poor Lighting
     - Face not clearly visible
     - Camera issues

**Handling Violations:**

**Step 1: Detect**
   • System alerts you
   • Or you observe behavior
   • Note exact time

**Step 2: Document**
   • Log violation type
   • Record timestamp
   • Capture screenshot (if available)
   • Note severity level
   • Add observations

**Step 3: Warn (if applicable)**
   • Send warning message
   • Explain violation
   • Remind of rules
   • Log warning sent

**Step 4: Monitor**
   • Watch for repeat violations
   • Track student behavior
   • Update log if continues

**Step 5: Escalate (if needed)**
   • Multiple violations → Flag submission
   • Serious violation → Contact examiner
   • Technical issue → Contact admin

**Step 6: Report**
   • Generate incident report
   • Include all evidence
   • Submit to examiner
   • Recommend action

**Violation Thresholds:**
• 1-2 warnings: Monitor closely
• 3 warnings: Flag for review
• 5+ warnings: Auto-submit exam
• Critical violation: Immediate flag

**Best Practices:**
✅ Document immediately
✅ Be objective
✅ Collect evidence
✅ Follow procedures
✅ Maintain records`,

      'reports': `📋 **PROCTORING REPORTS**

**Report Types:**

1️⃣ **Exam Proctoring Report:**
   • Exam details
   • Total students monitored
   • Total violations detected
   • Violation breakdown by type
   • Students flagged
   • Recommendations

2️⃣ **Student Incident Report:**
   • Student information
   • Exam details
   • Violations committed
   • Timeline of events
   • Evidence (screenshots)
   • Proctor observations
   • Recommended action

3️⃣ **Violation Summary:**
   • Date range
   • Total violations
   • Most common violations
   • Trends over time
   • High-risk students

4️⃣ **Compliance Report:**
   • Proctoring coverage
   • Response times
   • Incident resolution
   • Policy adherence

**Generating Reports:**

Step 1: Navigate to Reports
Step 2: Select report type
Step 3: Choose exam/student/date range
Step 4: Include:
   • Violation logs
   • Screenshots
   • Timestamps
   • Your observations
Step 5: Generate report
Step 6: Review for accuracy
Step 7: Submit to examiner/admin
Step 8: Archive copy

**Report Contents:**

**Executive Summary:**
   • Overview of monitoring
   • Key findings
   • Major incidents
   • Recommendations

**Detailed Findings:**
   • Violation-by-violation breakdown
   • Student-by-student analysis
   • Timeline of events
   • Evidence documentation

**Recommendations:**
   • Students to review
   • Policy improvements
   • Technical enhancements
   • Training needs

**Best Practices:**
✅ Generate immediately after exam
✅ Be thorough and accurate
✅ Include all evidence
✅ Be objective, not judgmental
✅ Provide clear recommendations
✅ Archive all reports`,

      'alerts': `🔔 **ALERT MANAGEMENT**

**Alert Types:**

🚨 **CRITICAL ALERTS:**
   • Multiple tab switches
   • Copy-paste detected
   • Unauthorized software
   • Multiple faces
   • Screen sharing
   • Exam time expiring (5 min)

⚠️ **WARNING ALERTS:**
   • Single tab switch
   • Looking away
   • Poor camera quality
   • Background noise
   • Slow submission

ℹ️ **INFO ALERTS:**
   • Student started exam
   • Student submitted
   • Question flagged
   • Technical issue reported

**Alert Dashboard:**
┌─────────────────────────────────┐
│ ACTIVE ALERTS                   │
├─────────────────────────────────┤
│ 🚨 Student #1234 - Tab Switch   │
│ ⚠️ Student #5678 - Looking Away  │
│ ℹ️ Student #9012 - Submitted     │
└─────────────────────────────────┘

**Responding to Alerts:**

**Critical Alert:**
1. Immediately view student screen
2. Assess situation
3. Log violation
4. Send warning if first time
5. Flag if repeated
6. Document thoroughly

**Warning Alert:**
1. Monitor student
2. Note in log
3. Watch for pattern
4. Escalate if continues

**Info Alert:**
1. Acknowledge
2. Update status
3. Continue monitoring

**Alert Settings:**
• Enable/disable alert types
• Set thresholds
• Configure notifications:
  - Sound alerts
  - Visual alerts
  - Email notifications
• Priority levels

**Best Practices:**
✅ Respond to critical alerts within 30 seconds
✅ Don't ignore warnings
✅ Document all responses
✅ Adjust settings as needed
✅ Stay focused on alerts`,

      'sessions': `📅 **SESSION MANAGEMENT**

**Before Session:**

**Preparation (1 day before):**
   • Review exam schedule
   • Check assigned exams
   • Read exam instructions
   • Verify proctoring settings
   • Test monitoring tools
   • Prepare workspace

**Setup (30 min before):**
   • Login to platform
   • Navigate to Proctoring Dashboard
   • Join monitoring session
   • Verify camera/screen access
   • Check alert settings
   • Review student list

**During Session:**

**Active Monitoring:**
   • Watch student screens
   • Monitor violation alerts
   • Track time remaining
   • Log incidents
   • Respond to queries

**Student Support:**
   • Answer technical questions
   • Help with login issues
   • Clarify exam instructions
   • Handle emergencies
   • Document all interactions

**Communication:**
   • Send announcements
   • Warn about violations
   • Remind about time
   • Provide technical help
   • Stay professional

**After Session:**

**Immediate (within 1 hour):**
   • Review all logs
   • Generate reports
   • Flag suspicious submissions
   • Submit to examiner
   • Document session

**Follow-up (within 24 hours):**
   • Archive evidence
   • Update records
   • Respond to queries
   • Prepare for next session

**Session Types:**

**Live Proctoring:**
   • Real-time monitoring
   • Immediate intervention
   • Direct communication
   • High engagement

**Recorded Review:**
   • Review recordings later
   • Flag violations
   • Generate reports
   • Less immediate

**Best Practices:**
✅ Arrive early
✅ Stay focused
✅ Document everything
✅ Be available
✅ Professional demeanor
✅ Follow procedures`
    }
  },
  'Student': {
    greeting: 'Hello Student! I can help you with taking exams, viewing results, and understanding the platform.',
    topics: {
      'take exam': 'Go to Exams section, select an available exam, and click "Start Exam".',
      'results': 'View your exam results and detailed feedback in the Results section.',
      'timer': 'The exam timer is displayed at the top. Your answers are auto-saved every 30 seconds.',
      'submission': 'You can submit early or the exam will auto-submit when time expires.',
      'rules': 'Stay in fullscreen mode, avoid tab switching, and don\'t copy-paste during exams.',
      'coding exam': 'For coding questions, write your code in the editor and run test cases before submitting.',
      'navigation': 'Use the question navigator to move between questions. Answered questions are marked green.'
    }
  }
};

const commonFAQs = {
  'password reset': 'Contact your administrator to reset your password or use the "Forgot Password" link on the login page.',
  'profile update': 'Go to your profile section (click your name in the header) to update your information.',
  'technical issue': 'If you encounter technical issues, please contact support or your system administrator.',
  'browser support': 'This platform works best on Chrome, Firefox, Safari, and Edge (latest versions).',
  'help': 'I can answer questions about exams, results, user management, and platform features. Just ask!'
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadChatHistory();
      loadSuggestions();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = () => {
    try {
      const savedMessages = localStorage.getItem('chatbot_history');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = (newMessages) => {
    try {
      localStorage.setItem('chatbot_history', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const loadSuggestions = () => {
    const userRole = user?.role || 'Student';
    const roleKB = knowledgeBase[userRole] || knowledgeBase['Student'];
    const topicKeys = Object.keys(roleKB.topics).slice(0, 5);
    setSuggestions(topicKeys);
  };

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    const userRole = user?.role || 'Student';
    const roleKB = knowledgeBase[userRole] || knowledgeBase['Student'];
    
    // Check for role queries first
    const msg = lowerMessage.replace(/\s/g, "");
    
    // Check for workflow queries
    if (msg.includes("projectworkflow") ||
        msg.includes("workflow") ||
        msg.includes("howprojectworks") ||
        msg.includes("systemflow")) {
      return roleDetails.workflow;
    }
    
    // Check for role queries
    if (msg.includes("student")) return roleDetails.student;
    if (msg.includes("examiner") || msg.includes("examinar")) return roleDetails.examiner;
    if (msg.includes("superadmin") || msg.includes("super")) return roleDetails.superadmin;
    if (msg.includes("admin") && !msg.includes("super")) return roleDetails.admin;
    
    // Check for greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      return roleKB.greeting;
    }
    
    // Check role-specific topics
    for (const [topic, response] of Object.entries(roleKB.topics)) {
      if (lowerMessage.includes(topic)) {
        return response;
      }
    }
    
    // Check common FAQs
    for (const [topic, response] of Object.entries(commonFAQs)) {
      if (lowerMessage.includes(topic)) {
        return response;
      }
    }
    
    // Keyword-based responses
    if (lowerMessage.includes('exam') && lowerMessage.includes('create')) {
      return 'To create an exam, go to the Exams section and click "Create New Exam". Fill in the details and add questions.';
    }
    
    if (lowerMessage.includes('exam') && lowerMessage.includes('take')) {
      return 'To take an exam, navigate to the Exams section, find your assigned exam, and click "Start Exam".';
    }
    
    if (lowerMessage.includes('result')) {
      return 'You can view results in the Results section. Detailed feedback is available for each submission.';
    }
    
    if (lowerMessage.includes('question')) {
      return 'Questions can be managed from the Questions section. You can create individual questions or upload multiple questions via CSV.';
    }
    
    if (lowerMessage.includes('analytics') || lowerMessage.includes('report')) {
      return 'Analytics and reports are available in the Analytics section. View performance metrics, trends, and detailed statistics.';
    }
    
    if (lowerMessage.includes('proctoring')) {
      return 'Proctoring features include tab switch detection, fullscreen enforcement, and violation logging. View logs in the Proctoring section.';
    }
    
    if (lowerMessage.includes('coding')) {
      return 'Coding questions support multiple languages (Python, Java, C++, JavaScript, C, C#). Create test cases for automated evaluation.';
    }
    
    // Default response
    return `I can help you with:\n\n• Student Role\n• Examiner Role\n• Admin Role\n• Super Admin Role\n• Project Workflow\n\nPlease ask about any of these topics!`;
  };

  const handleSendMessage = (messageText = null) => {
    const message = messageText || inputMessage.trim();
    if (!message) return;

    // Add user message to chat
    const userMessage = { text: message, sender: 'user', timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const response = generateResponse(message);
      const botMessage = {
        text: response,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear chat history?')) {
      setMessages([]);
      localStorage.removeItem('chatbot_history');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chatbot Button */}
      <button className="chatbot-button" onClick={toggleChat} title="Chat Assistant">
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="chatbot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <div className="chatbot-header-text">
                <h3>Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button className="chatbot-clear-btn" onClick={handleClearChat} title="Clear chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="chatbot-welcome-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4>Welcome, {user?.firstName || 'User'}!</h4>
                <p>I'm your virtual assistant. How can I help you today?</p>
                
                {suggestions.length > 0 && (
                  <div className="chatbot-suggestions">
                    <p className="suggestions-title">Quick topics:</p>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-container">
            <textarea
              className="chatbot-input"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
              disabled={isLoading}
            />
            <button
              className="chatbot-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="22" y1="2" x2="11" y2="13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
