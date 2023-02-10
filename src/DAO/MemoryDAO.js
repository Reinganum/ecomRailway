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
            return objects.find((obj)=>{return obj.socketID==socketID})
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
        }
    }
    save(newObject){
        this.objectArray.push(newObject)
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
        const index=this.#getByIndex(id)
        this.objectArray[index]={...this.object[index],...newData}
        return this.objectArray[index]
    }
}

module.exports=MemoryStorageDAO