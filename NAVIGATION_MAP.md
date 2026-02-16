# Navigation Map - Virtual Assessment Platform

## 🗺️ Complete Site Map

```
Virtual Assessment Platform
│
├── 🔓 Public Routes
│   ├── /login ..................... Login Page
│   └── /register .................. Registration Page
│
└── 🔐 Protected Routes (Authenticated Users)
    │
    ├── 📊 DASHBOARD (/dashboard)
    │   ├── Welcome Section
    │   ├── Platform Statistics
    │   ├── Quick Access Links
    │   └── Real-time Clock
    │
    ├── 👥 USER MANAGEMENT (/users)
    │   ├── User List (Table)
    │   ├── Create User (Modal)
    │   ├── Edit User (Modal)
    │   ├── Delete User
    │   └── Role Assignment
    │
    ├── 📚 MASTER DATA
    │   │
    │   ├── 🏢 Departments (/departments)
    │   │   ├── Department List
    │   │   ├── Create Department
    │   │   ├── Edit Department
    │   │   └── Delete Department
    │   │
    │   ├── 📖 Courses (/courses)
    │   │   ├── Course List
    │   │   ├── Create Course
    │   │   ├── Edit Course
    │   │   ├── Assign to Department
    │   │   └── Delete Course
    │   │
    │   ├── 🎓 Classes (/classes)
    │   │   ├── Class List
    │   │   ├── Create Class
    │   │   ├── Edit Class
    │   │   ├── Assign to Department
    │   │   └── Delete Class
    │   │
    │   ├── 👨‍🏫 Lecturers (/lecturers)
    │   │   ├── Lecturer List
    │   │   ├── Create Lecturer
    │   │   ├── Edit Lecturer
    │   │   ├── Assign to Department
    │   │   ├── Assign to Courses
    │   │   └── Delete Lecturer
    │   │
    │   └── 👨‍🎓 Students (/students)
    │       ├── Student List
    │       ├── Create Student
    │       ├── Edit Student
    │       ├── Assign to Class
    │       ├── Enroll in Exams
    │       └── Delete Student
    │
    ├── 📝 EXAM MANAGEMENT (/exams)
    │   ├── Exam List (Grid/Cards)
    │   ├── Create Exam (Modal)
    │   ├── Edit Exam (Modal)
    │   ├── Delete Exam
    │   ├── Publish/Unpublish
    │   ├── Schedule Exam
    │   ├── Add Questions
    │   │
    │   ├── 📄 Exam Details (/exams/:examId)
    │   │   ├── Exam Information
    │   │   ├── Question List
    │   │   ├── Enrolled Students
    │   │   ├── Submission Statistics
    │   │   └── Edit/Delete Actions
    │   │
    │   └── ✍️ Take Exam (/exams/:examId/take)
    │       ├── Timer Countdown
    │       ├── Question Display
    │       ├── Answer Options
    │       ├── Question Navigator
    │       ├── Auto-save Answers
    │       ├── Submit Exam
    │       └── Proctoring (if enabled)
    │
    ├── ❓ QUESTION BANK
    │   │
    │   ├── 🎴 Card View (/questions)
    │   │   ├── Question Cards (Visual)
    │   │   ├── Search Questions
    │   │   ├── Filter by Topic
    │   │   ├── Filter by Difficulty
    │   │   ├── Filter by Type
    │   │   ├── Create Question (Modal)
    │   │   ├── Edit Question (Modal)
    │   │   ├── Delete Question
    │   │   ├── View Full Details
    │   │   ├── Options Display
    │   │   └── Explanation Display
    │   │
    │   └── 📊 Table View (/questions-table)
    │       ├── Data Table (Compact)
    │       ├── Pagination (10/25/50/100)
    │       ├── Search Questions
    │       ├── Filter by Topic
    │       ├── Filter by Difficulty
    │       ├── Checkbox Selection
    │       ├── Bulk Delete
    │       ├── Create Question (Modal)
    │       ├── Edit Question (Modal)
    │       ├── Delete Question
    │       ├── View Details
    │       └── Export Options
    │
    ├── 📋 ASSESSMENT
    │   │
    │   ├── ✅ Submissions (/submissions)
    │   │   ├── Submission List (Table)
    │   │   ├── Filter by Status
    │   │   ├── Filter by Exam
    │   │   ├── View Submission Details
    │   │   ├── Review Answers
    │   │   ├── Evaluate Submission
    │   │   └── Export Results
    │   │
    │   └── 🏆 Results (/results)
    │       ├── Results Dashboard
    │       ├── Statistics Cards
    │       │   ├── Total Exams
    │       │   ├── Evaluated
    │       │   ├── Pending
    │       │   ├── Passed
    │       │   ├── Failed
    │       │   └── Average Score
    │       ├── Results Grid
    │       ├── Filter by Status
    │       ├── View Result Card
    │       │
    │       └── 📊 Result Details (/results/:submissionId)
    │           ├── Exam Information
    │           ├── Student Information
    │           ├── Score Display
    │           ├── Pass/Fail Status
    │           ├── Time Spent
    │           ├── Question-by-Question
    │           ├── Correct/Incorrect
    │           ├── Explanations
    │           └── Cheating Detection
    │
    └── 📈 ANALYTICS (/analytics)
        ├── Platform Overview
        ├── User Statistics
        ├── Exam Statistics
        ├── Performance Metrics
        ├── Trend Analysis
        ├── Custom Reports
        ├── Charts & Graphs
        └── Export Data
```

