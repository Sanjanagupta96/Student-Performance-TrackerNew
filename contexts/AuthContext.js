import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [adminSession, setAdminSession] = useState(null);
  const [studentSession, setStudentSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing sessions on app load
    const checkExistingSessions = () => {
      try {
        // Check admin session
        const savedAdminSession = localStorage.getItem('adminSession');
        if (savedAdminSession) {
          const session = JSON.parse(savedAdminSession);
          
          // Check if session is still valid (24 hours)
          const loginTime = new Date(session.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 24 && session.isAuthenticated) {
            setAdminSession(session);
          } else {
            // Session expired, clear it
            localStorage.removeItem('adminSession');
          }
        }

        // Check student session
        const savedStudentSession = localStorage.getItem('studentSession');
        if (savedStudentSession) {
          const session = JSON.parse(savedStudentSession);
          
          // Check if session is still valid (8 hours for students)
          const loginTime = new Date(session.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 8 && session.isAuthenticated) {
            setStudentSession(session);
          } else {
            // Session expired, clear it
            localStorage.removeItem('studentSession');
          }
        }
      } catch (error) {
        console.error('Error checking sessions:', error);
        localStorage.removeItem('adminSession');
        localStorage.removeItem('studentSession');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSessions();
  }, []);

  const loginAdmin = (sessionData) => {
    setAdminSession(sessionData);
  };

  const loginStudent = (sessionData) => {
    setStudentSession(sessionData);
  };

  const logout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('studentSession');
    setAdminSession(null);
    setStudentSession(null);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminSession');
    setAdminSession(null);
  };

  const logoutStudent = () => {
    localStorage.removeItem('studentSession');
    setStudentSession(null);
  };

  const isAdmin = () => {
    return adminSession && adminSession.isAuthenticated;
  };

  const isStudent = () => {
    return studentSession && studentSession.isAuthenticated;
  };

  const isAuthenticated = () => {
    return isAdmin() || isStudent();
  };

  const getCurrentUser = () => {
    if (isAdmin()) {
      return {
        type: 'admin',
        username: adminSession.username,
        name: adminSession.name,
        loginTime: adminSession.loginTime
      };
    } else if (isStudent()) {
      return {
        type: 'student',
        studentId: studentSession.studentId,
        name: studentSession.name,
        loginTime: studentSession.loginTime
      };
    }
    return null;
  };

  const getAdminInfo = () => {
    return adminSession ? {
      username: adminSession.username,
      name: adminSession.name,
      loginTime: adminSession.loginTime
    } : null;
  };

  const getStudentInfo = () => {
    return studentSession ? {
      studentId: studentSession.studentId,
      name: studentSession.name,
      loginTime: studentSession.loginTime
    } : null;
  };

  const value = {
    adminSession,
    studentSession,
    isLoading,
    loginAdmin,
    loginStudent,
    logout,
    logoutAdmin,
    logoutStudent,
    isAdmin: isAdmin(),
    isStudent: isStudent(),
    isAuthenticated: isAuthenticated(),
    getCurrentUser,
    getAdminInfo,
    getStudentInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
