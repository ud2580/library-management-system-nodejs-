const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const router = express.Router();
const {jwtAuthMiddleware, generateToken} = require('../jwt');

router.post('/signup',async(req, res) =>{
  try{
      const data = req.body
      const newuser = new User(data);

      const response = await newuser.save();
      console.log('data saved');

      const payload = {
          id: response.id,
      }
      console.log(JSON.stringify(payload));
      const token = generateToken(payload);
      console.log("Token is : ", token);

      res.status(200).json({response: response, token: token});
  }
  catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
  }
})

router.post('/login', async (req, res) => {
  try{
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, 'secret-key');
  res.send({ token });
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

router.put('/profile/password',jwtAuthMiddleware, async (req, res)=>{
  try{
      const userId = req.user; // Extract the id from the URL parameter
      const  {currentpassword,newpassword}=reb.body;

      const user = await user.findOne(userId);
      if( !(await user.comparePassword(password))){
          return res.status(401).json({error: 'Invalid username or password'});
      }

      user.password=newpassword;
      await user.save();


      console.log('password updated');
      res.status(200).json({message: "password updated"});
  }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
  }
})

module.exports = router;
