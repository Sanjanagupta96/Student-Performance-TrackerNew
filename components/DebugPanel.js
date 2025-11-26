import React from 'react';

const DebugPanel = ({ students }) => {
  const debugInfo = {
    totalStudents: students.length,
    studentsWithMarks: students.filter(s => Object.values(s.performance).flat().length > 0).length,
    studentsWithoutMarks: students.filter(s => Object.values(s.performance).flat().length === 0).length,
    latestStudent: students[students.length - 1] || null
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '120px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>🐛 Debug Info</h4>
      <div>Total Students: {debugInfo.totalStudents}</div>
      <div>With Marks: {debugInfo.studentsWithMarks}</div>
      <div>Without Marks: {debugInfo.studentsWithoutMarks}</div>
      {debugInfo.latestStudent && (
        <div style={{ marginTop: '10px', padding: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
          <div><strong>Latest:</strong> {debugInfo.latestStudent.name}</div>
          <div><strong>ID:</strong> {debugInfo.latestStudent.id}</div>
          <div><strong>Marks:</strong> {Object.values(debugInfo.latestStudent.performance).flat().length}</div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
