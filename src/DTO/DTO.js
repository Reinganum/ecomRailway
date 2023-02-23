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
    constructor({firstname,lastname,email,mobile}){
        this.firstname=firstname
        this.lastname=lastname
        this.email=email
        this.mobile=mobile
    }
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


module.exports={
    msgAsDTO,
    prodAsDTO,
    chatUserAsDTO,
    userAsDTO
}

