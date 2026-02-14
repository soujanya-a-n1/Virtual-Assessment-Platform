# Virtual Assessment Platform

A comprehensive full-stack web application for conducting secure online examinations with advanced proctoring features and role-based access control.

## 🚀 Features

### Core Modules
- **Authentication & Authorization** - JWT-based authentication with Role-Based Access Control (RBAC)
- **User Management** - Complete CRUD operations for user accounts
- **Exam Management** - Create, schedule, and manage examinations
- **Question Management** - Question bank with CSV upload functionality
- **Student Exam Module** - Timer-based exams with auto-save and auto-submit
- **Submission Management** - Handle and track exam submissions
- **Proctoring & Anti-Cheating** - Advanced security features
- **Result & Evaluation** - Automated grading and manual evaluation
- **Dashboards & Analytics** - Role-based dashboards with Recharts visualization

### Security Features
- Tab switch detection
- Copy-paste blocking
- Fullscreen enforcement
- Session monitoring
- Secure API endpoints
- Data encryption

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React.js with modern hooks and context API
- **Backend**: Node.js with Express.js framework
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Recharts for data visualization
- **Styling**: CSS3 with responsive design

### Project Structure
```
virtual-assessment-platform/
├── client/                     # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   └── styles/            # CSS files
│   └── package.json
├── server/                     # Node.js backend
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Sequelize models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   └── package.json
├── database/                   # Database related files
│   ├── migrations/            # Database migrations
│   ├── seeders/               # Database seeders
│   └── config.js              # Database configuration
└── # Virtual Assessment Platform

A comprehensive full-stack online examination and assessment platform with proctoring, anti-cheating features, and advanced analytics.

## 🎯 Quick Start

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed installation instructions.

### Quick Setup (5 minutes)

```bash
# 1. Setup Database
mysql -u root -p < database/schema.sql
mysql -u root -p < database/dummy_data.sql

# 2. Setup Backend
cd backend && npm install && npm run db:sync && npm run dev

# 3. Setup Frontend (in new terminal)
cd frontend && npm install && npm start
```

### Login with Demo Credentials
```
Email: superadmin@platform.com
Password: Admin@123456
```

## ✨ Key Features

### 🔐 Security & Authentication
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Password hashing with bcryptjs
- Protected API routes

### 📝 Exam Management
- Create and publish exams
- Manage questions (CRUD operations)
- CSV bulk upload for questions
- Exam scheduling and status tracking
- Negative marking support

### 🎓 Student Exam Module
- ⏱️ Real-time countdown timer
- 💾 Auto-save functionality
- 🚀 Auto-submit on time completion
- ✓ Answer review before submission
- 📊 Immediate result feedback

### 🛡️ Proctoring & Anti-Cheating
- 🔄 Tab switch detection and logging
- ✂️ Copy-paste prevention
- 🖱️ Right-click blocking
- 🖥️ Fullscreen enforcement
- 🔍 Developer tools prevention
- 📋 Comprehensive violation logging

### 📊 Analytics & Reporting
- Real-time exam analytics
- Student performance tracking
- Pass/fail statistics
- Detailed visualizations with Recharts
- Role-specific dashboards

### 👥 User Management
- 5 predefined roles (Super Admin, Admin, Examiner, Proctor, Student)
- User creation and role assignment
- User activity tracking
- Admin dashboard for oversight

## 📚 Technology Stack

### Backend
- **Node.js & Express** - Server framework
- **MySQL & Sequelize ORM** - Database and ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CSV Parser** - CSV handling

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **CSS3** - Responsive styling

## 🗂️ Project Structure

```
Virtual-Assessment-Platform/
├── backend/                 # Express server
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── models/         # Sequelize models
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & RBAC
│   │   ├── utils/          # Utilities
│   │   └── server.js
│   └── package.json
├── frontend/               # React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── context/       # Auth context
│   │   ├── styles/        # CSS files
│   │   └── utils/         # Utilities
│   └── package.json
├── database/
│   ├── schema.sql         # Database schema
│   └── dummy_data.sql     # Sample data
└── SETUP_GUIDE.md         # Detailed setup guide
```

## 🚀 User Roles & Permissions

| Role | Features |
|------|----------|
| **Super Admin** | Full system access, user management, all exams |
| **Admin** | User management, view all exams & submissions |
| **Examiner** | Create/edit exams, question management, evaluate submissions |
| **Proctor** | Invigilate exams, view proctoring logs, manage violations |
| **Student** | Take exams, view personal results |

## 📋 Database Models

- **Users** - User credentials and information
- **Roles** - 5 predefined roles
- **Exams** - Exam details and settings
- **Questions** - Question bank
- **Submissions** - Student exam attempts
- **StudentAnswers** - Individual question responses
- **ProctoringLogs** - Security violation records
- **Enrollments** - Student-exam relationships

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Users
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
POST   /api/users/assign-role
POST   /api/users/remove-role
```

