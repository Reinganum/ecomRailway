class MemoryStorageDAO {
    constructor(file,DTO,collection,schema){
        this.objectArray=[]
        this.DTO=DTO
    }
    #getByIndex(id){
        const parsedId=parseInt(id)
        return this.objectArray.findIndex(obj=>obj.id===parsedId)
    }
    getAll(){
        return this.objectArray
    }
    getById(id){
        const response=this.objectArray[this.#getByIndex(id)]
        if(response===undefined)return {error:"this ID is invalid or object is not found"}
        return response
    }
    save(newObject){
        let nuevoId=(this.objectArray.length)+1
        newObject.id=nuevoId;
        this.objectArray.push(newObject)
        return this.DTO(newObject)
    }
    deleteById(id){
        const index=this.#getByIndex(id)
        if(index===-1||index===undefined){
            return {error:"this ID is invalid or object is not found"}
        }
        else
        {   
            const [removedObject]= this.objectArray.splice(index,1)
            for (let i=index;i<this.objectArray.length;i++){
                this.objectArray[i].id-=1
            }
            return removedObject
        }
    }
    deleteAll(){
        let deletedObjects=this.objectArray.length
        this.objectArray=[]
        return {
            "acknowledged": true,
            "deletedCount": deletedObjects
        }
    }
    updateById( id, update){
        const index=this.#getByIndex(id)
        if(index===-1||index===undefined){
            return {error:"this ID is invalid or object is not found"}
        }
        const updatedObject={...this.objectArray[index],...update}
        this.objectArray[index]=updatedObject
        return updatedObject
    }
}

module.exports=MemoryStorageDAO