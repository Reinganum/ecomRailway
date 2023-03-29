const uniqid=require('uniqid')
class MemoryStorageDAO {
    constructor(file,DTO,collection,schema){
        this.objectArray=[]
        this.DTO=DTO
    }
    getAll(){
        return this.objectArray
    }
    find(prop){
        const propName=(Object.keys(prop)[0])
        const propValue=prop[`${propName}`]
        const foundObjs=this.objectArray.filter((obj)=>obj[`${propName}`]===propValue)
        return foundObjs
    }
    findOne(prop){
        console.log("findOne function in MemoryDao called")
        try{
            const propName=(Object.keys(prop)[0])
            const propValue=prop[`${propName}`]
            const foundObj=this.objectArray.find((obj)=>obj[`${propName}`]===propValue)
            return foundObj
        }catch(error){
            logger.info(`Memory DAO error, no se pudo encontrar objeto (findOne): ${error}`)
        }
    }
    getById(_id){
        const response=this.objectArray.find((obj)=>obj._id==_id)
        if(response===undefined)return {error:"this ID is invalid or object is not found"}
        return response
    }
    save(newObject){
        newObject._id=uniqid()
        this.objectArray.push(newObject)
        return newObject
    }
    deleteById(_id){
        const index=this.objectArray.findIndex((obj)=>obj._id==_id)
        if(index===-1||index===undefined){
            return {error:"this ID is invalid or object is not found"}
        }
        else
        {   
            const [removedObject]= this.objectArray.splice(index,1)
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
    updateById( _id, update){
        const index=this.objectArray.findIndex((obj)=>obj._id==_id)
        if(index===-1||index===undefined){
            return {error:"this ID is invalid or object is not found"}
        }
        const updatedObject={...this.objectArray[index],...update}
        this.objectArray[index]=updatedObject
        return updatedObject
    }
    async findOneAndRemove(prop){
        const foundObject=await this.findOne(prop)
        await this.deleteById(foundObject._id)
    }
}

module.exports=MemoryStorageDAO