---

## 🎯 User Journey Maps

### Student Journey

```
Login → Dashboard → Browse Exams → Take Exam → Submit → View Results → Check Analytics
  ↓         ↓            ↓             ↓          ↓          ↓              ↓
/login  /dashboard    /exams    /exams/:id/take  Submit  /results  /results/:id
```

**Detailed Flow:**
1. **Login** (`/login`)
   - Enter credentials
   - Authenticate
   - Redirect to Dashboard

2. **Dashboard** (`/dashboard`)
   - See welcome message
   - View quick access links
   - Check upcoming exams

3. **Browse Exams** (`/exams`)
   - View available exams
   - Filter by status
   - See exam details

4. **Take Exam** (`/exams/:examId/take`)
   - Start exam (timer begins)
   - Answer questions
   - Navigate between questions
   - Auto-save answers
   - Submit exam

5. **View Results** (`/results`)
   - See all exam results
   - Check pass/fail status
   - View scores

6. **Result Details** (`/results/:submissionId`)
   - See detailed breakdown
   - Review correct/incorrect answers
   - Read explanations

7. **Analytics** (`/analytics`)
   - View performance trends
   - Compare scores
   - Track progress

---

### Examiner Journey

```
Login → Dashboard → Create Questions → Create Exam → Add Questions → Publish → Monitor Submissions → Evaluate → View Analytics
  ↓         ↓             ↓                ↓             ↓            ↓            ↓                  ↓            ↓
/login  /dashboard   /questions        /exams      /exams/:id    Publish    /submissions       Evaluate    /analytics
```

**Detailed Flow:**
1. **Login** (`/login`)
2. **Dashboard** (`/dashboard`)
3. **Create Questions** (`/questions` or `/questions-table`)
   - Click "Create Question"
   - Fill in question details
   - Select topic
   - Add options
   - Set correct answer
   - Save question

4. **Create Exam** (`/exams`)
   - Click "Create Exam"
   - Set exam details
   - Set duration, marks
   - Schedule exam
   - Save exam

5. **Add Questions** (`/exams/:examId`)
   - View exam details
   - Click "Add Questions"
   - Select from question bank
   - Set question order
   - Save

6. **Publish Exam**
   - Change status to "Published"
   - Students can now see it

7. **Monitor Submissions** (`/submissions`)
   - View all submissions
   - Check submission status
   - Review answers

8. **Evaluate** (if manual evaluation needed)
   - Open submission
   - Review answers
   - Assign marks
   - Add notes

9. **View Results** (`/results`)
   - See all results
   - Check statistics
   - Export data

10. **Analytics** (`/analytics`)
    - View exam performance
    - Analyze trends
    - Generate reports

---

### Admin Journey

```
Login → Dashboard → Setup Master Data → Create Users → Assign Roles → Create Exams → Monitor System → View Analytics
  ↓         ↓              ↓                  ↓            ↓              ↓              ↓              ↓
/login  /dashboard   /departments        /users      /users/:id      /exams      /submissions   /analytics
                     /courses
                     /classes
                     /lecturers
                     /students
```

