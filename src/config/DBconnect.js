const dotenv=require('dotenv').config()
const { default: mongoose } = require("mongoose")

const dbConnect=()=>{
    try{
        mongoose.connect(
            process.env.MONGO_URI,
            {
                 dbName: process.env.MONGO_DB_NAME
            }
        )
        console.log(`connected to MongoDB`)
    } catch (error){
        console.log(`db connection error: ${error}`)
    }
}

module.exports=dbConnect;