const Teacher = require('../models/teacher.js');
// Add a new teacher
exports.addTeacher = async (req, res) => {
    try {
      const teacher = new Teacher(req.body); // Assuming the request body has all the necessary fields
      await teacher.save();
      res.status(201).json({ message: 'Teacher added successfully', teacher });
    } catch (error) {
      res.status(400).json({ message: 'Error adding teacher', error });
    }
  };
  
  
  exports.getAllTeachers = async (req, res) => {
    try {
      const teachers = await Teacher.find();
      res.status(200).json(teachers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teachers', error });
    }
  };
  
  // Update a teacher
  exports.updateTeacher = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedTeacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.status(200).json({ message: 'Teacher updated successfully', updatedTeacher });
    } catch (error) {
      res.status(400).json({ message: 'Error updating teacher', error });
    }
  };
  
  // Delete a teacher
  exports.deleteTeacher2 = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTeacher = await Teacher.findByIdAndDelete(id);
      if (!deletedTeacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting teacher', error });
    }
  };
  