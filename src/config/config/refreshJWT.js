const jwt=require('jsonwebtoken')

const signRefreshToken=(id)=>{
    return jwt.sign({id},process.env.JWT_REFRESH_SECRET, {expiresIn:process.env.JWT_REFRESHTOKEN_EXPIRY})
}

module.exports=signRefreshToken