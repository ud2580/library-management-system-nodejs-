const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    const token = req.headers['authorization'].replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const secretKey ='12345'; 
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }
      req.user = decoded; 
      next();
    });
  };


function generateToken(payload) {
   
    const secretKey = "12345";
    return jwt.sign(payload, secretKey);
  }
  

module.exports = {jwtAuthMiddleware, generateToken};


