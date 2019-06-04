const users = []

const addUser = ({id, username, room})=>{

    
    //cleann the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return {error: 'user is required'}
    }

    //existance of user
    const existedUser = users.find((user)=>{
        if(user.username === username && user.room === room){
            return true
        }
    })
    if(existedUser){
        return {error: "user is already exist"}
    }

    //store the user
    const user = {id, username, room}
    users.push(user)

    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)
    if(index == -1){
        return {error : "no users found"}
    }
    const removedUsers = users.splice(index, 1)

    return removedUsers[0]
}

const getUser = (id)=>{
    const user = users.find((user)=> user.id === id)
    return user
}

const getUsersInRoom = (room)=>{
    const roomUsers = users.filter((user)=>user.room === room)

    return roomUsers
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}