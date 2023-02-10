class MessageDTO {
    constructor({msg}){
        this.msg=msg
    }
}
class ProductDTO {
    constructor({title,price,stock,thumbnail,description}){
        this.title=title
        this.price=price
        this.stock=stock
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
function chatUserAsDTO(user){
    if(Array.isArray(user)){
        return prod.map(user=> new ChatUserDTO(user))
    }
    return new ChatUserDTO(user)
}


module.exports={
    msgAsDTO,
    prodAsDTO,
    chatUserAsDTO
}

