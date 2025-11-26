import React from 'react';

const PerformanceDashboard = ({ students, onStudentSelect }) => {
  const totalStudents = students.length;
  const averageAttendance = students.length > 0 
    ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length)
    : 0;
  
  const topPerformers = students
    .map(student => {
      const allScores = Object.values(student.performance).flat();
      const avgScore = allScores.length > 0 
        ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
        : 0;
      return { ...student, avgScore };
    })
    .filter(student => student.avgScore > 0) // Only show students with scores
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);

  const strugglingStudents = students
    .map(student => {
      const allScores = Object.values(student.performance).flat();
      const avgScore = allScores.length > 0 
        ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
        : 0;
      return { ...student, avgScore };
    })
    .filter(student => student.avgScore > 0 && student.avgScore < 80) // Only show students with scores below 80
    .sort((a, b) => a.avgScore - b.avgScore);

  const newStudents = students.filter(student => {
    const allScores = Object.values(student.performance).flat();
    return allScores.length === 0; // Students with no marks yet
  });

  return (
    <div className="dashboard">
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{averageAttendance}%</div>
          <div className="stat-label">Avg Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{topPerformers.length}</div>
          <div className="stat-label">Top Performers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{strugglingStudents.length}</div>
          <div className="stat-label">Need Attention</div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="student-list">
        <h2 className="section-title">🏆 Top Performers</h2>
        {topPerformers.map((student, index) => (
          <div 
            key={student.id} 
            className="student-card"
            onClick={() => onStudentSelect(student)}
          >
            <div className="student-name">
              #{index + 1} {student.name}
            </div>
            <div className="student-info">
              {student.grade} • {student.email}
            </div>
            <div className="performance-indicator">
              <span>Average Score:</span>
              <div className="performance-bar">
                <div 
                  className="performance-fill" 
                  style={{ width: `${student.avgScore}%` }}
                ></div>
              </div>
              <span>{Math.round(student.avgScore)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Students */}
      <div className="student-list">
        <h2 className="section-title">🆕 New Students</h2>
        {newStudents.length > 0 ? (
          newStudents.map((student, index) => (
            <div 
              key={student.id} 
              className="student-card"
              onClick={() => onStudentSelect(student)}
            >
              <div className="student-name">
                {student.name}
              </div>
              <div className="student-info">
                {student.grade} • {student.email}
              </div>
              <div className="performance-indicator">
                <span>Status:</span>
                <div className="performance-bar">
                  <div 
                    className="performance-fill" 
                    style={{ 
                      width: '100%',
                      background: 'linear-gradient(90deg, #17a2b8 0%, #20c997 100%)'
                    }}
                  ></div>
                </div>
                <span>No Marks Yet</span>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info">
            📚 All students have marks recorded.
          </div>
        )}
      </div>

      {/* Students Needing Attention */}
      <div className="student-list">
        <h2 className="section-title">⚠️ Students Needing Attention</h2>
        {strugglingStudents.length > 0 ? (
          strugglingStudents.map((student, index) => (
            <div 
              key={student.id} 
              className="student-card"
              onClick={() => onStudentSelect(student)}
            >
              <div className="student-name">
                {student.name}
              </div>
              <div className="student-info">
                {student.grade} • {student.email}
              </div>
              <div className="performance-indicator">
                <span>Average Score:</span>
                <div className="performance-bar">
                  <div 
                    className="performance-fill" 
                    style={{ 
                      width: `${student.avgScore}%`,
                      background: 'linear-gradient(90deg, #dc3545 0%, #fd7e14 100%)'
                    }}
                  ></div>
                </div>
                <span>{Math.round(student.avgScore)}%</span>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-success">
            🎉 All students are performing well! No students need immediate attention.
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;
