import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, submissionAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  FiClock, 
  FiSave, 
  FiSend, 
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import './TakeExam.css';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);

  useEffect(() => {
    startExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  const startExam = async () => {
    try {
      setLoading(true);
      const response = await submissionAPI.startExam(examId);
      const data = response.data.submission;
      
      setExam(data.exam);
      setQuestions(data.questions || []);
      setSubmission({ id: response.data.submission.id });
      setTimeRemaining(data.duration * 60); // Convert minutes to seconds
      
      // Initialize answers object
      const initialAnswers = {};
      (data.questions || []).forEach(q => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error starting exam:', error);
      alert(error.response?.data?.message || 'Failed to start exam');
      navigate('/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = async (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Auto-save answer
    try {
      setAutoSaving(true);
      await submissionAPI.autoSaveAnswer(submission.id, questionId, answer);
    } catch (error) {
      console.error('Error auto-saving answer:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit the exam? You cannot change your answers after submission.')) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await submissionAPI.submitExam(submission.id);
      alert('Exam submitted successfully!');
      navigate('/results', { 
        state: { 
          result: response.data.result,
          submissionId: submission.id
        } 
      });
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert(error.response?.data?.message || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    try {
      await submissionAPI.submitExam(submission.id);
      alert('Time is up! Exam has been auto-submitted.');
      navigate('/results');
    } catch (error) {
      console.error('Error auto-submitting exam:', error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining < 300) return 'red'; // Less than 5 minutes
    if (timeRemaining < 600) return 'orange'; // Less than 10 minutes
    return 'green';
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(a => a && a.trim() !== '').length;
  };

  if (loading) {
    return (
      <div className="take-exam-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Starting exam...</p>
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="take-exam-container">
        <div className="error-message">
          <FiAlertCircle />
          <h2>No Questions Available</h2>
          <p>This exam doesn't have any questions yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/exams')}>
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="take-exam-container">
      {/* Header */}
      <div className="exam-header">
        <div className="exam-info">
          <h1>{exam.title}</h1>
          <p>{exam.description}</p>
        </div>
        <div className={`timer ${getTimeColor()}`}>
          <FiClock />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-info">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{getAnsweredCount()} / {questions.length} answered</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="question-section">
        <div className="question-header">
          <h2>Question {currentQuestion + 1}</h2>
          <span className="marks-badge">{question.marks} marks</span>
        </div>

        <div className="question-text">
          {question.questionText}
        </div>

        {/* Answer Options */}
        <div className="answer-options">
          {question.questionType === 'Multiple Choice' && (
            <>
              {['A', 'B', 'C', 'D'].map(option => {
                const optionText = question[`option${option}`];
                if (!optionText) return null;
                
                return (
                  <label key={option} className="option-label">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                    <span className="option-text">
                      <span className="option-letter">{option}</span>
                      {optionText}
                    </span>
                  </label>
                );
              })}
            </>
          )}

          {question.questionType === 'True/False' && (
            <>
              <label className="option-label">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="A"
                  checked={answers[question.id] === 'A'}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
                <span className="option-text">
                  <span className="option-letter">A</span>
                  True
                </span>
              </label>
              <label className="option-label">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="B"
                  checked={answers[question.id] === 'B'}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
                <span className="option-text">
                  <span className="option-letter">B</span>
                  False
                </span>
              </label>
            </>
          )}

          {question.questionType === 'Short Answer' && (
            <textarea
              className="short-answer-input"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Type your answer here..."
              rows="4"
            />
          )}
        </div>

        {autoSaving && (
          <div className="auto-save-indicator">
            <FiSave /> Saving...
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="navigation-section">
        <div className="nav-buttons">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={submitting}
            >
              <FiSend /> {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="question-navigator">
          <p>Jump to question:</p>
          <div className="question-grid">
            {questions.map((q, index) => (
              <button
                key={q.id}
                className={`question-number ${index === currentQuestion ? 'active' : ''} ${answers[q.id] && answers[q.id].trim() !== '' ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
                {answers[q.id] && answers[q.id].trim() !== '' && (
                  <FiCheckCircle className="answered-icon" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Warning */}
      {timeRemaining < 300 && (
        <div className="warning-banner">
          <FiAlertCircle />
          <span>Less than 5 minutes remaining! Please submit your exam soon.</span>
        </div>
      )}
    </div>
  );
};

export default TakeExam;
