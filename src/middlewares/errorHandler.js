const logger = require("../config").logger

const notFound=(req,res,next)=>{
    const error=new Error (`Not found: ${req.originalUrl}`)
    next(error)
}

const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode==200?500:res.statusCode;
    logger.info({
        msg:err?.message,
        stack:err?.stack
    })
    res.status(statusCode).json({
        msg:err?.message,
        stack:err?.stack
    })
}
module.exports={errorHandler,notFound}