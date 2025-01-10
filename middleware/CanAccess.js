const CanAccess=(acceptedRole)=>{
    return (req,res,next)=>{
        if(req.role === acceptedRole){
            next()
        }else{
            res.status(401).json({message : "Unauthorized"})
        }
    }
}

module.exports = CanAccess