const users = []

const addUser = ({id, username, room}) => {
    //clean the data
     username = username.trim().toLowerCase()
     room = room.trim().toLowerCase()

     //validate the data
     if(!username || !room){
         return {
             error : 'username and room are required!'
         }
     }

     //check for exixting user
     const existinguser = users.find((user) => {
         return user.room === room && user.username === username
     })

     //validate username
     if(existinguser){
         return {
             error : 'Username is in use!'
         }
     }
     //store user
     const user = {id, username, room}
     users.push(user)
     return { user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id=== id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}




// addUser({
//     id : 01,
//     username : 'Shraboni',
//     room : 'potato'
// })

// addUser({
//     id : 02,
//     username : 'Tommy',
//     room : 'potato'
// })

// addUser({
//     id : 03,
//     username : 'Shraboni',
//     room : 'kutukutu'
// })

// console.log(users)

// const gettingUser = getUser(02)

// console.log(gettingUser)

// const User = getUsersInRoom('kolkata')
// console.log(User)
// // const res = addUser({
// //     id : 02,
// //     username : 'Shraboni',
// //     room : 'potato'
// // })

// // console.log(res)

// // const removedUser = removeUser(01)

// // console.log(removedUser)
// // console.log(users)