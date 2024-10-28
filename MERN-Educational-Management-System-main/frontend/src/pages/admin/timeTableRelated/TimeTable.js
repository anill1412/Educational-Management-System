// import React, { useState } from 'react';
// import html2canvas from 'html2canvas';
// import './timetable.css';

// const TimeTable = () => {
//   const [classType, setClassType] = useState('subject');
//   const [teacherName, setTeacherName] = useState('');
//   const [subjects, setSubjects] = useState('');
//   const [availability, setAvailability] = useState('');
//   const [labHours, setLabHours] = useState('');
//   const [labDay, setLabDay] = useState('');
//   const [teachers, setTeachers] = useState([]);
//   const [timetable, setTimetable] = useState({});
//   const [showRules, setShowRules] = useState(false);
  
//   const clearForm = () => {
//     setClassType('subject');
//     setTeacherName('');
//     setSubjects('');
//     setAvailability('');
//     setLabHours('');
//     setLabDay('');
//   };

//   const addTeacher = () => {
//     if (!teacherName.trim()) {
//       alert('Please enter the teacher name.');
//       return;
//     }

//     if (!subjects.trim()) {
//       alert('Please enter at least one subject.');
//       return;
//     }

//     const subjectsArray = subjects.split(',').map(s => s.trim());

//     if (classType === 'lab') {
//       if (!labHours || !labDay) {
//         alert('Please fill in lab hours and lab day.');
//         return;
//       }
//       if (labHours < 2 || labHours > 3) {
//         alert('Lab hours should be either 2 or 3.');
//         return;
//       }
//       const teacher = { name: teacherName, subjects: subjectsArray, classType, labDetails: { labHours: parseInt(labHours), labDay } };
//       setTeachers([...teachers, teacher]);
//     } else {
//       const availabilityArray = availability.split(',').map(d => d.trim());
//       if (availabilityArray.length < 4) {
//         alert('Please enter at least 4 available days.');
//         return;
//       }
//       const teacher = { name: teacherName, subjects: subjectsArray, classType, availability: availabilityArray };
//       setTeachers([...teachers, teacher]);
//     }

//     clearForm();
//   };

//   const generateTimetable = () => {
//     if (teachers.length === 0) {
//       alert('Please add at least one teacher before generating the timetable.');
//       return;
//     }

//     const newTimetable = {};
//     const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

//     daysOfWeek.forEach(day => {
//       newTimetable[day] = {
//         '9:00 AM': null,
//         '10:00 AM': null,
//         '11:00 AM': null,
//         '12:00 PM': 'Lunch',
//         '1:00 PM': null,
//         '2:00 PM': null,
//         '3:00 PM': null,
//       };
//     });

//     teachers.forEach(teacher => {
//       if (teacher.classType === 'lab') {
//         const day = teacher.labDetails.labDay;
//         const hours = teacher.labDetails.labHours;

//         let time = 9;
//         let slotsAllocated = 0;
//         while (slotsAllocated < hours && time < 12) {
//           const timeSlot = `${time}:00 AM`;
//           if (newTimetable[day][timeSlot] === null) {
//             newTimetable[day][timeSlot] = {
//               teacher: teacher.name,
//               subject: teacher.subjects.join(', '),
//               colSpan: hours
//             };
//             slotsAllocated = hours;
//             for (let i = 1; i < hours; i++) {
//               newTimetable[day][`${time + i}:00 AM`] = 'occupied';
//             }
//           }
//           time++;
//         }
//       } else {
//         teacher.availability.forEach(day => {
//           const availableTimes = Object.keys(newTimetable[day])
//             .filter(time => newTimetable[day][time] === null && time !== '12:00 PM')
//             .sort(() => Math.random() - 0.5);

//           if (availableTimes.length > 0) {
//             const time = availableTimes[0];
//             newTimetable[day][time] = { teacher: teacher.name, subject: teacher.subjects.join(', ') };
//           }
//         });
//       }
//     });

//     daysOfWeek.forEach(day => {
//       let sportsAdded = false;

//       Object.keys(newTimetable[day]).forEach(time => {
//         if (newTimetable[day][time] === null) {
//           if (!sportsAdded) {
//             newTimetable[day][time] = 'Sports';
//             sportsAdded = true;
//           } else if (!Object.values(newTimetable[day]).includes('Library')) {
//             newTimetable[day][time] = 'Library';
//           } else {
//             newTimetable[day][time] = 'Tutorial';
//           }
//         }
//       });
//     });

//     setTimetable(newTimetable);
//   };

//   const downloadTimetable = () => {
//     const timetableElement = document.getElementById('timetable');

//     html2canvas(timetableElement).then(canvas => {
//       const link = document.createElement('a');
//       link.href = canvas.toDataURL('image/png');
//       link.download = 'timetable.png';
//       link.click();
//     });
//   };

//   return (
//     <div>
//       <h1>Timetable Generator</h1>
//       <button className="rules-button" onClick={() => setShowRules(!showRules)}>
//         {showRules ? 'Hide Rules' : 'Show Rules'}
//       </button>

