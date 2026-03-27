import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  FiBook,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiTrendingUp,
  FiFileText,
  FiClock
} from 'react-icons/fi';
import './Analytics.css';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      // If student, fetch their personal analytics
      if (user?.role === 'Student') {
        const response = await api.get(`/analytics/students/${user.id}`);
        setAnalytics(response.data.studentAnalytics || response.data);
      } else {
        // Admin/Examiner: fetch platform analytics
        const response = await api.get('/analytics');
        setAnalytics(response.data.analytics || response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set default data if API fails
      setAnalytics({
        totalExams: 0,
        totalSubmissions: 0,
        totalStudents: 0,
        totalQuestions: 0,
        passedCount: 0,
        failedCount: 0,
        averageScore: 0,
        passPercentage: 0,
        recentSubmissions: [],
        submissions: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Student View - Show personal analytics
  if (user?.role === 'Student') {
    const totalExamsTaken = analytics.totalExamsTaken || 0;
    const passedCount = analytics.passedCount || 0;
    const failedCount = analytics.failedCount || 0;
    const passPercentage = totalExamsTaken > 0
      ? ((passedCount / totalExamsTaken) * 100).toFixed(1)
      : 0;
    const failPercentage = totalExamsTaken > 0
      ? ((failedCount / totalExamsTaken) * 100).toFixed(1)
      : 0;

    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <div>
            <h1>My Performance</h1>
            <p className="subtitle">Your exam history and statistics</p>
          </div>
        </div>

        {/* Student Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FiBook />
            </div>
            <div className="stat-content">
              <h3>{totalExamsTaken}</h3>
              <p>Exams Taken</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FiCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{passedCount}</h3>
              <p>Passed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <FiXCircle />
            </div>
            <div className="stat-content">
              <h3>{failedCount}</h3>
              <p>Failed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>{analytics.averageScore || 0}%</h3>
              <p>Average Score</p>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="performance-section">
          <h2>Performance Overview</h2>
          
          <div className="performance-grid">
            <div className="performance-card">
              <div className="performance-header">
                <FiTrendingUp className="performance-icon" />
                <h3>Average Score</h3>
              </div>
              <div className="performance-value">
                {analytics.averageScore || 0}%
              </div>
              <div className="performance-bar">
                <div 
                  className="performance-fill"
                  style={{ width: `${analytics.averageScore || 0}%` }}
                />
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-header">
                <FiCheckCircle className="performance-icon green" />
                <h3>Pass Rate</h3>
              </div>
              <div className="performance-value green">
                {passPercentage}%
              </div>
              <div className="performance-bar">
                <div 
                  className="performance-fill green"
                  style={{ width: `${passPercentage}%` }}
                />
              </div>
              <p className="performance-detail">
                {passedCount} exams passed
              </p>
            </div>

            <div className="performance-card">
              <div className="performance-header">
                <FiXCircle className="performance-icon red" />
                <h3>Fail Rate</h3>
              </div>
              <div className="performance-value red">
                {failPercentage}%
              </div>
              <div className="performance-bar">
                <div 
                  className="performance-fill red"
                  style={{ width: `${failPercentage}%` }}
                />
              </div>
              <p className="performance-detail">
                {failedCount} exams failed
              </p>
            </div>
          </div>
        </div>

        {/* Exam History */}
        {analytics.submissions && analytics.submissions.length > 0 ? (
          <div className="recent-activity-section">
            <h2>Exam History</h2>
            
            <div className="activity-list">
              {analytics.submissions.map((submission, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {submission.isPassed ? (
                      <FiCheckCircle className="icon-green" />
                    ) : (
                      <FiXCircle className="icon-red" />
                    )}
                  </div>
                  <div className="activity-content">
                    <h4>{submission.examTitle}</h4>
                    <p>{new Date(submission.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="activity-score">
                    <span className={submission.isPassed ? 'score-green' : 'score-red'}>
                      {submission.obtainedMarks || 0} / {submission.totalMarks || 0}
                    </span>
                  </div>
                  <div className="activity-percentage">
                    <span className={submission.isPassed ? 'score-green' : 'score-red'}>
                      {((submission.obtainedMarks / submission.totalMarks) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-data-message">
            <FiFileText className="no-data-icon" />
            <h3>No Exam History</h3>
            <p>Your exam results will appear here once you complete exams</p>
          </div>
        )}
      </div>
    );
  }

  // Admin/Examiner View - Show platform analytics

  const passPercentage = analytics.totalSubmissions > 0
    ? ((analytics.passedCount / analytics.totalSubmissions) * 100).toFixed(1)
    : 0;

  const failPercentage = analytics.totalSubmissions > 0
    ? ((analytics.failedCount / analytics.totalSubmissions) * 100).toFixed(1)
    : 0;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1>Platform Analytics</h1>
          <p className="subtitle">Overview of exam performance and statistics</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiBook />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalExams || 0}</h3>
            <p>Total Exams</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FiFileText />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalSubmissions || 0}</h3>
            <p>Total Submissions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalStudents || 0}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FiAward />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalQuestions || 0}</h3>
            <p>Total Questions</p>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="performance-section">
        <h2>Performance Overview</h2>
        
        <div className="performance-grid">
          <div className="performance-card">
            <div className="performance-header">
              <FiTrendingUp className="performance-icon" />
              <h3>Average Score</h3>
            </div>
            <div className="performance-value">
              {analytics.averageScore ? parseFloat(analytics.averageScore).toFixed(1) : '0'}%
            </div>
            <div className="performance-bar">
              <div 
                className="performance-fill"
                style={{ width: `${analytics.averageScore || 0}%` }}
              />
            </div>
          </div>

          <div className="performance-card">
            <div className="performance-header">
              <FiCheckCircle className="performance-icon green" />
              <h3>Pass Rate</h3>
            </div>
            <div className="performance-value green">
              {passPercentage}%
            </div>
            <div className="performance-bar">
              <div 
                className="performance-fill green"
                style={{ width: `${passPercentage}%` }}
              />
            </div>
            <p className="performance-detail">
              {analytics.passedCount || 0} students passed
            </p>
          </div>

          <div className="performance-card">
            <div className="performance-header">
              <FiXCircle className="performance-icon red" />
              <h3>Fail Rate</h3>
            </div>
            <div className="performance-value red">
              {failPercentage}%
            </div>
            <div className="performance-bar">
              <div 
                className="performance-fill red"
                style={{ width: `${failPercentage}%` }}
              />
            </div>
            <p className="performance-detail">
              {analytics.failedCount || 0} students failed
            </p>
          </div>
        </div>
      </div>

      {/* Pass/Fail Distribution */}
      <div className="distribution-section">
        <h2>Pass/Fail Distribution</h2>
        
        <div className="distribution-chart">
          <div className="distribution-bars">
            <div className="distribution-bar-container">
              <div className="distribution-label">
                <FiCheckCircle className="label-icon green" />
                <span>Passed</span>
              </div>
              <div className="distribution-bar">
                <div 
                  className="distribution-fill green"
                  style={{ width: `${passPercentage}%` }}
                >
                  <span className="bar-label">{analytics.passedCount || 0}</span>
                </div>
              </div>
              <span className="distribution-percentage">{passPercentage}%</span>
            </div>

            <div className="distribution-bar-container">
              <div className="distribution-label">
                <FiXCircle className="label-icon red" />
                <span>Failed</span>
              </div>
              <div className="distribution-bar">
                <div 
                  className="distribution-fill red"
                  style={{ width: `${failPercentage}%` }}
                >
                  <span className="bar-label">{analytics.failedCount || 0}</span>
                </div>
              </div>
              <span className="distribution-percentage">{failPercentage}%</span>
            </div>
          </div>

          <div className="distribution-summary">
            <div className="summary-item">
              <div className="summary-icon green">
                <FiCheckCircle />
              </div>
              <div>
                <h4>{analytics.passedCount || 0}</h4>
                <p>Students Passed</p>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon red">
                <FiXCircle />
              </div>
              <div>
                <h4>{analytics.failedCount || 0}</h4>
                <p>Students Failed</p>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon blue">
                <FiFileText />
              </div>
              <div>
                <h4>{analytics.totalSubmissions || 0}</h4>
                <p>Total Submissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {analytics.recentSubmissions && analytics.recentSubmissions.length > 0 && (
        <div className="recent-activity-section">
          <h2>Recent Submissions</h2>
          
          <div className="activity-list">
            {analytics.recentSubmissions.slice(0, 5).map((submission, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {submission.isPassed ? (
                    <FiCheckCircle className="icon-green" />
                  ) : (
                    <FiXCircle className="icon-red" />
                  )}
                </div>
                <div className="activity-content">
                  <h4>{submission.studentName || 'Student'}</h4>
                  <p>{submission.examTitle || 'Exam'}</p>
                </div>
                <div className="activity-score">
                  <span className={submission.isPassed ? 'score-green' : 'score-red'}>
                    {submission.obtainedMarks || 0} / {submission.totalMarks || 0}
                  </span>
                </div>
                <div className="activity-time">
                  <FiClock />
                  <span>{submission.timeAgo || 'Recently'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data Message */}
      {analytics.totalSubmissions === 0 && (
        <div className="no-data-message">
          <FiFileText className="no-data-icon" />
          <h3>No Data Available</h3>
          <p>Analytics will appear here once students start taking exams</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
