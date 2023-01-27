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
    cart:{
        type:Array,
        default:[]
    },
        Address: [{type: mongoose.Schema.Types.ObjectId, ref:"Adress"}],
        Wishlist: [{type: mongoose.Schema.Types.ObjectId, ref:"Product"}],
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


// 

userSchema.pre('save',async function (next){
    // funcion de mongoose isModified()
    if(!this.isModified('password')){
        next();
    }
    const salt=bcrypt.genSaltSync(10); // await?
    this.password=await bcrypt.hash(this.password, salt)
})
userSchema.methods.passwordMatches=async function (enteredPass){
    return await bcrypt.compare(enteredPass, this.password)
}
userSchema.methods.createPasswordResetToken=async function () {
    const resetToken=crypto.randomBytes(32).toString("hex")
    this.passwordResetToken=crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    this.passwordResetExpires=Date.now()+30*60*15000;
    return resetToken;
}


module.exports=mongoose.model("User",userSchema)