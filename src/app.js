import express from 'express'
import path from 'path';

import {Server} from 'socket.io'
import http from 'http'

 import { add_user,getUsersOf_room,get_user,delete_user } from './utils/users_chat.js';
const app=express()
import Profanity from 'accurate-profanity-filter'
import { generate_msg ,generate_location} from './utils/msg.js';
const server= http.createServer(app)
const io= new Server(server)
const __dirname=path.resolve()
const Filter = new Profanity({ substitute: '*', addToFilter: { ENG: true, PHL: true } })
const publicdir=path.join(__dirname,'../public/')

app.use(express.static(publicdir))
io.on('connection',(socket)=>{

socket.on('link',({user_name,room_name},callback)=>{
    const {error,user}=add_user({id:socket.id,username:user_name,room:room_name})
    if(error){return callback(error)}
    socket.join(user.room)
    io.to(user.room).emit('users_list',{room:user.room,users:getUsersOf_room(user.room)})
    socket.emit('msg',generate_msg('System','welcome to the chat'))
    socket.broadcast.to(user.room).emit('msg',generate_msg('System',`${user.username} has joined the chat`))
    callback()
})
socket.on('submit',(word,callback)=>{
    const statement=Filter.filter(word)
    const user=get_user(socket.id)
     io.to(user.room).emit('msg',generate_msg(user.username,statement))
    callback()

} 
 )
socket.on('send_location',(position,callback)=>{
    const user=get_user(socket.id)
    io.to(user.room).emit('current_location',generate_location(user.username,`https://google.com/maps?q=${position.latitude},${position.longitude}`))
    callback()
})
socket.on('disconnect',()=>{

    const userd=delete_user(socket.id)
    if(userd){
        io.to(userd.room).emit('users_list',{room:userd.room,users:getUsersOf_room(userd.room)})
        io.to(userd.room).emit('msg',generate_msg(`${userd.username} has left the conversation`))}
    })
    


})

const port=process.env.PORT||3000;

server.listen(port,()=>{io.emit(); console.log(`connected to ${port}`)})
