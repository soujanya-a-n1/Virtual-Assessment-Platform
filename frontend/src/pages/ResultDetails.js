import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiAward } from 'react-icons/fi';
import './ResultDetails.css';

const ResultDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResultDetails();
  }, [submissionId]);

  const fetchResultDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/submissions/${submissionId}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching result details:', error);
    } finally {
      setLoading(false);
    }
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
    const secs = seconds % 60;
    return hours > 0 
      ? `${hours}h ${minutes}m ${secs}s` 
      : `${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading result details...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-container">
        <h2>Result not found</h2>
        <button onClick={() => navigate('/results')} className="btn-back">
          Go Back
        </button>
      </div>
    );
  }

  const { submission } = data || {};
  const answers = submission?.studentAnswers || [];
  
  if (!submission) {
    return (
      <div className="error-container">
        <h2>Result not found</h2>
        <button onClick={() => navigate('/results')} className="btn-back">
          Go Back
        </button>
      </div>
    );
  }

  const percentage = submission.exam?.totalMarks 
    ? ((submission.obtainedMarks / submission.exam.totalMarks) * 100).toFixed(1)
    : 0;

  const isPassed = submission.obtainedMarks >= (submission.exam?.passingMarks || 0);

  return (
    <div className="result-details-container">
      <button className="btn-back" onClick={() => navigate('/results')}>
        <FiArrowLeft /> Back to Results
      </button>

      <div className="result-summary-card">
        <div className="summary-header">
          <div>
            <h1>{submission.exam?.title}</h1>
            <p className="exam-description">{submission.exam?.description}</p>
          </div>
          {submission.obtainedMarks !== null && submission.obtainedMarks !== undefined && (
            <div className={`result-badge-large ${isPassed ? 'passed' : 'failed'}`}>
              {isPassed ? <FiAward /> : <FiXCircle />}
              {isPassed ? 'PASSED' : 'FAILED'}
            </div>
          )}
        </div>

        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">
              {submission.obtainedMarks} / {submission.exam?.totalMarks}
            </span>
            <span className="stat-percentage">{percentage}%</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Time Spent</span>
            <span className="stat-value">{formatDuration(submission.totalTimeSpent)}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Submitted</span>
            <span className="stat-value">{formatDate(submission.submitTime)}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Status</span>
            <span className={`stat-badge ${submission.status.toLowerCase().replace(' ', '-')}`}>
              {submission.status}
            </span>
          </div>
        </div>

        {submission.evaluationNotes && (
          <div className="evaluation-notes">
            <h3>Evaluator Notes</h3>
            <p>{submission.evaluationNotes}</p>
            {submission.evaluator && (
              <p className="evaluator-info">
                Evaluated by: {submission.evaluator.firstName} {submission.evaluator.lastName}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="answers-section">
        <h2>Question-wise Analysis</h2>
        
        {answers && answers.length > 0 ? (
          answers.map((answer, index) => (
          <div key={answer.id} className="answer-card">
            <div className="answer-header">
              <span className="question-number">Question {index + 1}</span>
              <div className="answer-status">
                {answer.isCorrect !== null && (
                  <>
                    {answer.isCorrect ? (
                      <span className="correct-badge">
                        <FiCheckCircle /> Correct
                      </span>
                    ) : (
                      <span className="incorrect-badge">
                        <FiXCircle /> Incorrect
                      </span>
                    )}
                    <span className="marks-badge">
                      {answer.marksObtained} / {answer.question?.marks} marks
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="question-content">
              <p className="question-text">{answer.question?.questionText}</p>

              {answer.question?.questionType === 'Multiple Choice' && (
                <div className="options-list">
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionText = answer.question[`option${option}`];
                    if (!optionText) return null;

                    const isStudentAnswer = answer.selectedAnswer === option;
                    const isCorrectAnswer = answer.question.correctAnswer === option;

                    return (
                      <div
                        key={option}
                        className={`option-item ${
                          isCorrectAnswer ? 'correct-option' : ''
                        } ${isStudentAnswer && !isCorrectAnswer ? 'wrong-option' : ''} ${
                          isStudentAnswer ? 'selected-option' : ''
                        }`}
                      >
                        <span className="option-label">{option}.</span>
                        <span className="option-text">{optionText}</span>
                        {isCorrectAnswer && <FiCheckCircle className="correct-icon" />}
                        {isStudentAnswer && !isCorrectAnswer && <FiXCircle className="wrong-icon" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {answer.question?.questionType !== 'Multiple Choice' && (
                <div className="text-answer">
                  <div className="answer-section">
                    <h4>Your Answer:</h4>
                    <p>{answer.textAnswer || answer.selectedAnswer || 'No answer provided'}</p>
                  </div>
                  {answer.question?.correctAnswer && (
                    <div className="answer-section">
                      <h4>Correct Answer:</h4>
                      <p>{answer.question.correctAnswer === 'A' && answer.question.questionType === 'True/False' ? 'True' : answer.question.correctAnswer === 'B' && answer.question.questionType === 'True/False' ? 'False' : answer.question.correctAnswer}</p>
                    </div>
                  )}
                </div>
              )}

              {answer.question?.explanation && (
                <div className="explanation-box">
                  <h4>Explanation:</h4>
                  <p>{answer.question.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ))
        ) : (
          <div className="no-answers">
            <p>No answers available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDetails;
