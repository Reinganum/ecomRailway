const { DaoFactory } = require("../DAO/factoryDAO")

const DAO=DaoFactory.getDao()

class Repository {
    constructor(DAO){
        this.DAO=DAO
    }
    getAll(){
        return this.DAO.getAll()
    }
    getById(id){
        return this.DAO.getById(id)
    }
    getBySocketID(socketID){
        return this.DAO.getBySocketID(socketID)
    }
    save(newObject){
        return this.DAO.save(newObject)
    }
    deleteById(id){
        return this.DAO.deleteById(id)
    }
    deleteAll(){
        return this.DAO.deleteAll()
    }
    updateById( id, updateObject){
        return this.DAO.updateById(id, updateObject)
    }
    updateNickname(newData,id){
        return this.DAO.updateNickname(newData,id)
    }
}

const MessageRepo=new Repository(DAO.messages)
const ProductRepo=new Repository(DAO.products)
const ChatuserRepo=new Repository(DAO.chatuser)
const UserRepo=new Repository(DAO.users)

module.exports={
    Msgs:MessageRepo,
    Prods:ProductRepo,
    Users:UserRepo,
    ChatUser:ChatuserRepo
}