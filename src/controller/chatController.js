// CHAT USER CONTROLLER 

const {Product,ChatUser,Message}=require('../repository/repository')


const newUser=async(socket,io)=>{
    console.log(`new connected user with socketID: ${socket.id}`)
    let currentDate = new Date();
    let timestamp = `${currentDate.getHours()}`+":"+
    `${String(currentDate.getMinutes()).length===2?currentDate.getMinutes():'0'+currentDate.getMinutes()}`+":"+
    `${String(currentDate.getSeconds()).length===2?currentDate.getSeconds():'0'+currentDate.getSeconds()}`;
    await ChatUser.save({socketID:socket.id,nickname:null,time:timestamp})
    const allMsgs = await Message.getAll()
    const allUsers = await ChatUser.getAll()
    io.sockets.emit('allMsgs',allMsgs)
    console.log('allmsgs sent to front end')
    io.sockets.emit('allUsers',allUsers)
}

const userDisconnected = async(socketID)=>{
    const response=await ChatUser.findOneAndRemove({socketID})
}

// MESSAGE CONTROLLER 

const newMessage=async(socket,io,newMsg)=>{
    let currentDate = new Date();
    let timestamp = `${currentDate.getHours()}`+":"+
    `${String(currentDate.getMinutes()).length===2?currentDate.getMinutes():'0'+currentDate.getMinutes()}`+":"+
    `${String(currentDate.getSeconds()).length===2?currentDate.getSeconds():'0'+currentDate.getSeconds()}`;
    await Message.save({socketID:socket.id,msg:newMsg.msg,time:timestamp,author:newMsg.author,author_id:newMsg.author_id,email:newMsg.email})
    const allMsgs = await Message.getAll()
    io.sockets.emit('allMsgs', allMsgs)
}


module.exports = {newUser,userDisconnected,newMessage}