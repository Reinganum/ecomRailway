const FilesystemDAO = require("./DAOS/FilesystemDAO");
const FSmsgDAO = require("./MsgDAO/FSmsgDao");
const MongoMsgDao=require('../DAO/MsgDAO/MongoMsgDao')
const MemoryStorageDAO = require("./DAOS/MemoryDAO");
const MongoDao = require("./DAOS/mongoDAO");
const { MessageDaoSingleton,ProductDaoSingleton,ChatUserDaoSingleton,UserDaoSingleton,CartDaoSingleton, CategoryDaoSingleton, OrderDaoSingleton} = require("./Singleton/singleton");
const MemoryMsgDao = require("./MsgDAO/MemoryMsgDao");
const config=require('../config/index')
const logger=require('../config/config/logger')
const args=config.ARGS

let DAO

switch(args.s||process.env.SELECTED_DATABASE){
    case 'mongo': 
        logger.info('factory: mongo selected as storage') 
        DAO={
            users:UserDaoSingleton.getInstance(MongoDao),
            products:ProductDaoSingleton.getInstance(MongoDao),
            carts:CartDaoSingleton.getInstance(MongoDao),
            messages:MessageDaoSingleton.getInstance(MongoMsgDao),
            chatuser:ChatUserDaoSingleton.getInstance(MongoMsgDao),
            category:CategoryDaoSingleton.getInstance(MongoDao),
            order:OrderDaoSingleton.getInstance(MongoDao)
        }
        break
    case 'fs':
        logger.info('factory: filesystem selected as storage') 
        DAO={
            users:UserDaoSingleton.getInstance(FilesystemDAO),
            messages:MessageDaoSingleton.getInstance(FSmsgDAO),
            products:ProductDaoSingleton.getInstance(FilesystemDAO),
            chatuser:ChatUserDaoSingleton.getInstance(FSmsgDAO),
            carts: CartDaoSingleton.getInstance(FilesystemDAO),
            category:CategoryDaoSingleton.getInstance(FilesystemDAO),
            order:OrderDaoSingleton.getInstance(FilesystemDAO)
        }
        break
    case 'mem':
        logger.info('factory: memory selected as storage') 
        DAO={
            users:UserDaoSingleton.getInstance(MemoryStorageDAO),
            products:ProductDaoSingleton.getInstance(MemoryStorageDAO),
            messages:MessageDaoSingleton.getInstance(MemoryMsgDao),
            chatuser:ChatUserDaoSingleton.getInstance(MemoryMsgDao),
            carts:CartDaoSingleton.getInstance(MemoryStorageDAO),
            category:CategoryDaoSingleton.getInstance(MemoryStorageDAO),
            order:OrderDaoSingleton.getInstance(MemoryStorageDAO)
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