### Exams
```
POST   /api/exams
GET    /api/exams
GET    /api/exams/:id
PUT    /api/exams/:id
DELETE /api/exams/:id
POST   /api/exams/:id/publish
```

### Questions
```
POST   /api/questions
GET    /api/questions
GET    /api/questions/:id
PUT    /api/questions/:id
DELETE /api/questions/:id
POST   /api/questions/upload/csv
POST   /api/questions/:examId/add-questions
```

### Submissions
```
POST   /api/submissions/exams/:examId/start
POST   /api/submissions/auto-save
POST   /api/submissions/:submissionId/submit
GET    /api/submissions/:submissionId
GET    /api/submissions
POST   /api/submissions/:submissionId/evaluate
```

### Proctoring
```
POST   /api/proctoring/log
GET    /api/proctoring/:submissionId/logs
GET    /api/proctoring/:submissionId/report
```

### Analytics
```
GET    /api/analytics
GET    /api/analytics/exams/:examId
GET    /api/analytics/students/:studentId
```

## 🎨 UI Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern, clean interface
- ✅ Role-based dashboards with personalized views
- ✅ Real-time exam timer with visual warnings
- ✅ Question navigation sidebar
- ✅ Status indicators (answered, not answered, current)
- ✅ Interactive charts and analytics
- ✅ Activity logging and monitoring

## 🧪 Testing

All major features are implemented with dummy data:

1. **Login** - Use demo credentials to access platform
2. **Create Exam** - Examiners can create and publish exams
3. **Take Exam** - Students can browse and attempt exams
4. **Auto-Save** - Answers are automatically saved
5. **Submit** - Exams auto-submit on timer expiry or manual submission
6. **View Results** - Immediate feedback on exam completion
7. **Analytics** - View exam and student performance data
8. **Proctoring** - Violations are logged and tracked

## 📦 Installation

For detailed step-by-step installation, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

Quick install:
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend  
cd frontend && npm install && npm start
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Default Credentials

```
Email: superadmin@platform.com
Password: Admin@123456
Role: Super Admin
```

## 🔒 Security Notes

1. Change JWT_SECRET in production
2. Use HTTPS in production
3. Implement rate limiting
4. Add CSRF protection
5. Validate all inputs server-side
6. Use environment variables for sensitive data
7. Regular database backups
8. Monitor proctoring logs for suspicious activity

## 🚀 Performance

- Optimized React components
- CSS-in-JS for styling
- Database indexing for queries
- Connection pooling
- Lazy loading of components
- Efficient state management

## 🐛 Known Issues

None currently. Please report any issues in the repository.

## 🎓 Learning Resources

- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Sequelize](https://sequelize.org/)
- [JWT Theory](https://jwt.io/introduction)
- [Recharts](https://recharts.org/)

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or issues:
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for troubleshooting
2. Review API documentation above
3. Check database schema in `database/schema.sql`

---

**Status**: ✅ Fully Functional  
**Version**: 1.0.0  
**Last Updated**: February 2024

**Ready to run!** 🎉
```

## 👥 User Roles & Permissions

### Super Admin
- Full system access
- Manage all users and roles
- System configuration
- Global analytics and reports

### Admin
- Manage exams and questions
- User management (limited)
- View reports and analytics
- System monitoring

### Examiner
- Create and manage exams
- Question bank management
- Grade submissions
- View exam analytics

### Proctor
- Monitor ongoing exams
- Handle proctoring alerts
- Manage exam sessions
- Generate proctoring reports

### Student
- Take assigned exams
- View results and feedback
- Access study materials
- Personal dashboard

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Backend Setup
1. Clone the repository
```bash
git clone <repository-url>
cd virtual-assessment-platform
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` file with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=virtual_assessment
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Setup database
```bash
# Create database
mysql -u root -p
CREATE DATABASE virtual_assessment;

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

5. Start the server
```bash
npm run dev
```

### Frontend Setup
1. Install client dependencies
```bash
cd client
npm install
```

2. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

3. Start the development server
```bash
npm start
```

## 📊 Database Schema

### Core Tables
- **users** - User accounts and profiles
- **roles** - User roles and permissions
- **exams** - Exam configurations
- **questions** - Question bank
- **exam_questions** - Exam-question relationships
- **submissions** - Student exam submissions
- **answers** - Individual question answers
- **proctoring_logs** - Security and monitoring logs
- **results** - Exam results and grades

## 🔐 API Endpoints

### Authentication
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/refresh        # Refresh JWT token
POST /api/auth/logout         # User logout
```

### User Management
```
GET    /api/users             # Get all users
GET    /api/users/:id         # Get user by ID
POST   /api/users             # Create new user
PUT    /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user
```

### Exam Management
```
GET    /api/exams             # Get all exams
GET    /api/exams/:id         # Get exam by ID
POST   /api/exams             # Create new exam
PUT    /api/exams/:id         # Update exam
DELETE /api/exams/:id         # Delete exam
```

### Question Management
```
GET    /api/questions         # Get all questions
POST   /api/questions         # Create question
POST   /api/questions/upload  # CSV upload
PUT    /api/questions/:id     # Update question
DELETE /api/questions/:id     # Delete question
```

## 🎯 Key Features Implementation

### Anti-Cheating Measures
- **Tab Switch Detection**: Monitors browser tab changes
- **Copy-Paste Blocking**: Prevents copying exam content
- **Fullscreen Enforcement**: Forces fullscreen mode during exams
- **Time Tracking**: Monitors time spent on each question
- **Session Monitoring**: Tracks user activity and suspicious behavior

### Auto-Save & Auto-Submit
- Automatic saving of answers every 30 seconds
- Auto-submit when time expires
- Recovery of unsaved data on reconnection
- Progress tracking and validation

### Proctoring Dashboard
- Real-time monitoring of active exams
- Alert system for suspicious activities
- Live session management
- Detailed proctoring reports

## 📈 Analytics & Reporting

### Student Analytics
- Performance trends
- Time analysis per question
- Difficulty analysis
- Progress tracking

### Exam Analytics
- Pass/fail rates
- Question difficulty metrics
- Time distribution analysis
- Cheating attempt reports

### System Analytics
- User activity monitoring
- System performance metrics
- Security incident reports
- Usage statistics

## 🚦 Getting Started

1. **Super Admin Setup**: First user registered becomes Super Admin
2. **Create Roles**: Set up Admin, Examiner, Proctor roles
3. **Add Users**: Create user accounts and assign roles
4. **Question Bank**: Upload questions via CSV or create manually
5. **Create Exams**: Set up exams with questions and configurations
6. **Schedule Exams**: Assign exams to students with time slots
7. **Monitor**: Use proctoring dashboard during exams
8. **Evaluate**: Review submissions and generate results

## 🔧 Development

### Available Scripts
```bash
# Backend
npm run dev          # Start development server
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database
npm run test         # Run tests

# Frontend
npm start            # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run eject        # Eject from Create React App
```
## 🛡️ Security Considerations

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Secure headers
- Data encryption
- Audit logging

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
date 11 feb 2026