import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

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

  if (loading) return <div className="container">Loading analytics...</div>;
  if (!analytics) return <div className="container">No data available</div>;

  const passFailData = [
    { name: 'Passed', value: analytics.passedCount },
    { name: 'Failed', value: analytics.failedCount },
  ];

  const performanceData = [
    {
      name: 'Performance',
      'Average Score': parseFloat(analytics.averageScore),
      'Passing Marks': 50,
    },
  ];

  return (
    <div className="analytics-container">
      <h1>Platform Analytics</h1>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>{analytics.totalExams}</h3>
          <p>Total Exams</p>
        </div>
        <div className="stat-box">
          <h3>{analytics.totalSubmissions}</h3>
          <p>Total Submissions</p>
        </div>
        <div className="stat-box">
          <h3>{analytics.passPercentage}%</h3>
          <p>Pass Rate</p>
        </div>
        <div className="stat-box">
          <h3>{analytics.averageScore}</h3>
          <p>Average Score</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h3>Pass/Fail Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passFailData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#27ae60" />
                <Cell fill="#e74c3c" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Average Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Average Score" fill="#3498db" />
              <Bar dataKey="Passing Marks" fill="#f39c12" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