//       {showRules && (
//         <div className="rules-section">
//           <h3>Rules for Entering the Details:</h3>
//           <p>1. Enter at least four working days.</p>
//           <p>2. Subjects should be maximum 6 (comma separated).</p>
//           <p>3. First letter of each day should be capitalized (e.g., Monday).</p>
//         </div>
//       )}
//       <div>
//         <label htmlFor="classType">Is this a lab or subject?</label>
//         <select id="classType" value={classType} onChange={(e) => setClassType(e.target.value)}>
//           <option value="subject">Subject</option>
//           <option value="lab">Lab</option>
//         </select>

//         <label htmlFor="teacherName">Teacher Name:</label>
//         <input type="text" id="teacherName" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />

//         <label htmlFor="subjects">Subjects (comma separated):</label>
//         <input type="text" id="subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} />

//         {classType === 'lab' ? (
//           <>
//             <label htmlFor="labHours">Lab Hours (2 or 3):</label>
//             <input type="number" id="labHours" value={labHours} onChange={(e) => setLabHours(e.target.value)} min="2" max="3" />

//             <label htmlFor="labDay">Lab Day:</label>
//             <input type="text" id="labDay" value={labDay} onChange={(e) => setLabDay(e.target.value)} />
//           </>
//         ) : (
//           <>
//             <label htmlFor="availability">Available Days (comma separated):</label>
//             <input type="text" id="availability" value={availability} onChange={(e) => setAvailability(e.target.value)} />
//           </>
//         )}

//         <button onClick={addTeacher}>Add Teacher</button>
//         <button onClick={clearForm}>Clear Form</button>
//       </div>

//       <h3>Teachers List</h3>
//       <ul>
//         {teachers.map((teacher, index) => (
//           <li key={index}>
//             {`${teacher.name} (Subjects: ${teacher.subjects.join(', ')}${teacher.classType === 'subject' ? `, Available: ${teacher.availability.join(', ')}` : ''}${teacher.classType === 'lab' ? `, Lab: ${teacher.labDetails.labHours} hours on ${teacher.labDetails.labDay}` : ''})`}
//             <button onClick={() => setTeachers(teachers.filter((_, i) => i !== index))}>Delete</button>
//           </li>
//         ))}
//       </ul>
      
//       <button onClick={generateTimetable}>Generate Timetable</button>
//       <button onClick={downloadTimetable}>Download Timetable as Image</button>
      
//       <table id="timetable">
//         <thead>
//           <tr>
//             <th>Day</th>
//             <th>9:00 AM</th>
//             <th>10:00 AM</th>
//             <th>11:00 AM</th>
//             <th>12:00 PM</th>
//             <th>1:00 PM</th>
//             <th>2:00 PM</th>
//             <th>3:00 PM</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.keys(timetable).map(day => (
//             <tr key={day}>
//               <td>{day}</td>
//               {Object.keys(timetable[day]).map(time => (
//                 <td key={time} colSpan={timetable[day][time]?.colSpan || 1}>
//                   {timetable[day][time] === 'occupied' ? '' : timetable[day][time]?.teacher || timetable[day][time] || ''}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TimeTable;
import html2canvas from 'html2canvas';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './timetable.css';

const TimeTable= () => {
  const [teachers, setTeachers] = useState([]);
  const [timetable, setTimetable] = useState({});
  
 
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api');
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

    teachers.forEach(teacher => {
      if (teacher.classType === 'lab') {
        const day = teacher.labDetails.labDay;
        const hours = teacher.labDetails.labHours;

        let time = 9;
        let slotsAllocated = 0;
        while (slotsAllocated < hours && time < 12) {
          const timeSlot = `${time}:00 AM`;
          if (newTimetable[day][timeSlot] === null) {
            newTimetable[day][timeSlot] = {
              teacher: teacher.name,
              subject: teacher.subjects.join(', '),
              colSpan: hours
            };
            slotsAllocated = hours;
            for (let i = 1; i < hours; i++) {
              newTimetable[day][`${time + i}:00 AM`] = 'occupied';
            }
          }
          time++;
        }
      } else {
        teacher.availability.forEach(day => {
          const availableTimes = Object.keys(newTimetable[day])
            .filter(time => newTimetable[day][time] === null && time !== '12:00 PM')
            .sort(() => Math.random() - 0.5);

          if (availableTimes.length > 0) {
            const time = availableTimes[0];
            newTimetable[day][time] = { teacher: teacher.name, subject: teacher.subjects.join(', ') };
          }
        });
      }
    });

    // Handle free slots for Sports, Library, or Tutorial
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
          {Object.keys(timetable).map(day => (
            <tr key={day}>
              <td>{day}</td>
              {Object.keys(timetable[day]).map(time => (
                <td key={time} colSpan={timetable[day][time]?.colSpan || 1}>
                  {timetable[day][time] === 'occupied' ? '' : timetable[day][time]?.teacher || timetable[day][time] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TimeTable;
