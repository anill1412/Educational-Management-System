// src/components/TeacherDashboard.js

import React, { useState } from 'react';
import axios from 'axios';

const TeacherPreferences = () => {
  const [teacherData, setTeacherData] = useState({
    name: '',
    subjects: '',
    availability: '',
    classType: 'subject',
    labHours: '',
    labDay: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { subjects, availability, classType, labHours, labDay } = teacherData;

    // Convert comma-separated lists to arrays for subjects and availability
    const formattedData = {
      ...teacherData,
      subjects: subjects.split(',').map((s) => s.trim()),
      availability: availability.split(',').map((a) => a.trim()),
      labDetails: classType === 'lab' ? { labHours, labDay } : undefined
    };  

    try {
      await axios.post('http://localhost:5000/add', formattedData);
      alert('Teacher details submitted successfully!');
      setTeacherData({
        name: '',
        subjects: '',
        availability: '',
        classType: 'subject',
        labHours: '',
        labDay: ''
      });
    } catch (error) {
      alert('Error submitting details. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={teacherData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Subjects (comma-separated):</label>
          <input type="text" name="subjects" value={teacherData.subjects} onChange={handleChange} required />
        </div>
        <div>
          <label>Availability (comma-separated days):</label>
          <input type="text" name="availability" value={teacherData.availability} onChange={handleChange} required />
        </div>
        <div>
          <label>Class Type:</label>
          <select name="classType" value={teacherData.classType} onChange={handleChange}>
            <option value="subject">Subject</option>
            <option value="lab">Lab</option>
          </select>
        </div>
        {teacherData.classType === 'lab' && (
          <>
            <div>
              <label>Lab Hours:</label>
              <input type="number" name="labHours" value={teacherData.labHours} onChange={handleChange} />
            </div>
            <div>
              <label>Lab Day:</label>
              <input type="text" name="labDay" value={teacherData.labDay} onChange={handleChange} />
            </div>
          </>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TeacherPreferences
