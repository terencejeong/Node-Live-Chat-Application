const expect = require('expect');
const {Users} = require('./users')

describe('Users', () => {
  var users;


  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Derrick',
      room: 'React Course'
    }, {
      id: '3',
      name: 'John',
      room: 'Node Course'
    }]
  })

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: 12,
      name: 'Terry',
      room: 'South Park'
    };
    var resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  })

  it('should remove a user', () => {
    var userId = '1'
    var user = users.removeUser(userId)
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = '8'
    var user = users.removeUser(userId);
    expect(user).toNotExist(userId);
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var userId = '1'
    var user = users.getUser(userId);
    expect(user.id).toBe(userId)
  });

  it('should not find a user', () => {
    var userId = '4'
    var user = users.getUser(userId);
    expect(user).toNotExist();
  });

  it('should return names for node course', () => {
    var userList = users.getUserList('Node Course');
    expect(userList).toEqual(['Mike', 'John'])
  });

  it('should return names for react course', () => {
    var userList = users.getUserList('React Course');
    expect(userList).toEqual(['Derrick'])
  });
})
