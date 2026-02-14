# Developer Guide - Virtual Assessment Platform

## Quick Reference

### Project Structure
```
backend/src/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── middleware/     # Auth, RBAC, Error handling
├── models/         # Sequelize models
├── routes/         # API routes
├── utils/          # Helper functions
└── server.js       # Entry point

frontend/src/
├── components/     # Reusable components
├── context/        # Global state
├── pages/          # Page components
├── services/       # API client
├── styles/         # CSS files
├── utils/          # Helper functions
└── App.js          # Main app component
```

## Common Development Tasks

### Adding a New Model

1. **Create Model** (`backend/src/models/NewModel.js`):
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NewModel = sequelize.define('NewModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  // Add more fields
}, {
  tableName: 'new_models',
  timestamps: true,
});

module.exports = NewModel;
```

2. **Add Relationships** (`backend/src/models/index.js`):
```javascript
const NewModel = require('./NewModel');

// Add relationships
NewModel.belongsTo(OtherModel, { foreignKey: 'otherId', as: 'other' });

// Export
module.exports = {
  // ... existing models
  NewModel,
};
```

3. **Create Migration** (SQL):
```sql
CREATE TABLE IF NOT EXISTS new_models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Adding a New Controller

**File**: `backend/src/controllers/newController.js`
```javascript
const { NewModel } = require('../models');

const getAll = async (req, res) => {
  try {
    const items = await NewModel.findAll();
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const item = await NewModel.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const item = await NewModel.create({ name });
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { name } = req.body;
    const item = await NewModel.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.update({ name });
    res.json({ message: 'Item updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await NewModel.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteItem,
};
```

### Adding a New Route

**File**: `backend/src/routes/newRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const newController = require('../controllers/newController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, newController.getAll);
router.get('/:id', authenticate, newController.getById);
router.post('/', authenticate, authorize('Super Admin', 'Admin'), newController.create);
router.put('/:id', authenticate, authorize('Super Admin', 'Admin'), newController.update);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), newController.deleteItem);

module.exports = router;
```

**Register Route** (`backend/src/server.js`):
```javascript
const newRoutes = require('./routes/newRoutes');
app.use('/api/new', newRoutes);
```

### Adding a New Frontend Page

1. **Create Page Component** (`frontend/src/pages/NewPage.js`):
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../pages/ListPages.css';

const NewPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/new');
      setItems(response.data.items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/new', formData);
      alert('Item created successfully');
      setShowModal(false);
      fetchItems();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating item');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Items</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Item
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Item</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPage;
```

2. **Add Route** (`frontend/src/App.js`):
```javascript
import NewPage from './pages/NewPage';

// In Routes:
<Route
  path="/new"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>
```

3. **Add to Sidebar** (`frontend/src/components/Sidebar.js`):
```javascript
{ path: '/new', icon: <FiGrid />, label: 'New Items' }
```

## API Client Usage

### Making API Calls

```javascript
import api from '../services/api';

// GET request
const response = await api.get('/endpoint');
const data = response.data;

// POST request
const response = await api.post('/endpoint', { key: 'value' });

// PUT request
const response = await api.put('/endpoint/:id', { key: 'value' });

// DELETE request
const response = await api.delete('/endpoint/:id');

// With query parameters
const response = await api.get('/endpoint', { params: { page: 1, limit: 10 } });

// File upload
const formData = new FormData();
formData.append('file', file);
const response = await api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## Database Queries

### Sequelize Examples

```javascript
// Find all
const items = await Model.findAll();

// Find with conditions
const items = await Model.findAll({
  where: { status: 'active' },
  order: [['createdAt', 'DESC']],
  limit: 10,
});

// Find by primary key
const item = await Model.findByPk(id);

// Find one
const item = await Model.findOne({ where: { email: 'test@example.com' } });

// Create
const item = await Model.create({ name: 'Test' });

// Update
await item.update({ name: 'Updated' });

// Delete
await item.destroy();

// Include associations
const items = await Model.findAll({
  include: [
    { model: OtherModel, as: 'relation' },
  ],
});

// Count
const count = await Model.count({ where: { status: 'active' } });

// Raw query
const [results] = await sequelize.query('SELECT * FROM table WHERE id = ?', {
  replacements: [id],
  type: QueryTypes.SELECT,
});
```

## Authentication & Authorization

### Protecting Routes

```javascript
// Require authentication only
router.get('/endpoint', authenticate, controller.method);

// Require specific roles
router.post('/endpoint', authenticate, authorize('Admin', 'Super Admin'), controller.method);

// Multiple role options
router.put('/endpoint', authenticate, authorize('Admin', 'Examiner'), controller.method);
```

### Accessing User in Controller

```javascript
const someController = async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  // User object is available from authenticate middleware
};
```

## Frontend State Management

### Using Context

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.firstName}</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
};
```

## Common Patterns

### Error Handling

**Backend**:
```javascript
try {
  // Your code
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Error message', 
    error: error.message 
  });
}
```

**Frontend**:
```javascript
try {
  const response = await api.get('/endpoint');
  // Handle success
} catch (error) {
  console.error('Error:', error);
  alert(error.response?.data?.message || 'An error occurred');
}
```

### Loading States

```javascript
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/endpoint');
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) return <div className="loading">Loading...</div>;
```

### Form Handling

```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('/endpoint', formData);
    alert('Success');
  } catch (error) {
    alert('Error');
  }
};
```

## Testing

### Testing API Endpoints

Use Postman, Thunder Client, or curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'

# Get with token
curl -X GET http://localhost:5000/api/departments \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create with token
curl -X POST http://localhost:5000/api/departments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Computer Science","code":"CS"}'
```

