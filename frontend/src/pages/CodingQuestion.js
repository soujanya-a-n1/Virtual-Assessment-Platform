import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiClock, FiCode, FiSend, FiAlertCircle } from 'react-icons/fi';
import './CodingQuestion.css';

const CodingQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Python');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  useEffect(() => {
    if (timeRemaining <= 0 && question && !autoSubmitted) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, question, autoSubmitted]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/coding-questions/${questionId}`);
      const q = response.data.question;
      setQuestion(q);
      setTimeRemaining(q.timeLimit * 60); // Convert minutes to seconds
      
      // Load saved code if exists
      const savedCode = localStorage.getItem(`coding_${questionId}`);
      if (savedCode) {
        setCode(savedCode);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      alert('Failed to load coding question');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    // Auto-save to localStorage
    localStorage.setItem(`coding_${questionId}`, newCode);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    if (!window.confirm('Are you sure you want to submit your code? You cannot change it after submission.')) {
      return;
    }

    try {
      setSubmitting(true);
      
      await api.post('/coding-questions/submit', {
        codingQuestionId: parseInt(questionId),
        language,
        code,
      });

      // Clear localStorage
      localStorage.removeItem(`coding_${questionId}`);
      
      alert('Code submitted successfully!');
      navigate('/results');
    } catch (error) {
      console.error('Error submitting code:', error);
      alert(error.response?.data?.message || 'Failed to submit code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (autoSubmitted) return;
    
    setAutoSubmitted(true);
    
    try {
      await api.post('/coding-questions/submit', {
        codingQuestionId: parseInt(questionId),
        language,
        code: code || '// No code submitted',
      });

      localStorage.removeItem(`coding_${questionId}`);
      alert('Time is up! Your code has been auto-submitted.');
      navigate('/results');
    } catch (error) {
      console.error('Error auto-submitting code:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="coding-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading coding question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="coding-container">
        <div className="error-message">
          <h2>Question not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/exams')}>
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="coding-container">
      {/* Timer Header */}
      <div className="coding-header">
        <div className="header-left">
          <FiCode className="header-icon" />
          <h1>Coding Question</h1>
        </div>
        <div className={`timer ${timeRemaining < 300 ? 'timer-warning' : ''}`}>
          <FiClock className="timer-icon" />
          <span className="timer-text">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="coding-content">
        {/* Question Section */}
        <div className="question-section">
          <div className="question-header">
            <h2>{question.title}</h2>
            <div className="question-meta">
              <span className={`difficulty-badge ${question.difficulty.toLowerCase()}`}>
                {question.difficulty}
              </span>
              <span className="marks-badge">
                {question.marks} marks
              </span>
            </div>
          </div>

          <div className="question-description">
            <h3>Problem Description</h3>
            <p>{question.description}</p>
          </div>

          {question.inputFormat && (
            <div className="question-format">
              <h3>Input Format</h3>
              <p>{question.inputFormat}</p>
            </div>
          )}

          {question.outputFormat && (
            <div className="question-format">
              <h3>Output Format</h3>
              <p>{question.outputFormat}</p>
            </div>
          )}

          {question.sampleInput && question.sampleOutput && (
            <div className="question-sample">
              <h3>Sample Test Case</h3>
              <div className="sample-grid">
                <div className="sample-box">
                  <h4>Input</h4>
                  <pre>{question.sampleInput}</pre>
                </div>
                <div className="sample-box">
                  <h4>Output</h4>
                  <pre>{question.sampleOutput}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Code Editor Section */}
        <div className="editor-section">
          <div className="editor-header">
            <h3>Your Solution</h3>
            <div className="language-selector">
              <label htmlFor="language">Language:</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={submitting}
              >
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
              </select>
            </div>
          </div>

          <textarea
            className="code-editor"
            value={code}
            onChange={handleCodeChange}
            placeholder={`// Write your ${language} code here...\n\n`}
            disabled={submitting || timeRemaining === 0}
            spellCheck="false"
          />

          <div className="editor-footer">
            <div className="editor-info">
              <FiAlertCircle className="info-icon" />
              <span>Your code is auto-saved locally</span>
            </div>
            <button
              className="btn btn-submit"
              onClick={handleSubmit}
              disabled={submitting || timeRemaining === 0 || !code.trim()}
            >
              <FiSend /> {submitting ? 'Submitting...' : 'Submit Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingQuestion;
