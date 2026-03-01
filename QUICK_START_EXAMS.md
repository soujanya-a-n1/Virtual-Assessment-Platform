# Quick Start: Exam Data Setup

## 🚀 One Command Setup

```bash
mysql -u root -p virtual_assessment_db < database/insert_exam_data.sql
```

Enter your MySQL password when prompted.

## ✅ What You Get

### 9 Exams Across 5 Departments

| Course | Exam | Duration | Questions | Marks | Status |
|--------|------|----------|-----------|-------|--------|
| CS101 | Midterm Exam | 90 min | 5 | 10 | Published |
| CS101 | Final Exam | 120 min | 5 | 10 | Scheduled |
| CS201 | Data Structures Midterm | 90 min | 4 | 12 | Published |
| CS301 | Database Systems Midterm | 90 min | 4 | 10 | Published |
| MATH101 | Calculus I Midterm | 90 min | 4 | 11 | Published |
| MATH201 | Linear Algebra Quiz | 45 min | 3 | 8 | Published |
| PHY101 | Physics I Midterm | 90 min | 3 | 7 | Published |
| ENG101 | English Composition Midterm | 90 min | 3 | 6 | Published |
| BUS101 | Business Management Quiz | 30 min | 3 | 7 | Published |

### 30+ Questions
- Organized by course
- Multiple difficulty levels
- Complete with explanations
- Ready to use

## 📋 Verify Installation

```sql
USE virtual_assessment_db;

-- Quick check
SELECT 
    c.code,
    c.name,
    COUNT(DISTINCT e.id) AS exams,
    COUNT(DISTINCT q.id) AS questions
FROM courses c
LEFT JOIN exams e ON c.id = e.courseId
LEFT JOIN questions q ON c.id = q.courseId
GROUP BY c.id
HAVING exams > 0 OR questions > 0;
```

## 🎯 Test in Frontend

1. **Login** as Admin/Examiner
2. **Navigate** to Exams Management
3. **See** 9 exams with course badges
4. **Filter** by course using dropdown
5. **Click** "Assign" to assign students
6. **Open** exam to manage questions

## 🔧 Quick Commands

### View All Exams with Courses
```sql
SELECT e.title, c.code, c.name, e.status 
FROM exams e 
JOIN courses c ON e.courseId = c.id;
```

### Count Questions per Course
```sql
SELECT c.code, COUNT(q.id) AS questions 
FROM courses c 
LEFT JOIN questions q ON c.id = q.courseId 
GROUP BY c.id;
```

### View Exam Details
```sql
SELECT 
    e.title,
    e.duration,
    e.totalQuestions,
    e.totalMarks,
    e.status,
    c.code AS course
FROM exams e
JOIN courses c ON e.courseId = c.id
WHERE e.courseId IS NOT NULL;
```

## 🎓 Course Breakdown

**Computer Science (3 exams)**
- CS101: Programming basics
- CS201: Data structures
- CS301: Database systems

**Mathematics (2 exams)**
- MATH101: Calculus
- MATH201: Linear algebra

**Physics (1 exam)**
- PHY101: Mechanics

**English (1 exam)**
- ENG101: Composition

**Business (1 exam)**
- BUS101: Management

## ⚡ Next Steps

1. ✅ Run the SQL script
2. ✅ Restart backend server
3. ✅ Refresh browser
4. ✅ Start using exams!

## 📚 Need More?

- **EXAM_DATA_SETUP_GUIDE.md** - Detailed setup guide
- **EXAM_MANAGEMENT_MODULE.md** - Complete documentation
- **COURSE_BASED_QUESTIONS.md** - Course integration details

---

**Ready in 1 minute!** ⚡
