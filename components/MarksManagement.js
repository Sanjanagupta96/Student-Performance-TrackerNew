import React, { useState } from 'react';

const MarksManagement = ({ students, onUpdateStudents }) => {
  const [activeTab, setActiveTab] = useState('add-marks');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marksData, setMarksData] = useState({
    score: '',
    testNumber: '',
    testDate: new Date().toISOString().split('T')[0],
    testType: 'Unit Test',
    notes: ''
  });

  const subjects = ['math', 'science', 'english', 'history'];
  const testTypes = ['Unit Test', 'Mid Term', 'Final Exam', 'Quiz', 'Assignment', 'Project'];

  const handleAddMarks = () => {
    if (!selectedStudent || !selectedSubject || !marksData.score) {
      alert('Please select student, subject, and enter marks');
      return;
    }

    if (parseInt(marksData.score) < 0 || parseInt(marksData.score) > 100) {
      alert('Please enter marks between 0 and 100');
      return;
    }

    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        const updatedPerformance = { ...student.performance };
        const subjectScores = [...updatedPerformance[selectedSubject]];
        
        // Add new score to the beginning of the array
        subjectScores.unshift(parseInt(marksData.score));
        
        // Keep only the latest 10 scores
        updatedPerformance[selectedSubject] = subjectScores.slice(0, 10);
        
        return {
          ...student,
          performance: updatedPerformance,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return student;
    });

    onUpdateStudents(updatedStudents);
    
    // Update the selected student to reflect changes
    const updatedStudent = updatedStudents.find(s => s.id === selectedStudent.id);
    setSelectedStudent(updatedStudent);
    
    // Reset form
    setMarksData({
      score: '',
      testNumber: '',
      testDate: new Date().toISOString().split('T')[0],
      testType: 'Unit Test',
      notes: ''
    });
    
    alert(`Marks added successfully! ${marksData.score}% in ${selectedSubject}`);
  };

  const handleBulkMarksImport = (importData) => {
    // Parse CSV format: StudentName, Subject, Score, TestType, Date
    const lines = importData.trim().split('\n');
    const updatedStudents = [...students];
    
    lines.forEach(line => {
      if (line.trim()) {
        const [studentName, subject, score, testType, date] = line.split(',').map(item => item?.trim());
        
        const student = updatedStudents.find(s => s.name.toLowerCase() === studentName.toLowerCase());
        if (student && subjects.includes(subject.toLowerCase())) {
          const updatedPerformance = { ...student.performance };
          const subjectScores = [...updatedPerformance[subject.toLowerCase()]];
          subjectScores.unshift(parseInt(score));
          updatedPerformance[subject.toLowerCase()] = subjectScores.slice(0, 10);
          
          const studentIndex = updatedStudents.findIndex(s => s.id === student.id);
          updatedStudents[studentIndex] = {
            ...student,
            performance: updatedPerformance,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
      }
    });

    onUpdateStudents(updatedStudents);
  };

  return (
    <div className="marks-management">
      <div className="marks-header">
        <h3>📝 Marks Management</h3>
        <div className="marks-tabs">
          <button 
            className={`marks-tab ${activeTab === 'add-marks' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-marks')}
          >
            ➕ Add Individual Marks
          </button>
          <button 
            className={`marks-tab ${activeTab === 'bulk-marks' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk-marks')}
          >
            📊 Bulk Marks Import
          </button>
          <button 
            className={`marks-tab ${activeTab === 'marks-history' ? 'active' : ''}`}
            onClick={() => setActiveTab('marks-history')}
          >
            📋 Marks History
          </button>
        </div>
      </div>

      <div className="marks-content">
        {activeTab === 'add-marks' && (
          <AddMarksForm
            students={students}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            marksData={marksData}
            setMarksData={setMarksData}
            onAddMarks={handleAddMarks}
          />
        )}

        {activeTab === 'bulk-marks' && (
          <BulkMarksImport onImport={handleBulkMarksImport} />
        )}

        {activeTab === 'marks-history' && (
          <MarksHistory students={students} />
        )}
      </div>
    </div>
  );
};

// Add Individual Marks Form Component
const AddMarksForm = ({ 
  students, 
  selectedStudent, 
  setSelectedStudent, 
  selectedSubject, 
  setSelectedSubject,
  marksData,
  setMarksData,
  onAddMarks 
}) => {
  const subjects = [
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' }
  ];

  const testTypes = ['Unit Test', 'Mid Term', 'Final Exam', 'Quiz', 'Assignment', 'Project'];

  const handleInputChange = (field, value) => {
    setMarksData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStudentPerformance = () => {
    if (!selectedStudent || !selectedSubject) return null;
    
    const scores = selectedStudent.performance[selectedSubject];
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    return {
      scores,
      average: Math.round(average),
      latest: scores[0] || 0,
      highest: Math.max(...scores),
      lowest: Math.min(...scores)
    };
  };

  const performance = getStudentPerformance();

  return (
    <div className="add-marks-form">
      <div className="marks-form-grid">
        <div className="marks-form-section">
          <h4>🎯 Student & Subject Selection</h4>
          
          <div className="form-group">
            <label className="form-label">Select Student:</label>
            <select
              className="form-select"
              value={selectedStudent?.id || ''}
              onChange={(e) => {
                const student = students.find(s => s.id === parseInt(e.target.value));
                setSelectedStudent(student);
              }}
            >
              <option value="">Choose a student...</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.grade})
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="student-info-card">
              <h5>📚 {selectedStudent.name}</h5>
              <p>📧 {selectedStudent.email}</p>
              <p>🎓 {selectedStudent.grade}</p>
              <p>📅 Attendance: {selectedStudent.attendance}%</p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Subject:</label>
            <div className="subject-buttons">
              {subjects.map(subject => (
                <button
                  key={subject.value}
                  type="button"
                  className={`subject-btn ${selectedSubject === subject.value ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(subject.value)}
                >
                  {subject.label}
                </button>
              ))}
            </div>
          </div>

          {performance && (
            <div className="performance-summary">
              <h5>📊 Current Performance in {subjects.find(s => s.value === selectedSubject)?.label}</h5>
              <div className="performance-stats">
                <div className="stat">
                  <span className="stat-label">Latest Score:</span>
                  <span className="stat-value">{performance.latest}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Average:</span>
                  <span className="stat-value">{performance.average}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Highest:</span>
                  <span className="stat-value">{performance.highest}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Lowest:</span>
                  <span className="stat-value">{performance.lowest}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="marks-form-section">
          <h4>📝 Enter Marks Details</h4>
          
          <div className="form-group">
            <label className="form-label">Marks Scored:</label>
            <input
              type="number"
              className="form-input"
              min="0"
              max="100"
              value={marksData.score}
              onChange={(e) => handleInputChange('score', e.target.value)}
              placeholder="Enter marks (0-100)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Test Number:</label>
            <input
              type="text"
              className="form-input"
              value={marksData.testNumber}
              onChange={(e) => handleInputChange('testNumber', e.target.value)}
              placeholder="e.g., Test 1, Quiz 2, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Test Type:</label>
            <select
              className="form-select"
              value={marksData.testType}
              onChange={(e) => handleInputChange('testType', e.target.value)}
            >
              {testTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Test Date:</label>
            <input
              type="date"
              className="form-input"
              value={marksData.testDate}
              onChange={(e) => handleInputChange('testDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional):</label>
            <textarea
              className="form-input"
              rows="3"
              value={marksData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes about the test..."
            />
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={onAddMarks}
              disabled={!selectedStudent || !selectedSubject || !marksData.score}
            >
              ➕ Add Marks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bulk Marks Import Component
const BulkMarksImport = ({ onImport }) => {
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onImport(importData);
      setImportData('');
      alert('Marks imported successfully!');
    } catch (error) {
      alert('Error importing marks. Please check the format.');
    }
    setIsImporting(false);
  };

  return (
    <div className="bulk-marks-import">
      <h4>📊 Bulk Marks Import</h4>
      
      <div className="import-instructions">
        <h5>📋 Import Format (CSV):</h5>
        <p>Enter marks data in CSV format, one entry per line:</p>
        <code>StudentName, Subject, Score, TestType, Date</code>
        <p><strong>Example:</strong></p>
        <code>John Smith, math, 85, Unit Test, 2024-01-15</code>
        <code>Jane Doe, science, 92, Quiz, 2024-01-16</code>
      </div>

      <div className="form-group">
        <label className="form-label">Marks Data:</label>
        <textarea
          className="form-input"
          rows="10"
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          placeholder="Enter marks data here..."
        />
      </div>

      <div className="form-actions">
        <button 
          className="btn btn-primary"
          onClick={handleImport}
          disabled={isImporting || !importData.trim()}
        >
          {isImporting ? 'Importing...' : 'Import Marks'}
        </button>
      </div>
    </div>
  );
};

// Marks History Component
const MarksHistory = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' }
  ];

  const getFilteredScores = () => {
    if (!selectedStudent) return [];

    if (selectedSubject === 'all') {
      return Object.entries(selectedStudent.performance).map(([subject, scores]) => ({
        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
        scores: scores.map((score, index) => ({ score, testNumber: index + 1 }))
      }));
    }

    return [{
      subject: selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1),
      scores: selectedStudent.performance[selectedSubject].map((score, index) => ({ score, testNumber: index + 1 }))
    }];
  };

  const filteredScores = getFilteredScores();

  return (
    <div className="marks-history">
      <h4>📋 Marks History</h4>
      
      <div className="history-filters">
        <div className="form-group">
          <label className="form-label">Select Student:</label>
          <select
            className="form-select"
            value={selectedStudent?.id || ''}
            onChange={(e) => {
              const student = students.find(s => s.id === parseInt(e.target.value));
              setSelectedStudent(student);
            }}
          >
            <option value="">Choose a student...</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.grade})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="form-group">
            <label className="form-label">Subject:</label>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map(subject => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="history-content">
          <div className="student-summary">
            <h5>📚 {selectedStudent.name}</h5>
            <p>📧 {selectedStudent.email} • 🎓 {selectedStudent.grade}</p>
          </div>

          {filteredScores.map(({ subject, scores }) => (
            <div key={subject} className="subject-history">
              <h6>{subject}</h6>
              <div className="scores-grid">
                {scores.map(({ score, testNumber }) => (
                  <div key={testNumber} className="score-item">
                    <span className="test-number">Test {testNumber}</span>
                    <span className={`score-value ${score >= 80 ? 'good' : score >= 60 ? 'average' : 'poor'}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarksManagement;
