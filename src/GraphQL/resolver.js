const Repo=require('../repository/repository')
const Products=Repo.Prods
const Users=Repo.Users
const logger=require('../config/logger')
const bcrypt=require('bcrypt')
const {getProduct}=require('../controller/productController')

const passwordMatches=async function (enteredPass,storedPassword){
    return await bcrypt.compare(enteredPass, storedPassword)
}

const root = {
    getProducts:async()=>{
        return await Products.getAll()
    },
    saveProduct:async(data)=>{
        const {title,description,price,thumbnail,category,quantity}=data.productData
        const newObj={title,description,price,thumbnail,category,quantity}
        return await Products.save(newObj)
    },
    updateProduct:async(data)=>{
        const {id,newData}=data
        const response=await Products.updateById(id,newData)
        return response
    },
    deleteProduct:async(queryId)=>{
        const {id}=(queryId)
        return await Products.deleteById(id)
    },
    deleteAllProducts:async()=>{
        return await Products.deleteAll()
    },
    getUser:async(queryId)=>{
        const {id}=(queryId)
        return await Users.getById(id)
    },
    getUsers:async()=>{
        return await Users.getAll()
    },
    saveUser:async(data)=>{
        let {firstname,lastname,email,password,mobile}=data.userData
        const usersArr=await Users.getAll()
        const findUser=usersArr.find((user)=>{return user.email===email})
        if(!findUser){
            const salt=bcrypt.genSaltSync(10);
            password=await bcrypt.hash(password, salt)
            const newUserData={firstname,lastname,email,password,mobile}
            // create new user
            return newUser=await Users.save(newUserData)   
        } else {
            // email is used, user already exists
            logger.info('User not created, email already in database')
        }
    },
    login:async(data)=>{
        const {email,password}=data.userData
        const usersArr=await Users.getAll()
        const findUser=usersArr.find((user)=>{return user.email===email})
        if (findUser&&await passwordMatches(password,findUser.password)){
            return findUser
        } else {
            logger.info("authentication failed")
        }
    },
    updateUser:async(data)=>{
        const {id,newData}=data
        const response=await Users.updateById(id,newData)
        return response
    },
    deleteUser:async(queryId)=>{
        const {id}=(queryId)
        return await Users.deleteById(id)
    },
    deleteAllUsers:async()=>{
        return await Users.deleteAll()
    },
};

module.exports=root;

