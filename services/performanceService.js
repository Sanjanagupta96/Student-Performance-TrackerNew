import api from './api';

class PerformanceService {
  // Add performance record for a student
  async addPerformanceRecord(studentId, performanceData) {
    try {
      const response = await api.post(`/students/${studentId}/performance`, performanceData);
      return response.data || response;
    } catch (error) {
      console.error('Error adding performance record:', error);
      throw error;
    }
  }

  // Update performance record
  async updatePerformanceRecord(studentId, recordId, performanceData) {
    try {
      const response = await api.put(`/students/${studentId}/performance/${recordId}`, performanceData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating performance record:', error);
      throw error;
    }
  }

  // Delete performance record
  async deletePerformanceRecord(studentId, recordId) {
    try {
      const response = await api.delete(`/students/${studentId}/performance/${recordId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting performance record:', error);
      throw error;
    }
  }

  // Get performance records for a student
  async getStudentPerformance(studentId, subject = null, dateRange = null) {
    try {
      let endpoint = `/students/${studentId}/performance`;
      const params = new URLSearchParams();
      
      if (subject) params.append('subject', subject);
      if (dateRange?.start) params.append('startDate', dateRange.start);
      if (dateRange?.end) params.append('endDate', dateRange.end);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      const response = await api.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching student performance:', error);
      throw error;
    }
  }

  // Get class performance summary
  async getClassPerformanceSummary(grade = null, subject = null) {
    try {
      let endpoint = '/performance/class-summary';
      const params = new URLSearchParams();
      
      if (grade) params.append('grade', grade);
      if (subject) params.append('subject', subject);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      const response = await api.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching class performance summary:', error);
      throw error;
    }
  }

  // Get performance analytics
  async getPerformanceAnalytics(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const endpoint = `/performance/analytics${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching performance analytics:', error);
      throw error;
    }
  }

  // Get attendance records
  async getAttendanceRecords(studentId, dateRange = null) {
    try {
      let endpoint = `/students/${studentId}/attendance`;
      const params = new URLSearchParams();
      
      if (dateRange?.start) params.append('startDate', dateRange.start);
      if (dateRange?.end) params.append('endDate', dateRange.end);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      const response = await api.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  }

  // Update attendance
  async updateAttendance(studentId, attendanceData) {
    try {
      const response = await api.put(`/students/${studentId}/attendance`, attendanceData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  // Bulk import performance data
  async bulkImportPerformance(performanceData) {
    try {
      const response = await api.post('/performance/bulk-import', performanceData);
      return response.data || response;
    } catch (error) {
      console.error('Error bulk importing performance data:', error);
      throw error;
    }
  }

  // Export performance data
  async exportPerformanceData(filters = {}, format = 'json') {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('format', format);
      
      const endpoint = `/performance/export?${params.toString()}`;
      const response = await api.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Error exporting performance data:', error);
      throw error;
    }
  }
}

export default new PerformanceService();
