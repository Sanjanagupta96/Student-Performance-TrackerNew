import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AccessGuide = () => {
  const { isAdmin, getAdminInfo } = useAuth();
  const adminInfo = getAdminInfo();

  return (
    <div className="access-guide">
      <div className="guide-header">
        <h3>🔐 Admin Panel Access Guide</h3>
      </div>

      <div className="guide-content">
        {!isAdmin ? (
          <div className="unauthorized-section">
            <div className="status-card unauthorized">
              <h4>🚫 Current Status: Unauthorized</h4>
              <p>You don't have admin access. Follow the steps below to gain access.</p>
            </div>

            <div className="steps-section">
              <h4>📋 How to Access Admin Panel:</h4>
              
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h5>Click Admin Tab</h5>
                  <p>Navigate to the <strong>🔧 Admin</strong> tab in the navigation bar</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h5>Login Modal Appears</h5>
                  <p>A secure login modal will appear asking for admin credentials</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h5>Enter Credentials</h5>
                  <div className="credentials-box">
                    <p><strong>Username:</strong> admin</p>
                    <p><strong>Password:</strong> admin123</p>
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h5>Click Login Button</h5>
                  <p>Click the <strong>🔑 Login</strong> button to authenticate</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h5>Access Granted</h5>
                  <p>You'll be redirected to the admin panel with full access</p>
                </div>
              </div>
            </div>

            <div className="features-section">
              <h4>🎯 Admin Panel Features:</h4>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">➕</span>
                  <span>Add New Students</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📝</span>
                  <span>Add Student Marks</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <span>Manage Students</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Bulk Import Data</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💾</span>
                  <span>Data Management</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔧</span>
                  <span>System Settings</span>
                </div>
              </div>
            </div>

            <div className="security-info">
              <h4>🔒 Security Features:</h4>
              <ul>
                <li>✅ <strong>Session Management:</strong> 24-hour automatic logout</li>
                <li>✅ <strong>Secure Authentication:</strong> Username/password validation</li>
                <li>✅ <strong>Access Control:</strong> Only authorized admins can access</li>
                <li>✅ <strong>Session Persistence:</strong> Login persists across browser sessions</li>
                <li>✅ <strong>Automatic Logout:</strong> Session expires after 24 hours</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="authorized-section">
            <div className="status-card authorized">
              <h4>✅ Current Status: Authorized</h4>
              <p>Welcome, <strong>{adminInfo?.name}</strong>! You have full admin access.</p>
            </div>

            <div className="admin-info-section">
              <h4>👤 Admin Information:</h4>
              <div className="admin-details">
                <div className="detail-item">
                  <span className="label">Username:</span>
                  <span className="value">{adminInfo?.username}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{adminInfo?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Login Time:</span>
                  <span className="value">{adminInfo?.loginTime ? new Date(adminInfo.loginTime).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Session Status:</span>
                  <span className="value status-active">Active</span>
                </div>
              </div>
            </div>

            <div className="admin-actions">
              <h4>🎯 Available Actions:</h4>
              <div className="actions-grid">
                <div className="action-item">
                  <span className="action-icon">➕</span>
                  <div className="action-content">
                    <h5>Add Students</h5>
                    <p>Create new student profiles</p>
                  </div>
                </div>
                <div className="action-item">
                  <span className="action-icon">📝</span>
                  <div className="action-content">
                    <h5>Manage Marks</h5>
                    <p>Add and update student marks</p>
                  </div>
                </div>
                <div className="action-item">
                  <span className="action-icon">👥</span>
                  <div className="action-content">
                    <h5>Student Management</h5>
                    <p>Edit and delete student records</p>
                  </div>
                </div>
                <div className="action-item">
                  <span className="action-icon">💾</span>
                  <div className="action-content">
                    <h5>Data Management</h5>
                    <p>Export, import, and backup data</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="session-info">
              <h4>⏰ Session Information:</h4>
              <div className="session-details">
                <p>Your admin session will automatically expire after 24 hours for security.</p>
                <p>You can manually logout using the logout button in the header.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessGuide;
