import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI } from '../services/api';
import { 
  FiSave, 
  FiX, 
  FiClock, 
  FiFileText, 
  FiAward,
  FiCalendar,
  FiSettings
} from 'react-icons/fi';
import './ExamPage.css';

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isCreateMode = examId === 'create';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    totalQuestions: 10,
    totalMarks: 100,
    passingMarks: 40,
    examType: 'Online',
    startTime: '',
    endTime: '',
    requiresProctoring: true,
    shuffleQuestions: false,
    negativeMarkingEnabled: false,
    negativeMarks: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isCreateMode) {
      fetchExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, isCreateMode]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const response = await examAPI.getExamById(examId);
      const exam = response.data.exam;
      
      setFormData({
        title: exam.title || '',
        description: exam.description || '',
        duration: exam.duration || 60,
        totalQuestions: exam.totalQuestions || 10,
        totalMarks: exam.totalMarks || 100,
        passingMarks: exam.passingMarks || 40,
        examType: exam.examType || 'Online',
        startTime: exam.startTime ? new Date(exam.startTime).toISOString().slice(0, 16) : '',
        endTime: exam.endTime ? new Date(exam.endTime).toISOString().slice(0, 16) : '',
        requiresProctoring: exam.requiresProctoring ?? true,
        shuffleQuestions: exam.shuffleQuestions ?? false,
        negativeMarkingEnabled: exam.negativeMarkingEnabled ?? false,
        negativeMarks: exam.negativeMarks || 0,
      });
    } catch (error) {
      console.error('Error fetching exam:', error);
      alert('Failed to load exam details');
      navigate('/exams');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }

    if (formData.totalQuestions < 1) {
      newErrors.totalQuestions = 'Must have at least 1 question';
    }

    if (formData.totalMarks < 1) {
      newErrors.totalMarks = 'Total marks must be at least 1';
    }

    if (formData.passingMarks < 0 || formData.passingMarks > formData.totalMarks) {
      newErrors.passingMarks = 'Passing marks must be between 0 and total marks';
    }

    if (formData.startTime && formData.endTime) {
      if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const examData = {
        ...formData,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
      };

      if (isCreateMode) {
        await examAPI.createExam(examData);
        alert('Exam created successfully!');
      } else {
        await examAPI.updateExam(examId, examData);
        alert('Exam updated successfully!');
      }

      navigate('/exams');
    } catch (error) {
      console.error('Error saving exam:', error);
      alert(error.response?.data?.message || 'Failed to save exam');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="exam-page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-page-container">
      <div className="exam-page-header">
        <h1>{isCreateMode ? 'Create New Exam' : 'Edit Exam'}</h1>
        <p className="subtitle">
          {isCreateMode 
            ? 'Fill in the details to create a new exam' 
            : 'Update exam information'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="exam-form">
        {/* Basic Information */}
        <div className="form-section">
          <div className="section-header">
            <FiFileText className="section-icon" />
            <h2>Basic Information</h2>
          </div>

          <div className="form-group">
            <label htmlFor="title">Exam Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter exam title"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter exam description"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="examType">Exam Type</label>
              <select
                id="examType"
                name="examType"
                value={formData.examType}
                onChange={handleChange}
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exam Configuration */}
        <div className="form-section">
          <div className="section-header">
            <FiSettings className="section-icon" />
            <h2>Exam Configuration</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">
                <FiClock className="label-icon" />
                Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                className={errors.duration ? 'error' : ''}
              />
              {errors.duration && <span className="error-message">{errors.duration}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="totalQuestions">
                <FiFileText className="label-icon" />
                Total Questions *
              </label>
              <input
                type="number"
                id="totalQuestions"
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleChange}
                min="1"
                className={errors.totalQuestions ? 'error' : ''}
              />
              {errors.totalQuestions && <span className="error-message">{errors.totalQuestions}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalMarks">
                <FiAward className="label-icon" />
                Total Marks *
              </label>
              <input
                type="number"
                id="totalMarks"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                min="1"
                className={errors.totalMarks ? 'error' : ''}
              />
              {errors.totalMarks && <span className="error-message">{errors.totalMarks}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="passingMarks">
                <FiAward className="label-icon" />
                Passing Marks *
              </label>
              <input
                type="number"
                id="passingMarks"
                name="passingMarks"
                value={formData.passingMarks}
                onChange={handleChange}
                min="0"
                className={errors.passingMarks ? 'error' : ''}
              />
              {errors.passingMarks && <span className="error-message">{errors.passingMarks}</span>}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="form-section">
          <div className="section-header">
            <FiCalendar className="section-icon" />
            <h2>Schedule (Optional)</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={errors.endTime ? 'error' : ''}
              />
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="form-section">
          <div className="section-header">
            <FiSettings className="section-icon" />
            <h2>Advanced Settings</h2>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requiresProctoring"
                checked={formData.requiresProctoring}
                onChange={handleChange}
              />
              <span>Requires Proctoring</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="shuffleQuestions"
                checked={formData.shuffleQuestions}
                onChange={handleChange}
              />
              <span>Shuffle Questions</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="negativeMarkingEnabled"
                checked={formData.negativeMarkingEnabled}
                onChange={handleChange}
              />
              <span>Enable Negative Marking</span>
            </label>
          </div>

          {formData.negativeMarkingEnabled && (
            <div className="form-group">
              <label htmlFor="negativeMarks">Negative Marks per Wrong Answer</label>
              <input
                type="number"
                id="negativeMarks"
                name="negativeMarks"
                value={formData.negativeMarks}
                onChange={handleChange}
                min="0"
                step="0.25"
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/exams')}
            disabled={saving}
          >
            <FiX /> Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            <FiSave /> {saving ? 'Saving...' : (isCreateMode ? 'Create Exam' : 'Update Exam')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamPage;
