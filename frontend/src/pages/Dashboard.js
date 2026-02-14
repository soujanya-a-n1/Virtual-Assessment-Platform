import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import {
  FiUsers,
  FiBook,
  FiCheckSquare,
  FiTrendingUp,
  FiAward,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiCalendar,
  FiClock,
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (user?.role !== 'Student') {
      fetchAnalytics();
    } else {
      setLoading(false);
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, <span className="user-name">{user?.firstName}!</span>
            </h1>
            <p className="welcome-subtitle">
              {user?.role === 'Student'
                ? '🎓 Ready to ace your next exam?'
                : '📊 Here\'s your platform overview'}
            </p>
          </div>
          <div className="time-widget">
            <div className="time-display">
              <FiClock className="time-icon" />
              <span className="time-text">{formatTime(currentTime)}</span>
            </div>
            <div className="date-display">
              <FiCalendar className="date-icon" />
              <span className="date-text">{formatDate(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {user?.role !== 'Student' && analytics && (
        <div className="stats-section">
          <h2 className="section-title">Platform Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card orange">
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <FiUsers className="stat-icon" />
                </div>
                <div className="stat-content">
                  <p className="stat-value">{analytics.totalUsers || 0}</p>
                  <p className="stat-label">Total Users</p>
                </div>
                <div className="stat-decoration"></div>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <FiBook className="stat-icon" />
                </div>
                <div className="stat-content">
                  <p className="stat-value">{analytics.totalExams || 0}</p>
                  <p className="stat-label">Total Exams</p>
                </div>
                <div className="stat-decoration"></div>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <FiCheckSquare className="stat-icon" />
                </div>
                <div className="stat-content">
                  <p className="stat-value">{analytics.totalSubmissions || 0}</p>
                  <p className="stat-label">Submissions</p>
                </div>
                <div className="stat-decoration"></div>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <FiTrendingUp className="stat-icon" />
                </div>
                <div className="stat-content">
                  <p className="stat-value">{analytics.passPercentage || 0}%</p>
                  <p className="stat-label">Pass Rate</p>
                </div>
                <div className="stat-decoration"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="quick-access-section">
        <h2 className="section-title">Quick Access</h2>
        <div className="quick-links-grid">
          <Link to="/exams" className="quick-link-card exams">
            <div className="quick-link-icon">
              <FiBook />
            </div>
            <div className="quick-link-content">
              <h3>Exams</h3>
              <p>View and manage exams</p>
            </div>
            <div className="quick-link-arrow">→</div>
          </Link>

          <Link to="/submissions" className="quick-link-card submissions">
            <div className="quick-link-icon">
              <FiCheckSquare />
            </div>
            <div className="quick-link-content">
              <h3>{user?.role === 'Student' ? 'My Results' : 'Submissions'}</h3>
              <p>Check exam results</p>
            </div>
            <div className="quick-link-arrow">→</div>
          </Link>

          <Link to="/analytics" className="quick-link-card analytics">
            <div className="quick-link-icon">
              <FiBarChart2 />
            </div>
            <div className="quick-link-content">
              <h3>Analytics</h3>
              <p>View detailed reports</p>
            </div>
            <div className="quick-link-arrow">→</div>
          </Link>

          {user?.role !== 'Student' && (
            <>
              <Link to="/users" className="quick-link-card users">
                <div className="quick-link-icon">
                  <FiUsers />
                </div>
                <div className="quick-link-content">
                  <h3>Users</h3>
                  <p>Manage system users</p>
                </div>
                <div className="quick-link-arrow">→</div>
              </Link>

              <Link to="/students" className="quick-link-card students">
                <div className="quick-link-icon">
                  <FiAward />
                </div>
                <div className="quick-link-content">
                  <h3>Students</h3>
                  <p>Student management</p>
                </div>
                <div className="quick-link-arrow">→</div>
              </Link>

              <Link to="/courses" className="quick-link-card courses">
                <div className="quick-link-icon">
                  <FiFileText />
                </div>
                <div className="quick-link-content">
                  <h3>Courses</h3>
                  <p>Course catalog</p>
                </div>
                <div className="quick-link-arrow">→</div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
