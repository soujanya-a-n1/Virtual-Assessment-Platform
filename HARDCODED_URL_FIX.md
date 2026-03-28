# Hardcoded API URL Fix

## Status: ✅ COMPLETE

Replaced all hardcoded `http://localhost:5000/api` URLs with the environment variable `process.env.REACT_APP_API_URL`.

## Files Updated

### 1. frontend/src/pages/ExamsList.js
**Changed:**
```javascript
// OLD (HARDCODED):
const response = await fetch('http://localhost:5000/api/courses', {

// NEW (DYNAMIC):
const response = await fetch(`${process.env.REACT_APP_API_URL}/courses`, {
```

### 2. frontend/src/components/ExamAssignmentModal.js
**Changed 5 instances:**

1. **Available Students Endpoint:**
```javascript
// OLD:
`http://localhost:5000/api/exams/${exam.id}/available-students`

// NEW:
`${process.env.REACT_APP_API_URL}/exams/${exam.id}/available-students`
```

2. **Classes for Assignment Endpoint:**
```javascript
// OLD:
`http://localhost:5000/api/classes-for-assignment`

// NEW:
`${process.env.REACT_APP_API_URL}/classes-for-assignment`
```

3. **Exam Enrollments Endpoint:**
```javascript
// OLD:
`http://localhost:5000/api/exams/${exam.id}/enrollments`

// NEW:
`${process.env.REACT_APP_API_URL}/exams/${exam.id}/enrollments`
```

4. **Assign Exam Endpoint:**
```javascript
// OLD:
`http://localhost:5000/api/exams/${exam.id}/assign`

// NEW:
`${process.env.REACT_APP_API_URL}/exams/${exam.id}/assign`
```

5. **Delete Enrollment Endpoint:**
```javascript
// OLD:
`http://localhost:5000/api/exams/${exam.id}/enrollments/${userId}`

// NEW:
`${process.env.REACT_APP_API_URL}/exams/${exam.id}/enrollments/${userId}`
```

## Environment Configuration

The API URL is now controlled by the `.env` file:

**frontend/.env:**
```
REACT_APP_API_URL=http://localhost:5002/api
```

## Benefits

1. **Single Source of Truth:** API URL is defined once in `.env` file
2. **Easy Port Changes:** Change port in one place, affects entire app
3. **Environment Flexibility:** Different URLs for dev, staging, production
4. **No Code Changes:** Update `.env` without touching code

## How It Works

React automatically loads environment variables that start with `REACT_APP_` and makes them available via `process.env`.

```javascript
// In .env file:
REACT_APP_API_URL=http://localhost:5002/api

// In JavaScript:
process.env.REACT_APP_API_URL // Returns: "http://localhost:5002/api"
```

## Testing

1. Verify `.env` file has correct URL:
   ```
   REACT_APP_API_URL=http://localhost:5002/api
   ```

2. Restart frontend development server (required for .env changes):
   ```bash
   cd frontend
   npm start
   ```

3. Test affected features:
   - Exam assignment modal
   - Course selection in exams list
   - Student enrollment
   - Class assignment

## Notes

- Frontend must be restarted after changing `.env` file
- Environment variables are embedded at build time
- For production, update `.env.production` file
- Never commit sensitive data to `.env` files

## Related Files

- `frontend/.env` - Environment configuration
- `frontend/src/services/api.js` - Main API service (already using env var)
- `frontend/src/pages/ExamsList.js` - Fixed fetch call
- `frontend/src/components/ExamAssignmentModal.js` - Fixed 5 fetch calls
