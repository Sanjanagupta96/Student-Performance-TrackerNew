import api from './api';

class StudentService {
  // Get all students
  async getAllStudents() {
    try {
      const response = await api.get('/students');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  // Get student by ID
  async getStudentById(id) {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  // Create new student
  async createStudent(studentData) {
    try {
      const response = await api.post('/students', studentData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  // Update student
  async updateStudent(id, studentData) {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  // Delete student
  async deleteStudent(id) {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  // Get students by grade
  async getStudentsByGrade(grade) {
    try {
      const response = await api.get(`/students/grade/${grade}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching students by grade:', error);
      throw error;
    }
  }

  // Search students
  async searchStudents(query) {
    try {
      const response = await api.get(`/students/search?q=${encodeURIComponent(query)}`);
      return response.data || response;
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  }

  // Get student performance analytics
  async getStudentAnalytics(studentId) {
    try {
      const response = await api.get(`/students/${studentId}/analytics`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching student analytics:', error);
      throw error;
    }
  }

  // Get performance trends for a student
  async getPerformanceTrends(studentId, subject = null) {
    try {
      const endpoint = subject 
        ? `/students/${studentId}/trends?subject=${subject}`
        : `/students/${studentId}/trends`;
      const response = await api.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching performance trends:', error);
      throw error;
    }
  }
}

export default new StudentService();
