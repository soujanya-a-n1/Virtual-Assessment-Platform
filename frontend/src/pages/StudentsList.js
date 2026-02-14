import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../pages/ListPages.css';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    studentId: '',
    classId: '',
    departmentId: '',
    enrollmentYear: new Date().getFullYear(),
    currentSemester: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.students);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
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

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
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
        await api.put(`/students/${currentStudent.id}`, formData);
        alert('Student updated successfully');
      } else {
        await api.post('/students', formData);
        alert('Student created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving student');
    }
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setFormData({
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      password: '',
      phone: student.user.phone || '',
      studentId: student.studentId || '',
      classId: student.classId || '',
      departmentId: student.departmentId || '',
      enrollmentYear: student.enrollmentYear || new Date().getFullYear(),
      currentSemester: student.currentSemester || 1,
      isActive: student.isActive,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        alert('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting student');
      }
    }
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleImportCSV = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      alert('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await api.post('/students/import-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`Import completed: ${response.data.successCount} students imported, ${response.data.errorCount} errors`);
      setShowImportModal(false);
      setCsvFile(null);
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error importing students');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      studentId: '',
      classId: '',
      departmentId: '',
      enrollmentYear: new Date().getFullYear(),
      currentSemester: 1,
      isActive: true,
    });
    setEditMode(false);
    setCurrentStudent(null);
  };

  const filteredStudents = students.filter((student) =>
    student.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Student Management</h2>
        <div>
          <button
            className="btn-secondary"
            onClick={() => setShowImportModal(true)}
            style={{ marginRight: '10px' }}
          >
            Import CSV
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Student
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.studentId || '-'}</td>
                <td>{`${student.user.firstName} ${student.user.lastName}`}</td>
                <td>{student.user.email}</td>
                <td>{student.class?.name || '-'}</td>
                <td>{student.department?.name || '-'}</td>
                <td>{student.currentSemester || '-'}</td>
                <td>
                  <span className={`status ${student.isActive ? 'active' : 'inactive'}`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(student)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(student.id)}>
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
              <h3>{editMode ? 'Edit Student' : 'Add Student'}</h3>
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
                  <label>Student ID</label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
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
                  <label>Class</label>
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Enrollment Year</label>
                  <input
                    type="number"
                    name="enrollmentYear"
                    value={formData.enrollmentYear}
                    onChange={handleInputChange}
                    min="2000"
                    max="2100"
                  />
                </div>
                <div className="form-group">
                  <label>Current Semester</label>
                  <input
                    type="number"
                    name="currentSemester"
                    value={formData.currentSemester}
                    onChange={handleInputChange}
                    min="1"
                    max="8"
                  />
                </div>
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

      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Import Students from CSV</h3>
              <button className="close-btn" onClick={() => setShowImportModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleImportCSV}>
              <div className="form-group">
                <label>Select CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  required
                />
                <small>
                  CSV should have columns: firstName, lastName, email, password, phone, studentId, classId, departmentId, enrollmentYear, currentSemester
                </small>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowImportModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
