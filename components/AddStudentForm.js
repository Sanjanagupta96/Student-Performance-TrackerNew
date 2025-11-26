import React, { useState } from 'react';

const AddStudentForm = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '9th Grade',
    dateOfBirth: '',
    attendance: 100
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const grades = ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!grades.includes(formData.grade)) {
      newErrors.grade = 'Please select a valid grade';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required for student login';
    }

    if (formData.attendance < 0 || formData.attendance > 100) {
      newErrors.attendance = 'Attendance must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate unique ID based on current timestamp and random number
      const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
      
      const newStudent = {
        id: uniqueId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        grade: formData.grade,
        dateOfBirth: formData.dateOfBirth,
        attendance: formData.attendance,
        performance: {
          math: [],
          science: [],
          english: [],
          history: []
        },
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      // In a real app, you would call the API here:
      // await studentService.createStudent(newStudent);

      onStudentAdded(newStudent);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        grade: '9th Grade',
        dateOfBirth: '',
        attendance: 100
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error adding student:', error);
      setErrors({ submit: 'Failed to add student. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="add-student-form">
      <h3>➕ Add New Student</h3>
      
      {success && (
        <div className="alert alert-success">
          ✅ Student added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter student's full name"
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="student@example.com"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="grade">
              Grade Level *
            </label>
            <select
              id="grade"
              name="grade"
              className={`form-select ${errors.grade ? 'error' : ''}`}
              value={formData.grade}
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            {errors.grade && <span className="error-message">{errors.grade}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dateOfBirth">
              Date of Birth *
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="attendance">
              Initial Attendance %
            </label>
            <input
              type="number"
              id="attendance"
              name="attendance"
              className={`form-input ${errors.attendance ? 'error' : ''}`}
              value={formData.attendance}
              onChange={handleInputChange}
              min="0"
              max="100"
              disabled={isSubmitting}
            />
            {errors.attendance && <span className="error-message">{errors.attendance}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Adding Student...
              </>
            ) : (
              'Add Student'
            )}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFormData({
              name: '',
              email: '',
              grade: '9th Grade',
              dateOfBirth: '',
              attendance: 100
            })}
            disabled={isSubmitting}
          >
            Clear Form
          </button>
        </div>

        {errors.submit && (
          <div className="alert alert-error">
            {errors.submit}
          </div>
        )}
      </form>

      <div className="form-help">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Make sure the email address is valid and unique</li>
          <li>Student ID will be automatically generated</li>
          <li>Date of birth is required for student login functionality</li>
          <li>Attendance percentage should be between 0-100</li>
          <li>New students will start with empty performance records</li>
          <li>You can edit student details after adding them</li>
        </ul>
      </div>
    </div>
  );
};

export default AddStudentForm;
