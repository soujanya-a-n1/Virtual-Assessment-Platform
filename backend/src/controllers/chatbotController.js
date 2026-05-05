const ChatMessage = require('../models/ChatMessage');
const { User } = require('../models');

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

// Common FAQs for all roles
const commonFAQs = {
  'password reset': 'Contact your administrator to reset your password or use the "Forgot Password" link on the login page.',
  'profile update': 'Go to your profile section (click your name in the header) to update your information.',
  'technical issue': 'If you encounter technical issues, please contact support or your system administrator.',
  'browser support': 'This platform works best on Chrome, Firefox, Safari, and Edge (latest versions).',
  'help': 'I can answer questions about exams, results, user management, and platform features. Just ask!'
};

// AI-like response generator
const generateResponse = (message, userRole) => {
  const lowerMessage = message.toLowerCase();
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
    return `Hello! I'm your Virtual Assessment Platform assistant. I can help you with:\n\n• Student Role\n• Examiner Role\n• Admin Role\n• Super Admin Role\n• Project Workflow\n\nWhat would you like to know?`;
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

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50 } = req.query;
    
    const messages = await ChatMessage.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      messages: messages.reverse()
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history'
    });
  }
};

// Send message and get response
exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role || 'Student';
    
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }
    
    // Generate AI response
    const response = generateResponse(message, userRole);
    
    // Save to database
    const chatMessage = await ChatMessage.create({
      userId,
      message: message.trim(),
      response,
      userRole,
      sessionId: sessionId || `session_${Date.now()}`,
      isResolved: true
    });
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: chatMessage.id,
        message: chatMessage.message,
        response: chatMessage.response,
        timestamp: chatMessage.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Get quick suggestions based on role
exports.getQuickSuggestions = async (req, res) => {
  try {
    const userRole = req.user.role || 'Student';
    
    const suggestions = ['Student Role', 'Examiner Role', 'Admin Role', 'Super Admin Role', 'Project Workflow'];
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions'
    });
  }
};

// Clear chat history
exports.clearChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await ChatMessage.destroy({
      where: { userId }
    });
    
    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history'
    });
  }
};
