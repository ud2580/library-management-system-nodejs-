const express = require('express');
const Student = require('../model/student');
const {jwtAuthMiddleware,generateToken} = require('../jwt');
const User = require('../model/user');


const router = express.Router();

const checkAdminRole = async (userid) => {
  try {
      const user = await User.findById(userid);
      if(user.role ="admin" ){
          return true;
      } // Returns true if user is admin, false otherwise
  } catch (err) {
     
      return false; // Retu rn false on error
  }
}

router.post('/add',jwtAuthMiddleware, async (req, res) => {
  try{
    if(!(await checkAdminRole(req.user.id))) 
      return res.status(403).json({ message: "user has not in admin role"});

  const student = new Student(req.body);
  await student.save();
  res.send(student);
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
}
});


router.get('/',jwtAuthMiddleware, async (req, res) => {
try{
  const students = await Student.find();
  res.send(students);
}catch (err) {
  console.log(err);
  res.status(500).json({ error: 'Internal Server Error' });
}
});

module.exports = router;
