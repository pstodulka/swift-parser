// Generated by CoffeeScript 1.7.1
(function() {
  var Block1;

  module.exports.parse = function(input) {
    var match, pattern, result;
    result = new Block1();
    result.content = input;
    pattern = /(.)(..)(.{12})(....)(.*)/;
    match = pattern.exec(input);
    if ((match != null)) {
      result.applicationId = match[1];
      result.serviceId = match[2];
      result.receivingLtId = match[3];
      result.sessionNumber = match[4];
      result.sequenceNumber = match[5];
    }
    return result;
  };

  Block1 = (function() {
    function Block1() {
      this.blockId = 1;
      this.content = void 0;
      this.applicationId = void 0;
      this.serviceId = void 0;
      this.receivingLtId = void 0;
      this.sessionNumber = void 0;
      this.sequenceNumber = void 0;
    }

    return Block1;

  })();

}).call(this);

//# sourceMappingURL=block1Parser.map