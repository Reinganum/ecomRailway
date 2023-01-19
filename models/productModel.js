const { default: mongoose } = require("mongoose");
const productSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String, 
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        thumbnails:{
            type:Array,
        }
    }
},
{timestamps:true})

module.exports=mongoose.model("Product",productSchema)