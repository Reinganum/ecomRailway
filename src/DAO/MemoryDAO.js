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
    updateById( id, updateObject){
        const index=this.#getByIndex(id)
        const updatedObject={...this.object[index],...updateObject}
        this.objectArray[index]=update
        return updatedObject
    }
}

module.exports=MemoryStorageDAO