import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submissionAPI } from '../services/api';
import Editor from '@monaco-editor/react';
import { 
  FiClock, 
  FiSave, 
  FiSend, 
  FiAlertCircle,
  FiCheckCircle,
  FiPlay,
  FiCode
} from 'react-icons/fi';
import './TakeExam.css';

// Judge0 language IDs removed — using Piston API directly (free, no key needed)

const LANGUAGE_LABELS = {
  python: 'Python 3',
  java: 'Java',
  c: 'C',
};

const STARTER_CODE = {
  python: '# Write your solution here\n\n',
  java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
  c: '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
};

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  // Coding question state
  const [codeMap, setCodeMap] = useState({});         // { questionId: code }
  const [langMap, setLangMap] = useState({});          // { questionId: language }
  const [runOutput, setRunOutput] = useState({});      // { questionId: output }
  const [running, setRunning] = useState({});          // { questionId: bool }

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
      const initialCode = {};
      const initialLang = {};
      (data.questions || []).forEach(q => {
        initialAnswers[q.id] = '';
        if (q.questionType === 'Coding') {
          const lang = q.codingDetails?.language || 'python';
          initialLang[q.id] = lang;
          initialCode[q.id] = q.codingDetails?.starterCode || STARTER_CODE[lang] || '';
        }
      });
      setAnswers(initialAnswers);
      setCodeMap(initialCode);
      setLangMap(initialLang);
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

  const handleCodeChange = (questionId, code) => {
    setCodeMap(prev => ({ ...prev, [questionId]: code }));
    handleAnswerChange(questionId, code);
  };

  const handleLanguageChange = (questionId, lang) => {
    setLangMap(prev => ({ ...prev, [questionId]: lang }));
    const current = codeMap[questionId];
    if (!current || Object.values(STARTER_CODE).includes(current)) {
      setCodeMap(prev => ({ ...prev, [questionId]: STARTER_CODE[lang] || '' }));
    }
  };

  const runCode = async (questionId) => {
    const code = codeMap[questionId] || '';
    const lang = langMap[questionId] || 'python';

    if (!code.trim()) {
      setRunOutput(prev => ({ ...prev, [questionId]: 'Please write some code first.' }));
      return;
    }

    setRunning(prev => ({ ...prev, [questionId]: true }));
    setRunOutput(prev => ({ ...prev, [questionId]: '⏳ Running...' }));

    // Piston language name + wildcard version (*) — Piston picks latest automatically
    const PISTON_LANG = {
      python: 'python',
      java: 'java',
      c: 'c',
    };

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch('http://localhost:5000/api/code/execute', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          language: PISTON_LANG[lang] || 'python',
          version: '*',
          files: [{ name: 'main', content: code }],
          stdin: '',
          args: [],
          compile_timeout: 10000,
          run_timeout: 5000,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setRunOutput(prev => ({ ...prev, [questionId]: `Error ${res.status}: ${errText}` }));
        return;
      }

      const data = await res.json();

      const run = data.run || {};
      const compile = data.compile || {};
      const compileErr = compile.stderr || compile.output || '';
      const output = run.output || run.stdout || run.stderr || '';

      if (compileErr && !output) {
        setRunOutput(prev => ({ ...prev, [questionId]: `Compile Error:\n${compileErr}` }));
      } else if (output) {
        setRunOutput(prev => ({ ...prev, [questionId]: output }));
      } else if (run.code === 0) {
        setRunOutput(prev => ({ ...prev, [questionId]: '(program ran with no output)' }));
      } else {
        setRunOutput(prev => ({ ...prev, [questionId]: compileErr || `Exit code: ${run.code}` }));
      }
    } catch (err) {
      setRunOutput(prev => ({
        ...prev,
        [questionId]: `Network error: ${err.message}\nCheck your internet connection.`,
      }));
    } finally {
      setRunning(prev => ({ ...prev, [questionId]: false }));
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
              style={{
                color: '#ffffff',
                backgroundColor: '#2a2a3e',
                fontWeight: '500',
                WebkitTextFillColor: '#ffffff'
              }}
            />
          )}

          {question.questionType === 'Coding' && (
            <div className="coding-editor-section">
              {/* Language Selector */}
              <div className="coding-toolbar">
                <div className="lang-selector">
                  <FiCode />
                  <label>Language:</label>
                  <select
                    value={langMap[question.id] || 'python'}
                    onChange={(e) => handleLanguageChange(question.id, e.target.value)}
                  >
                    {Object.entries(LANGUAGE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="run-btn"
                  onClick={() => runCode(question.id)}
                  disabled={running[question.id]}
                >
                  <FiPlay />
                  {running[question.id] ? 'Running...' : 'Run Code'}
                </button>
              </div>

              {/* Monaco Code Editor */}
              <div className="editor-wrapper">
                <Editor
                  height="380px"
                  language={langMap[question.id] === 'cpp' ? 'cpp' : langMap[question.id] === 'csharp' ? 'csharp' : langMap[question.id] || 'python'}
                  value={codeMap[question.id] || STARTER_CODE[langMap[question.id] || 'python']}
                  theme="vs-dark"
                  onChange={(val) => handleCodeChange(question.id, val || '', langMap[question.id] || 'python')}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    folding: true,
                    suggestOnTriggerCharacters: true,
                  }}
                />
              </div>

              {/* Output Panel */}
              <div className="output-panel">
                <div className="output-header">
                  <span>Output</span>
                  {runOutput[question.id] && (
                    <button className="clear-btn" onClick={() => setRunOutput(prev => ({ ...prev, [question.id]: '' }))}>
                      Clear
                    </button>
                  )}
                </div>
                <pre className="output-content">
                  {runOutput[question.id] || 'Click "Run Code" to see output here...'}
                </pre>
              </div>
            </div>
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
