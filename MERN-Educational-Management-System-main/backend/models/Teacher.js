const mongoose = require('mongoose');

const Teacher = new mongoose.Schema({
  name: { type: String, required: true },
  subjects: [String],
  availability: [String],
  classType: { type: String, enum: ['subject', 'lab'] },
  labDetails: {
    labHours: { type: Number },
    labDay: { type: String }
  }
});
module.exports = mongoose.model('Teacher2', Teacher);
// const mongoose = require('mongoose');

// const TeacherSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   subjects: { type: [String], required: true },
//   availability: [
//     {
//       day: { type: String, required: true }, // e.g., "Monday"
//       slots: { type: [String], required: true } // e.g., ["9:00 AM", "10:00 AM", "2:00 PM"]
//     }
//   ],
//   classType: { type: String, enum: ['subject', 'lab'], required: true },
//   labDetails: {
//     labHours: { type: Number, required: function() { return this.classType === 'lab'; } },
//     labDay: { type: String, required: function() { return this.classType === 'lab'; } }
//   }
// });

// module.exports = mongoose.model('Teacher3', TeacherSchema);
