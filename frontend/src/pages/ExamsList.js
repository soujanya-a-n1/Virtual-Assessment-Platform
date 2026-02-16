import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { examAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiClock, 
  FiFileText, 
  FiAward,
  FiCalendar,
  FiEye
} from 'react-icons/fi';
import './ExamsList.css';

const ExamsList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    totalQuestions: 10,
    totalMarks: 100,
    passingMarks: 40,
    examType: 'Online',
    status: 'Draft',
    startTime: '',
    endTime: '',
    requiresProctoring: true,
    shuffleQuestions: false,
    negativeMarkingEnabled: false,
    negativeMarks: 0
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examAPI.getAllExams();
      setExams(response.data.exams || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await examAPI.updateExam(currentExam.id, formData);
        alert('Exam updated successfully');
      } else {
        await examAPI.createExam(formData);
        alert('Exam created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchExams();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving exam');
    }
  };

  const handleEdit = (exam) => {
    setCurrentExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description || '',
      duration: exam.duration,
      totalQuestions: exam.totalQuestions,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      examType: exam.examType,
      status: exam.status,
      startTime: exam.startTime ? new Date(exam.startTime).toISOString().slice(0, 16) : '',
      endTime: exam.endTime ? new Date(exam.endTime).toISOString().slice(0, 16) : '',
      requiresProctoring: exam.requiresProctoring,
      shuffleQuestions: exam.shuffleQuestions,
      negativeMarkingEnabled: exam.negativeMarkingEnabled,
      negativeMarks: exam.negativeMarks || 0
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await examAPI.deleteExam(examId);
        setExams(exams.filter(e => e.id !== examId));
        alert('Exam deleted successfully');
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert(error.response?.data?.message || 'Failed to delete exam');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 60,
      totalQuestions: 10,
      totalMarks: 100,
      passingMarks: 40,
      examType: 'Online',
      status: 'Draft',
      startTime: '',
      endTime: '',
      requiresProctoring: true,
      shuffleQuestions: false,
      negativeMarkingEnabled: false,
      negativeMarks: 0
    });
    setEditMode(false);
    setCurrentExam(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'grey',
      'Published': 'blue',
      'Scheduled': 'orange',
      'Active': 'green',
      'Completed': 'purple'
    };
    return colors[status] || 'grey';
  };

  const filteredExams = exams.filter(exam => {
    if (filter === 'all') return true;
    return exam.status === filter;
  });

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canManageExams = ['Admin', 'Super Admin', 'Examiner'].includes(user?.role);

  if (loading) {
    return (
      <div className="exams-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exams-container">
      <div className="exams-header">
        <div>
          <h1>Exams Management</h1>
          <p className="subtitle">Create, manage, and monitor all exams</p>
        </div>
        {canManageExams && (
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FiPlus /> Create New Exam
          </button>
        )}
      </div>

      <div className="filter-bar">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({exams.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'Draft' ? 'active' : ''}`}
            onClick={() => setFilter('Draft')}
          >
            Draft ({exams.filter(e => e.status === 'Draft').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'Published' ? 'active' : ''}`}
            onClick={() => setFilter('Published')}
          >
            Published ({exams.filter(e => e.status === 'Published').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'Active' ? 'active' : ''}`}
            onClick={() => setFilter('Active')}
          >
            Active ({exams.filter(e => e.status === 'Active').length})
          </button>
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="no-exams">
          <FiFileText className="no-exams-icon" />
          <h3>No Exams Found</h3>
          <p>
            {filter === 'all' 
              ? 'Get started by creating your first exam' 
              : `No exams with status "${filter}"`}
          </p>
          {canManageExams && filter === 'all' && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <FiPlus /> Create Exam
            </button>
          )}
        </div>
      ) : (
        <div className="exams-grid">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <div className="exam-card-header">
                <h3>{exam.title}</h3>
                <span className={`status-badge ${getStatusColor(exam.status)}`}>
                  {exam.status}
                </span>
              </div>

              <p className="exam-description">{exam.description || 'No description'}</p>

              <div className="exam-details">
                <div className="detail-item">
                  <FiClock className="detail-icon" />
                  <span>{exam.duration} minutes</span>
                </div>
                <div className="detail-item">
                  <FiFileText className="detail-icon" />
                  <span>{exam.totalQuestions} questions</span>
                </div>
                <div className="detail-item">
                  <FiAward className="detail-icon" />
                  <span>{exam.totalMarks} marks</span>
                </div>
              </div>

              {exam.startTime && (
                <div className="exam-schedule">
                  <FiCalendar className="schedule-icon" />
                  <div>
                    <span className="schedule-label">Start:</span>
                    <span className="schedule-time">{formatDate(exam.startTime)}</span>
                  </div>
                </div>
              )}

              <div className="exam-card-footer">
                {user?.role === 'Student' ? (
                  <>
                    {exam.status === 'Published' || exam.status === 'Active' ? (
                      <button
                        className="action-btn take-exam-btn"
                        onClick={() => navigate(`/exams/${exam.id}/take`)}
                        title="Take exam"
                      >
                        <FiEye /> Take Exam
                      </button>
                    ) : (
                      <button
                        className="action-btn view-btn"
                        disabled
                        title="Exam not available"
                      >
                        <FiEye /> Not Available
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      className="action-btn view-btn"
                      onClick={() => navigate(`/exams/${exam.id}`)}
                      title="View exam"
                    >
                      <FiEye /> View
                    </button>
                    {canManageExams && (
                      <>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(exam)}
                          title="Edit exam"
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(exam.id)}
                          title="Delete exam"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Exam' : 'Create New Exam'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter exam title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter exam description"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Total Questions *</label>
                  <input
                    type="number"
                    name="totalQuestions"
                    value={formData.totalQuestions}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Marks *</label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Passing Marks *</label>
                  <input
                    type="number"
                    name="passingMarks"
                    value={formData.passingMarks}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Exam Type</label>
                  <select name="examType" value={formData.examType} onChange={handleInputChange}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="requiresProctoring"
                    checked={formData.requiresProctoring}
                    onChange={handleInputChange}
                  />
                  Requires Proctoring
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="shuffleQuestions"
                    checked={formData.shuffleQuestions}
                    onChange={handleInputChange}
                  />
                  Shuffle Questions
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="negativeMarkingEnabled"
                    checked={formData.negativeMarkingEnabled}
                    onChange={handleInputChange}
                  />
                  Negative Marking
                </label>
              </div>
              {formData.negativeMarkingEnabled && (
                <div className="form-group">
                  <label>Negative Marks</label>
                  <input
                    type="number"
                    name="negativeMarks"
                    value={formData.negativeMarks}
                    onChange={handleInputChange}
                    step="0.25"
                    min="0"
                  />
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Update Exam' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsList;
