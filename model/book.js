const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
},
  author: {
    type: String,
    required: true,
},
  isbn: String,
  borrowedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student' 
},
  history: [{
      student: { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Student' },
      borrowedAt: Date,
      returnedAt: Date,
    },
  ],
});

module.exports = mongoose.model('Book', bookSchema);
