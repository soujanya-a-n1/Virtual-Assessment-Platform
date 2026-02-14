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
            onClick={() => navigate('/exams/create')}
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
              onClick={() => navigate('/exams/create')}
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
                      onClick={() => navigate(`/exams/${exam.id}/edit`)}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamsList;
