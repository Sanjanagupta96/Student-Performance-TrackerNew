import React, { useState, useEffect } from 'react';
import { 
  getStorageInfo, 
  exportStudentsData, 
  importStudentsData, 
  clearStudentsFromStorage 
} from '../utils/dataStorage';

const DataManagement = ({ students, onUpdateStudents }) => {
  const [storageInfo, setStorageInfo] = useState({ exists: false, count: 0, lastUpdated: null });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    updateStorageInfo();
  }, [students]);

  const updateStorageInfo = () => {
    const info = getStorageInfo();
    setStorageInfo(info);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const success = exportStudentsData();
      if (success) {
        showMessage('success', '✅ Data exported successfully!');
      } else {
        showMessage('error', '❌ No data to export');
      }
    } catch (error) {
      showMessage('error', '❌ Error exporting data');
    }
    setIsLoading(false);
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const importedStudents = await importStudentsData(file);
      onUpdateStudents(importedStudents);
      showMessage('success', `✅ Data imported successfully! ${importedStudents.length} students loaded.`);
    } catch (error) {
      showMessage('error', '❌ Error importing data. Please check file format.');
    }
    setIsLoading(false);
    
    // Clear the file input
    event.target.value = '';
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ Are you sure you want to clear all student data? This action cannot be undone!')) {
      try {
        clearStudentsFromStorage();
        onUpdateStudents([]);
        showMessage('success', '✅ All data cleared successfully!');
      } catch (error) {
        showMessage('error', '❌ Error clearing data');
      }
    }
  };

  const handleResetToSample = () => {
    if (window.confirm('🔄 Are you sure you want to reset to sample data? Current data will be replaced!')) {
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
          lastUpdated: new Date().toISOString().split('T')[0]
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
          lastUpdated: new Date().toISOString().split('T')[0]
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
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      ];
      onUpdateStudents(sampleStudents);
      showMessage('success', '✅ Reset to sample data successful!');
    }
  };

  return (
    <div className="data-management">
      <h3>💾 Data Management</h3>
      
      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <div className="data-management-grid">
        {/* Storage Information */}
        <div className="data-section">
          <h4>📊 Storage Information</h4>
          <div className="storage-info">
            <div className="info-item">
              <span className="info-label">Data Status:</span>
              <span className={`info-value ${storageInfo.exists ? 'success' : 'warning'}`}>
                {storageInfo.exists ? '✅ Stored' : '⚠️ No Data'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Students:</span>
              <span className="info-value">{storageInfo.count}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">
                {storageInfo.lastUpdated || 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Storage Type:</span>
              <span className="info-value">Local Storage</span>
            </div>
          </div>
        </div>

        {/* Export Data */}
        <div className="data-section">
          <h4>📤 Export Data</h4>
          <div className="section-content">
            <p>Export all student data to a JSON file for backup or transfer.</p>
            <button 
              className="btn btn-primary"
              onClick={handleExportData}
              disabled={isLoading || storageInfo.count === 0}
            >
              {isLoading ? 'Exporting...' : '📥 Export Data'}
            </button>
          </div>
        </div>

        {/* Import Data */}
        <div className="data-section">
          <h4>📥 Import Data</h4>
          <div className="section-content">
            <p>Import student data from a previously exported JSON file.</p>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="importFile"
                accept=".json"
                onChange={handleImportData}
                disabled={isLoading}
                className="file-input"
              />
              <label htmlFor="importFile" className="file-input-label">
                {isLoading ? 'Importing...' : '📁 Choose File'}
              </label>
            </div>
          </div>
        </div>

        {/* Clear Data */}
        <div className="data-section">
          <h4>🗑️ Clear Data</h4>
          <div className="section-content">
            <p>Remove all student data from storage. This action cannot be undone!</p>
            <button 
              className="btn btn-danger"
              onClick={handleClearData}
              disabled={isLoading || storageInfo.count === 0}
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* Reset to Sample */}
        <div className="data-section">
          <h4>🔄 Reset to Sample</h4>
          <div className="section-content">
            <p>Reset the application to sample data. Current data will be replaced.</p>
            <button 
              className="btn btn-warning"
              onClick={handleResetToSample}
              disabled={isLoading}
            >
              🔄 Reset to Sample Data
            </button>
          </div>
        </div>

        {/* Data Tips */}
        <div className="data-section tips-section">
          <h4>💡 Data Management Tips</h4>
          <div className="tips-content">
            <ul>
              <li>✅ <strong>Auto-Save:</strong> All changes are automatically saved to localStorage</li>
              <li>📁 <strong>Backup:</strong> Export your data regularly for backup</li>
              <li>🔄 <strong>Import/Export:</strong> Use JSON format for data transfer</li>
              <li>🗑️ <strong>Clear Data:</strong> Use with caution - action cannot be undone</li>
              <li>📊 <strong>Persistence:</strong> Data persists across browser sessions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="data-actions">
        <div className="action-group">
          <button 
            className="btn btn-success"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
