// Data Storage Utility Functions

const STORAGE_KEY = 'studentPerformanceData';

export const saveStudentsToStorage = (students) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    console.log('✅ Students data saved to localStorage:', students.length, 'students');
    return true;
  } catch (error) {
    console.error('❌ Error saving students to localStorage:', error);
    return false;
  }
};

export const loadStudentsFromStorage = () => {
  try {
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    if (savedStudents) {
      const parsedStudents = JSON.parse(savedStudents);
      console.log('✅ Students data loaded from localStorage:', parsedStudents.length, 'students');
      return parsedStudents;
    }
    return null;
  } catch (error) {
    console.error('❌ Error loading students from localStorage:', error);
    return null;
  }
};

export const clearStudentsFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Students data cleared from localStorage');
    return true;
  } catch (error) {
    console.error('❌ Error clearing students from localStorage:', error);
    return false;
  }
};

export const getStorageInfo = () => {
  try {
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    if (savedStudents) {
      const parsedStudents = JSON.parse(savedStudents);
      return {
        exists: true,
        count: parsedStudents.length,
        lastUpdated: parsedStudents.length > 0 ? parsedStudents[0].lastUpdated : null
      };
    }
    return {
      exists: false,
      count: 0,
      lastUpdated: null
    };
  } catch (error) {
    console.error('❌ Error getting storage info:', error);
    return {
      exists: false,
      count: 0,
      lastUpdated: null
    };
  }
};

export const exportStudentsData = () => {
  try {
    const students = loadStudentsFromStorage();
    if (students) {
      const dataStr = JSON.stringify(students, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `student-performance-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error exporting students data:', error);
    return false;
  }
};

export const importStudentsData = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedStudents = JSON.parse(e.target.result);
          if (Array.isArray(importedStudents)) {
            saveStudentsToStorage(importedStudents);
            resolve(importedStudents);
          } else {
            reject(new Error('Invalid data format'));
          }
        } catch (parseError) {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
};
