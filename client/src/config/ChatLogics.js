export const getSender = (loggedUser, users) => {
    // console.log(users[1].name+"  fuck u");
    console.log('====================================');
    console.log(loggedUser.data.id);
    console.log(users[0]._id);
    console.log('====================================');
    return users[0]._id === loggedUser.data.id ? users[1].name : users[0].name;
    // return users[1].name;
}