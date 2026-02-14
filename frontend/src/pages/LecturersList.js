import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../pages/ListPages.css';

const LecturersList = () => {
  const [lecturers, setLecturers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLecturer, setCurrentLecturer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    employeeId: '',
    departmentId: '',
    qualification: '',
    specialization: '',
    joiningDate: '',
    isActive: true,
  });

  useEffect(() => {
    fetchLecturers();
    fetchDepartments();
  }, []);

  const fetchLecturers = async () => {
    try {
      const response = await api.get('/lecturers');
      setLecturers(response.data.lecturers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
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
        await api.put(`/lecturers/${currentLecturer.id}`, formData);
        alert('Lecturer updated successfully');
      } else {
        await api.post('/lecturers', formData);
        alert('Lecturer created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchLecturers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving lecturer');
    }
  };

  const handleEdit = (lecturer) => {
    setCurrentLecturer(lecturer);
    setFormData({
      firstName: lecturer.user.firstName,
      lastName: lecturer.user.lastName,
      email: lecturer.user.email,
      password: '',
      phone: lecturer.user.phone || '',
      employeeId: lecturer.employeeId || '',
      departmentId: lecturer.departmentId || '',
      qualification: lecturer.qualification || '',
      specialization: lecturer.specialization || '',
      joiningDate: lecturer.joiningDate || '',
      isActive: lecturer.isActive,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecturer?')) {
      try {
        await api.delete(`/lecturers/${id}`);
        alert('Lecturer deleted successfully');
        fetchLecturers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting lecturer');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      employeeId: '',
      departmentId: '',
      qualification: '',
      specialization: '',
      joiningDate: '',
      isActive: true,
    });
    setEditMode(false);
    setCurrentLecturer(null);
  };

  const filteredLecturers = lecturers.filter((lecturer) =>
    lecturer.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecturer.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecturer.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lecturer.employeeId && lecturer.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Lecturer Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Lecturer
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search lecturers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Specialization</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLecturers.map((lecturer) => (
              <tr key={lecturer.id}>
                <td>{lecturer.employeeId || '-'}</td>
                <td>{`${lecturer.user.firstName} ${lecturer.user.lastName}`}</td>
                <td>{lecturer.user.email}</td>
                <td>{lecturer.department?.name || '-'}</td>
                <td>{lecturer.specialization || '-'}</td>
                <td>{lecturer.courses?.length || 0}</td>
                <td>
                  <span className={`status ${lecturer.isActive ? 'active' : 'inactive'}`}>
                    {lecturer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(lecturer)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(lecturer.id)}>
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
              <h3>{editMode ? 'Edit Lecturer' : 'Add Lecturer'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={editMode}
                />
              </div>
              {!editMode && (
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editMode}
                  />
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                  />
                </div>
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
              <div className="form-row">
                <div className="form-group">
                  <label>Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="e.g., Ph.D., M.Sc."
                  />
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
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
    </div>
  );
};

export default LecturersList;
