

export const generate_msg=(user_name,msg)=>{
   
return {
user_name,
msg,
createdAt:new Date().getTime()
}


}

export const generate_location=(user_name,location)=>{

return {
user_name,
location,
createdAt:new Date().getTime()


}


}