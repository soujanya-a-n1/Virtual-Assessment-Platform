const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');
const Exam = require('./Exam');
const Question = require('./Question');
const ExamQuestion = require('./ExamQuestion');
const ExamSubmission = require('./ExamSubmission');
const StudentAnswer = require('./StudentAnswer');
const ProctoringLog = require('./ProctoringLog');
const StudentExamEnrollment = require('./StudentExamEnrollment');
const Department = require('./Department');
const Course = require('./Course');
const Class = require('./Class');
const Lecturer = require('./Lecturer');
const Student = require('./Student');
const CourseLecturer = require('./CourseLecturer');
const CodingQuestion = require('./CodingQuestion');
const CodingSubmission = require('./CodingSubmission');
const TestCase = require('./TestCase');
const TestResult = require('./TestResult');

// User - Role relationship (many-to-many)
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

// User - ExamSubmission relationship (one-to-many)
User.hasMany(ExamSubmission, { foreignKey: 'userId', as: 'submissions' });
ExamSubmission.belongsTo(User, { foreignKey: 'userId', as: 'student' });

// User - ProctoringLog relationship (one-to-many)
User.hasMany(ProctoringLog, { foreignKey: 'userId', as: 'proctoringLogs' });
ProctoringLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - StudentExamEnrollment relationship (one-to-many)
User.hasMany(StudentExamEnrollment, { foreignKey: 'userId', as: 'enrollments' });
StudentExamEnrollment.belongsTo(User, { foreignKey: 'userId', as: 'student' });

// User - Exam relationship (one-to-many) for created exams
User.hasMany(Exam, { foreignKey: 'createdBy', as: 'createdExams' });
Exam.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Exam - Question relationship (many-to-many)
Exam.belongsToMany(Question, { through: ExamQuestion, foreignKey: 'examId' });
Question.belongsToMany(Exam, { through: ExamQuestion, foreignKey: 'questionId' });

// Exam - ExamSubmission relationship (one-to-many)
Exam.hasMany(ExamSubmission, { foreignKey: 'examId', as: 'submissions' });
ExamSubmission.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

// Exam - StudentExamEnrollment relationship (one-to-many)
Exam.hasMany(StudentExamEnrollment, { foreignKey: 'examId', as: 'enrollments' });
StudentExamEnrollment.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

// Question - StudentAnswer relationship (one-to-many)
Question.hasMany(StudentAnswer, { foreignKey: 'questionId', as: 'answers' });
StudentAnswer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// ExamSubmission - StudentAnswer relationship (one-to-many)
ExamSubmission.hasMany(StudentAnswer, { foreignKey: 'submissionId', as: 'studentAnswers' });
StudentAnswer.belongsTo(ExamSubmission, { foreignKey: 'submissionId', as: 'submission' });

// ExamSubmission - ProctoringLog relationship (one-to-many)
ExamSubmission.hasMany(ProctoringLog, { foreignKey: 'submissionId', as: 'logs' });
ProctoringLog.belongsTo(ExamSubmission, { foreignKey: 'submissionId', as: 'submission' });

// User - ExamSubmission relationship for evaluator
User.hasMany(ExamSubmission, { foreignKey: 'evaluatedBy', as: 'evaluations' });
ExamSubmission.belongsTo(User, { foreignKey: 'evaluatedBy', as: 'evaluator' });

// Department - Course relationship (one-to-many)
Department.hasMany(Course, { foreignKey: 'departmentId', as: 'courses' });
Course.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// Department - Class relationship (one-to-many)
Department.hasMany(Class, { foreignKey: 'departmentId', as: 'classes' });
Class.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// Department - Lecturer relationship (one-to-many)
Department.hasMany(Lecturer, { foreignKey: 'departmentId', as: 'lecturers' });
Lecturer.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// Department - Student relationship (one-to-many)
Department.hasMany(Student, { foreignKey: 'departmentId', as: 'students' });
Student.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// User - Lecturer relationship (one-to-one)
User.hasOne(Lecturer, { foreignKey: 'userId', as: 'lecturerProfile' });
Lecturer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Student relationship (one-to-one)
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Class - Student relationship (one-to-many)
Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });
Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

// Course - Lecturer relationship (many-to-many)
Course.belongsToMany(Lecturer, { through: CourseLecturer, foreignKey: 'courseId', as: 'lecturers' });
Lecturer.belongsToMany(Course, { through: CourseLecturer, foreignKey: 'lecturerId', as: 'courses' });

// Course - Exam relationship (one-to-many)
Course.hasMany(Exam, { foreignKey: 'courseId', as: 'exams' });
Exam.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Course - Question relationship (one-to-many)
Course.hasMany(Question, { foreignKey: 'courseId', as: 'questions' });
Question.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Question - CodingQuestion relationship (one-to-one)
Question.belongsTo(CodingQuestion, { 
  foreignKey: 'codingQuestionId',
  as: 'codingDetails'
});
CodingQuestion.hasOne(Question, { 
  foreignKey: 'codingQuestionId',
  as: 'questionEntry'
});

// Course - CodingQuestion relationship (one-to-many)
Course.hasMany(CodingQuestion, { foreignKey: 'courseId', as: 'codingQuestions' });
CodingQuestion.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Exam - CodingQuestion relationship (one-to-many)
Exam.hasMany(CodingQuestion, { foreignKey: 'examId', as: 'codingQuestions' });
CodingQuestion.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

// User - CodingSubmission relationship (one-to-many)
User.hasMany(CodingSubmission, { foreignKey: 'studentId', as: 'codingSubmissions' });
CodingSubmission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// CodingQuestion - CodingSubmission relationship (one-to-many)
CodingQuestion.hasMany(CodingSubmission, { foreignKey: 'codingQuestionId', as: 'submissions' });
CodingSubmission.belongsTo(CodingQuestion, { foreignKey: 'codingQuestionId', as: 'codingQuestion' });

// ExamSubmission - CodingSubmission relationship (one-to-many)
ExamSubmission.hasMany(CodingSubmission, { foreignKey: 'submissionId', as: 'codingSubmissions' });
CodingSubmission.belongsTo(ExamSubmission, { foreignKey: 'submissionId', as: 'examSubmission' });

// CodingQuestion - TestCase relationship (one-to-many)
CodingQuestion.hasMany(TestCase, { foreignKey: 'codingQuestionId', as: 'testCases' });
TestCase.belongsTo(CodingQuestion, { foreignKey: 'codingQuestionId', as: 'codingQuestion' });

// CodingSubmission - TestResult relationship (one-to-many)
CodingSubmission.hasMany(TestResult, { foreignKey: 'submissionId', as: 'testResults' });
TestResult.belongsTo(CodingSubmission, { foreignKey: 'submissionId', as: 'submission' });

// TestCase - TestResult relationship (one-to-many)
TestCase.hasMany(TestResult, { foreignKey: 'testCaseId', as: 'results' });
TestResult.belongsTo(TestCase, { foreignKey: 'testCaseId', as: 'testCase' });

module.exports = {
  User,
  Role,
  UserRole,
  Exam,
  Question,
  ExamQuestion,
  ExamSubmission,
  StudentAnswer,
  ProctoringLog,
  StudentExamEnrollment,
  Department,
  Course,
  Class,
  Lecturer,
  Student,
  CourseLecturer,
  CodingQuestion,
  CodingSubmission,
  TestCase,
  TestResult,
};
