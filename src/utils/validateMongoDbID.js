const mongoose=require('mongoose')
const validateMongoDBID=(id)=>{
    const isValid=mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error("this ID is invalid or object is not found")
}

module.exports=validateMongoDBID