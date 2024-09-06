
const jwt = require('jsonwebtoken')

const jsonwebtoken  = async(req,res,next)=>{
    // console.log("Inside JWT Middleware!!!");
    const token = req.headers['authorization'].split(" ")[1]
    try{
        if(token){
            const jwtResponse = jwt.verify(token,process.env.JWT_SECRET_KEY)
             req.user = jwtResponse.userId
            next()
        }else{
            res.status(406).json("Please Provide Token!!!")
        }
        
    }catch(err){
        res.status(401).json("Access denied.... Please provide token!!!")
    }
    
}

module.exports = jsonwebtoken