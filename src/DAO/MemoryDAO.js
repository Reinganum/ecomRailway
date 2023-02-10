class MemoryStorageDAO {
    constructor(file,DTO){
        this.objectArray=[]
        this.DTO=DTO
    }
    #getByIndex(id){
        return this.objectArray.findIndex(obj=>obj.id===id)
    }
    getAll(){
        return this.objectArray
    }
    getById(id){
        return this.objectArray[this.#getByIndex(id)]
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
    save(newObject){
        let nuevoId=(this.objectArray.length)+1
        newObject.id=nuevoId;
        this.objectArray.push(newObject)
        console.log(this.DTO(this.objectArray))
        return this.DTO(newObject)
    }
    deleteById(id){
        const index=this.#getByIndex(id)
        const [removedObject]= this.objectArray.splice( index,1)
        return removedObject
    }
    deleteAll(){
        this.objectArray=[]
    }
    updateById( id, update){
        const index=this.#getByIndex(id)
        const updatedObject={...this.object[index],...update}
        this.objectArray[index]=updatedObject
        return updatedObject
    }
    updateNickname(newData,id){
        let users=this.getAll()
            if(users){
                let userIndex=users.findIndex((user)=>{return user.id==parseInt(id)})
                console.log("newData")
                console.log(newData)
                users[userIndex].nickname=newData
                return(users[userIndex])
            }
    }
}

module.exports=MemoryStorageDAO