var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jen';
    var text = 'Some Message';
    var message = generateMessage(from, text)

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({
      from: from,
      text
    });
    // store res in variable
    // assert from matche
    // assert text match
    // assert createdAt is number

  })
});

  describe('generateLocationMessage', () => {
    it('should generate location object', () => {
      var from = 'Terry';
      var latitude = 15
      var longitude = 19
      var url = 'https://www.google.com/maps?q=15,19'
      var message = generateLocationMessage(from, latitude, longitude)
      expect(message.createdAt).toBeA('number');
      expect(message).toInclude({from, url})
    });
  });
