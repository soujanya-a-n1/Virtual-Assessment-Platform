# Lecturer-Course Assignment Feature

## ✅ Feature Added

I've successfully added bidirectional lecturer-course assignment functionality to both the Courses and Lecturers modules.

---

## 🎯 What's New

### 1. **Assign Lecturers to Courses**
- From the Courses page, you can now assign multiple lecturers to any course
- Click the "Lecturers" button next to any course
- Select/deselect lecturers using checkboxes
- Save assignments with one click

### 2. **Assign Courses to Lecturers**
- From the Lecturers page, you can now assign multiple courses to any lecturer
- Click the "Courses" button next to any lecturer
- Select/deselect courses using checkboxes
- Save assignments with one click

---

## 📋 Features

### Courses Module (`/courses`)

**New Button**: "Lecturers" button added to each course row

**Functionality**:
- Click "Lecturers" button → Opens assignment modal
- Modal shows all available lecturers
- Checkboxes for easy selection
- Pre-selected lecturers are already checked
- Shows lecturer details:
  - Name
  - Employee ID
  - Department
  - Specialization
- Select multiple lecturers
- Click "Save" to assign
- Shows count of selected lecturers

**Table Display**:
- "Lecturers" column shows count of assigned lecturers
- Example: "3" means 3 lecturers assigned to this course

### Lecturers Module (`/lecturers`)

**New Button**: "Courses" button added to each lecturer row

**Functionality**:
- Click "Courses" button → Opens assignment modal
- Modal shows all available courses
- Checkboxes for easy selection
- Pre-selected courses are already checked
- Shows course details:
  - Course code
  - Course name
  - Department
  - Credits
- Select multiple courses
- Click "Save" to assign
- Shows count of selected courses

**Table Display**:
- "Courses" column shows count of assigned courses
- Example: "5" means lecturer teaches 5 courses

---

## 🔄 How It Works

### Assign Lecturers to a Course

1. **Navigate** to Courses page (`/courses`)
2. **Find** the course you want to assign lecturers to
3. **Click** the "Lecturers" button (gray button)
4. **Modal opens** showing all available lecturers
5. **Check/Uncheck** lecturers you want to assign
6. **Click "Save"** button
7. **Success!** Lecturers are now assigned to the course

### Assign Courses to a Lecturer

1. **Navigate** to Lecturers page (`/lecturers`)
2. **Find** the lecturer you want to assign courses to
3. **Click** the "Courses" button (gray button)
4. **Modal opens** showing all available courses
5. **Check/Uncheck** courses you want to assign
6. **Click "Save"** button
7. **Success!** Courses are now assigned to the lecturer

---

## 🎨 UI Components

### Assignment Modal

**Header**:
- Title: "Assign Lecturers to [Course Name]" or "Assign Courses to [Lecturer Name]"
- Close button (×)

**Body**:
- Description text
- Scrollable list of items
- Each item shows:
  - Checkbox
  - Name/Title
  - Additional details (department, specialization, etc.)
- Hover effect on items
- Selected items highlighted

**Footer**:
- Cancel button (gray)
- Save button (blue) with count: "Save (X selected)"

### Styling

