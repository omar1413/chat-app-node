const {addUser, removeUser, getUser, getUsersInRoom} = require('../src/utils/users')

const userOne =  {id: 24, username:'omar', room:'roo'}
beforeEach(()=>{
    addUser(userOne)
})

test('should add  user', async()=>{
    const user = {id: 20, username:'omar', room:'roo1'}
    const res = addUser(user)

    
    expect(res).toMatchObject({user})
})

test('should addUser fail when adding the same user', ()=>{
    const res = addUser(userOne)

    expect(res).not.toMatchObject({user: userOne})
})

test('should addUser fail when adding the invalid user', ()=>{
    const user = {id:1,username:'',room:''}
    const res = addUser(user)

    expect(res).not.toMatchObject({user})
})

test('should user removed', ()=>{
    removeUser(userOne.id)
    res = addUser(userOne)

    expect(res).toMatchObject({user: userOne})
})

test('should get user when exist', ()=> {
    const user = getUser(userOne.id)

    expect(user).toMatchObject(userOne)
})

test('should getUser undefinde if no users', ()=>{
    const res = getUser(userOne.id + 5)

    expect(res).toEqual(undefined)
})

test('should getUsersInRoom ', ()=>{
    // 
    const user1 = {id: 1, username: 'hello1', room: userOne.room}
    const user2 = {id: 2, username: 'hello2', room: userOne.room}
    const user3 = {id: 3, username: 'hello3', room: userOne.room}
    const user4 = {id: 4, username: 'hello4', room: userOne.room}

    const user5 = {id: 5, username: 'hello1', room: 'room3'}
    const user6 = {id: 6, username: 'hello20', room: 'room3'}
    const user7 = {id: 7, username: 'hello3', room: 'room3'}
    const user8 = {id: 8, username: 'hello40', room: 'room3'}

    const roomUsers = [user1,user2,user3,user4,user5,user6,user7,user8]
    roomUsers.forEach((user)=>{
        addUser(user)
    })

    const users1 = getUsersInRoom(userOne.room)
    const users2 = getUsersInRoom('room3')
    const users3 = getUsersInRoom('starngeadasdasd')

    expect(users3).toEqual([])
    expect(users1).toEqual([userOne, user1,user2,user3,user4])
    expect(users2).toEqual([user5,user6,user7,user8])
})
