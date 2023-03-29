const { msgAsDTO, prodAsDTO,chatUserAsDTO, userAsDTO, cartAsDTO,categoryAsDTO,orderAsDTO} = require("../../DTO/DTO")
const config=require('../../config/index')

const messageModel=require('../../models/messageModel')
const productModel = require("../../models/productModel")
const chatuserModel=require('../../models/chatuserModel')
const userModel=require('../../models/userModel')
const cartModel=require('../../models/cartModel')
const categoryModel=require('../../models/productCategoryModel')
const orderModel=require('../../models/orderModel')

let ProductDaoInstance=null
let MessageDaoInstance=null
let ChatUserDaoInstance=null
let UserDaoInstance=null
let CartDaoInstance=null
let CategoryDaoInstance=null
let OrderDaoInstance=null

class OrderDaoSingleton {
    static OrderDaoInstance
    static getInstance=(DAO)=>{
        if(!OrderDaoInstance)
        OrderDaoInstance=new DAO(process.env.Order_STORAGE_NAME,orderAsDTO, orderModel)
        return OrderDaoInstance
    }
}

class CategoryDaoSingleton {
    static CategoryDaoInstance
    static getInstance=(DAO)=>{
        if(!CategoryDaoInstance)
        CategoryDaoInstance=new DAO(process.env.CATEGORY_STORAGE_NAME, categoryAsDTO, categoryModel)
        return CategoryDaoInstance
    }
}


class MessageDaoSingleton {
    static MessageDaoInstance
    static getInstance=(DAO)=>{
        if(!MessageDaoInstance)
            MessageDaoInstance=new DAO(process.env.MESSAGES_STORAGE_NAME, msgAsDTO, messageModel)
        return MessageDaoInstance
    }
}

class CartDaoSingleton {
    static CartDaoInstance
    static getInstance=(DAO)=>{
        if(!CartDaoInstance)
            CartDaoInstance=new DAO(process.env.CART_STORAGE_NAME, cartAsDTO, cartModel)
        return CartDaoInstance
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

class UserDaoSingleton {
    static UserDaoInstance
    static getInstance=(DAO)=>{
        if(!UserDaoInstance)
            UserDaoInstance=new DAO(process.env.USER_STORAGE_NAME, userAsDTO,userModel)
        return UserDaoInstance
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


module.exports={
    MessageDaoSingleton,
    ProductDaoSingleton,
    ChatUserDaoSingleton,
    UserDaoSingleton,
    CartDaoSingleton,
    CategoryDaoSingleton,
    OrderDaoSingleton,
}