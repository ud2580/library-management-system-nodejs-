const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
},
  studentId: {
    type: String,
    required: true,
},
  borrowedBooks: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book' }],
});

module.exports = mongoose.model('Student', studentSchema);
