const {User}=require('../repository/repository')
const jwt=require('jsonwebtoken')
const asyncHandler=require('express-async-handler')
const config=require('../config/index')

const auth=asyncHandler(async(req,res,next)=>{
    let token;
    if(!req?.headers?.authorization?.startsWith("Bearer")&&!req.session){
        res.json({Error: "user is not authenticated"})
    }
    try{
        if(config.AUTH_METHOD.AUTH==='JWT'){
         if (req?.headers?.authorization?.startsWith("Bearer")){
                token=(req.headers.authorization.split(' ')[1])
                const decoded=jwt.verify(token, config.JWT.secret)
                req.user=await User.getById(decoded?.id)
                next()
         }  
        } else {
        req.user=await User.getById(req.session.userId.userId)
        next()
        }
    }catch(error){
        throw new Error(`error in the auth middleware login: ${error.name}`)
    }
})


const verifyJWT=async(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token=authHeader.split(' ')[1];
    jwt.verify(
        token,
        config.JWT.secret,
        (err,decoded)=>{
            if(err) return res.sendStatus(403);
            req.user=decoded.email
            next();
        })
}

const isAdmin=asyncHandler(async(req,res,next)=>{
    if (req.user.role!=="admin"){
        throw Error('Logged user does not have admin credentials')
    } else {
        next()
    }
})

module.exports={ auth, isAdmin }