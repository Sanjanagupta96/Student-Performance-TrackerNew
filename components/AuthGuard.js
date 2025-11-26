import React, { useState } from 'react';
import LoginForm from './LoginForm';

const AuthGuard = ({ children, fallback = null }) => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = (sessionData) => {
    setShowLogin(false);
    // The AuthContext will handle updating the session
  };

  const handleLoginCancel = () => {
    setShowLogin(false);
  };

  return (
    <>
      {fallback || (
        <div className="auth-guard">
          <div className="auth-guard-content">
            <div className="auth-guard-icon">🔒</div>
            <h3>Admin Access Required</h3>
            <p>You need admin privileges to access this section.</p>
            <button 
              className="btn btn-primary"
              onClick={handleLoginClick}
            >
              🔑 Admin Login
            </button>
          </div>
        </div>
      )}
      
      <LoginForm 
        isVisible={showLogin}
        onLogin={handleLoginSuccess}
      />
    </>
  );
};

export default AuthGuard;
