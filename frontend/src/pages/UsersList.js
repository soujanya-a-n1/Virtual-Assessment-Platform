import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiDownload,
  FiUser,
  FiMail,
  FiPhone,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import './UsersList.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    roles: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter((user) =>
        user.Roles?.some((role) => role.name === filterRole)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(
        (user) =>
          (filterStatus === 'active' && user.isActive) ||
          (filterStatus === 'inactive' && !user.isActive)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      roles: [],
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      roles: user.Roles?.map((r) => r.id) || [],
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(userId);
        setUsers(users.filter((u) => u.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        // Validate password for create mode
        if (!formData.password || formData.password.length < 6) {
          alert('Password must be at least 6 characters long');
          return;
        }
        
        const response = await userAPI.createUser(formData);
        
        alert('User created successfully');
      } else {
        // Update existing user
        await userAPI.updateUser(selectedUser.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        });

        // Update roles - remove old ones and add new ones
        const currentRoleIds = selectedUser.Roles?.map((r) => r.id) || [];
        const rolesToRemove = currentRoleIds.filter((id) => !formData.roles.includes(id));
        const rolesToAdd = formData.roles.filter((id) => !currentRoleIds.includes(id));

        for (const roleId of rolesToRemove) {
          await userAPI.removeRole(selectedUser.id, roleId);
        }

        for (const roleId of rolesToAdd) {
          await userAPI.assignRole(selectedUser.id, roleId);
        }

        alert('User updated successfully');
      }
      
      setShowModal(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleRoleChange = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter((r) => r !== roleId)
        : [...prev.roles, roleId],
    }));
  };

  if (loading) {
    return (
      <div className="users-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      {/* Header */}
      <div className="users-header">
        <div className="header-top">
          <div>
            <h1>User Management</h1>
            <p className="header-subtitle">
              Manage system users and assign roles
            </p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleCreateUser}>
            <FiPlus /> Create New User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="role-filter">Role</label>
            <select
              id="role-filter"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Examiner">Examiner</option>
              <option value="Proctor">Proctor</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button className="btn btn-secondary">
            <FiDownload /> Export
          </button>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            Showing <strong>{filteredUsers.length}</strong> of{' '}
            <strong>{users.length}</strong> users
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-wrapper">
        {filteredUsers.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">
              <FiUser />
            </div>
            <h3>No users found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Roles</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="user-name">
                    <div className="name-avatar">
                      {(user.firstName[0] + user.lastName[0]).toUpperCase()}
                    </div>
                    <div>
                      <div className="full-name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="user-id">ID: {user.id}</div>
                    </div>
                  </td>
                  <td className="user-email">
                    <FiMail className="cell-icon" />
                    {user.email}
                  </td>
                  <td className="user-phone">
                    <FiPhone className="cell-icon" />
                    {user.phone || '—'}
                  </td>
                  <td className="user-roles">
                    <div className="role-badges">
                      {user.Roles?.length > 0 ? (
                        user.Roles.map((role) => (
                          <span key={role.id} className="role-badge">
                            {role.name}
                          </span>
                        ))
                      ) : (
                        <span className="role-badge empty">No Role</span>
                      )}
                    </div>
                  </td>
                  <td className="user-status">
                    <span
                      className={`status-badge ${
                        user.isActive ? 'active' : 'inactive'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <FiCheck /> Active
                        </>
                      ) : (
                        <>
                          <FiX /> Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="user-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditUser(user)}
                      title="Edit user"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete user"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'create' ? 'Create New User' : 'Edit User'}
              </h2>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {modalMode === 'create' && (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Assign Roles</label>
                <div className="roles-selector">
                  {['Super Admin', 'Admin', 'Examiner', 'Proctor', 'Student'].map(
                    (role, idx) => (
                      <label key={role} className="role-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.roles.includes(idx + 1)}
                          onChange={() => handleRoleChange(idx + 1)}
                        />
                        {role}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'create' ? 'Create User' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
