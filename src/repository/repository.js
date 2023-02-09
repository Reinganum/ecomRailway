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
}

const MessageRepo=new Repository(DAO.messages)
const ProductRepo=new Repository(DAO.products)
module.exports={
    Msgs:MessageRepo,
    Prods:ProductRepo
}