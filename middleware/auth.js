var jwt = require("jsonwebtoken");

const auth =(req,res,next)=>{
  try {
    const token = req.headers.authorization.split(" ")[1]
    console.log(token)
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    if(decoded){
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin

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