**Colors**:
- Border: Orange (#ff8c00) on hover
- Background: Light gray (#f8f9fa)
- Selected: White background
- Checkbox: Orange accent

**Layout**:
- Responsive design
- Mobile-friendly
- Scrollable content
- Clean, modern look

---

## 🔧 Technical Implementation

### Frontend Changes

**Files Modified**:
1. `frontend/src/pages/CoursesList.js`
   - Added `lecturers` state
   - Added `showLecturerModal` state
   - Added `selectedLecturers` state
   - Added `fetchLecturers()` function
   - Added `handleManageLecturers()` function
   - Added `handleLecturerToggle()` function
   - Added `handleSaveLecturers()` function
   - Added lecturer assignment modal JSX
   - Added "Lecturers" button to table

2. `frontend/src/pages/LecturersList.js`
   - Added `courses` state
   - Added `showCourseModal` state
   - Added `selectedCourses` state
   - Added `fetchCourses()` function
   - Added `handleManageCourses()` function
   - Added `handleCourseToggle()` function
   - Added `handleSaveCourses()` function
   - Added course assignment modal JSX
   - Added "Courses" button to table

3. `frontend/src/pages/ListPages.css`
   - Added `.modal-body` styles
   - Added `.lecturer-list` and `.course-list` styles
   - Added `.lecturer-item` and `.course-item` styles
   - Added checkbox styles
   - Added hover effects
   - Added scrollbar styling
   - Added responsive styles

### Backend Changes

**Files Modified**:
1. `backend/src/routes/courseRoutes.js`
   - Added `POST /:id/lecturers` route

2. `backend/src/routes/lecturerRoutes.js`
   - Added `POST /:id/courses` route

3. `backend/src/controllers/courseController.js`
   - Added `assignLecturers()` function
   - Handles bulk assignment
   - Removes old assignments
   - Creates new assignments

4. `backend/src/controllers/lecturerController.js`
   - Added `assignCourses()` function
   - Handles bulk assignment
   - Removes old assignments
   - Creates new assignments

---

## 📡 API Endpoints

### Assign Lecturers to Course
```
POST /api/courses/:id/lecturers
```

**Request Body**:
```json
{
  "lecturerIds": [1, 2, 3]
}
```

**Response**:
```json
{
  "message": "Lecturers assigned successfully"
}
```

### Assign Courses to Lecturer
```
POST /api/lecturers/:id/courses
```

**Request Body**:
```json
{
  "courseIds": [1, 2, 3, 4, 5]
}
```

**Response**:
```json
{
  "message": "Courses assigned successfully"
}
```

---

## 💾 Database

### Table: `course_lecturers`

**Structure**:
- `id` - Primary key
- `courseId` - Foreign key to courses
- `lecturerId` - Foreign key to lecturers
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

**Relationship**:
- Many-to-Many between Courses and Lecturers
- One course can have multiple lecturers
- One lecturer can teach multiple courses

---

## 🧪 Testing

### Test Scenario 1: Assign Lecturers to Course

1. Login as Admin
2. Go to Courses page
3. Click "Lecturers" on any course
4. Select 2-3 lecturers
5. Click "Save"
6. Verify success message
7. Check "Lecturers" column shows correct count
8. Go to Lecturers page
9. Verify those lecturers show the course in their "Courses" count

### Test Scenario 2: Assign Courses to Lecturer

1. Login as Admin
2. Go to Lecturers page
3. Click "Courses" on any lecturer
4. Select 3-4 courses
5. Click "Save"
6. Verify success message
7. Check "Courses" column shows correct count
8. Go to Courses page
9. Verify those courses show the lecturer in their "Lecturers" count

### Test Scenario 3: Update Assignments

1. Open assignment modal
2. Uncheck some items
3. Check new items
4. Save
5. Verify changes are reflected
6. Verify counts are updated

### Test Scenario 4: Remove All Assignments

1. Open assignment modal
2. Uncheck all items
3. Save (0 selected)
4. Verify all assignments removed
5. Verify count shows 0

---

## ✨ Benefits

### For Administrators
- Easy course-lecturer management
- Visual interface for assignments
- Bulk assignment capability
- Quick overview of assignments
- No need for complex forms

### For System
- Maintains data integrity
- Proper many-to-many relationship
- Efficient database operations
- Scalable solution
- Clean code structure

### For Users
- Intuitive interface
- Fast assignment process
- Clear visual feedback
- Mobile-friendly
- Consistent with other modules

---

## 🎯 Use Cases

### Use Case 1: New Semester Setup
1. Create courses for new semester
2. Assign lecturers to each course
3. Lecturers can see their assigned courses
4. Students can see course lecturers

### Use Case 2: Lecturer Workload Management
1. View lecturer's current courses
2. Add or remove courses
3. Balance workload across lecturers
4. Track teaching assignments

### Use Case 3: Course Staffing
1. View course's assigned lecturers
2. Add co-lecturers or TAs
3. Replace lecturers if needed
4. Maintain course continuity

---

## 🔐 Access Control

**Who Can Assign**:
- Admin
- Super Admin

**Who Can View**:
- Admin
- Super Admin
- Examiner (read-only)
- Lecturer (own assignments)

---

## 📱 Responsive Design

**Desktop**:
- Full modal width
- Side-by-side buttons
- Comfortable spacing

**Tablet**:
- Adjusted modal size
- Maintained layout
- Touch-friendly

**Mobile**:
- Full-width modal
- Stacked buttons
- Optimized scrolling
- Large touch targets

---

## 🚀 Future Enhancements

Possible improvements:
- Search within assignment modal
- Filter lecturers by department
- Sort courses by name/code
- Bulk assign to multiple courses
- Assignment history/audit log
- Email notifications on assignment
- Calendar integration
- Workload analytics

---

## 📝 Notes

- Assignments are saved immediately
- Old assignments are replaced (not merged)
- Empty selection removes all assignments
- Changes are reflected in both modules
- Database maintains referential integrity
- Cascade delete handles cleanup

---

## ✅ Checklist

- [x] Frontend: Courses module updated
- [x] Frontend: Lecturers module updated
- [x] Frontend: Assignment modals created
- [x] Frontend: Styling added
- [x] Backend: Routes added
- [x] Backend: Controllers updated
- [x] Backend: Bulk assignment logic
- [x] Database: Many-to-many relationship
- [x] UI: Responsive design
- [x] UX: Intuitive interface
- [x] Testing: Ready for testing
- [x] Documentation: Complete

---

**The lecturer-course assignment feature is now fully functional!** 🎉

You can now easily manage which lecturers teach which courses from both the Courses and Lecturers pages. The bidirectional relationship ensures data consistency across the system.
