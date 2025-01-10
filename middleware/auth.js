var jwt = require("jsonwebtoken");

const auth =(req,res,next)=>{
  try {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    console.log(decoded.role)
    if(decoded){
        req.userId = decoded.userId;
        req.role = decoded.role 

        next()
    }else{
        res.json({message : "Unauthorized"})
    }
  } catch (error) {
    console.log(error)
    res.send("Error in Authentication")
  }
}

module.exports = auth