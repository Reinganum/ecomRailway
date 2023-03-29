const { DaoFactory } = require("../DAO/factoryDAO")
const { OrderDaoSingleton } = require("../DAO/Singleton/singleton")
const DAO=DaoFactory.getDao()
const {ProductRepoSingleton,CartRepoSingleton,UserRepoSingleton,ChatRepoSingleton,MessageRepoSingleton,CategoryRepoSingleton}=require('./singleton')

const Product=ProductRepoSingleton.getInstance()
const User=UserRepoSingleton.getInstance()
const Cart=CartRepoSingleton.getInstance()
const ChatUser=ChatRepoSingleton.getInstance()
const Message=MessageRepoSingleton.getInstance()
const Category=CategoryRepoSingleton.getInstance()
const Order=OrderDaoSingleton.getInstance()

module.exports={
    Product,
    User,
    Cart,
    ChatUser,
    Message,
    Category,
    Order
}
