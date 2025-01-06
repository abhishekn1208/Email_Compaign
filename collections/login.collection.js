const User = require("../model/user.model");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const loginAdmin=async(req,res)=>{
  try {
    const {username, password} = req.body;

    const user = await User.findOne({username})
    if(!user) return res.status(404).json({message : "Not found"})
        const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
        { userId: user._id },
        process.env.SECRET_KEY,  
        { expiresIn: '12h' }      
      );
      res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {loginAdmin}