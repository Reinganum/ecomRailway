const { logger } = require('../../config/index')
const FilesystemDAO=require('../DAOS/FilesystemDao')
const fs=require('fs')
const path=require('path')

class FSmsgDAO extends FilesystemDAO {
    constructor(file,DTO) {
        super(file,DTO)
        this.DTO=DTO
        try {
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
    async updateNickname(newData,_id){
        try{
            let users=await this.getAll()
            if( await users){
                let userIndex=users.findIndex((user)=>{return user._id==String(_id)})
                users[userIndex].nickname=newData
                await fs.promises.writeFile(this.file,JSON.stringify(users))
            }
        } catch(error){
            logger.info(`error, could not update nickname: ${error}`)
        }   
    }
    async getBySocketID(socketID){
        try{
            let objects=await this.getAll()
            return objects.find((obj)=>{return obj.socketID==socketID})
        }
        catch(error){
            logger.info(`error, could not get Id: ${error}`)
        }
    }
  }

module.exports=FSmsgDAO