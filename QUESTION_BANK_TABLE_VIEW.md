# Question Bank - Table View

## Overview

I've created a new **table-based Question Bank page** that matches the design in your screenshot. This provides a more traditional admin panel look with a data table layout.

## Features

### 1. Table Layout
- Clean, professional data table design
- Sortable columns
- Checkbox selection for bulk operations
- Responsive design

### 2. Advanced Filtering
- **Show entries**: 10, 25, 50, 100 per page
- **Filter by Topic**: All topics dropdown
- **Filter by Difficulty**: Easy, Medium, Hard
- **Search**: Real-time search across questions

### 3. Pagination
- Previous/Next buttons
- Page numbers
- Shows "Showing X to Y of Z entries"

### 4. Bulk Operations
- Select individual questions with checkboxes
- Select all questions
- Bulk delete selected questions

### 5. Action Buttons
- **Detail**: View question details (green)
- **Edit**: Edit question (orange)
- **Delete**: Delete individual question (red)

### 6. Table Columns
1. Checkbox (for selection)
2. # (Row number)
3. Topic (with badge)
4. Question (truncated to 80 characters)
5. Type (Multiple Choice, True/False, etc.)
6. Difficulty (color-coded badge)
7. Marks (centered)
8. Created Date (formatted timestamp)
9. Actions (Detail, Edit, Delete buttons)

## How to Access

### Option 1: Direct URL
Navigate to: `http://localhost:3000/questions-table`

### Option 2: Update Sidebar (Recommended)
You can update the sidebar to show both views:

Edit `frontend/src/components/Sidebar.js` and change the Question Bank menu item to have a submenu:

```javascript
{ 
  label: 'Question Bank',
  icon: <FiHelpCircle />,
  submenu: [
    { path: '/questions', icon: <FiGrid />, label: 'Card View' },
    { path: '/questions-table', icon: <FiList />, label: 'Table View' },
  ]
}
```

## Files Created

1. **frontend/src/pages/QuestionBankTable.js** - Main component
2. **frontend/src/pages/QuestionBankTable.css** - Styling
3. **frontend/src/App.js** - Updated with new route

## Comparison: Card View vs Table View

### Card View (`/questions`)
- Visual, card-based layout
- Shows full question details
- Better for browsing and reviewing
- Shows all options and explanations
- More space per question

### Table View (`/questions-table`)
- Compact, data table layout
- Shows more questions at once
- Better for management and bulk operations
- Quick scanning of many questions
- Professional admin panel look

## Usage Examples

### Create Question
1. Click "Create Question" button (orange, top right)
2. Fill in the form
3. Select topic from dropdown
4. Add options (for Multiple Choice)
5. Click "Create Question"

### Edit Question
1. Click "Edit" button (orange) on any row
2. Modify the fields
3. Click "Update Question"

### Delete Single Question
1. Click "Delete" button (red) on any row
2. Confirm deletion

### Bulk Delete
1. Check boxes next to questions you want to delete
2. Click "Delete (X)" button at top
3. Confirm deletion

### Filter Questions
1. Use "Show entries" dropdown to change page size
2. Select topic from "All Topics" dropdown
3. Select difficulty from "All Difficulties" dropdown
4. Type in search box for real-time filtering

### Navigate Pages
1. Use "Previous" and "Next" buttons
2. Click page numbers directly
3. See current range in "Showing X to Y of Z entries"

## Styling Details

### Color Scheme
- **Primary**: #ff8c00 (Orange) - Create button, active states
- **Success**: #28a745 (Green) - Detail button
- **Danger**: #dc3545 (Red) - Delete button
- **Background**: #f5f5f5 (Light gray)
- **Cards**: White with subtle shadows

### Badges
- **Topic**: Blue background (#e3f2fd)
- **Type**: Purple background (#f3e5f5)
- **Easy**: Green (#e8f5e9)
- **Medium**: Orange (#fff3e0)
- **Hard**: Red (#ffebee)

### Responsive Design
- Desktop: Full table with all columns
- Tablet: Adjusted spacing
- Mobile: Stacked layout, full-width buttons

## Database Connection Note

⚠️ **Important**: The table view will show the same 500 errors until the database is connected.

To fix:
1. Set MySQL password in `backend/.env`
2. Create database: `CREATE DATABASE virtual_assessment_db;`
3. Restart backend: `npm start`
4. Refresh browser

See `FIX_500_ERRORS.md` for detailed instructions.

## Testing Checklist

Once database is connected:

- [ ] Table loads without errors
- [ ] Can create new question
- [ ] Can edit existing question
- [ ] Can delete single question
- [ ] Can select multiple questions
- [ ] Can bulk delete questions
- [ ] Search filters questions in real-time
- [ ] Topic filter works
- [ ] Difficulty filter works
- [ ] Pagination works correctly
- [ ] "Show entries" changes page size
- [ ] Action buttons work (Detail, Edit, Delete)
- [ ] Responsive on mobile devices

## Screenshots Reference

Your screenshot shows:
- Clean white table on light background
- Orange "Create Question" button
- Green "Detail" and orange "Edit" buttons
- Lecturer and Course columns (we use Topic instead)
- Created date with timestamp
- Professional admin panel aesthetic

Our implementation matches this design with:
- Same color scheme
- Similar button styles
- Clean table layout
- Professional look and feel
- Better filtering and search
- Bulk operations support

## Next Steps

1. **Connect Database** (see FIX_500_ERRORS.md)
2. **Add Sample Questions** (`node backend/add-sample-questions-with-topics.js`)
3. **Test Table View** (navigate to `/questions-table`)
4. **Compare Views** (switch between `/questions` and `/questions-table`)
5. **Choose Preferred View** (or keep both!)

## Tips

- Use **Card View** for detailed question review
- Use **Table View** for quick management and bulk operations
- Both views share the same data and functionality
- Both views have the same create/edit modal
- Switch between views based on your task

---

**The table view is ready to use! Just connect the database and navigate to `/questions-table`** 🎉
