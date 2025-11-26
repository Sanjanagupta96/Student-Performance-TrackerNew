import React, { useState } from 'react';

const StudentList = ({ students, onStudentSelect, onUpdateStudents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filter and sort students
  const filteredStudents = students.filter(
    student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
      return matchesSearch && matchesGrade;
    }
  ).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'grade':
        return a.grade.localeCompare(b.grade);
      case 'attendance':
        return b.attendance - a.attendance;
      case 'performance':
        const aAvg = Object.values(a.performance).flat().reduce((sum, score) => sum + score, 0) / 
                     Object.values(a.performance).flat().length;
        const bAvg = Object.values(b.performance).flat().reduce((sum, score) => sum + score, 0) / 
                     Object.values(b.performance).flat().length;
        return bAvg - aAvg;
      default:
        return 0;
    }
  });

  const getUniqueGrades = () => {
    const grades = students.map(student => student.grade);
    return [...new Set(grades)];
  };

  const calculateAverageScore = (student) => {
    const scores = Object.values(student.performance).flat();
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  return (
    <div className="student-list">
      <div className="filters-section">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search students..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="form-group">
            <select 
              className="form-select" 
              value={filterGrade} 
              onChange={(e) => setFilterGrade(e.target.value)}
            >
              <option value="all">All Grades</option>
              {getUniqueGrades().map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <select 
              className="form-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="grade">Sort by Grade</option>
              <option value="attendance">Sort by Attendance</option>
              <option value="performance">Sort by Performance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="students-grid">
        {filteredStudents.map(student => {
          const avgScore = calculateAverageScore(student);
          const performanceColor = avgScore >= 90 ? '#28a745' : 
                                 avgScore >= 80 ? '#ffc107' : 
                                 avgScore >= 70 ? '#fd7e14' : '#dc3545';
          
          return (
            <div 
              key={student.id} 
              className="student-card"
              onClick={() => onStudentSelect(student)}
            >
              <div className="student-header">
                <div className="student-name">{student.name}</div>
                <div className="student-badge" style={{ backgroundColor: performanceColor }}>
                  {avgScore}%
                </div>
              </div>
              
              <div className="student-info">
                <div>📧 {student.email}</div>
                <div>🎓 {student.grade}</div>
                <div>📅 {student.attendance}% Attendance</div>
              </div>
              
              <div className="performance-summary">
                <div className="subject-scores">
                  {Object.entries(student.performance).map(([subject, scores]) => {
                    const avg = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
                    return (
                      <div key={subject} className="subject-score">
                        <span className="subject-name">{subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
                        <span className="score">{avg}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="last-updated">
                Last updated: {new Date(student.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="alert alert-info">
          No students found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default StudentList;
