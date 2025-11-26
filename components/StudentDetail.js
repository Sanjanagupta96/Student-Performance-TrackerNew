import React, { useState } from 'react';
import PerformanceChart from './PerformanceChart';

const StudentDetail = ({ student, onBack, onUpdateStudent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: student.name,
    email: student.email,
    grade: student.grade,
    attendance: student.attendance
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedStudent = {
      ...student,
      ...editForm,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onUpdateStudent(updatedStudent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: student.name,
      email: student.email,
      grade: student.grade,
      attendance: student.attendance
    });
    setIsEditing(false);
  };

  const calculateSubjectAverage = (scores) => {
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const getOverallAverage = () => {
    const allScores = Object.values(student.performance).flat();
    return Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);
  };

  const getPerformanceGrade = (average) => {
    if (average >= 90) return { grade: 'A', color: '#28a745' };
    if (average >= 80) return { grade: 'B', color: '#ffc107' };
    if (average >= 70) return { grade: 'C', color: '#fd7e14' };
    if (average >= 60) return { grade: 'D', color: '#dc3545' };
    return { grade: 'F', color: '#6c757d' };
  };

  const overallAvg = getOverallAverage();
  const performanceGrade = getPerformanceGrade(overallAvg);

  return (
    <div className="student-detail">
      <button className="back-btn" onClick={onBack}>
        ← Back to Students
      </button>

      <div className="student-header">
        <div>
          {isEditing ? (
            <input
              type="text"
              className="form-input"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
            />
          ) : (
            <h1 className="student-title">{student.name}</h1>
          )}
        </div>
        <div className="attendance-badge">
          {student.attendance}% Attendance
        </div>
      </div>

      <div className="student-info-section">
        <div className="info-grid">
          <div className="info-item">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                className="form-input"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            ) : (
              <span>{student.email}</span>
            )}
          </div>
          
          <div className="info-item">
            <label>Grade:</label>
            {isEditing ? (
              <select
                className="form-select"
                value={editForm.grade}
                onChange={(e) => setEditForm({...editForm, grade: e.target.value})}
              >
                <option value="9th Grade">9th Grade</option>
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
              </select>
            ) : (
              <span>{student.grade}</span>
            )}
          </div>
          
          <div className="info-item">
            <label>Attendance:</label>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="100"
                className="form-input"
                value={editForm.attendance}
                onChange={(e) => setEditForm({...editForm, attendance: parseInt(e.target.value)})}
              />
            ) : (
              <span>{student.attendance}%</span>
            )}
          </div>
          
          <div className="info-item">
            <label>Overall Average:</label>
            <span style={{ color: performanceGrade.color, fontWeight: 'bold' }}>
              {overallAvg}% ({performanceGrade.grade})
            </span>
          </div>
        </div>

        <div className="edit-actions">
          {isEditing ? (
            <div>
              <button className="btn btn-success" onClick={handleSave}>
                Save Changes
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit Student
            </button>
          )}
        </div>
      </div>

      <div className="performance-section">
        <h2 className="section-title">📊 Performance Analysis</h2>
        
        {Object.entries(student.performance).map(([subject, scores]) => {
          const average = calculateSubjectAverage(scores);
          const grade = getPerformanceGrade(average);
          
          return (
            <div key={subject} className="subject-chart">
              <div className="subject-header">
                <div className="subject-name">
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </div>
                <div 
                  className="subject-average"
                  style={{ backgroundColor: grade.color }}
                >
                  {average}% ({grade.grade})
                </div>
              </div>
              
              <PerformanceChart scores={scores} subject={subject} />
              
              <div className="score-details">
                <div className="score-list">
                  {scores.map((score, index) => (
                    <div key={index} className="score-item">
                      Test {index + 1}: {score}%
                    </div>
                  ))}
                </div>
                
                <div className="score-stats">
                  <div>Highest: {Math.max(...scores)}%</div>
                  <div>Lowest: {Math.min(...scores)}%</div>
                  <div>Trend: {scores[scores.length - 1] > scores[0] ? '📈 Improving' : '📉 Declining'}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="recommendations-section">
        <h2 className="section-title">💡 Recommendations</h2>
        <div className="recommendations">
          {overallAvg < 70 && (
            <div className="alert alert-warning">
              <strong>⚠️ Academic Support Needed:</strong> This student's overall performance is below 70%. 
              Consider scheduling additional tutoring sessions and meeting with parents.
            </div>
          )}
          
          {student.attendance < 90 && (
            <div className="alert alert-warning">
              <strong>📅 Attendance Concern:</strong> Attendance is below 90%. 
              Please contact parents to discuss attendance patterns.
            </div>
          )}
          
          {overallAvg >= 90 && student.attendance >= 95 && (
            <div className="alert alert-success">
              <strong>🌟 Excellent Performance:</strong> This student is excelling in all areas. 
              Consider advanced placement opportunities or enrichment programs.
            </div>
          )}
          
          {Object.entries(student.performance).map(([subject, scores]) => {
            const average = calculateSubjectAverage(scores);
            if (average < 75) {
              return (
                <div key={subject} className="alert alert-info">
                  <strong>📚 {subject.charAt(0).toUpperCase() + subject.slice(1)} Support:</strong> 
                  Consider additional resources or tutoring for {subject}.
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
