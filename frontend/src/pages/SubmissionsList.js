import React, { useState, useEffect } from 'react';
import { submissionAPI } from '../services/api';
import './ListPages.css';

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await submissionAPI.getAllSubmissions();
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Student Submissions</h1>
      {submissions.length === 0 ? (
        <p className="no-data">No submissions yet</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Exam</th>
              <th>Student</th>
              <th>Status</th>
              <th>Marks</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.exam?.title}</td>
                <td>
                  {submission.student?.firstName} {submission.student?.lastName}
                </td>
                <td>
                  <span className={`status ${submission.status.toLowerCase()}`}>
                    {submission.status}
                  </span>
                </td>
                <td>
                  {submission.obtainedMarks || '-'} / {submission.exam?.totalMarks}
                </td>
                <td>
                  {submission.submitTime
                    ? new Date(submission.submitTime).toLocaleString()
                    : '-'}
                </td>
                <td>
                  <button className="btn btn-small btn-secondary">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubmissionsList;
