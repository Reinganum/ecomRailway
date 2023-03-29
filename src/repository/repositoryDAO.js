class Repository {

    constructor(DAO){
        this.DAO=DAO
    }
    getAll(){
        return this.DAO.getAll()
    }
    find(prop){
        return this.DAO.find(prop)
    }
    findOne(prop){
        return this.DAO.findOne(prop)
    }
    Query(queryStr){
        return this.DAO.query(queryStr)
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
    findOneAndRemove(prop){
        return this.DAO.findOneAndRemove(prop)
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

module.exports=Repository

