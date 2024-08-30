const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
},
  email: {
    type: String,
},
  username: {
    type: String,
    required: true,
},
  password: {
    type: String,
    required: true,
},
  role: { 
    type: String,
     enum: ['admin', 'user'],
     default: 'user' 
    },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword){
  try{
      
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
  }catch(err){
      throw err;
  }
}

module.exports = mongoose.model('User', userSchema);
