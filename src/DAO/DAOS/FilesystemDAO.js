const fs = require('fs')
const path=require('path')
const logger = require('../../config/logger')


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
            logger.info(`Error en el constructor: ${error.message}`)
          }
      }
    async getAll() {
        try{
            const arr=await fs.promises.readFile(this.file,"utf-8")
            const arrObj=JSON.parse(arr)
            return arrObj;
        }
        catch (error) {
            logger.info(`error en la lectura: ${error}`)
        }
    }
    async save(obj){
        try{
            let arrProductos= await this.getAll()
            let nuevoId=arrProductos.length+1
            obj.id=nuevoId;
            arrProductos.push(obj)
            let nuevoArr=arrProductos
            await fs.promises.writeFile(this.file,JSON.stringify(nuevoArr))
            return this.DTO(obj)
        }
        catch (error){
            logger.info(`error, no se pudo agregar objeto: ${error}`)
        }
    }
    async getById(id){
        try{
            let objects=await this.getAll()
            let foundObject=objects.find((obj)=>{return obj.id==id})
            if(foundObject===undefined){
                return {error:"this ID is invalid or object is not found"}
            }
            return foundObject
        }
        catch(error){
            logger.info(`error, could not get object with requested Id: ${error}`)
        }
    }
    async updateById( id, update){
        try{
            console.log(id)
            let objects=await this.getAll()
            const index=objects.findIndex((obj)=>obj.id==id)
            if(index===-1){
                return {error:"this ID is invalid or object is not found"}
            }
            const updatedObject={...objects[index],...update}
            objects[index]=updatedObject
            await fs.promises.writeFile(this.file,JSON.stringify(objects))
            return updatedObject
        } catch(error){
            logger.info(`error, could not update object: ${error}`)
        }
    }
    async deleteById(id){
        try{
            let objects=await this.getAll()
            let index=await objects.findIndex(obj=>obj.id==id)
            if(index===-1){
                return {error:"this ID is invalid or object is not found"}
            }
            const [removedObject]=objects.splice(index,1)
            for (let i=index;i<objects.length;i++){
                objects[i].id-=1
            }
            await fs.promises.writeFile(this.file,JSON.stringify(objects))
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