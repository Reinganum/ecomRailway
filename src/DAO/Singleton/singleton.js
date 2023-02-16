const { msgAsDTO, prodAsDTO,chatUserAsDTO } = require("../../DTO/DTO")
const messageModel=require('../../models/messageModel')
const productModel = require("../../models/productModel")
const chatuserModel=require('../../models/chatuserModel')

let ProductDaoInstance=null
let MessageDaoInstance=null
let ChatUserDaoInstance=null

class MessageDaoSingleton {
    static MessageDaoInstance
    static getInstance=(DAO)=>{
        if(!MessageDaoInstance)
            MessageDaoInstance=new DAO(process.env.MESSAGES_STORAGE_NAME, msgAsDTO, messageModel)
        return MessageDaoInstance
    }
}
class ProductDaoSingleton {
    static ProductDaoInstance
    static getInstance=(DAO)=>{
        if(!ProductDaoInstance)
            ProductDaoInstance=new DAO(process.env.PRODUCTS_STORAGE_NAME, prodAsDTO,productModel)
        return ProductDaoInstance
    }
}

class ChatUserDaoSingleton {
    static ChatUserDaoInstance
    static getInstance=(DAO)=>{
        if(!ChatUserDaoInstance)
            ChatUserDaoInstance=new DAO(process.env.CHATUSER_STORAGE_NAME, chatUserAsDTO,chatuserModel)
        return ChatUserDaoInstance
    }
}

module.exports={
    MessageDaoSingleton,
    ProductDaoSingleton,
    ChatUserDaoSingleton,
}