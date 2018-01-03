var expect = require('expect');
const {isRealString} = require('./validation')


// should reject non-string values
// should reject strings with only spaces
// should allow strings with non-space charatcers

describe('isRealString', () => {
  it('should reject non-string values', () => {
      var res = isRealString(12)
      expect(res).toBe(false)
  });
  it('should reject string with only spaces', () => {
    var res = isRealString('   ');
    expect(res).toBe(false)
  });
  it('should allow strings with non space characters', () => {
    var res = isRealString('ads s sd');
    expect(res).toBe(true)
  })
});
