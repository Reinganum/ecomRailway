const { msgAsDTO, prodAsDTO,chatUserAsDTO } = require("../DTO/DTO")

let ProductDaoInstance=null
let MessageDaoInstance=null
let ChatUserDaoInstance=null

class MessageDaoSingleton {
    static MessageDaoInstance
    static getInstance=(DAO)=>{
        if(!MessageDaoInstance)
            console.log('la clase no existia')
            MessageDaoInstance=new DAO(process.env.MESSAGES_STORAGE_NAME, msgAsDTO)
        console.log('la clase ya existe')
        return MessageDaoInstance
    }
}
class ProductDaoSingleton {
    static ProductDaoInstance
    static getInstance=(DAO)=>{
        if(!ProductDaoInstance)
            console.log('la clase no existia')
            ProductDaoInstance=new DAO(process.env.PRODUCTS_STORAGE_NAME, prodAsDTO)
        console.log('la clase ya existe')
        return ProductDaoInstance
    }
}

class ChatUserDaoSingleton {
    static ChatUserDaoInstance
    static getInstance=(DAO)=>{
        if(!ChatUserDaoInstance)
            console.log('la clase no existia')
            ChatUserDaoInstance=new DAO(process.env.CHATUSER_STORAGE_NAME, chatUserAsDTO)
        console.log('la clase ya existe')
        return ChatUserDaoInstance
    }
}

module.exports={
    MessageDaoSingleton,
    ProductDaoSingleton,
    ChatUserDaoSingleton,
}