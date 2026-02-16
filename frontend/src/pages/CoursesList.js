import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../pages/ListPages.css';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [selectedLecturers, setSelectedLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    departmentId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    fetchLecturers();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.courses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchLecturers = async () => {
    try {
      const response = await api.get('/lecturers');
      setLecturers(response.data.lecturers);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  const handleManageLecturers = (course) => {
    setCurrentCourse(course);
    setSelectedLecturers(course.lecturers?.map(l => l.id) || []);
    setShowLecturerModal(true);
  };

  const handleLecturerToggle = (lecturerId) => {
    setSelectedLecturers(prev =>
      prev.includes(lecturerId)
        ? prev.filter(id => id !== lecturerId)
        : [...prev, lecturerId]
    );
  };

  const handleSaveLecturers = async () => {
    try {
      await api.post(`/courses/${currentCourse.id}/lecturers`, {
        lecturerIds: selectedLecturers
      });
      alert('Lecturers assigned successfully');
      setShowLecturerModal(false);
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || 'Error assigning lecturers');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/courses/${currentCourse.id}`, formData);
        alert('Course updated successfully');
      } else {
        await api.post('/courses', formData);
        alert('Course created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving course');
    }
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      description: course.description || '',
      credits: course.credits || '',
      departmentId: course.departmentId || '',
      isActive: course.isActive,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        alert('Course deleted successfully');
        fetchCourses();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting course');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      credits: '',
      departmentId: '',
      isActive: true,
    });
    setEditMode(false);
    setCurrentCourse(null);
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Course Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Course
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Assigned Lecturers</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.department?.name || '-'}</td>
                <td>{course.credits || '-'}</td>
                <td>
                  <div className="assigned-items">
                    {course.lecturers && course.lecturers.length > 0 ? (
                      <>
                        <span className="count-badge">{course.lecturers.length}</span>
                        <div className="items-list">
                          {course.lecturers.map((lecturer, index) => (
                            <span key={lecturer.id} className="item-tag">
                              {lecturer.user.firstName} {lecturer.user.lastName}
                              {index < course.lecturers.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <span className="no-items">No lecturers assigned</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status ${course.isActive ? 'active' : 'inactive'}`}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(course)}>
                    Edit
                  </button>
                  <button className="btn-secondary" onClick={() => handleManageLecturers(course)}>
                    Lecturers
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(course.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editMode ? 'Edit Course' : 'Add Course'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  disabled={editMode}
                />
              </div>
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLecturerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Lecturers to {currentCourse?.name}</h3>
              <button className="close-btn" onClick={() => setShowLecturerModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Select lecturers to assign to this course. You can select multiple lecturers.
              </p>
              <div className="lecturer-list">
                {lecturers.length === 0 ? (
                  <p className="no-data">No lecturers available</p>
                ) : (
                  lecturers.map((lecturer) => (
                    <div key={lecturer.id} className="lecturer-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedLecturers.includes(lecturer.id)}
                          onChange={() => handleLecturerToggle(lecturer.id)}
                        />
                        <div className="lecturer-info">
                          <span className="lecturer-name">
                            {lecturer.user.firstName} {lecturer.user.lastName}
                          </span>
                          <span className="lecturer-details">
                            {lecturer.employeeId && `(${lecturer.employeeId})`}
                            {lecturer.department && ` - ${lecturer.department.name}`}
                            {lecturer.specialization && ` - ${lecturer.specialization}`}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowLecturerModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleSaveLecturers}>
                Save ({selectedLecturers.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
