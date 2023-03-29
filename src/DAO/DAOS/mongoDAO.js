const { isValidObjectId } = require("mongoose")
const logger=require('../../config/config/logger')

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
            throw new Error(`error, could not get object by Socket id: ${error}`)
        }
    }
    async getAll(){
        try{
            const response = await this.model.find();
            return response;
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
            throw new Error(`error, could not get objects: ${error}`)
        }
    }
    async findOne(prop){
        try{
            const response=await this.model.findOne(prop)
            return response
        }
        catch(error){
            logger.info(`error, could not find object: ${error}`)
            throw new Error(`error, could not find object: ${error}`)
        }
    }
    async getById(id){
        try{
            return this.model.findById(id)
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
            throw new Error(`error, could not get object by id: ${error}`)
        }
    }
    async save(newObject){
        try{
            let response=await this.model.create(newObject);
            return response
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
            throw new Error(`error, could not save object: ${error} mongoDAO!!!!!`)
        }
    }
    async deleteById(id){
        try{
            return this.model.findByIdAndDelete(id)
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
            throw new Error(`error, could not delete object by id: ${error}`)
        }
    }
    async findOneAndRemove(prop){
        try{
            return this.model.findOneAndRemove(prop)
        }
        catch(error){
            logger.info(`error, could not find and remove by prop: ${error}`)
        }
    }
    async deleteAll(){
        try{
            return this.model.remove()
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
            throw new Error(`error, could not delete collection: ${error}`)
        }
    }
    async updateById(id, newData) {
        try{
            if(!isValidObjectId(id)){
                return {error:"this ID is invalid or object is not found"}
            }
            const response = await this.model.findByIdAndUpdate(id, newData, {
              new: true,
            });
            return response;
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
            throw new Error(`error, could not update object: ${error}`)
        }
      }
    async updateNickname(newData,id){
        try{
            if(!isValidObjectId(id)){
                return {error:"this ID is invalid or object is not found"}
            }
            const foundUser=await this.model.find({id:id})
            const response=await this.model.findByIdAndUpdate(foundUser[0]._id,{nickname:newData},{new:true})
            return response
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
            throw new Error(`error, could not update nickname: ${error}`)
        }
    }      
}


module.exports=MongoDao