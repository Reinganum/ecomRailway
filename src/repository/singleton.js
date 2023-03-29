const { DaoFactory } = require("../DAO/factoryDAO")
const DAO=DaoFactory.getDao()
const Repository=require('./repositoryDAO')

let ProductRepoInstance=null
let MessageRepoInstance=null
let ChatRepoInstance=null
let UserRepoInstance=null
let CartRepoInstance=null
let CategoryRepoInstance=null
let OrderRepoInstance=null

class OrderRepoSingleton{
    static OrderRepoInstance
    static getInstance=()=>{
        if(!OrderRepoInstance)
        OrderRepoInstance=new Repository(DAO.order)
        return OrderRepoInstance
    }
}

class CategoryRepoSingleton {
    static CategoryRepoInstance
    static getInstance=()=>{
        if(!CategoryRepoInstance)
        CategoryRepoInstance=new Repository(DAO.category)
        return CategoryRepoInstance
    }
}

class MessageRepoSingleton {
    static MessageRepoInstance
    static getInstance=()=>{
        if(!MessageRepoInstance)
        MessageRepoInstance=new Repository(DAO.messages)
        return MessageRepoInstance
    }
}

class CartRepoSingleton {
    static CartRepoInstance
    static getInstance=()=>{
        if(!CartRepoInstance)
            CartRepoInstance=new Repository(DAO.carts)
        return CartRepoInstance
    }
}

class ChatRepoSingleton {
    static ChatRepoInstance
    static getInstance=()=>{
        if(!ChatRepoInstance)
            ChatRepoInstance=new Repository(DAO.chatuser)
        return ChatRepoInstance
    }
}

class UserRepoSingleton {
    static UserRepoInstance
    static getInstance=()=>{
        if(!UserRepoInstance)
            UserRepoInstance=new Repository(DAO.users)
        return UserRepoInstance
    }
}

class ProductRepoSingleton {
    static ProductRepoInstance
    static getInstance=()=>{
        if(!ProductRepoInstance)
            ProductRepoInstance=new Repository(DAO.products)
        return ProductRepoInstance
    }
}

module.exports={
    ProductRepoSingleton,
    UserRepoSingleton,
    CartRepoSingleton,
    MessageRepoSingleton,
    ChatRepoSingleton,
    CategoryRepoSingleton,
    OrderRepoSingleton,
}