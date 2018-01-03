[{
  id:'safadaa',
  name: 'Terry',
  room: 'South Park Fans'
}]

// want to add a user addUser(id, name, room)
// removeUser(id) - by socketid
// getUser(id)
// getUserList(room)


class Users {
  constructor () {
    this.users = [];
  }
  addUser(id, name, room) {
    var user = {id, name, room}
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    var user = this.getUser(id);
    if(user) {
      this.users = this.users.filter((user) => user.id !== id)
      }
    return user;
    // return user that was removed.
  }
  getUser(id) {
    return this.users.filter((user) => user.id === id)[0]
  }
  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }
}
// same as arrow function technique above.
// getUserList(room) {
//   var users = this.users.filter((user) => {
//     return user.room === room;
//   })
// }


module.exports = {Users};
// going to use classes.
// example of classes in ES6
// class Person {
//   // constructor function is specific to the class. Lets you initialize the instance of your class.
//   constructor (name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   getUserDescription() {
//     return `${this.name} is ${this.age} years old`
//   }
// }
//
// var me = new Person('Terry', 25);
//
// var description = me.getUserDescription();
// console.log(description)
