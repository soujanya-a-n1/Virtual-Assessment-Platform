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
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data.analytics || response.data);
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
        recentSubmissions: []
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
