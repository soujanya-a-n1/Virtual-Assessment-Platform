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
  FiEdit2,
  FiList,
  FiCheckCircle
} from 'react-icons/fi';
import './ExamPage.css';

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

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
  });

  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Medium',
    topic: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (examId && examId !== 'create') {
      fetchExam();
      fetchExamQuestions();
    }
    fetchAllQuestions();
  }, [examId]);

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
      });
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

  const fetchAllQuestions = async () => {
    try {
      const response = await api.get('/questions');
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
        totalQuestions: questions.length,
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/questions', questionForm);
      const newQuestion = response.data.question;
      
      if (examId && examId !== 'create') {
        await api.post(`/questions/${examId}/add-questions`, { questionIds: [newQuestion.id] });
        fetchExamQuestions();
      }
      
      alert('Question created successfully!');
      setShowQuestionModal(false);
      resetQuestionForm();
      fetchAllQuestions();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create question');
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

  const resetQuestionForm = () => {
    setQuestionForm({
      questionText: '',
      questionType: 'Multiple Choice',
      marks: 1,
      difficulty: 'Medium',
      topic: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      explanation: '',
    });
    setEditingQuestion(null);
  };

  const calculateTotalMarks = () => {
    return questions.reduce((sum, q) => sum + parseFloat(q.marks || 0), 0);
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
            <FiList /> Questions ({questions.length})
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
                  <h3>{questions.length}</h3>
                  <p>Total Questions</p>
                </div>
              </div>
              <div className="stat-card">
                <FiAward className="stat-icon" />
                <div>
                  <h3>{calculateTotalMarks()}</h3>
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

          {questions.length === 0 ? (
            <div className="no-questions">
              <FiFileText className="no-questions-icon" />
              <h3>No Questions Added</h3>
              <p>Start by creating a new question or adding existing questions to this exam</p>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((question, index) => (
                <div key={question.id} className="question-card">
                  <div className="question-card-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className="question-type">{question.questionType}</span>
                    <span className="question-marks">{question.marks} marks</span>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleRemoveQuestion(question.id)}
                      title="Remove question"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="question-text">{question.questionText}</div>
                  {question.questionType === 'Multiple Choice' && (
                    <div className="question-options">
                      {['A', 'B', 'C', 'D'].map(opt => {
                        const optionText = question[`option${opt}`];
                        if (!optionText) return null;
                        return (
                          <div key={opt} className={`option ${question.correctAnswer === opt ? 'correct' : ''}`}>
                            <span className="option-letter">{opt}</span>
                            <span>{optionText}</span>
                            {question.correctAnswer === opt && <FiCheckCircle className="correct-icon" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {question.questionType === 'True/False' && (
                    <div className="question-answer">
                      <strong>Correct Answer:</strong> {question.correctAnswer === 'A' ? 'True' : 'False'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Question Modal */}
      {showQuestionModal && (
        <div className="modal-overlay" onClick={() => setShowQuestionModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Question</h2>
              <button className="close-btn" onClick={() => setShowQuestionModal(false)}>×</button>
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
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Question Type *</label>
                  <select
                    name="questionType"
                    value={questionForm.questionType}
                    onChange={handleQuestionChange}
                    required
                  >
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="True/False">True/False</option>
                    <option value="Short Answer">Short Answer</option>
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
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    name="difficulty"
                    value={questionForm.difficulty}
                    onChange={handleQuestionChange}
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
                    />
                  </div>
                  <div className="form-group">
                    <label>Option C</label>
                    <input
                      type="text"
                      name="optionC"
                      value={questionForm.optionC}
                      onChange={handleQuestionChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Option D</label>
                    <input
                      type="text"
                      name="optionD"
                      value={questionForm.optionD}
                      onChange={handleQuestionChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Correct Answer *</label>
                    <select
                      name="correctAnswer"
                      value={questionForm.correctAnswer}
                      onChange={handleQuestionChange}
                      required
                    >
                      <option value="">Select correct answer</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      {questionForm.optionC && <option value="C">C</option>}
                      {questionForm.optionD && <option value="D">D</option>}
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
                  />
                </div>
              )}

              <div className="form-group">
                <label>Explanation (Optional)</label>
                <textarea
                  name="explanation"
                  value={questionForm.explanation}
                  onChange={handleQuestionChange}
                  rows="2"
                  placeholder="Explain the correct answer"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowQuestionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Existing Questions Modal */}
      {showAddQuestionModal && (
        <AddQuestionsModal
          questions={allQuestions.filter(q => !questions.find(eq => eq.id === q.id))}
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

  const filteredQuestions = questions.filter(q =>
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <input
            type="text"
            className="search-input"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
