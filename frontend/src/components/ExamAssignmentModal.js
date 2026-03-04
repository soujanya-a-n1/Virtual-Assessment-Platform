import { useState, useEffect } from 'react';
import { FiX, FiUsers, FiUserPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import './ExamAssignmentModal.css';

const ExamAssignmentModal = ({ exam, onClose, onAssign }) => {
  const [activeTab, setActiveTab] = useState('assign');
  const [assignmentType, setAssignmentType] = useState('individual');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'assign') {
      if (assignmentType === 'individual') {
        fetchAvailableStudents();
      } else {
        fetchAvailableClasses();
      }
    } else {
      fetchEnrolledStudents();
    }
  }, [activeTab, assignmentType, exam.id]);

  const fetchAvailableStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/exams/${exam.id}/available-students`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setAvailableStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/classes-for-assignment`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setAvailableClasses(data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/exams/${exam.id}/enrollments`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setEnrolledStudents(data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    try {
      setLoading(true);
      const payload = {};
      
      if (assignmentType === 'individual') {
        payload.studentIds = selectedStudents;
      } else if (assignmentType === 'class') {
        payload.classIds = selectedClasses;
      } else if (assignmentType === 'course') {
        payload.courseId = exam.courseId;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/exams/${exam.id}/assign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        setSelectedStudents([]);
        setSelectedClasses([]);
        fetchEnrolledStudents();
        setActiveTab('enrolled');
        if (onAssign) onAssign();
      } else {
        alert(data.message || 'Failed to assign students');
      }
    } catch (error) {
      console.error('Error assigning students:', error);
      alert('Failed to assign students');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (userId) => {
    if (!window.confirm('Remove this student from the exam?')) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/exams/${exam.id}/enrollments/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        alert('Student removed successfully');
        fetchEnrolledStudents();
      } else {
        alert('Failed to remove student');
      }
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Failed to remove student');
    }
  };

  const toggleStudentSelection = (userId) => {
    setSelectedStudents(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleClassSelection = (classId) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const filteredStudents = availableStudents.filter(student => {
    const fullName = `${student.user.firstName} ${student.user.lastName}`.toLowerCase();
    const email = student.user.email.toLowerCase();
    const studentId = student.studentId?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search) || studentId.includes(search);
  });

  const filteredClasses = availableClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="assignment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Assign Students to Exam</h2>
            <p className="exam-title">{exam.title}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`}
            onClick={() => setActiveTab('assign')}
          >
            <FiUserPlus /> Assign Students
          </button>
          <button
            className={`tab-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
            onClick={() => setActiveTab('enrolled')}
          >
            <FiUsers /> Enrolled ({enrolledStudents.length})
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'assign' ? (
            <>
              <div className="assignment-type-selector">
                <label>
                  <input
                    type="radio"
                    value="individual"
                    checked={assignmentType === 'individual'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                  />
                  <span>Individual Students</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="class"
                    checked={assignmentType === 'class'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                  />
                  <span>By Class</span>
                </label>
                {exam.courseId && (
                  <label>
                    <input
                      type="radio"
                      value="course"
                      checked={assignmentType === 'course'}
                      onChange={(e) => setAssignmentType(e.target.value)}
                    />
                    <span>All Students in Course</span>
                  </label>
                )}
              </div>

              {assignmentType !== 'course' && (
                <div className="search-box">
                  <input
                    type="text"
                    placeholder={`Search ${assignmentType === 'individual' ? 'students' : 'classes'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}

              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : (
                <>
                  {assignmentType === 'individual' && (
                    <div className="selection-list">
                      {filteredStudents.length === 0 ? (
                        <p className="no-data">No available students</p>
                      ) : (
                        filteredStudents.map(student => (
                          <div key={student.userId} className="selection-item">
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(student.userId)}
                                onChange={() => toggleStudentSelection(student.userId)}
                              />
                              <div className="item-info">
                                <div className="item-name">
                                  {student.user.firstName} {student.user.lastName}
                                </div>
                                <div className="item-meta">
                                  {student.studentId && <span>ID: {student.studentId}</span>}
                                  {student.class && <span>{student.class.name}</span>}
                                </div>
                              </div>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {assignmentType === 'class' && (
                    <div className="selection-list">
                      {filteredClasses.length === 0 ? (
                        <p className="no-data">No available classes</p>
                      ) : (
                        filteredClasses.map(cls => (
                          <div key={cls.id} className="selection-item">
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedClasses.includes(cls.id)}
                                onChange={() => toggleClassSelection(cls.id)}
                              />
                              <div className="item-info">
                                <div className="item-name">
                                  {cls.code} - {cls.name}
                                </div>
                                <div className="item-meta">
                                  <span>{cls.studentCount} students</span>
                                  {cls.academicYear && <span>{cls.academicYear}</span>}
                                </div>
                              </div>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {assignmentType === 'course' && (
                    <div className="course-assignment-info">
                      <FiCheck className="info-icon" />
                      <p>This will assign all students enrolled in the course to this exam.</p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="enrolled-list">
              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : enrolledStudents.length === 0 ? (
                <p className="no-data">No students enrolled yet</p>
              ) : (
                enrolledStudents.map(enrollment => (
                  <div key={enrollment.userId} className="enrolled-item">
                    <div className="student-info">
                      <div className="student-name">
                        {enrollment.student.firstName} {enrollment.student.lastName}
                      </div>
                      <div className="student-meta">
                        {enrollment.student.studentProfile?.studentId && (
                          <span>ID: {enrollment.student.studentProfile.studentId}</span>
                        )}
                        {enrollment.student.studentProfile?.class && (
                          <span>{enrollment.student.studentProfile.class.name}</span>
                        )}
                        <span className={`status-badge ${enrollment.enrollmentStatus.toLowerCase()}`}>
                          {enrollment.enrollmentStatus}
                        </span>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveStudent(enrollment.userId)}
                      title="Remove student"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {activeTab === 'assign' && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAssign}
              disabled={
                loading ||
                (assignmentType === 'individual' && selectedStudents.length === 0) ||
                (assignmentType === 'class' && selectedClasses.length === 0)
              }
            >
              <FiUserPlus />
              {assignmentType === 'individual' && ` Assign ${selectedStudents.length} Student(s)`}
              {assignmentType === 'class' && ` Assign ${selectedClasses.length} Class(es)`}
              {assignmentType === 'course' && ' Assign All Course Students'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamAssignmentModal;
