import html2canvas from 'html2canvas';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './timetable.css';

const REACT_APP_BASE_URL = "http://localhost:5000";
const TimeTable= () => {
  const [teachers, setTeachers] = useState([]);
  const [timetable, setTimetable] = useState({});
  
 
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL}/api`);
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    fetchTeachers();
  }, []);
  const generateTimetable = () => {
    if (teachers.length === 0) {
      alert('Please add at least one teacher before generating the timetable.');
      return;
    }
    
    const newTimetable = {};
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
    // Initialize timetable with empty slots and set "Lunch" at 12 PM
    daysOfWeek.forEach(day => {
      newTimetable[day] = {
        '9:00 AM': null,
        '10:00 AM': null,
        '11:00 AM': null,
        '12:00 PM': 'Lunch',
        '1:00 PM': null,
        '2:00 PM': null,
        '3:00 PM': null,
      };
    });
  
    // Allocate labs first to prioritize them
    teachers.forEach(teacher => {
      if (teacher.classType === 'lab') {
        const day = teacher.labDetails.labDay;
        const hours = teacher.labDetails.labHours;
  
        // Ensure the day exists in the timetable before proceeding
        if (!newTimetable[day]) {
          console.error(`Day ${day} is not defined in timetable`);
          return;
        }
  
        let time = 9;
        let slotsAllocated = 0;
        while (slotsAllocated < hours && time < 12) {
          const timeSlot = `${time}:00 AM`;
          
          if (newTimetable[day][timeSlot] === null) {
            newTimetable[day][timeSlot] = {
              subject: teacher.subjects.join(', '),
              colSpan: hours,
              classType: 'lab'
            };
            slotsAllocated = hours;
            
            // Mark subsequent hours as 'occupied' for the lab session
            for (let i = 1; i < hours; i++) {
              newTimetable[day][`${time + i}:00 AM`] = 'occupied';
            }
          }
          time++;
        }
      }
    });
  
    // Allocate subjects to remaining free slots, including slots after labs on lab day
    teachers.forEach(teacher => {
      if (teacher.classType === 'subject') {
        teacher.availability.forEach(day => {
          // Ensure the day exists in the timetable before proceeding
          if (!newTimetable[day]) {
            console.error(`Day ${day} is not defined in timetable`);
            return;
          }
  
          const availableTimes = Object.keys(newTimetable[day])
            .filter(time => newTimetable[day][time] === null && time !== '12:00 PM')
            .sort(() => Math.random() - 0.5);
  
          if (availableTimes.length > 0) {
            const time = availableTimes[0];
            newTimetable[day][time] = {
              subject: teacher.subjects.join(', '),
              classType: 'subject'
            };
          }
        });
      }
    });
  
    // Fill remaining free slots with Sports, Library, or Tutorial
    daysOfWeek.forEach(day => {
      let sportsAdded = false;
  
      Object.keys(newTimetable[day]).forEach(time => {
        if (newTimetable[day][time] === null) {
          if (!sportsAdded) {
            newTimetable[day][time] = 'Sports';
            sportsAdded = true;
          } else if (!Object.values(newTimetable[day]).includes('Library')) {
            newTimetable[day][time] = 'Library';
          } else {
            newTimetable[day][time] = 'Tutorial';
          }
        }
      });
    });
  
    setTimetable(newTimetable);
  };
  
  
  
  const downloadTimetable = () => {
    const timetableElement = document.getElementById('timetable');
    if (!timetableElement) {
      alert('Timetable element not found');
      return;
    }
  
    html2canvas(timetableElement)
      .then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'timetable.png';
        link.click();
      })
      .catch((error) => {
        console.error('Error capturing the timetable:', error);
        alert('Failed to capture the timetable. Please try again.');
      });
  };
  

  return (
    <div>
      <h1>Timetable Generator</h1>
      <button onClick={generateTimetable}>Generate Timetable</button>
      <button onClick={downloadTimetable}>Download Timetable as Image</button>
      <table id="timetable">
        <thead>
          <tr>
            <th>Day</th>
            <th>9:00 AM</th>
            <th>10:00 AM</th>
            <th>11:00 AM</th>
            <th>12:00 PM</th>
            <th>1:00 PM</th>
            <th>2:00 PM</th>
            <th>3:00 PM</th>
          </tr>
        </thead>
        
        <tbody>
  {Object.keys(timetable).map((day) => (
    <tr key={day}>
      <td>{day}</td>
      {Object.keys(timetable[day]).map((time, index) => {
        const cellData = timetable[day][time];
        
        // Skip rendering 'occupied' cells; only render the cell that starts a lab session.
        if (cellData === 'occupied') return null;

        return (
          <td key={time} colSpan={cellData?.colSpan || 1}>
            {cellData?.subject || cellData || ''}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>
      
      </table>
    </div>
  );
};
export default TimeTable;


