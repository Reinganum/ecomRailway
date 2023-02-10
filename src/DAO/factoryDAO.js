const args = require("../config/argsConfig");
const logger=require('../config/logger');
const FilesystemDAO = require("./FilesystemDAO");
const MemoryStorageDAO = require("./MemoryDAO");
const { MessageDaoSingleton,ProductDaoSingleton,ChatUserDaoSingleton} = require("./singleton");

let DAO

switch(args.s||process.env.SELECTED_DATABASE){
    case 'Mongo': // DESARROLLAR PARA MONGO
        console.log('factory: mongo selected') 
        DAO='mongo selected'
        break
    case 'fs':
        console.log('factory: filesystem selected') 
        DAO={
            products:ProductDaoSingleton.getInstance(FilesystemDAO),
            messages:MessageDaoSingleton.getInstance(FilesystemDAO),
            chatuser:ChatUserDaoSingleton.getInstance(FilesystemDAO)
        }
        break
    case 'mem':
        console.log('factory: memory selected') 
        DAO={
            products:ProductDaoSingleton.getInstance(MemoryStorageDAO),
            messages:MessageDaoSingleton.getInstance(MemoryStorageDAO),
            chatuser:ChatUserDaoSingleton.getInstance(MemoryStorageDAO)
        }
        break
}
class DaoFactory {
    static getDao() {
        return DAO
    }
}


/*
DAO.messages.save({autor:"esto ya es con singleton"})
messages:MessageDaoSingleton.getInstance(FilesystemDAO)
messages:MessageDaoSingleton.getInstance(FilesystemDAO)
messages:MessageDaoSingleton.getInstance(FilesystemDAO)
messages:MessageDaoSingleton.getInstance(FilesystemDAO)
messages:MessageDaoSingleton.getInstance(FilesystemDAO)
*/
// DAO.products.save({producto:'pantalla LED Samsung'})

module.exports={
    DaoFactory,
}
