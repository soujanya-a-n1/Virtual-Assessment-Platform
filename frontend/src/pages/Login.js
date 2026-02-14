import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Admin@123456');
  };

  return (
    <div className="auth-container">
      <div className="login-box">
        <h2>Login</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="login-btn"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-label">Demo Accounts:</p>
          <select 
            className="demo-select"
            onChange={(e) => e.target.value && handleDemoLogin(e.target.value)}
            value=""
          >
            <option value="">Select a demo account</option>
            <option value="superadmin@platform.com">Super Admin</option>
            <option value="admin@platform.com">Admin</option>
            <option value="examiner@platform.com">Examiner</option>
            <option value="student1@platform.com">Student</option>
          </select>
          <p className="demo-password">Password: Admin@123456</p>
        </div>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
