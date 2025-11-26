import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onViewChange, currentView }) => {
  const { isAdmin, isStudent, getAdminInfo, getStudentInfo, logoutAdmin, logoutStudent } = useAuth();
  const adminInfo = getAdminInfo();
  const studentInfo = getStudentInfo();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      if (isAdmin) {
        logoutAdmin();
      } else if (isStudent) {
        logoutStudent();
      }
      onViewChange('dashboard'); // Redirect to dashboard after logout
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>📊 Student Performance Tracker</h1>
        
        {(isAdmin && adminInfo) && (
          <div className="admin-info">
            <span className="admin-welcome">
              Welcome, {adminInfo.name}
            </span>
            <button 
              className="btn btn-secondary btn-sm logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        )}
        
        {(isStudent && studentInfo) && (
          <div className="student-info">
            <span className="student-welcome">
              Welcome, {studentInfo.name}
            </span>
            <button 
              className="btn btn-secondary btn-sm logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
      
      <div className="nav-buttons">
        {!isStudent && (
          <>
            <button 
              className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onViewChange('dashboard')}
            >
              📈 Dashboard
            </button>
            <button 
              className={`nav-btn ${currentView === 'students' ? 'active' : ''}`}
              onClick={() => onViewChange('students')}
            >
              👥 Students
            </button>
            <button 
              className={`nav-btn ${currentView === 'admin' ? 'active' : ''} ${!isAdmin ? 'admin-locked' : ''}`}
              onClick={() => onViewChange('admin')}
              title={!isAdmin ? 'Click to login as admin' : 'Admin Panel'}
            >
              {isAdmin ? '🔧 Admin' : '🔒 Admin Login'}
            </button>
          </>
        )}
        
        {!isAdmin && !isStudent && (
          <button 
            className={`nav-btn ${currentView === 'student-login' ? 'active' : ''}`}
            onClick={() => onViewChange('student-login')}
            title="Student Login"
          >
            🎓 Student Login
          </button>
        )}
        
        {isStudent && (
          <button 
            className={`nav-btn ${currentView === 'student-dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('student-dashboard')}
            title="My Performance"
          >
            📊 My Performance
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
