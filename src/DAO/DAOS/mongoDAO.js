const { isValidObjectId } = require("mongoose")

class MongoDao{
    constructor (file,DTO,model){
       this.file=file
       this.model=model
       this.DTO=DTO
    }
    async getBySocketID(socketID){
        try{
            let response= await this.model.find({socketID:socketID})
            return response
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
        }
    }
    async getAll(){
        const response = await this.model.find();
        return response;
    }
    async getById(id){
        if(!isValidObjectId(id)){
            return {error:"this ID is invalid or object is not found"}
        }
        return this.model.findById(id)
    }
    async save(newObject){
        newObject.id=await this.model.count()
        let response=await this.model.create(newObject);
        return this.DTO(response)
    }
    async deleteById(id){
        if(!isValidObjectId(id)){
            return {error:"this ID is invalid or object is not found"}
        }
        return this.model.findByIdAndDelete(id)
    }
    async deleteAll(){
        return this.model.remove()
    }
    async updateById(id, newData) {
        if(!isValidObjectId(id)){
            return {error:"this ID is invalid or object is not found"}
        }
        const response = await this.model.findByIdAndUpdate(id, newData, {
          new: true,
        });
        return response;
      }
    async updateNickname(newData,id){
        if(!isValidObjectId(id)){
            return {error:"this ID is invalid or object is not found"}
        }
        const foundUser=await this.model.find({id:id})
        const response=await this.model.findByIdAndUpdate(foundUser[0]._id,{nickname:newData},{new:true})
        return response
    }
}


module.exports=MongoDao