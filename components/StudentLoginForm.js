import React, { useState } from 'react';

const StudentLoginForm = ({ onLogin, isVisible, onCancel, students }) => {
  const [loginData, setLoginData] = useState({
    studentId: '',
    dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateStudentCredentials = (studentId, dateOfBirth) => {
    // Find student by ID
    const student = students.find(s => s.id.toString() === studentId.toString());
    
    if (!student) {
      return { isValid: false, error: 'Student ID not found' };
    }

    // Check if student has dateOfBirth field
    if (!student.dateOfBirth) {
      return { isValid: false, error: 'Student account not properly configured' };
    }

    // Compare date of birth (format: YYYY-MM-DD)
    if (student.dateOfBirth !== dateOfBirth) {
      return { isValid: false, error: 'Invalid date of birth' };
    }

    return { isValid: true, student };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate credentials
      const validation = validateStudentCredentials(loginData.studentId, loginData.dateOfBirth);
      
      if (validation.isValid) {
        // Create student session
        const studentSession = {
          isAuthenticated: true,
          studentId: validation.student.id,
          name: validation.student.name,
          loginTime: new Date().toISOString(),
          token: btoa(`${validation.student.id}:${Date.now()}`) // Simple token generation
        };

        // Save to localStorage
        localStorage.setItem('studentSession', JSON.stringify(studentSession));
        
        // Notify parent component
        onLogin(studentSession);
        
      } else {
        setError(validation.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h2>🎓 Student Login</h2>
          <p>Enter your student ID and date of birth to access your performance data</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="studentId">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              className={`form-input ${error ? 'error' : ''}`}
              value={loginData.studentId}
              onChange={handleInputChange}
              placeholder="Enter your student ID"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dateOfBirth">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className={`form-input ${error ? 'error' : ''}`}
              value={loginData.dateOfBirth}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !loginData.studentId || !loginData.dateOfBirth}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Logging in...
                </>
              ) : (
                '🎓 Student Login'
              )}
            </button>
            
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={isLoading}
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>

        <div className="login-help">
          <h4>💡 How to Login:</h4>
          <p><strong>Student ID:</strong> Your unique student identification number</p>
          <p><strong>Date of Birth:</strong> Your birth date in YYYY-MM-DD format</p>
          <small>Note: Only you can access your personal performance data. Other students cannot see your information.</small>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginForm;
