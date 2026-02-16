import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  FiArrowLeft, 
  FiUser, 
  FiClock, 
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiSave
} from 'react-icons/fi';
import './SubmissionReview.css';

const SubmissionReview = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluationNotes, setEvaluationNotes] = useState('');

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`/submissions/${submissionId}`);
      setSubmission(response.data.submission);
      setEvaluationNotes(response.data.submission.evaluationNotes || '');
    } catch (error) {
      console.error('Error fetching submission:', error);
      alert('Failed to load submission');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!window.confirm('Are you sure you want to submit this evaluation?')) {
      return;
    }

    try {
      setSaving(true);
      await api.post(`/submissions/${submissionId}/evaluate`, {
        evaluationNotes
      });
      alert('Evaluation saved successfully!');
      navigate('/submissions');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save evaluation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="review-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="review-container">
        <div className="error-message">
          <h2>Submission not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/submissions')}>
            Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  const calculatePercentage = () => {
    if (!submission.obtainedMarks || !submission.exam?.totalMarks) return 0;
    return ((submission.obtainedMarks / submission.exam.totalMarks) * 100).toFixed(2);
  };

  const isPassed = () => {
    return submission.obtainedMarks >= submission.exam?.passingMarks;
  };

  return (
    <div className="review-container">
      <div className="review-header">
        <button className="btn-back" onClick={() => navigate('/submissions')}>
          <FiArrowLeft /> Back to Submissions
        </button>
        <h1>Review Submission</h1>
      </div>

      {/* Submission Info */}
      <div className="submission-info-card">
        <div className="info-grid">
          <div className="info-item">
            <FiFileText className="info-icon" />
            <div>
              <span className="info-label">Exam</span>
              <span className="info-value">{submission.exam?.title}</span>
            </div>
          </div>

          <div className="info-item">
            <FiUser className="info-icon" />
            <div>
              <span className="info-label">Student</span>
              <span className="info-value">
                {submission.student?.user?.firstName} {submission.student?.user?.lastName}
              </span>
            </div>
          </div>

          <div className="info-item">
            <FiClock className="info-icon" />
            <div>
              <span className="info-label">Submitted</span>
              <span className="info-value">
                {submission.submitTime 
                  ? new Date(submission.submitTime).toLocaleString()
                  : 'Not submitted'}
              </span>
            </div>
          </div>

          <div className="info-item">
            <FiAward className="info-icon" />
            <div>
              <span className="info-label">Score</span>
              <span className="info-value">
                {submission.obtainedMarks !== null && submission.obtainedMarks !== undefined
                  ? `${submission.obtainedMarks} / ${submission.exam?.totalMarks} (${calculatePercentage()}%)`
                  : 'Not evaluated'}
              </span>
            </div>
          </div>
        </div>

        {submission.obtainedMarks !== null && submission.obtainedMarks !== undefined && (
          <div className="result-badge-container">
            <div className={`result-badge ${isPassed() ? 'passed' : 'failed'}`}>
              {isPassed() ? (
                <>
                  <FiCheckCircle /> PASSED
                </>
              ) : (
                <>
                  <FiXCircle /> FAILED
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Student Answers */}
      <div className="answers-section">
        <h2>Student Answers</h2>
        
        {submission.studentAnswers && submission.studentAnswers.length > 0 ? (
          <div className="answers-list">
            {submission.studentAnswers.map((answer, index) => (
              <div key={answer.id} className="answer-card">
                <div className="answer-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className="answer-marks">
                    {answer.marksObtained !== null && answer.marksObtained !== undefined
                      ? `${answer.marksObtained} / ${answer.question?.marks || 0} marks`
                      : `${answer.question?.marks || 0} marks`}
                  </span>
                </div>

                <div className="question-text">
                  {answer.question?.questionText}
                </div>

                {answer.question?.questionType === 'Multiple Choice' && (
                  <div className="options-display">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const optionText = answer.question[`option${opt}`];
                      if (!optionText) return null;
                      
                      const isCorrect = answer.question.correctAnswer === opt;
                      const isSelected = answer.selectedAnswer === opt;
                      
                      return (
                        <div 
                          key={opt} 
                          className={`option-item ${isCorrect ? 'correct' : ''} ${isSelected ? 'selected' : ''}`}
                        >
                          <span className="option-letter">{opt}</span>
                          <span className="option-text">{optionText}</span>
                          {isCorrect && <FiCheckCircle className="correct-icon" />}
                          {isSelected && !isCorrect && <FiXCircle className="wrong-icon" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {answer.question?.questionType === 'True/False' && (
                  <div className="answer-display">
                    <div className="answer-row">
                      <span className="answer-label">Student Answer:</span>
                      <span className={`answer-value ${answer.selectedAnswer === answer.question.correctAnswer ? 'correct' : 'wrong'}`}>
                        {answer.selectedAnswer === 'A' ? 'True' : 'False'}
                      </span>
                    </div>
                    <div className="answer-row">
                      <span className="answer-label">Correct Answer:</span>
                      <span className="answer-value correct">
                        {answer.question.correctAnswer === 'A' ? 'True' : 'False'}
                      </span>
                    </div>
                  </div>
                )}

                {answer.question?.questionType === 'Short Answer' && (
                  <div className="answer-display">
                    <div className="answer-row">
                      <span className="answer-label">Student Answer:</span>
                      <div className="text-answer">
                        {answer.textAnswer || 'No answer provided'}
                      </div>
                    </div>
                    <div className="answer-row">
                      <span className="answer-label">Model Answer:</span>
                      <div className="text-answer model">
                        {answer.question.correctAnswer}
                      </div>
                    </div>
                  </div>
                )}

                {answer.question?.explanation && (
                  <div className="explanation">
                    <strong>Explanation:</strong> {answer.question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-answers">
            <p>No answers submitted</p>
          </div>
        )}
      </div>

      {/* Evaluation Notes */}
      <div className="evaluation-section">
        <h2>Evaluation Notes</h2>
        <textarea
          className="evaluation-textarea"
          value={evaluationNotes}
          onChange={(e) => setEvaluationNotes(e.target.value)}
          placeholder="Add evaluation notes, feedback, or comments for the student..."
          rows="6"
        />
        <button 
          className="btn-save-evaluation"
          onClick={handleEvaluate}
          disabled={saving}
        >
          <FiSave /> {saving ? 'Saving...' : 'Save Evaluation'}
        </button>
      </div>
    </div>
  );
};

export default SubmissionReview;
