const MemoryDao=require('../DAOS/MemoryDAO')


class MemoryMsgDao extends MemoryDao{
    constructor(file,DTO){
        super(DTO)
        this.DTO=DTO
    }
    updateNickname(newData,id){
        let users=this.getAll()
            if(users){
                let userIndex=users.findIndex((user)=>{return user.id==parseInt(id)})
                users[userIndex].nickname=newData
                return(users[userIndex])
            }
    }
    getBySocketID(socketID){
        try{
            let objects=this.getAll()
            let objectFound=objects.find((obj)=>{return obj.socketID==socketID})
            return objectFound
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
        }
    }
}

module.exports=MemoryMsgDao