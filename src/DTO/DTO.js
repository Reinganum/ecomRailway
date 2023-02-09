class MessageDTO {
    constructor({username,timestamp,text}){
        this.username=username
        this.timestamp=timestamp
        this.text=text
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

module.exports={
    msgAsDTO,
    prodAsDTO
}

