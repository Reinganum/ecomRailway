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
    author_id:{
        type:String,
    },
    author:{
        type:String
    },
    email:{
        type:String
    }
  },
)

module.exports=mongoose.model("Message", messageSchema)