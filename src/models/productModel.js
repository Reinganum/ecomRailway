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
    thumbnail:{
        type:String,
    },
    category:{
        type:String, 
    },
    stock:{
        type:Number,
        default:1,
        required:true,
    },
    ratings:[
        {
            star:Number,
            postedBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"}
        }
    ],
    totalRating:{ 
        type:String,// puede ser number o string
        default:0,
    }
},
{timestamps:true})

module.exports=mongoose.model("Product",productSchema)