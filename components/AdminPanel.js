import React, { useState } from 'react';
import AddStudentForm from './AddStudentForm';
import StudentManagement from './StudentManagement';
import MarksManagement from './MarksManagement';
import DataManagement from './DataManagement';
import AccessGuide from './AccessGuide';

const AdminPanel = ({ students, onUpdateStudents, onStudentSelect }) => {
  const [activeTab, setActiveTab] = useState('add-student');

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>🔧 Admin Panel</h2>
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'add-student' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-student')}
          >
            ➕ Add Student
          </button>
          <button 
            className={`admin-tab ${activeTab === 'manage-students' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage-students')}
          >
            👥 Manage Students
          </button>
          <button 
            className={`admin-tab ${activeTab === 'marks-management' ? 'active' : ''}`}
            onClick={() => setActiveTab('marks-management')}
          >
            📝 Marks Management
          </button>
          <button 
            className={`admin-tab ${activeTab === 'bulk-import' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk-import')}
          >
            📊 Bulk Import
          </button>
          <button 
            className={`admin-tab ${activeTab === 'data-management' ? 'active' : ''}`}
            onClick={() => setActiveTab('data-management')}
          >
            💾 Data Management
          </button>
          <button 
            className={`admin-tab ${activeTab === 'access-guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('access-guide')}
          >
            📖 Access Guide
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'add-student' && (
          <AddStudentForm 
            onStudentAdded={(newStudent) => {
              const updatedStudents = [...students, newStudent];
              onUpdateStudents(updatedStudents);
            }}
          />
        )}

        {activeTab === 'manage-students' && (
          <StudentManagement 
            students={students}
            onUpdateStudents={onUpdateStudents}
            onStudentSelect={onStudentSelect}
          />
        )}

        {activeTab === 'marks-management' && (
          <MarksManagement 
            students={students}
            onUpdateStudents={onUpdateStudents}
          />
        )}

        {activeTab === 'bulk-import' && (
          <BulkImportPanel onStudentsImported={onUpdateStudents} />
        )}

        {activeTab === 'data-management' && (
          <DataManagement 
            students={students}
            onUpdateStudents={onUpdateStudents}
          />
        )}

        {activeTab === 'access-guide' && (
          <AccessGuide />
        )}
      </div>
    </div>
  );
};

// Bulk Import Component
const BulkImportPanel = ({ onStudentsImported }) => {
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      // Parse CSV or JSON data. Supported CSV formats:
      // 1) Name, Email, Grade, Attendance
      // 2) Name, Email, Grade, Attendance, DateOfBirth
      // 3) StudentID, Name, Email, Grade, Attendance, DateOfBirth (optional StudentID)
      const lines = importData.trim().split('\n');
      const students = [];
      
      lines.forEach((line, index) => {
        if (line.trim()) {
          const parts = line.split(',').map(p => p?.trim());
          let idFromCsv;
          let name;
          let email;
          let grade;
          let attendance;
          let dateOfBirth;

          // If first column is numeric, treat as StudentID present
          if (parts.length >= 5 && /^\d+$/.test(parts[0])) {
            // Format: StudentID, Name, Email, Grade, Attendance (, DOB)
            [idFromCsv, name, email, grade, attendance, dateOfBirth] = parts;
          } else {
            // Format: Name, Email, Grade, Attendance (, DOB)
            [name, email, grade, attendance, dateOfBirth] = parts;
          }

          const studentObj = {
            id: idFromCsv ? parseInt(idFromCsv) : (Date.now() + index),
            name: name || '',
            email: email || '',
            grade: grade || '9th Grade',
            attendance: parseInt(attendance) || 100,
            performance: {
              math: [0, 0, 0, 0, 0],
              science: [0, 0, 0, 0, 0],
              english: [0, 0, 0, 0, 0],
              history: [0, 0, 0, 0, 0]
            },
            lastUpdated: new Date().toISOString().split('T')[0]
          };

          if (dateOfBirth) {
            studentObj.dateOfBirth = dateOfBirth;
          }

          students.push(studentObj);
        }
      });

      setImportResults({
        success: students.length,
        errors: 0,
        students: students
      });

      // Update the students list
      onStudentsImported(prev => [...prev, ...students]);
      
    } catch (error) {
      setImportResults({
        success: 0,
        errors: 1,
        error: error.message
      });
    }
    setIsImporting(false);
  };

  return (
    <div className="bulk-import-panel">
      <h3>📊 Bulk Import Students</h3>
      
      <div className="import-instructions">
        <h4>Import Format (CSV):</h4>
        <p>Enter student data in CSV format, one student per line:</p>
        <code>Name, Email, Grade, Attendance[, DateOfBirth]</code>
        <p>Optionally include StudentID as first column:</p>
        <code>StudentID, Name, Email, Grade, Attendance[, DateOfBirth]</code>
        <p><strong>Example:</strong></p>
        <code>John Smith, john.smith@email.com, 10th Grade, 95, 2008-03-15</code>
        <p><strong>Example with StudentID:</strong></p>
        <code>1001, Jane Doe, jane.doe@email.com, 11th Grade, 98, 2007-07-22</code>
      </div>

      <div className="form-group">
        <label className="form-label">Student Data:</label>
        <textarea
          className="form-input"
          rows="10"
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          placeholder="Enter student data here..."
        />
      </div>

      <div className="import-actions">
        <button 
          className="btn btn-primary"
          onClick={handleImport}
          disabled={isImporting || !importData.trim()}
        >
          {isImporting ? 'Importing...' : 'Import Students'}
        </button>
      </div>

      {importResults && (
        <div className="import-results">
          <div className={`alert ${importResults.errors > 0 ? 'alert-error' : 'alert-success'}`}>
            <h4>Import Results:</h4>
            <p>✅ Successfully imported: {importResults.success} students</p>
            {importResults.errors > 0 && (
              <p>❌ Errors: {importResults.errors}</p>
            )}
            {importResults.error && (
              <p>Error: {importResults.error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
