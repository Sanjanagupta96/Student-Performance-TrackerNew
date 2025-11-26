import React, { useState } from 'react';

const StudentManagement = ({ students, onUpdateStudents, onStudentSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [editingStudent, setEditingStudent] = useState(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      const updatedStudents = students.filter(student => student.id !== studentId);
      onUpdateStudents(updatedStudents);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent({ ...student });
  };

  const handleSaveEdit = () => {
    const updatedStudents = students.map(student => 
      student.id === editingStudent.id ? editingStudent : student
    );
    onUpdateStudents(updatedStudents);
    setEditingStudent(null);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const handleInputChange = (field, value) => {
    setEditingStudent(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  return (
    <div className="student-management">
      <h3>👥 Student Management</h3>
      
      <div className="management-filters">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search students..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <select 
            className="form-select" 
            value={filterGrade} 
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option value="all">All Grades</option>
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
            <option value="11th Grade">11th Grade</option>
            <option value="12th Grade">12th Grade</option>
          </select>
        </div>
      </div>

      <div className="students-table">
        <div className="table-header">
          <div className="table-cell">Name</div>
          <div className="table-cell">Email</div>
          <div className="table-cell">Grade</div>
          <div className="table-cell">Attendance</div>
          <div className="table-cell">Last Updated</div>
          <div className="table-cell">Actions</div>
        </div>

        {filteredStudents.map(student => (
          <div key={student.id} className="table-row">
            {editingStudent && editingStudent.id === student.id ? (
              // Edit mode
              <>
                <div className="table-cell">
                  <input
                    type="text"
                    className="form-input table-input"
                    value={editingStudent.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="table-cell">
                  <input
                    type="email"
                    className="form-input table-input"
                    value={editingStudent.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="table-cell">
                  <select
                    className="form-select table-input"
                    value={editingStudent.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                  >
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                    <option value="11th Grade">11th Grade</option>
                    <option value="12th Grade">12th Grade</option>
                  </select>
                </div>
                <div className="table-cell">
                  <input
                    type="number"
                    className="form-input table-input"
                    value={editingStudent.attendance}
                    onChange={(e) => handleInputChange('attendance', parseInt(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="table-cell">
                  {editingStudent.lastUpdated}
                </div>
                <div className="table-cell">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={handleSaveEdit}
                  >
                    💾 Save
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={handleCancelEdit}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </>
            ) : (
              // View mode
              <>
                <div className="table-cell">{student.name}</div>
                <div className="table-cell">{student.email}</div>
                <div className="table-cell">{student.grade}</div>
                <div className="table-cell">{student.attendance}%</div>
                <div className="table-cell">{student.lastUpdated}</div>
                <div className="table-cell">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onStudentSelect(student)}
                    title="View Details"
                  >
                    👁️ View
                  </button>
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditStudent(student)}
                    title="Edit Student"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteStudent(student.id)}
                    title="Delete Student"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="alert alert-info">
          No students found matching your criteria.
        </div>
      )}

      <div className="management-stats">
        <div className="stat-item">
          <span className="stat-label">Total Students:</span>
          <span className="stat-value">{students.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Filtered Results:</span>
          <span className="stat-value">{filteredStudents.length}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