**Detailed Flow:**
1. **Login** (`/login`)
2. **Dashboard** (`/dashboard`)
3. **Setup Master Data**
   - Create Departments (`/departments`)
   - Create Courses (`/courses`)
   - Create Classes (`/classes`)
   - Add Lecturers (`/lecturers`)
   - Add Students (`/students`)

4. **User Management** (`/users`)
   - Create user accounts
   - Assign roles
   - Manage permissions

5. **Exam Management** (`/exams`)
   - Oversee all exams
   - Approve/reject exams
   - Monitor status

6. **Question Bank** (`/questions` or `/questions-table`)
   - Review questions
   - Approve questions
   - Manage question pool

7. **Monitor Submissions** (`/submissions`)
   - View all submissions
   - Check for issues
   - Handle disputes

8. **View Results** (`/results`)
   - Platform-wide results
   - Performance metrics
   - Pass/fail rates

9. **Analytics** (`/analytics`)
   - System-wide analytics
   - User statistics
   - Performance reports
   - Trend analysis

---

## 🔗 Module Interconnections

```
┌─────────────┐
│   USERS     │
└──────┬──────┘
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌─────────────┐              ┌─────────────┐
│  STUDENTS   │              │  LECTURERS  │
└──────┬──────┘              └──────┬──────┘
       │                            │
       │                            │
       ▼                            ▼
┌─────────────┐              ┌─────────────┐
│   CLASSES   │◄─────────────┤ DEPARTMENTS │
└──────┬──────┘              └──────┬──────┘
       │                            │
       │                            ▼
       │                     ┌─────────────┐
       │                     │   COURSES   │
       │                     └──────┬──────┘
       │                            │
       │                            ▼
       │                     ┌─────────────┐
       │                     │    EXAMS    │
       │                     └──────┬──────┘
       │                            │
       │                            ▼
       │                     ┌─────────────┐
       │                     │  QUESTIONS  │
       │                     └─────────────┘
       │
       ▼
┌─────────────┐
│ SUBMISSIONS │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   RESULTS   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  ANALYTICS  │
└─────────────┘
```

---

## 📱 Responsive Navigation

### Desktop (> 1024px)
- Full sidebar visible
- All menu items expanded
- Quick access cards in grid

### Tablet (768px - 1024px)
- Collapsible sidebar
- Hamburger menu
- Adjusted card layout

### Mobile (< 768px)
- Hidden sidebar (toggle with hamburger)
- Overlay menu
- Stacked cards
- Bottom navigation (optional)

---

## 🎨 Navigation UI Elements

### Sidebar
- Logo/Brand
- Menu items with icons
- Submenu support
- Active state highlighting
- User profile badge
- Logout button

### Header
- Page title
- Breadcrumbs
- User avatar
- Notifications (optional)
- Settings (optional)

### Quick Access Cards
- Icon
- Title
- Description
- Arrow indicator
- Hover effects
- Color coding by module

---

## 🔐 Access Control Matrix

| Module | Student | Examiner | Admin |
|--------|---------|----------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| Users | ❌ | ❌ | ✅ |
| Departments | ❌ | ❌ | ✅ |
| Courses | ❌ | ❌ | ✅ |
| Classes | ❌ | ❌ | ✅ |
| Lecturers | ❌ | ❌ | ✅ |
| Students | ❌ | ❌ | ✅ |
| Exams (View) | ✅ | ✅ | ✅ |
| Exams (Manage) | ❌ | ✅ | ✅ |
| Take Exam | ✅ | ❌ | ❌ |
| Questions (View) | ❌ | ✅ | ✅ |
| Questions (Manage) | ❌ | ✅ | ✅ |
| Submissions (Own) | ✅ | ❌ | ❌ |
| Submissions (All) | ❌ | ✅ | ✅ |
| Results (Own) | ✅ | ❌ | ❌ |
| Results (All) | ❌ | ✅ | ✅ |
| Analytics (Own) | ✅ | ❌ | ❌ |
| Analytics (All) | ❌ | ✅ | ✅ |

---

## 🚀 Quick Navigation Tips

1. **Use Sidebar** - Primary navigation for all modules
2. **Use Dashboard** - Quick access to frequently used modules
3. **Use Breadcrumbs** - Navigate back through hierarchy
4. **Use Search** - Find specific items quickly
5. **Use Filters** - Narrow down lists
6. **Use Keyboard Shortcuts** (if implemented)

---

**All modules are interconnected and accessible through intuitive navigation!** 🎉