## Debugging

### Backend Debugging

```javascript
// Add console logs
console.log('Request body:', req.body);
console.log('User:', req.user);
console.log('Query result:', result);

// Use debugger
debugger; // Add breakpoint

// Check database queries
// Enable Sequelize logging in config/database.js
logging: console.log
```

### Frontend Debugging

```javascript
// Console logs
console.log('State:', state);
console.log('Props:', props);
console.log('API Response:', response);

// React DevTools
// Install React Developer Tools browser extension

// Network tab
// Check API calls in browser DevTools > Network
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=virtual_assessment_db
JWT_SECRET=your_secret_key
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Access in code:
```javascript
// Backend
process.env.PORT
process.env.JWT_SECRET

// Frontend
process.env.REACT_APP_API_URL
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub

# After merge, update main
git checkout main
git pull origin main
```

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
- Check MySQL is running
- Verify credentials in .env
- Check database exists
- Test connection: `mysql -u root -p`

### CORS Error
- Check CORS_ORIGIN in backend .env
- Verify API URL in frontend .env
- Ensure backend is running

### JWT Token Issues
- Clear localStorage in browser
- Check JWT_SECRET is set
- Verify token expiration time

## Best Practices

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await instead of callbacks
- Handle errors properly

### Security
- Never commit .env files
- Use strong JWT secrets
- Validate all inputs
- Sanitize user data
- Use parameterized queries
- Implement rate limiting

### Performance
- Add database indexes
- Use pagination for large datasets
- Optimize queries (avoid N+1)
- Lazy load components
- Minimize bundle size

### Git
- Write clear commit messages
- Create feature branches
- Review code before merging
- Keep commits atomic
- Don't commit node_modules

## Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run db:sync      # Sync database models
npm install package  # Install new package

# Frontend
npm start            # Start development server
npm run build        # Build for production
npm install package  # Install new package

# Database
mysql -u root -p                    # Login to MySQL
source database/schema.sql          # Run SQL file
SHOW DATABASES;                     # List databases
USE virtual_assessment_db;          # Select database
SHOW TABLES;                        # List tables
DESCRIBE table_name;                # Show table structure

# Git
git status                          # Check status
git add .                           # Stage all changes
git commit -m "message"             # Commit changes
git push origin branch              # Push to remote
git pull origin main                # Pull from remote
git branch                          # List branches
git checkout -b feature/name        # Create new branch
```

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Sequelize Documentation](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Introduction](https://jwt.io/introduction)

---

**Happy Coding!** 🚀
