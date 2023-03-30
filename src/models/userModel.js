const { default: mongoose } = require("mongoose");
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        default:"user"
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    avatar:{
        type:String,
        default:"incognito.jpg",
    },
    cart:{
        type:Array,
        default:[]
    },
        address: {type:String},
        wishlist: [{type: mongoose.Schema.Types.ObjectId, ref:"Product"}],
        refreshToken:{
            type:String,
        },
        passwordChangedAt:Date,
        passwordResetToken:String,
        passwordResetExpires:Date,
    },
    {
        timestamps:true,
    }
)


module.exports=mongoose.model("User",userSchema)