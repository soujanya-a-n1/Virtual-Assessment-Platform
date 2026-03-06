import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  FiEye, 
  FiCheckCircle, 
  FiClock, 
  FiUser, 
  FiFileText,
  FiAward,
  FiFilter
} from 'react-icons/fi';
import './SubmissionsList.css';

const SubmissionsList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/submissions');
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (submissionId) => {
    navigate(`/submissions/${submissionId}/review`);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'blue',
      'In Progress': 'orange',
      'Evaluated': 'green',
      'Pending': 'yellow'
    };
    return colors[status] || 'grey';
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesFilter = filter === 'all' || submission.status === filter;
    const matchesSearch = 
      submission.exam?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.student?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.student?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="submissions-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        <div>
          <h1>Student Submissions</h1>
          <p className="subtitle">Review and evaluate student exam submissions</p>
        </div>
      </div>

      <div className="submissions-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by exam or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({submissions.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'Submitted' ? 'active' : ''}`}
            onClick={() => setFilter('Submitted')}
          >
            Submitted ({submissions.filter(s => s.status === 'Submitted').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'Evaluated' ? 'active' : ''}`}
            onClick={() => setFilter('Evaluated')}
          >
            Evaluated ({submissions.filter(s => s.status === 'Evaluated').length})
          </button>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="no-submissions">
          <FiFileText className="no-submissions-icon" />
          <h3>No Submissions Found</h3>
          <p>
            {filter === 'all' 
              ? 'No student submissions yet' 
              : `No submissions with status "${filter}"`}
          </p>
        </div>
      ) : (
        <div className="submissions-grid">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="submission-card">
              <div className="submission-card-header">
                <div className="submission-exam">
                  <FiFileText className="exam-icon" />
                  <h3>{submission.exam?.title || 'Unknown Exam'}</h3>
                </div>
                <span className={`status-badge ${getStatusColor(submission.status)}`}>
                  {submission.status}
                </span>
              </div>

              <div className="submission-details">
                <div className="detail-row">
                  <FiUser className="detail-icon" />
                  <div>
                    <span className="detail-label">Student</span>
                    <span className="detail-value">
                      {submission.student?.user?.firstName} {submission.student?.user?.lastName}
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <FiClock className="detail-icon" />
                  <div>
                    <span className="detail-label">Submitted</span>
                    <span className="detail-value">
                      {submission.submitTime
                        ? new Date(submission.submitTime).toLocaleString()
                        : 'Not submitted'}
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <FiAward className="detail-icon" />
                  <div>
                    <span className="detail-label">Score</span>
                    <span className="detail-value">
                      {submission.obtainedMarks !== null && submission.obtainedMarks !== undefined
                        ? `${submission.obtainedMarks} / ${submission.exam?.totalMarks || 0}`
                        : 'Not evaluated'}
                    </span>
                  </div>
                </div>

                {submission.obtainedMarks !== null && submission.obtainedMarks !== undefined && (
                  <div className="score-bar">
                    <div 
                      className="score-fill"
                      style={{ 
                        width: `${(submission.obtainedMarks / (submission.exam?.totalMarks || 1)) * 100}%`,
                        backgroundColor: 
                          (submission.obtainedMarks / (submission.exam?.totalMarks || 1)) >= 0.4 
                            ? '#27ae60' 
                            : '#e74c3c'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="submission-card-footer">
                <button
                  className="btn-review"
                  onClick={() => handleReview(submission.id)}
                >
                  <FiEye /> Review Submission
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionsList;
