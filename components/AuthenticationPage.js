import React, { useState } from 'react';
import LoginForm from './LoginForm';
import { useAuth } from '../contexts/AuthContext';

const AuthenticationPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { login } = useAuth();

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = (sessionData) => {
    login(sessionData);
    setShowLogin(false);
  };

  const handleLoginCancel = () => {
    setShowLogin(false);
  };

  return (
    <div className="authentication-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h1>Admin Authentication Required</h1>
          <p>Access to the admin panel requires proper authentication</p>
        </div>

        <div className="auth-content">
          <div className="auth-info">
            <h3>🔒 Secure Access</h3>
            <p>Only authorized administrators can access the admin panel. This ensures the security and integrity of student data.</p>
            
            <div className="security-features">
              <h4>🛡️ Security Features:</h4>
              <ul>
                <li>✅ Secure username/password authentication</li>
                <li>✅ 24-hour session management</li>
                <li>✅ Automatic logout for security</li>
                <li>✅ Session persistence across browser sessions</li>
              </ul>
            </div>

            <div className="admin-features">
              <h4>🎯 Admin Panel Features:</h4>
              <div className="features-grid">
                <div className="feature-card">
                  <span className="feature-icon">➕</span>
                  <h5>Add Students</h5>
                  <p>Create new student profiles with complete information</p>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">📝</span>
                  <h5>Marks Management</h5>
                  <p>Add and manage student marks across all subjects</p>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">👥</span>
                  <h5>Student Management</h5>
                  <p>Edit, update, and delete student records</p>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">📊</span>
                  <h5>Bulk Import</h5>
                  <p>Import multiple students via CSV files</p>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">💾</span>
                  <h5>Data Management</h5>
                  <p>Export, import, and backup application data</p>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">📖</span>
                  <h5>Access Guide</h5>
                  <p>Complete guide for admin panel usage</p>
                </div>
              </div>
            </div>

            <div className="demo-credentials">
              <h4>🧪 Demo Credentials:</h4>
              <div className="credentials-display">
                <div className="credential-item">
                  <span className="cred-label">Username:</span>
                  <span className="cred-value">admin</span>
                </div>
                <div className="credential-item">
                  <span className="cred-label">Password:</span>
                  <span className="cred-value">admin123</span>
                </div>
              </div>
              <small>Note: These are demo credentials for testing purposes.</small>
            </div>
          </div>

          <div className="auth-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={handleLoginClick}
            >
              🔑 Login as Admin
            </button>
            
            <div className="auth-help">
              <p>Don't have admin credentials?</p>
              <p>Contact your system administrator for access.</p>
            </div>
          </div>
        </div>
      </div>

      <LoginForm 
        isVisible={showLogin}
        onLogin={handleLoginSuccess}
        onCancel={handleLoginCancel}
      />
    </div>
  );
};

export default AuthenticationPage;
