import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentDetail from './StudentDetail';

const StudentDashboard = ({ students }) => {
  const { getStudentInfo, logoutStudent } = useAuth();
  const studentInfo = getStudentInfo();

  // Find the current student's data
  const currentStudent = students.find(s => s.id.toString() === studentInfo.studentId.toString());

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logoutStudent();
    }
  };

  if (!currentStudent) {
    return (
      <div className="student-dashboard">
        <div className="error-message">
          <h3>❌ Student Data Not Found</h3>
          <p>Your student data could not be loaded. Please contact your administrator.</p>
          <button className="btn btn-primary" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="student-header">
        <div className="student-welcome">
          <h1>🎓 Welcome, {currentStudent.name}!</h1>
          <p>Student ID: {currentStudent.id} | Grade: {currentStudent.grade}</p>
        </div>
        <div className="student-actions">
          <button 
            className="btn btn-secondary btn-sm logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="student-content">
        <div className="privacy-notice">
          <div className="privacy-card">
            <h3>🔒 Your Data is Private</h3>
            <p>Only you can see your performance data. Other students cannot access your information.</p>
          </div>
        </div>

        <StudentDetail 
          student={currentStudent} 
          onBack={() => {}} // No back button needed for student view
          onUpdateStudent={() => {}} // Students cannot edit their own data
          isStudentView={true}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
