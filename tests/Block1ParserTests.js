var assert = require('assert');
var parser = require('../block1Parser');

describe('Block1 Parser', function() {
    it('parses correct input', function() {
      var block, text;
      text = 'F01SARACHBBAXXX8059525613';
      block = parser.parse(text);
      assert.notEqual(block, void 0);
      assert.equal(block.blockId, '1');
      assert.equal(block.content, text);
      assert.equal(block.applicationId, 'F');
      assert.equal(block.serviceId, '01');
      assert.equal(block.receivingLtId, 'SARACHBBAXXX');
      assert.equal(block.sessionNumber, '8059');
      return assert.equal(block.sequenceNumber, '525613');
    });
    it('doesn\'t parse short input', function() {
      var block, text;
      text = 'F01SARACHBB3';
      block = parser.parse(text);
      assert.notEqual(block, void 0);
      assert.equal(block.blockId, '1');
      assert.equal(block.content, text);
      assert.equal(block.applicationId, void 0);
      assert.equal(block.serviceId, void 0);
      assert.equal(block.receivingLtId, void 0);
      assert.equal(block.sessionNumber, void 0);
      return assert.equal(block.sequenceNumber, void 0);
    });
    return it('parses long input', function() {
      var block, text;
      text = 'F01SARACHBBAXXX80595256131234567890';
      block = parser.parse(text);
      assert.notEqual(block, void 0);
      assert.equal(block.blockId, '1');
      assert.equal(block.content, text);
      assert.equal(block.applicationId, 'F');
      assert.equal(block.serviceId, '01');
      assert.equal(block.receivingLtId, 'SARACHBBAXXX');
      assert.equal(block.sessionNumber, '8059');
      return assert.equal(block.sequenceNumber, '5256131234567890');
    });
  });
