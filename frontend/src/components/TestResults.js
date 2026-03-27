import React from 'react';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import './TestResults.css';

const TestResults = ({ results, marks, totalMarks, status }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const percentage = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  return (
    <div className="test-results-container">
      <div className="results-header">
        <h3>Test Results</h3>
        {status === 'Graded' && (
          <div className="marks-display">
            <span className="marks-obtained">{marks}</span>
            <span className="marks-separator">/</span>
            <span className="marks-total">{totalMarks}</span>
            <span className="marks-label">marks</span>
          </div>
        )}
      </div>

      <div className="results-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Tests:</span>
            <span className="stat-value">{totalCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Passed:</span>
            <span className="stat-value passed">{passedCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Failed:</span>
            <span className="stat-value failed">{totalCount - passedCount}</span>
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="progress-text">{percentage}% passed</span>
        </div>
      </div>

      <div className="test-cases-list">
        {results.map((result, index) => (
          <div 
            key={result.id || index} 
            className={`test-case ${result.passed ? 'passed' : 'failed'}`}
          >
            <div className="test-case-header">
              <div className="test-case-title">
                {result.passed ? (
                  <FiCheckCircle className="icon-passed" />
                ) : (
                  <FiXCircle className="icon-failed" />
                )}
                <span>Test Case {index + 1}</span>
              </div>
              {result.executionTime && (
                <div className="execution-time">
                  <FiClock className="clock-icon" />
                  <span>{result.executionTime}ms</span>
                </div>
              )}
            </div>

            {!result.passed && (
              <div className="test-case-details">
                {result.input && (
                  <div className="detail-section">
                    <h4>Input:</h4>
                    <pre>{result.input}</pre>
                  </div>
                )}
                
                <div className="output-comparison">
                  <div className="detail-section expected">
                    <h4>Expected Output:</h4>
                    <pre>{result.expectedOutput}</pre>
                  </div>
                  
                  <div className="detail-section actual">
                    <h4>Your Output:</h4>
                    <pre>{result.actualOutput || '(no output)'}</pre>
                  </div>
                </div>

                {result.errorMessage && (
                  <div className="detail-section error">
                    <h4>Error:</h4>
                    <pre>{result.errorMessage}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
