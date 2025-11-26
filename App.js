import React, { useState, useEffect } from 'react';
import './App.css';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import PerformanceDashboard from './components/PerformanceDashboard';
import AdminPanel from './components/AdminPanel';
import StudentDashboard from './components/StudentDashboard';
import StudentLoginForm from './components/StudentLoginForm';
import Header from './components/Header';
import DebugPanel from './components/DebugPanel';
import AuthenticationPage from './components/AuthenticationPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'students', 'detail', 'admin', 'student-login', 'student-dashboard'
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const { isAdmin, isStudent, isLoading, loginStudent } = useAuth();

  // Load students from localStorage or initialize with sample data
  useEffect(() => {
    const loadStudents = () => {
      try {
        const savedStudents = localStorage.getItem('studentPerformanceData');
        if (savedStudents) {
          const parsedStudents = JSON.parse(savedStudents);
          setStudents(parsedStudents);
        } else {
          // Initialize with sample data if no saved data exists
          const sampleStudents = [
            {
              id: 1,
              name: 'John Doe',
              email: 'john.doe@example.com',
              grade: '10th Grade',
              dateOfBirth: '2008-03-15',
              performance: {
                math: [85, 92, 78, 88, 95],
                science: [90, 85, 92, 87, 89],
                english: [88, 90, 85, 92, 88],
                history: [82, 88, 90, 85, 87]
              },
              attendance: 95,
              lastUpdated: '2024-01-15'
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
              grade: '11th Grade',
              dateOfBirth: '2007-07-22',
              performance: {
                math: [92, 88, 95, 90, 87],
                science: [85, 90, 88, 92, 85],
                english: [95, 92, 88, 90, 93],
                history: [88, 85, 92, 87, 90]
              },
              attendance: 98,
              lastUpdated: '2024-01-15'
            },
            {
              id: 3,
              name: 'Mike Johnson',
              email: 'mike.johnson@example.com',
              grade: '9th Grade',
              dateOfBirth: '2009-11-08',
              performance: {
                math: [75, 82, 78, 85, 80],
                science: [80, 85, 78, 82, 85],
                english: [85, 80, 88, 82, 85],
                history: [78, 82, 85, 80, 83]
              },
              attendance: 92,
              lastUpdated: '2024-01-15'
            }
          ];
          setStudents(sampleStudents);
          // Save sample data to localStorage
          localStorage.setItem('studentPerformanceData', JSON.stringify(sampleStudents));
        }
      } catch (error) {
        console.error('Error loading students from localStorage:', error);
        // Fallback to sample data if there's an error
        const sampleStudents = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            grade: '10th Grade',
            dateOfBirth: '2008-03-15',
            performance: {
              math: [85, 92, 78, 88, 95],
              science: [90, 85, 92, 87, 89],
              english: [88, 90, 85, 92, 88],
              history: [82, 88, 90, 85, 87]
            },
            attendance: 95,
            lastUpdated: '2024-01-15'
          }
        ];
        setStudents(sampleStudents);
      }
    };

    loadStudents();
  }, []);

  // Save students to localStorage whenever students array changes
  useEffect(() => {
    if (students.length > 0) {
      try {
        localStorage.setItem('studentPerformanceData', JSON.stringify(students));
        console.log('✅ Students data saved to localStorage:', students.length, 'students');
        console.log('📊 Current students:', students.map(s => ({ id: s.id, name: s.name, marksCount: Object.values(s.performance).flat().length })));
      } catch (error) {
        console.error('Error saving students to localStorage:', error);
      }
    }
  }, [students]);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setView('detail');
  };

  const handleViewChange = (newView) => {
    if (newView === 'student-login') {
      setShowStudentLogin(true);
    } else {
      setView(newView);
      if (newView !== 'detail') {
        setSelectedStudent(null);
      }
    }
  };

  const handleStudentLogin = (sessionData) => {
    loginStudent(sessionData);
    setShowStudentLogin(false);
    setView('student-dashboard');
  };

  const handleStudentLoginCancel = () => {
    setShowStudentLogin(false);
  };

  if (isLoading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header onViewChange={handleViewChange} currentView={view} />
      
      {/* Debug Panel - Remove in production */}
      <DebugPanel students={students} />
      
      <main className="main-content">
        {view === 'dashboard' && !isStudent && (
          <PerformanceDashboard students={students} onStudentSelect={handleStudentSelect} />
        )}
        
        {view === 'students' && !isStudent && (
          <StudentList 
            students={students} 
            onStudentSelect={handleStudentSelect}
            onUpdateStudents={setStudents}
          />
        )}
        
        {view === 'admin' && (
          isAdmin ? (
            <AdminPanel 
              students={students}
              onUpdateStudents={setStudents}
              onStudentSelect={handleStudentSelect}
            />
          ) : (
            <AuthenticationPage />
          )
        )}
        
        {view === 'student-dashboard' && isStudent && (
          <StudentDashboard students={students} />
        )}
        
        {view === 'detail' && selectedStudent && !isStudent && (
          <StudentDetail 
            student={selectedStudent} 
            onBack={() => setView('students')}
            onUpdateStudent={(updatedStudent) => {
              setStudents(students.map(s => 
                s.id === updatedStudent.id ? updatedStudent : s
              ));
              setSelectedStudent(updatedStudent);
            }}
          />
        )}
        
        {!isAdmin && !isStudent && view === 'dashboard' && (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h2>🎓 Welcome to Student Performance Tracker</h2>
              <p>Choose how you'd like to access the system:</p>
              <div className="access-options">
                <button 
                  className="btn btn-primary btn-large"
                  onClick={() => setShowStudentLogin(true)}
                >
                  🎓 Student Login
                </button>
                <button 
                  className="btn btn-secondary btn-large"
                  onClick={() => setView('admin')}
                >
                  🔧 Admin Login
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <StudentLoginForm 
        isVisible={showStudentLogin}
        onLogin={handleStudentLogin}
        onCancel={handleStudentLoginCancel}
        students={students}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
