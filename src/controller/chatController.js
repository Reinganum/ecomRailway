// CHAT USER CONTROLLER 

const Repo=require('../repository/repository')
const Users = Repo.Usr
const Messages=Repo.Msgs
const Items=Repo.Prods

const newUser=async(socket,io)=>{
    console.log(`new connected user with socketID: ${socket.id}`)
    let currentDate = new Date();
    let timestamp = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    await Users.save({socketID:socket.id,nickname:null,time:timestamp})
    const allMsgs = await Messages.getAll()
    const allUsers = await Users.getAll()
    io.sockets.emit('allMsgs',allMsgs)
    io.sockets.emit('allUsers',allUsers)
}

const changeUser=async(socket,io,newName)=>{
    const user = await Users.getBySocketID(socket.id)
    const userID=user.id
    console.log(user)
    await Users.updateNickname(newName.name,userID) 
    const allUsers=await Users.getAll()
    io.sockets.emit('allUsers',allUsers)
}

const userDisconnected = async(socket,io)=>{
    const user = Users.getById(socket.id)
    const userID=user.id
    if (user)
    Users.deleteById(userID)
    const allUsers =await Users.getAll()
    io.sockets.emit('allUsers',allUsers)
}

// MESSAGE CONTROLLER 

const newMessage=async(socket,io,newMsg)=>{
    let currentDate = new Date();
    let timestamp = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    await Messages.save({socketID:socket.id,msg:newMsg,time:timestamp})
    const allMsgs = await Messages.getAll()
    io.sockets.emit('allMsgs', allMsgs)
}
// NEW ITEM 

const newItem=async(socket, io, newItem)=>{
    await Items.save(newItem)
    const allItems=await Items.getAll()
    io.sockets.emit('items',allItems)
}

module.exports = {newUser,changeUser,userDisconnected,newMessage,newItem}