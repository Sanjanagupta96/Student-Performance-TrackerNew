import React, { useState } from 'react';

const LoginForm = ({ onLogin, isVisible, onCancel }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Default admin credentials (in production, these would come from a secure backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
    name: 'System Administrator'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate credentials
      if (loginData.username === ADMIN_CREDENTIALS.username && 
          loginData.password === ADMIN_CREDENTIALS.password) {
        
        // Create admin session
        const adminSession = {
          isAuthenticated: true,
          username: ADMIN_CREDENTIALS.username,
          name: ADMIN_CREDENTIALS.name,
          loginTime: new Date().toISOString(),
          token: btoa(`${ADMIN_CREDENTIALS.username}:${Date.now()}`) // Simple token generation
        };

        // Save to localStorage
        localStorage.setItem('adminSession', JSON.stringify(adminSession));
        
        // Notify parent component
        onLogin(adminSession);
        
      } else {
        setError('Invalid username or password');
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
          <h2>🔐 Admin Login</h2>
          <p>Enter your admin credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-input ${error ? 'error' : ''}`}
              value={loginData.username}
              onChange={handleInputChange}
              placeholder="Enter admin username"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${error ? 'error' : ''}`}
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="Enter admin password"
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
              disabled={isLoading || !loginData.username || !loginData.password}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Logging in...
                </>
              ) : (
                '🔑 Login'
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
          <h4>💡 Demo Credentials:</h4>
          <p><strong>Username:</strong> admin</p>
          <p><strong>Password:</strong> admin123</p>
          <small>Note: In production, these credentials would be managed securely by your backend system.</small>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
