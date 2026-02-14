import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FiCheckCircle, FiXCircle, FiClock, FiAward, FiEye } from 'react-icons/fi';
import './Results.css';

const Results = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    evaluated: 0,
    pending: 0,
    passed: 0,
    failed: 0,
    avgScore: 0
  });

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const endpoint = user.role === 'Student' ? 'results/my-results' : 'results';
      const params = filter !== 'all' ? { status: filter } : {};
      
      const response = await api.get(endpoint, { params });
      setResults(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const evaluated = data.filter(r => r.status === 'Evaluated');
    const passed = evaluated.filter(r => r.isPassed);
    const failed = evaluated.filter(r => r.isPassed === false);
    const pending = data.filter(r => r.status === 'Submitted');
    
    const totalScore = evaluated.reduce((sum, r) => {
      const percentage = (r.obtainedMarks / r.exam?.totalMarks) * 100;
      return sum + percentage;
    }, 0);
    
    setStats({
      total: data.length,
      evaluated: evaluated.length,
      pending: pending.length,
      passed: passed.length,
      failed: failed.length,
      avgScore: evaluated.length > 0 ? (totalScore / evaluated.length).toFixed(1) : 0
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Evaluated': { icon: <FiCheckCircle />, class: 'evaluated', label: 'Evaluated' },
      'Submitted': { icon: <FiClock />, class: 'submitted', label: 'Pending' },
      'In Progress': { icon: <FiClock />, class: 'in-progress', label: 'In Progress' },
      'Not Started': { icon: <FiXCircle />, class: 'not-started', label: 'Not Started' },
    };
    
    const config = statusConfig[status] || statusConfig['Not Started'];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getResultBadge = (isPassed) => {
    if (isPassed === null || isPassed === undefined) return null;
    return isPassed ? (
      <span className="result-badge passed">
        <FiAward /> Passed
      </span>
    ) : (
      <span className="result-badge failed">
        <FiXCircle /> Failed
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const viewDetails = (submissionId) => {
    navigate(`/results/${submissionId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Exam Results</h1>
        <p className="subtitle">View your exam performance and scores</p>
      </div>

      <div className="stats-dashboard">
        <div className="stat-card-large orange">
          <div className="stat-icon-wrapper">
            <FiAward className="stat-icon" />
          </div>
          <div className="stat-content">
            <h2>{stats.total}</h2>
            <p>Total Exams</p>
          </div>
        </div>

        <div className="stat-card-large green">
          <div className="stat-icon-wrapper">
            <FiCheckCircle className="stat-icon" />
          </div>
          <div className="stat-content">
            <h2>{stats.evaluated}</h2>
            <p>Evaluated</p>
          </div>
        </div>

        <div className="stat-card-large blue">
          <div className="stat-icon-wrapper">
            <FiClock className="stat-icon" />
          </div>
          <div className="stat-content">
            <h2>{stats.pending}</h2>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card-large purple">
          <div className="stat-icon-wrapper">
            <FiAward className="stat-icon" />
          </div>
          <div className="stat-content">
            <h2>{stats.passed}</h2>
            <p>Passed</p>
          </div>
        </div>

        <div className="stat-card-large red">
          <div className="stat-icon-wrapper">
            <FiXCircle className="stat-icon" />
          </div>
          <div className="stat-content">
            <h2>{stats.failed}</h2>
            <p>Failed</p>
          </div>
        </div>

        <div className="stat-card-large teal">
          <div className="stat-icon-wrapper">
            <FiAward className="stat-icon" />
          </div>
          <div className="stat-content">
            <h2>{stats.avgScore}%</h2>
            <p>Average Score</p>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h2>All Results</h2>
        <div className="filter-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Results</option>
            <option value="Evaluated">Evaluated</option>
            <option value="Submitted">Pending Evaluation</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="no-results">
          <FiAward className="no-results-icon" />
          <h3>No Results Found</h3>
          <p>You haven't completed any exams yet.</p>
        </div>
      ) : (
        <div className="results-grid">
          {results.map((result) => (
            <div key={result.id} className="result-card">
              <div className="result-card-header">
                <h3>{result.exam?.title || 'Exam'}</h3>
                {getStatusBadge(result.status)}
              </div>

              <div className="result-card-body">
                {user.role !== 'Student' && (
                  <div className="result-info">
                    <span className="label">Student:</span>
                    <span className="value">
                      {result.user?.firstName} {result.user?.lastName}
                    </span>
                  </div>
                )}

                <div className="result-info">
                  <span className="label">Submitted:</span>
                  <span className="value">{formatDate(result.submitTime)}</span>
                </div>

                <div className="result-info">
                  <span className="label">Time Spent:</span>
                  <span className="value">{formatDuration(result.totalTimeSpent)}</span>
                </div>

                {result.status === 'Evaluated' && (
                  <>
                    <div className="result-score">
                      <div className="score-display">
                        <span className="score-value">{result.obtainedMarks}</span>
                        <span className="score-total">/ {result.exam?.totalMarks}</span>
                      </div>
                      <div className="score-percentage">
                        {((result.obtainedMarks / result.exam?.totalMarks) * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="result-status">
                      {getResultBadge(result.isPassed)}
                      <span className="passing-marks">
                        Passing: {result.exam?.passingMarks} marks
                      </span>
                    </div>
                  </>
                )}

                {result.cheatingDetected && (
                  <div className="warning-badge">
                    <FiXCircle /> Cheating Detected
                  </div>
                )}
              </div>

              <div className="result-card-footer">
                <button
                  className="btn-view-details"
                  onClick={() => viewDetails(result.id)}
                >
                  <FiEye /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
