const logger = require('../../config/logger')
const MongoDao=require('../DAOS/mongoDAO')

class MongoMsgDao extends MongoDao{
    constructor(file,DTO,model) {
        super(file,DTO,model)
            this.file=file
            this.model=model
            this.DTO=DTO
    }
    async updateNickname(newData,id){
        const foundUser=await this.model.find({id:id})
        const response=await this.model.findByIdAndUpdate(foundUser[0]._id,{nickname:newData},{new:true})
        return response
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
}

module.exports=MongoMsgDao