var expect = require('expect');

var {generateMessage} = require('./message')
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
})
