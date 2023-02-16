const { default: mongoose } = require("mongoose");

const messageSchema=new mongoose.Schema({
    socketID:{
        type:String,
        required:true,
    },
    msg:{
        type:String,
    },
    time:{
        type:String,
    },
    id:{
        type:Number,
    }
  },
)

module.exports=mongoose.model("Message", messageSchema)