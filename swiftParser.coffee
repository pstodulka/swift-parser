fs = require('fs')
finParser = require("./finParser.js")
mtParser = require("./mtParser.js")
block1Parser = require('./block1Parser')
block2Parser = require('./block2Parser')
FieldParser = require('./FieldRegexpFactory').FieldParser

class SwiftParser
  constructor: (@fieldPatterns) ->
    if(not fieldPatterns?)
      @fieldPatterns = JSON.parse(fs.readFileSync(__dirname + '/metadata/patterns.json'))

    @fieldParser = new FieldParser(@fieldPatterns)

  process: (swiftMessage) ->
    ast = finParser.parse(swiftMessage)
    ast.block1 = block1Parser.parse(ast.block1.content[0])
    ast.block2 = block2Parser.parse(ast.block2.content[0])
    ast.block4.fields = mtParser.parse(ast.block4.content[0])
    for field in ast.block4.fields
      fieldCode = field.type + (field.option ? "")
      parsedField = @fieldParser.parse(fieldCode, field.fieldValue)
      field.ast = parsedField
    return ast

  parse: (swiftMessage, callback) ->
    try
      ast = @process(swiftMessage)
      callback(null, ast)
    catch e
      callback(e, null)

module.exports.SwiftParser = SwiftParser

main = () ->
  if(process.argv.length != 3)
    console.log("Usage: node swiftParser <swift file>")
    return

  filename = process.argv[2]
  fs.readFile filename, "ASCII", (err, content) ->
    if(err?) then throw err
    parser = new SwiftParser()
    parser.parse content, (err, ast) ->
      if(err?) then throw err
      console.log(JSON.stringify(ast, null, 2))


if(require.main == module)
  main()