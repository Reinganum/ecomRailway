const fs = require('fs')
const path=require('path')
const logger = require('../config/logger')


class FilesystemDAO{
    constructor(file,DTO) {
        try {
            if (fs.existsSync(path.join(process.cwd(), `./src/DB/${file}.json`))===false){
                this.createdAt=Date.now().toLocaleString
                this.DTO=DTO
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
            this.getAll()
        }
        catch (error){
            logger.info(`error, no se pudo agregar objeto: ${error}`)
        }
    }
    async getById(id){
        try{
            let objects=await this.getAll()
            return objects.find(object=>((object).id)===(id))
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
        }
    }
    async updateById(newData,id){
        try{
            let objects=await this.getAll()
            const objectIndex=object.findIndex((obj)=>obj.id==id)
            if(objectIndex===-1)return {error:true}
            objects[objectIndex].nickname=newData.name;
            await fs.promises.writeFile(this.file,JSON.stringify(items))
        } catch(error){
            logger.info(`error, could not update object: ${error}`)
        }
    }
    async deleteById(id){
        try{
            let objects=await this.getAll()
            let index=objects.findIndex(obj=>obj.id===id)
            const [removedObject]=objects.splice(index,1)
            await fs.promises.writeFile(this.file,JSON.stringify(objects))
        } catch(error){
            logger.info(`error, could not delete object: ${error}`)
        }   
    }
    async deleteAll(){
        try{
            await fs.promises.writeFile(this.file, '[]')
        }
        catch(error){
            logger.info(`error, could not delete objects: ${error}`)
        }
    }
}

module.exports=FilesystemDAO;