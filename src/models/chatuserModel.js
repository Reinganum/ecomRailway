const { default: mongoose } = require("mongoose");

const chatuserSchema=new mongoose.Schema({
    socketID:{
        type:String,
        required:true,
    },
    nickname:{
        type:String,
    },
    time:{
        type:String,
    },
  },
)

module.exports=mongoose.model("ChatUser", chatuserSchema)