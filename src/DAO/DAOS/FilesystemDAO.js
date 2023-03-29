const fs = require('fs')
const path=require('path')
const { logger } = require('../../config/index')
const uniqid=require('uniqid')

class FilesystemDAO{
    constructor(file,DTO) {
        try {
            this.DTO=DTO
            if (fs.existsSync(path.join(process.cwd(), `./src/DB/${file}.json`))===false){
                this.createdAt=Date.now().toLocaleString
                this.file = path.join(process.cwd(), `./src/DB/${file}.json`)
                fs.writeFileSync(this.file, '[]')
            } else {
                this.file=path.join(process.cwd(), `./src/DB/${file}.json`)
            }
          } catch (error) {
            logger.info(`Error in the constructor: ${error.message}`)
          }
      }
    async getAll() {
        try{
            const arr=await fs.promises.readFile(this.file,"utf-8")
            const arrObj=JSON.parse(arr)
            return arrObj;
        }
        catch (error) {
            logger.info(`Error couldn't fetch objects in file: ${error}`)
        }
    }
    async save(obj){
        try{
            let array= await this.getAll()
            obj._id=uniqid();
            array.push(obj)
            let nuevoArr=array
            await fs.promises.writeFile(this.file,JSON.stringify(nuevoArr))
            return obj
        }
        catch (error){
            logger.info(`Error could not save object: ${error}`)
        }
    }
    async query(queryStr){
        return queryStr
    }
    async find(prop){
        try{
            const array=await this.getAll()
            const propName=(Object.keys(prop)[0])
            const propValue=prop[`${propName}`]
            const foundObjs=array.filter((obj)=>obj[`${propName}`]===propValue)
            return foundObjs
        }catch(error){
            logger.info(`FS DAO error, could not filter objects (findOne): ${error}`)
        }
    }
    async findOne(prop){
        try{
            const array=await this.getAll()
            const propName=(Object.keys(prop)[0])
            const propValue=prop[`${propName}`]
            const foundObj=array.find((obj)=>obj[`${propName}`]===propValue)
            return foundObj
        }catch(error){
            logger.info(`FS DAO error, no se pudo encontrar objeto (findOne): ${error}`)
        }
    }
    async getById(_id){
        try{
            let array=await this.getAll()
            let foundObject=array.find((obj)=>{return obj._id===String(_id)})
            return foundObject
        }
        catch(error){
            logger.info(`error, could not get object with requested Id: ${error}`)
        }
    }
    async updateById(_id, update){
        try{
            let objects=await this.getAll()
            const index=objects.findIndex((obj)=>obj._id==_id)
            if(index===-1){
                return {error:"this ID is invalid or object is not found (update)"}
            }
            const updatedObject={...objects[index],...update}
            objects[index]=updatedObject
            await fs.promises.writeFile(this.file,JSON.stringify(objects))
            return updatedObject
        } catch(error){
            logger.info(`error, could not update object: ${error}`)
        }
    }
    async findOneAndRemove(prop){
        const foundObject=await this.findOne(prop)
        await this.deleteById(foundObject._id)
    }
    async deleteById(_id){
        try{
            let array=await this.getAll()
            let index=await array.findIndex(obj=>obj._id===String(_id))
            if(index===-1){
                return {error:"this ID is invalid or object is not found"}
            }
            const [removedObject]=array.splice(index,1)
            await fs.promises.writeFile(this.file,JSON.stringify(array))
            return removedObject
        } catch(error){
            logger.info(`error, could not delete object: ${error}`)
        }   
    }
    async deleteAll(){
        try{
            const arr=await fs.promises.readFile(this.file,"utf-8")
            const arrObj=JSON.parse(arr)
            const deletedObjects=arrObj.length
            await fs.promises.writeFile(this.file, '[]')
            return {
                "acknowledged": true,
                "deletedCount": deletedObjects
            }
        }
        catch(error){
            logger.info(`error, could not delete objects: ${error}`)
        }
    }
}


module.exports=FilesystemDAO;