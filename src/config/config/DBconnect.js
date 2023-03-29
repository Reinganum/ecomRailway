const dotenv=require('dotenv').config()
const { default: mongoose } = require("mongoose")
const logger=require('./logger')

const dbConnect=()=>{
    try{
        mongoose.connect(
            process.env.MONGO_URI,
            {
                 dbName: process.env.MONGO_DB_NAME
            }
        )
        logger.info(`connected to MongoDB`)
    } catch (error){
        logger.error(`db connection error: ${error}`)
    }
}

module.exports=dbConnect;