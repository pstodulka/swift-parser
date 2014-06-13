module.exports.parse = (input) ->
    result = new Block1()
    result.content = input
    pattern = /(.)(..)(.{12})(....)(.*)/
    match = pattern.exec(input)
    if(match?)
      result.applicationId = match[1]
      result.serviceId = match[2]
      result.receivingLtId = match[3]
      result.sessionNumber = match[4]
      result.sequenceNumber = match[5]

    return result

class Block1
  constructor: ->
    @blockId = 1
    @content = undefined
    @applicationId = undefined
    @serviceId = undefined
    @receivingLtId = undefined
    @sessionNumber = undefined
    @sequenceNumber = undefined
