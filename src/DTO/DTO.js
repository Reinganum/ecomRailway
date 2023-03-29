class MessageDTO {
    constructor({msg}){
        this.msg=msg
    }
}
class ProductDTO {
    constructor({title,price,quantity,thumbnail,description}){
        this.title=title
        this.price=price
        this.quantity=quantity
        this.thumbnail=thumbnail
        this.description=description
    }
}

class ChatUserDTO{
    constructor({socketID,nickname,time}){
        this.socketID=socketID
        this.nickname=nickname
        this.time=time
    }
}

class UserDTO{
    constructor({firstname,lastname,email,mobile,avatar,role}){
        this.firstname=firstname
        this.lastname=lastname
        this.email=email
        this.mobile=mobile
        this.avatar=avatar
        this.role=role
    }
}

class CartDTO{
    constructor({products,cartTotal,buyer}){
        this.products=products
        this.cartTotal=cartTotal
        this.buyer=buyer
    }
}

class CategoryDTO{
    constructor({name}){
        this.name=name
    }
}

class OrderDTO{
    constructor({name}){
        this.name=name
    }
}

function orderAsDTO(order){
    if(Array.isArray(order)){
        return order.map(order=> new OrderDTO(order))
    }
    return new OrderDTO(order)
}

function categoryAsDTO(category){
    if(Array.isArray(category)){
        return category.map(category=> new CategoryDTO(category))
    }
    return new CategoryDTO(category)
}

function msgAsDTO(msg){
    if(Array.isArray(msg)){
        return msg.map(msg=> new MessageDTO(msg))
    }
    return new MessageDTO(msg)
}
function prodAsDTO(prod){
    if(Array.isArray(prod)){
        return prod.map(prod=> new ProductDTO(prod))
    }
    return new ProductDTO(prod)
}
function chatUserAsDTO(chatUser){
    if(Array.isArray(chatUser)){
        return chatUser.map(user=> new ChatUserDTO(user))
    }
    return new ChatUserDTO(chatUser)
}

function userAsDTO(user){
    if(Array.isArray(user)){
        return user.map((user)=>new UserDTO(user))
    }
    return new UserDTO(user)
}

function cartAsDTO(cart){
    if(Array.isArray(cart)){
        return cart.map((cart)=>new UserDTO(cart))
    }
    return new CartDTO(cart)
}


module.exports={
    msgAsDTO,
    prodAsDTO,
    chatUserAsDTO,
    userAsDTO,
    cartAsDTO,
    categoryAsDTO,
    orderAsDTO,
}

