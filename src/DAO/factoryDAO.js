const args = require("../config/argsConfig");
const logger=require('../config/logger');
const FilesystemDAO = require("./DAOS/FilesystemDAO");
const FSmsgDAO = require("./MsgDAO/FSmsgDao");
const MongoMsgDao=require('../DAO/MsgDAO/MongoMsgDao')
const MemoryStorageDAO = require("./DAOS/MemoryDAO");
const MongoDao = require("./DAOS/mongoDAO");
const { MessageDaoSingleton,ProductDaoSingleton,ChatUserDaoSingleton} = require("./Singleton/singleton");
const MemoryMsgDao = require("./MsgDAO/MemoryMsgDao");

let DAO

switch(args.s||process.env.SELECTED_DATABASE){
    case 'mongo': 
        logger.info('factory: mongo selected as storage') 
        DAO={
            products:ProductDaoSingleton.getInstance(MongoDao),
            messages:MessageDaoSingleton.getInstance(MongoMsgDao),
            chatuser:ChatUserDaoSingleton.getInstance(MongoMsgDao)
        }
        break
    case 'fs':
        logger.info('factory: filesystem selected as storage') 
        DAO={
            products:ProductDaoSingleton.getInstance(FilesystemDAO),
            messages:MessageDaoSingleton.getInstance(FSmsgDAO),
            chatuser:ChatUserDaoSingleton.getInstance(FSmsgDAO)
        }
        break
    case 'mem':
        logger.info('factory: memory selected as storage') 
        DAO={
            products:ProductDaoSingleton.getInstance(MemoryStorageDAO),
            messages:MessageDaoSingleton.getInstance(MemoryMsgDao),
            chatuser:ChatUserDaoSingleton.getInstance(MemoryMsgDao)
        }
        break
}
class DaoFactory {
    static getDao() {
        return DAO
    }
}

module.exports={
    DaoFactory,
}
