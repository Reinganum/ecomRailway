const { buildSchema} = require('graphql')


const schema = buildSchema(`
  ## PRODUCTS ##

  type Product{
    title:String
    description:String
    price:Int
    thumbnail:String
    quantity:Int
  }
  type deletedObjects{
    acknowledged: Boolean
    deletedCount: Int
  }
  input ProductInput{
    title:String
    description:String
    price:Int
    thumbnail:String
    quantity:Int
    category:String
  }

  ## USERS ##

  input registerData{
    firstname:String!
    lastname:String!
    email:String!
    password:String!
    mobile:String!
  }

  input UserInput{
    firstname:String
    lastname:String
    email:String
    password:String
    mobile:String
  }

  input login {
    email:String!
    password:String!
  }

  type User{
    firstname:String
    lastname:String
    email:String
    mobile:String
  }

  type Query{
    getProducts:[Product]
    getProduct(id:ID!):Product
    getUsers:[User]
    getUser(id:ID!):User
  }
  type Mutation{
    saveProduct(productData:ProductInput):Product
    updateProduct(id:ID!,newData:ProductInput):Product
    deleteProduct(id:ID!):Product
    deleteAllProducts:deletedObjects
    saveUser(userData:registerData):User
    login(userData:login):User
    updateUser(id:ID!,newData:UserInput):User
    deleteUser(id:ID!):User
    deleteAllUsers:deletedObjects
  }
`)

module.exports=schema