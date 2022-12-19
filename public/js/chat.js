const socket=io()
const form=document.querySelector('#message_in')
const field=document.querySelector('#in')
const submit_button=form.querySelector('#send')
const send_location=document.querySelector('#send_location')
const chat_container=document.querySelector('#chat_container')


const chat_template=document.querySelector('#chat-template').innerHTML
const location_template=document.querySelector('#location-template').innerHTML
const side_template=document.querySelector('#template_side').innerHTML

const {user_name,room_name}=Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on('msg',(message)=>{
   
    const html=Mustache.render(chat_template,
        {user_name:message.user_name,
            msg:message.msg,
        createdAt:moment(message.createdAt).format('h:mm a')})
    chat_container.insertAdjacentHTML('beforeend',html)
    })

socket.on('current_location',(location_url)=>{
   //console.log(location_url)
   const html=Mustache.render(location_template,{
    user_name:location_url.user_name,
    location:location_url.location,
     createdAt:moment(location_url.createdAt).format('h:mm a')})
    chat_container.insertAdjacentHTML('beforeend',html)

})
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    submit_button.disabled=true
    const wes=e.target.elements.in.value
    socket.emit('submit',wes,()=>{
        setTimeout(() => {
            submit_button.disabled=false
        }, 1000);
        
    field.value=''
    field.focus()
    })
    

})
socket.on('users_list',({room,users})=>{
const html=Mustache.render(side_template,{room,users})
document.querySelector('#side').innerHTML=html

})
send_location.addEventListener('click',()=>{
    send_location.disabled=true
navigator.geolocation.getCurrentPosition((position)=>{
socket.emit('send_location',{
latitude:position.coords.latitude,
longitude:position.coords.longitude


},()=>{
    setTimeout(() => {
        send_location.disabled=false
    }, 1000);
    console.log('location has been successfully shared')})




})
})

socket.emit('link',{user_name,room_name},(error)=>{

if(error){
alert(error)
location.href='/'

}

})