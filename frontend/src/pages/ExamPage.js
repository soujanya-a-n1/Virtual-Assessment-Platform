import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  FiSave, 
  FiX, 
  FiClock, 
  FiFileText, 
  FiAward,
  FiCalendar,
  FiSettings,
  FiPlus,
  FiTrash2,
  FiList,
  FiCheckCircle,
  FiEdit2
} from 'react-icons/fi';
import './ExamPage.css';

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    totalMarks: 100,
    passingMarks: 40,
    examType: 'Online',
    status: 'Draft',
    startTime: '',
    endTime: '',
    requiresProctoring: true,
    shuffleQuestions: false,
    negativeMarkingEnabled: false,
    negativeMarks: 0,
    courseId: '',
  });

  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Medium',
    topic: '',
    courseId: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    language: 'python',
    timeLimit: 5,
    memoryLimit: 256,
    starterCode: '',
    testCases: [],
  });

  const [newTestCase, setNewTestCase] = useState({
    input: '',
    expectedOutput: '',
    isVisible: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCourses();
    if (examId && examId !== 'create') {
      fetchExam();
      fetchExamQuestions();
    }
    fetchAllQuestions();
  }, [examId]);

  // Debug: Log questionForm changes
  useEffect(() => {
    if (showQuestionModal && editingQuestion) {
      console.log('=== MODAL OPENED WITH QUESTION FORM ===');
      console.log('questionForm state:', questionForm);
      console.log('editingQuestion:', editingQuestion);
    }
  }, [showQuestionModal, questionForm, editingQuestion]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchExam = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/exams/${examId}`);
      const examData = response.data.exam;
      
      setExam(examData);
      setFormData({
        title: examData.title || '',
        description: examData.description || '',
        duration: examData.duration || 60,
        totalMarks: examData.totalMarks || 100,
        passingMarks: examData.passingMarks || 40,
        examType: examData.examType || 'Online',
        status: examData.status || 'Draft',
        startTime: examData.startTime ? new Date(examData.startTime).toISOString().slice(0, 16) : '',
        endTime: examData.endTime ? new Date(examData.endTime).toISOString().slice(0, 16) : '',
        requiresProctoring: examData.requiresProctoring ?? true,
        shuffleQuestions: examData.shuffleQuestions ?? false,
        negativeMarkingEnabled: examData.negativeMarkingEnabled ?? false,
        negativeMarks: examData.negativeMarks || 0,
        courseId: examData.courseId || '',
      });
      
      // Fetch questions for the selected course
      if (examData.courseId) {
        fetchAllQuestions(examData.courseId);
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
      alert('Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  const fetchExamQuestions = async () => {
    try {
      const response = await api.get(`/exams/${examId}`);
      setQuestions(response.data.exam.Questions || []);
    } catch (error) {
      console.error('Error fetching exam questions:', error);
    }
  };

  const fetchAllQuestions = async (courseId = null) => {
    try {
      const url = courseId ? `/questions?courseId=${courseId}` : '/questions';
      const response = await api.get(url);
      setAllQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.duration < 1) newErrors.duration = 'Duration must be at least 1 minute';
    if (formData.passingMarks < 0 || formData.passingMarks > formData.totalMarks) {
      newErrors.passingMarks = 'Passing marks must be between 0 and total marks';
    }
    if (formData.startTime && formData.endTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
      newErrors.endTime = 'End time must be after start time';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      const examData = {
        ...formData,
        totalQuestions: questions?.length || 0,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
      };

      if (examId && examId !== 'create') {
        await api.put(`/exams/${examId}`, examData);
        alert('Exam updated successfully!');
      } else {
        const response = await api.post('/exams', examData);
        alert('Exam created successfully!');
        navigate(`/exams/${response.data.exam.id}`);
      }
    } catch (error) {
      console.error('Error saving exam:', error);
      alert(error.response?.data?.message || 'Failed to save exam');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // When course changes, fetch questions for that course
    if (name === 'courseId') {
      fetchAllQuestions(value || null);
      setQuestionForm(prev => ({ ...prev, courseId: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTestCase = () => {
    if (!newTestCase.input.trim() || !newTestCase.expectedOutput.trim()) {
      alert('Please fill in both input and expected output');
      return;
    }
    setQuestionForm(prev => ({
      ...prev,
      testCases: [...(prev.testCases || []), { ...newTestCase, orderIndex: (prev.testCases || []).length }]
    }));
    setNewTestCase({ input: '', expectedOutput: '', isVisible: true });
  };

  const handleRemoveTestCase = (index) => {
    setQuestionForm(prev => ({
      ...prev,
      testCases: (prev.testCases || []).filter((_, i) => i !== index)
    }));
  };

  const handleTestCaseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTestCase(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    
    if (!questionForm.courseId) {
      alert('Please select a course for the question');
      return;
    }

    if (questionForm.questionType === 'Coding' && (!questionForm.testCases || questionForm.testCases.length === 0)) {
      alert('Please add at least one test case for coding questions');
      return;
    }
    
    try {
      if (questionForm.questionType === 'Coding') {
        const codingQuestionData = {
          title: questionForm.questionText,
          description: questionForm.questionText,
          difficulty: questionForm.difficulty,
          marks: questionForm.marks,
          language: questionForm.language,
          timeLimit: questionForm.timeLimit,
          memoryLimit: questionForm.memoryLimit,
          starterCode: questionForm.starterCode,
          courseId: questionForm.courseId,
          testCases: questionForm.testCases,
          examId: examId && examId !== 'create' ? examId : null,
        };

        if (editingQuestion) {
          const linkedCodingId =
            editingQuestion.codingQuestionId ?? editingQuestion.coding_question_id;

          if (linkedCodingId) {
            await api.put(`/coding-questions/${linkedCodingId}`, codingQuestionData);
            await api.put(`/questions/${editingQuestion.id}`, {
              questionText: questionForm.questionText,
              marks: questionForm.marks,
              difficulty: questionForm.difficulty,
              courseId: questionForm.courseId,
            });
          } else {
            const response = await api.post('/coding-questions', codingQuestionData);
            const newCoding = response.data.codingQuestion;
            await api.put(`/questions/${editingQuestion.id}`, {
              questionText: questionForm.questionText,
              marks: questionForm.marks,
              difficulty: questionForm.difficulty,
              courseId: questionForm.courseId,
              codingQuestionId: newCoding.id,
            });
          }
          alert('Coding question updated successfully!');
        } else {
          const response = await api.post('/coding-questions', codingQuestionData);
          const newCodingQuestion = response.data.codingQuestion;
          
          const questionData = {
            questionText: questionForm.questionText,
            questionType: 'Coding',
            marks: questionForm.marks,
            difficulty: questionForm.difficulty,
            courseId: questionForm.courseId,
            codingQuestionId: newCodingQuestion.id,
            correctAnswer: '',
          };
          const questionResponse = await api.post('/questions', questionData);
          
          if (examId && examId !== 'create') {
            await api.post(`/questions/${examId}/add-questions`, { 
              questionIds: [questionResponse.data.question.id] 
            });
          }
          
          alert('Coding question created successfully!');
        }
      } else {
        if (editingQuestion) {
          await api.put(`/questions/${editingQuestion.id}`, questionForm);
          alert('Question updated successfully!');
        } else {
          const response = await api.post('/questions', questionForm);
          const newQuestion = response.data.question;
          
          if (examId && examId !== 'create') {
            await api.post(`/questions/${examId}/add-questions`, { questionIds: [newQuestion.id] });
          }
          alert('Question created successfully!');
        }
      }
      
      setShowQuestionModal(false);
      setEditingQuestion(null);
      resetQuestionForm();
      fetchExamQuestions();
      fetchAllQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      alert(error.response?.data?.message || 'Failed to save question');
    }
  };

  const handleAddExistingQuestions = async (selectedIds) => {
    try {
      await api.post(`/questions/${examId}/add-questions`, { questionIds: selectedIds });
      alert('Questions added successfully!');
      setShowAddQuestionModal(false);
      fetchExamQuestions();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add questions');
    }
  };

  const handleRemoveQuestion = async (questionId) => {
    if (!window.confirm('Remove this question from the exam?')) return;
    try {
      await api.delete(`/questions/${examId}/questions/${questionId}`);
      fetchExamQuestions();
      alert('Question removed successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove question');
    }
  };

  const handleEditQuestion = async (question) => {
    try {
      console.log('=== FETCHING FULL QUESTION DATA ===');
      console.log('Question ID:', question.id);
      
      // Fetch complete question data from API
      const response = await api.get(`/questions/${question.id}`);
      const fullQuestion = response.data.question;
      
      console.log('Full question data received:', fullQuestion);
      console.log('Option A:', fullQuestion.optionA);
      console.log('Option B:', fullQuestion.optionB);
      console.log('Option C:', fullQuestion.optionC);
      console.log('Option D:', fullQuestion.optionD);
      
      // Set editing question
      setEditingQuestion(fullQuestion);

      const rawQt = fullQuestion.questionType;
      const normalizedQuestionType =
        rawQt === 'Coding' ||
        (typeof rawQt === 'string' && rawQt.trim().toLowerCase() === 'coding')
          ? 'Coding'
          : rawQt || 'Multiple Choice';

      const formValues = {
        questionText: fullQuestion.questionText || '',
        questionType: normalizedQuestionType,
        marks: fullQuestion.marks || 1,
        difficulty: fullQuestion.difficulty || 'Medium',
        topic: fullQuestion.topic || '',
        courseId: fullQuestion.courseId || formData.courseId || '',
        optionA: fullQuestion.optionA || '',
        optionB: fullQuestion.optionB || '',
        optionC: fullQuestion.optionC || '',
        optionD: fullQuestion.optionD || '',
        correctAnswer: fullQuestion.correctAnswer || '',
        language: 'python',
        timeLimit: 5,
        memoryLimit: 256,
        starterCode: '',
        testCases: [],
      };

      if (normalizedQuestionType === 'Coding') {
        const cqId = fullQuestion.codingQuestionId ?? fullQuestion.coding_question_id;
        if (cqId) {
          try {
            const cqRes = await api.get(`/coding-questions/${cqId}`);
            const cq = cqRes.data.question;
            formValues.language = cq.language || 'python';
            formValues.timeLimit = cq.timeLimit ?? 5;
            formValues.memoryLimit = cq.memoryLimit ?? 256;
            formValues.starterCode = cq.starterCode || '';
            formValues.questionText =
              fullQuestion.questionText || cq.description || cq.title || '';
            const rawTcs =
              cq.testCases || cq.test_cases || (Array.isArray(cq.TestCases) ? cq.TestCases : []);
            formValues.testCases = rawTcs.map((tc, i) => ({
              input: tc.input ?? '',
              expectedOutput: tc.expectedOutput ?? tc.expected_output ?? '',
              isVisible:
                tc.isVisible !== undefined
                  ? tc.isVisible
                  : tc.is_visible !== undefined
                    ? tc.is_visible
                    : true,
              orderIndex:
                tc.orderIndex != null
                  ? tc.orderIndex
                  : tc.order_index != null
                    ? tc.order_index
                    : i,
            }));
          } catch (cqErr) {
            console.error('Error loading coding question:', cqErr);
          }
        }
      }

      console.log('Form values being set:', formValues);

      setQuestionForm(formValues);
      setShowQuestionModal(true);
    } catch (error) {
      console.error('Error fetching question:', error);
      alert('Failed to load question details. Please try again.');
    }
  };

  const toggleQuestionExpand = (questionId) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      questionText: '',
      questionType: 'Multiple Choice',
      marks: 1,
      difficulty: 'Medium',
      topic: '',
      courseId: formData.courseId || '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      language: 'python',
      timeLimit: 5,
      memoryLimit: 256,
      starterCode: '',
      testCases: [],
    });
    setNewTestCase({
      input: '',
      expectedOutput: '',
      isVisible: true,
    });
    setEditingQuestion(null);
  };

  const calculateTotalMarks = () => {
    if (!questions || !Array.isArray(questions)) return 0;
    return questions.reduce((sum, q) => {
      const marks = parseFloat(q.marks);
      return sum + (isNaN(marks) ? 0 : marks);
    }, 0);
  };

  if (loading) {
    return (
      <div className="exam-page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-page-container">
      <div className="exam-page-header">
        <div>
          <h1>{examId === 'create' ? 'Create New Exam' : 'Manage Exam'}</h1>
          <p className="subtitle">
            {examId === 'create' ? 'Fill in the details to create a new exam' : exam?.title}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {examId && examId !== 'create' && exam?.status === 'Draft' && (
            <button 
              className="btn btn-primary" 
              onClick={async () => {
                try {
                  await api.post(`/exams/${examId}/publish`);
                  alert('Exam published successfully!');
                  fetchExam();
                } catch (error) {
                  alert(error.response?.data?.message || 'Failed to publish exam');
                }
              }}
            >
              <FiCheckCircle /> Publish Exam
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/exams')}>
            <FiX /> Close
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="exam-tabs">
        <button
          className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <FiSettings /> Exam Details
        </button>
        {examId && examId !== 'create' && (
          <button
            className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <FiList /> Questions ({questions?.length || 0})
          </button>
        )}
      </div>

      {/* Exam Details Tab */}
      {activeTab === 'details' && (
        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-section">
            <div className="section-header">
              <FiFileText className="section-icon" />
              <h2>Basic Information</h2>
            </div>

            <div className="form-group">
              <label htmlFor="title">Exam Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter exam title"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter exam description"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="courseId">Course</label>
                <select 
                  id="courseId" 
                  name="courseId" 
                  value={formData.courseId} 
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="examType">Exam Type</label>
                <select id="examType" name="examType" value={formData.examType} onChange={handleChange}>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <FiSettings className="section-icon" />
              <h2>Exam Configuration</h2>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">
                  <FiClock className="label-icon" />
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className={errors.duration ? 'error' : ''}
                />
                {errors.duration && <span className="error-message">{errors.duration}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="totalMarks">
                  <FiAward className="label-icon" />
                  Total Marks *
                </label>
                <input
                  type="number"
                  id="totalMarks"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  min="1"
                  className={errors.totalMarks ? 'error' : ''}
                />
                {errors.totalMarks && <span className="error-message">{errors.totalMarks}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="passingMarks">
                  <FiAward className="label-icon" />
                  Passing Marks *
                </label>
                <input
                  type="number"
                  id="passingMarks"
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  min="0"
                  className={errors.passingMarks ? 'error' : ''}
                />
                {errors.passingMarks && <span className="error-message">{errors.passingMarks}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <FiCalendar className="section-icon" />
              <h2>Schedule (Optional)</h2>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={errors.endTime ? 'error' : ''}
                />
                {errors.endTime && <span className="error-message">{errors.endTime}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <FiSettings className="section-icon" />
              <h2>Advanced Settings</h2>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="requiresProctoring"
                  checked={formData.requiresProctoring}
                  onChange={handleChange}
                />
                <span>Requires Proctoring</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="shuffleQuestions"
                  checked={formData.shuffleQuestions}
                  onChange={handleChange}
                />
                <span>Shuffle Questions</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="negativeMarkingEnabled"
                  checked={formData.negativeMarkingEnabled}
                  onChange={handleChange}
                />
                <span>Enable Negative Marking</span>
              </label>
            </div>

            {formData.negativeMarkingEnabled && (
              <div className="form-group">
                <label htmlFor="negativeMarks">Negative Marks per Wrong Answer</label>
                <input
                  type="number"
                  id="negativeMarks"
                  name="negativeMarks"
                  value={formData.negativeMarks}
                  onChange={handleChange}
                  min="0"
                  step="0.25"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/exams')}
              disabled={saving}
            >
              <FiX /> Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              <FiSave /> {saving ? 'Saving...' : (examId === 'create' ? 'Create Exam' : 'Update Exam')}
            </button>
          </div>
        </form>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="questions-section">
          <div className="questions-header">
            <div className="questions-stats">
              <div className="stat-card">
                <FiList className="stat-icon" />
                <div>
                  <h3>{questions?.length || 0}</h3>
                  <p>Total Questions</p>
                </div>
              </div>
              <div className="stat-card">
                <FiAward className="stat-icon" />
                <div>
                  <h3>{calculateTotalMarks().toFixed(2)}</h3>
                  <p>Total Marks</p>
                </div>
              </div>
            </div>
            <div className="questions-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddQuestionModal(true)}
              >
                <FiPlus /> Add Existing Questions
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowQuestionModal(true)}
              >
                <FiPlus /> Create New Question
              </button>
            </div>
          </div>

          {!questions || questions.length === 0 ? (
            <div className="no-questions">
              <FiFileText className="no-questions-icon" />
              <h3>No Questions Added</h3>
              <p>Start by creating a new question or adding existing questions to this exam</p>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((question, index) => {
                const isExpanded = expandedQuestions.includes(question.id);
                return (
                  <div key={question.id} className="question-card">
                    <div className="question-card-header">
                      <div className="question-header-left">
                        <span 
                          className="question-number clickable" 
                          onClick={() => toggleQuestionExpand(question.id)}
                          title="Click to expand/collapse"
                        >
                          Q{index + 1}
                        </span>
                        <span className="question-type">{question.questionType}</span>
                        <span className="question-marks">
                          {parseFloat(question.marks).toFixed(2)} marks
                        </span>
                        {question.difficulty && (
                          <span className={`question-difficulty ${question.difficulty.toLowerCase()}`}>
                            {question.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="question-actions">
                        <button
                          className="btn-icon edit"
                          onClick={() => handleEditQuestion(question)}
                          title="Edit question"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleRemoveQuestion(question.id)}
                          title="Remove question"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <div className="question-text">{question.questionText}</div>
                    {isExpanded && (
                      <>
                        {question.questionType === 'Multiple Choice' && (
                          <div className="question-options">
                            {['A', 'B', 'C', 'D'].map(opt => {
                              const optionText = question[`option${opt}`];
                              if (!optionText) return null;
                              return (
                                <div key={opt} className={`option ${question.correctAnswer === opt ? 'correct' : ''}`}>
                                  <span className="option-letter">{opt}</span>
                                  <span className="option-text">{optionText}</span>
                                  {question.correctAnswer === opt && <FiCheckCircle className="correct-icon" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {question.questionType === 'True/False' && (
                          <div className="question-options">
                            <div className={`option ${question.correctAnswer === 'A' ? 'correct' : ''}`}>
                              <span className="option-letter">A</span>
                              <span className="option-text">True</span>
                              {question.correctAnswer === 'A' && <FiCheckCircle className="correct-icon" />}
                            </div>
                            <div className={`option ${question.correctAnswer === 'B' ? 'correct' : ''}`}>
                              <span className="option-letter">B</span>
                              <span className="option-text">False</span>
                              {question.correctAnswer === 'B' && <FiCheckCircle className="correct-icon" />}
                            </div>
                          </div>
                        )}
                        {question.questionType === 'Short Answer' && (
                          <div className="question-answer">
                            <strong>Model Answer:</strong>
                            <p>{question.correctAnswer}</p>
                          </div>
                        )}
                        {question.questionType === 'Coding' && question.codingDetails && (
                          <div className="question-answer coding-details">
                            <div className="coding-meta">
                              <span><strong>Language:</strong> {question.codingDetails.language}</span>
                              <span><strong>Time:</strong> {question.codingDetails.timeLimit}s</span>
                              <span><strong>Memory:</strong> {question.codingDetails.memoryLimit}MB</span>
                            </div>
                            {question.codingDetails.testCases && (
                              <div className="test-info">
                                <strong>Test Cases:</strong> {question.codingDetails.testCases.length} total
                                ({question.codingDetails.testCases.filter(tc => tc.isVisible).length} visible)
                              </div>
                            )}
                          </div>
                        )}
                        {question.questionType === 'Coding' && !question.codingDetails && (
                          <div className="question-answer">
                            <p style={{color: '#f44336'}}>⚠️ Coding details not loaded</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Question Modal */}
      {showQuestionModal && (
        <div className="modal-overlay" onClick={() => { setShowQuestionModal(false); setEditingQuestion(null); resetQuestionForm(); }}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingQuestion ? 'Edit Question' : 'Create New Question'}</h2>
              <button className="close-btn" onClick={() => { setShowQuestionModal(false); setEditingQuestion(null); resetQuestionForm(); }}>×</button>
            </div>
            <form onSubmit={handleCreateQuestion}>
              <div className="form-group">
                <label>Question Text *</label>
                <textarea
                  name="questionText"
                  value={questionForm.questionText}
                  onChange={handleQuestionChange}
                  required
                  rows="3"
                  placeholder="Enter the question"
                  style={{ 
                    color: '#000000', 
                    backgroundColor: '#ffffff', 
                    fontWeight: '600',
                    WebkitTextFillColor: '#000000'
                  }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Course *</label>
                  <select
                    name="courseId"
                    value={questionForm.courseId}
                    onChange={handleQuestionChange}
                    required
                    className={!questionForm.courseId ? 'error' : ''}
                    style={{ 
                      color: '#000000', 
                      backgroundColor: '#ffffff', 
                      fontWeight: '600',
                      WebkitTextFillColor: '#000000'
                    }}
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                  {!questionForm.courseId && (
                    <span className="error-message" style={{ fontSize: '0.85rem', color: '#ff4444' }}>
                      Course selection is required
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>Question Type *</label>
                  <select
                    name="questionType"
                    value={questionForm.questionType}
                    onChange={handleQuestionChange}
                    required
                    style={{ 
                      color: '#000000', 
                      backgroundColor: '#ffffff', 
                      fontWeight: '600',
                      WebkitTextFillColor: '#000000'
                    }}
                  >
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="True/False">True/False</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Coding">Coding</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Marks *</label>
                  <input
                    type="number"
                    name="marks"
                    value={questionForm.marks}
                    onChange={handleQuestionChange}
                    required
                    min="0.25"
                    step="0.25"
                    style={{ 
                      color: '#000000', 
                      backgroundColor: '#ffffff', 
                      fontWeight: '600',
                      WebkitTextFillColor: '#000000'
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    name="difficulty"
                    value={questionForm.difficulty}
                    onChange={handleQuestionChange}
                    style={{ 
                      color: '#000000', 
                      backgroundColor: '#ffffff', 
                      fontWeight: '600',
                      WebkitTextFillColor: '#000000'
                    }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {questionForm.questionType === 'Multiple Choice' && (
                <>
                  <div className="form-group">
                    <label>Option A *</label>
                    <input
                      type="text"
                      name="optionA"
                      value={questionForm.optionA}
                      onChange={handleQuestionChange}
                      required
                      placeholder="Enter option A"
                      style={{ 
                        color: '#000000', 
                        backgroundColor: '#ffffff', 
                        fontWeight: '600',
                        WebkitTextFillColor: '#000000'
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Option B *</label>
                    <input
                      type="text"
                      name="optionB"
                      value={questionForm.optionB}
                      onChange={handleQuestionChange}
                      required
                      placeholder="Enter option B"
                      style={{ 
                        color: '#000000', 
                        backgroundColor: '#ffffff', 
                        fontWeight: '600',
                        WebkitTextFillColor: '#000000'
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Option C *</label>
                    <input
                      type="text"
                      name="optionC"
                      value={questionForm.optionC}
                      onChange={handleQuestionChange}
                      required
                      placeholder="Enter option C"
                      style={{ 
                        color: '#000000', 
                        backgroundColor: '#ffffff', 
                        fontWeight: '600',
                        WebkitTextFillColor: '#000000'
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Option D *</label>
                    <input
                      type="text"
                      name="optionD"
                      value={questionForm.optionD}
                      onChange={handleQuestionChange}
                      required
                      placeholder="Enter option D"
                      style={{ 
                        color: '#000000', 
                        backgroundColor: '#ffffff', 
                        fontWeight: '600',
                        WebkitTextFillColor: '#000000'
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Correct Answer *</label>
                    <select
                      name="correctAnswer"
                      value={questionForm.correctAnswer}
                      onChange={handleQuestionChange}
                      required
                      style={{ 
                        color: '#000000', 
                        backgroundColor: '#ffffff', 
                        fontWeight: '600',
                        WebkitTextFillColor: '#000000'
                      }}
                    >
                      <option value="">Select correct answer</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </>
              )}

              {questionForm.questionType === 'True/False' && (
                <div className="form-group">
                  <label>Correct Answer *</label>
                  <select
                    name="correctAnswer"
                    value={questionForm.correctAnswer}
                    onChange={handleQuestionChange}
                    required
                    style={{ 
                      color: '#000000', 
                      backgroundColor: '#ffffff', 
                      fontWeight: '600',
                      WebkitTextFillColor: '#000000'
                    }}
                  >
                    <option value="">Select correct answer</option>
                    <option value="A">True</option>
                    <option value="B">False</option>
                  </select>
                </div>
              )}

              {questionForm.questionType === 'Short Answer' && (
                <div className="form-group">
                  <label>Model Answer *</label>
                  <textarea
                    name="correctAnswer"
                    value={questionForm.correctAnswer}
                    onChange={handleQuestionChange}
                    required
                    rows="2"
                    placeholder="Enter the model answer"
                    style={{ 
                      color: '#000000', 
                      backgroundColor: '#ffffff', 
                      fontWeight: '600',
                      WebkitTextFillColor: '#000000'
                    }}
                  />
                </div>
              )}

              {questionForm.questionType === 'Coding' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Programming Language *</label>
                      <select
                        name="language"
                        value={questionForm.language}
                        onChange={handleQuestionChange}
                        required
                        style={{ 
                          color: '#000000', 
                          backgroundColor: '#ffffff', 
                          fontWeight: '600',
                          WebkitTextFillColor: '#000000'
                        }}
                      >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="csharp">C#</option>
                        <option value="nodejs">Node.js</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Time Limit (seconds) *</label>
                      <input
                        type="number"
                        name="timeLimit"
                        value={questionForm.timeLimit}
                        onChange={handleQuestionChange}
                        required
                        min="1"
                        max="30"
                        style={{ 
                          color: '#000000', 
                          backgroundColor: '#ffffff', 
                          fontWeight: '600',
                          WebkitTextFillColor: '#000000'
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Memory Limit (MB) *</label>
                      <input
                        type="number"
                        name="memoryLimit"
                        value={questionForm.memoryLimit}
                        onChange={handleQuestionChange}
                        required
                        min="64"
                        max="512"
                        step="64"
                        style={{ 
                          color: '#000000', 
                          backgroundColor: '#ffffff', 
                          fontWeight: '600',
                          WebkitTextFillColor: '#000000'
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Starter Code (Optional)</label>
                    <textarea
                      name="starterCode"
                      value={questionForm.starterCode}
                      onChange={handleQuestionChange}
                      rows="4"
                      placeholder="Enter starter code template..."
                      style={{ 
                        color: '#000000', 
                        backgroundColor: '#ffffff', 
                        fontWeight: '600',
                        WebkitTextFillColor: '#000000',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  <div className="test-cases-section">
                    <h4>Test Cases</h4>
                    
                    {questionForm.testCases && questionForm.testCases.length > 0 && (
                      <div className="test-cases-list">
                        {questionForm.testCases.map((tc, index) => (
                          <div key={index} className="test-case-item">
                            <div className="test-case-header">
                              <span>Test Case {index + 1}</span>
                              <span className={tc.isVisible ? 'badge-visible' : 'badge-hidden'}>
                                {tc.isVisible ? 'Visible' : 'Hidden'}
                              </span>
                              <button 
                                type="button" 
                                className="btn-remove-small"
                                onClick={() => handleRemoveTestCase(index)}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                            <div className="test-case-content">
                              <div><strong>Input:</strong> {tc.input}</div>
                              <div><strong>Output:</strong> {tc.expectedOutput}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="add-test-case">
                      <h5>Add Test Case</h5>
                      <div className="form-group">
                        <label>Input *</label>
                        <textarea
                          name="input"
                          value={newTestCase.input}
                          onChange={handleTestCaseChange}
                          rows="2"
                          placeholder="Enter test input..."
                          style={{ 
                            color: '#000000', 
                            backgroundColor: '#ffffff', 
                            fontWeight: '600',
                            WebkitTextFillColor: '#000000',
                            fontFamily: 'monospace'
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Expected Output *</label>
                        <textarea
                          name="expectedOutput"
                          value={newTestCase.expectedOutput}
                          onChange={handleTestCaseChange}
                          rows="2"
                          placeholder="Enter expected output..."
                          style={{ 
                            color: '#000000', 
                            backgroundColor: '#ffffff', 
                            fontWeight: '600',
                            WebkitTextFillColor: '#000000',
                            fontFamily: 'monospace'
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            name="isVisible"
                            checked={newTestCase.isVisible}
                            onChange={handleTestCaseChange}
                          />
                          {' '}Visible to students
                        </label>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleAddTestCase}
                      >
                        <FiPlus /> Add Test Case
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowQuestionModal(false); setEditingQuestion(null); resetQuestionForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingQuestion ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Existing Questions Modal */}
      {showAddQuestionModal && (
        <AddQuestionsModal
          questions={(allQuestions || []).filter(q => !(questions || []).find(eq => eq.id === q.id))}
          onAdd={handleAddExistingQuestions}
          onClose={() => setShowAddQuestionModal(false)}
        />
      )}
    </div>
  );
};

// Add Questions Modal Component
const AddQuestionsModal = ({ questions, onAdd, onClose }) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredQuestions = (questions || []).filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
    const matchesType = !filterType || q.questionType === filterType;
    return matchesSearch && matchesDifficulty && matchesType;
  });

  const handleToggle = (id) => {
    setSelectedQuestions(prev =>
      prev.includes(id) ? prev.filter(qid => qid !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question');
      return;
    }
    onAdd(selectedQuestions);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Existing Questions</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="filters-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 2 }}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">All Types</option>
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="True/False">True/False</option>
              <option value="Short Answer">Short Answer</option>
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="questions-select-list">
            {filteredQuestions.length === 0 ? (
              <p className="no-data">No questions available</p>
            ) : (
              filteredQuestions.map(question => (
                <div key={question.id} className="question-select-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleToggle(question.id)}
                    />
                    <div className="question-select-content">
                      <div className="question-select-text">{question.questionText}</div>
                      <div className="question-select-meta">
                        <span className="badge">{question.questionType}</span>
                        <span className="badge">{question.marks} marks</span>
                        <span className="badge">{question.difficulty}</span>
                      </div>
                    </div>
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Add {selectedQuestions.length} Question{selectedQuestions.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
