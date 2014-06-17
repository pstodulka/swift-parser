XRegExp = require('xregexp').XRegExp
parsePattern = require('./FieldPeg').parse


class FieldParser
  constructor: (@fieldPatterns) ->
    @fieldParsers = {}
    @regexpFactory = new FieldRegexpFactory()

  parse: (fieldHeader, fieldContent) ->
    if(not @fieldParsers[fieldHeader]?)
      fieldMetadata = @fieldPatterns[fieldHeader]
      throw new Error("Metadata not found for field #{fieldHeader}.") unless(fieldMetadata?)

      if(fieldHeader == "77E")
        throw new Error("Parsing of field 77E is not supported.") #this field has a very strange pattern and multiple fields with the same name

      regexpSt = @regexpFactory.createRegexp(fieldMetadata.pattern, fieldMetadata.fieldNames)
      @fieldParsers[fieldHeader] = new FieldContentParser(regexpSt, new FieldNames(fieldMetadata.fieldNames))
    parser = @fieldParsers[fieldHeader]
    result = parser.parse(fieldContent)
    return result


class FieldContentParser
  constructor: (@regexpSt, @fieldNames) ->
    @regexp = new XRegExp(@regexpSt)

  parse: (fieldValue) ->
    match = @regexp.xexec(fieldValue)
    if(not match?)
      throw new Error("Unable to parse '#{fieldValue}' with regexp '#{@regexpSt}'.")

    result = {}
    for fieldName in @fieldNames.flatNames
      if(match[fieldName]?)
        result[FieldNamesParser.unescape(fieldName)] = match[fieldName]

    return result


class FieldRegexpFactory
  createRegexp: (pattern, fieldNamesString) ->
    patternParts = pattern.split('$')
    fieldNames = new FieldNames(fieldNamesString)
    if(patternParts.length != fieldNames.names.length)
      throw new Error('Different count of lines in pattern and field names.')

    regexps = []
    for patternPart, i in patternParts
      fieldNamesSection = fieldNames.names[i]
      regexps.push(@_createRegexpCore(patternPart, fieldNamesSection))

    mandatoryFieldDetector = new MandatoryFieldDetector()
    [head, regexps...] = regexps
    result = head.regexp
    leftMandatory = mandatoryFieldDetector.containsMandatory(head.tree)
    for regexpPart in regexps
      rightMandatory = mandatoryFieldDetector.containsMandatory(regexpPart.tree)
      if(leftMandatory and rightMandatory)
        result = result + "\r\n" + regexpPart.regexp
      else #not 100% correct -- the newlines should be parts of the sequences -- [a]$b --> (a\r\n)?b instead of (a)?(\r\n)?b
        result = result + "(\r\n)?#{regexpPart.regexp}"

    result = "^" + result + "$"
    return result

  _createRegexpCore: (pattern, fieldNames) ->
    if(pattern[0]==':') #make the leading colon optional not to enforce it in the field value
      prefix = ":?"
      pattern = pattern.substring(1)

    parsedPattern = parsePattern(pattern)
    injector = new PatternNameInjector()
    injector.injectNames(fieldNames, parsedPattern)
    regexp = @_visitNode(parsedPattern)
    if(prefix?)
      regexp = prefix + regexp
    return {tree: parsedPattern, regexp: regexp}

  _visitNodes: (array) ->
    result = (@_visitNode(node) for node in array).join("")
    return result

  _visitNode: (node) ->
    switch(node.type)
      when 'literal'
        return @_visitLiteral(node)
      when 'sequence'
        rxOptional = if(node.optional) then "?" else ""
        rxName = if(node.name?) then "?<#{node.name}>" else ""
        value = @_visitNodes(node.parts)

        if(not node.optional and not node.name?) #no need to add parentheses
          return value

        if(node.parts.length == 1 and not node.name?)
          if(node.optional and /^\(.*\)$/.test(value))
            return value + "?" #there are already parentheses

        return "(#{rxName}#{value})#{rxOptional}"
      when 'field'
        return @_visitField(node)
      else
        throw new Error("Unknown node type #{node.type}: " + node)

  _visitField: (field) ->
    count = field.count
    set = field.set
    lines = field.lines ? 1
    exact = field.exact ? false

    rxSet = switch set
      when 'e' then ' '
      when 'z' then '[\\s\\S]'
      else '.'
    rxCount = if exact then "{#{count}}" else "{1,#{count}}"
    rxName = if(field.name?) then "?<#{field.name}>" else ""
    rxLines = if(lines > 1) then "(\r\n#{rxSet}#{rxCount}){0,#{lines-1}}" else ""

    if rxName != ""
      result = "(#{rxName}#{rxSet}#{rxCount}#{rxLines})"
    else
      result = "#{rxSet}#{rxCount}#{rxLines}"
    return result

  _visitLiteral: (node) ->
    if(node.name?)
      return "(?<#{node.name}>#{node.value})"
    return node.value


class FieldNames
  constructor: (@fieldNamesString) ->
    fieldNamesParts = @fieldNamesString.split('$')
    @names = []
    for fieldNamesPart in fieldNamesParts
      if(fieldNamesPart == "") #special handling of empty list
        fieldNamesPart = "(Value)"
      names = FieldNamesParser.parseFieldNames(fieldNamesPart)
      @names.push(names)
    @flatNames = []
    for section in @names
      for name in section
        @flatNames.push(name)


class FieldNamesParser
  @_fieldNamesRegExp:  new XRegExp("\\((.*?)\\)")

  @parseFieldNames: (fieldNamesString) ->
    if(fieldNamesString == "")
      return []

    names = []
    @_fieldNamesRegExp.forEach(fieldNamesString, (match) =>
      escaped = @escape(match[1])
      names.push(escaped)
    )
    if(names.length == 0)
      throw new Error("Strange field names: " + fieldNamesString)
    return names

  @escape: (name) ->
    return name.replace(new XRegExp(" ", "g"), "_")

  @unescape: (name) ->
    return name.replace(new XRegExp("_", "g"), " ")


class PatternNameInjector
  injectNames: (names, parsedPattern) ->
    @remainingNames = names
    @pattern = parsedPattern
    result = @_visitNode(parsedPattern)
    if(@remainingNames.length > 0)
      throw new Error("Remaining names after name injection: " + @remainingNames.toString())
    return result

  _visitNode: (node) ->
    switch(node.type)
      when 'literal'
        return @_visitLiteral(node)
      when 'sequence'
        for child in node.parts
          @_visitNode(child)
        return node
      when 'field'
        return @_visitField(node)
      else
        throw new Error("Unknown node type #{node.type}: " + node)

  _visitLiteral: (node) ->
    if(node.value == 'N' and @remainingNames[0]? and /(_|\b)sign(_|\b)/i.test(@remainingNames[0])) #the Sign
      [name, @remainingNames...] = @remainingNames
      node.name = name
    return node

  _visitField: (node) ->
    if(node.set == 'e') #space doesnt' get name
      return node
    @_attachNameToField(node)
    return node

  _attachNameToField: (node) ->
    if(@remainingNames.length == 0)
      return
    if(@remainingNames.length == 1)
      righmostFieldPath = new FieldFinder((field) -> true).findPath(@pattern)
      currentFieldPath = new FieldFinder((field) -> field == node).findPath(@pattern)
      length = Math.min(righmostFieldPath.length, currentFieldPath.length)
      i = 0
      commonAncestor = null
      while i < length and righmostFieldPath[i] == currentFieldPath[i]
        commonAncestor = righmostFieldPath[i]
        i=i+1
      if i < length
        #rewrite the pattern tree to name the remaining fields as a sequence
        if(commonAncestor.type != 'sequence')
          throw new Error('Common ancestor should be a sequence: '+JSON.stringify(commonAncestor))
        left = commonAncestor.parts.indexOf(currentFieldPath[i])
        right = commonAncestor.parts.indexOf(righmostFieldPath[i])
        if(left == -1 or right == -1)
          throw new Error("Left: #{left} Right: #{right}")
        newNode = {type: 'sequence', optional:false, parts:commonAncestor.parts[left..right]}
        commonAncestor.parts = commonAncestor.parts[0...left].concat([newNode]).concat(commonAncestor.parts[right+1..])
        node = newNode
    [name, @remainingNames...] = @remainingNames
    node.name = name


# Depth-first, right-to-left traverser
class FieldFinder
  constructor: (@predicate) ->

  findPath: (tree) ->
    path = []
    @_visitNode(tree, path)
    return path

  _visitNode: (node, path) ->
    switch(node.type)
      when 'literal'
        return false
      when 'field'
        if(@predicate(node))
          path.push(node)
          return true
        else
          return false
      when 'sequence'
        path.push(node)
        for child in node.parts by -1
          if(@_visitNode(child, path))
            return true
        path.pop()
        return false
      else
        throw new Error("Unknown node type #{node.type}: " + node)


class MandatoryFieldDetector
  constructor: ->

  containsMandatory: (tree) ->
    return @_visitNode(tree)

  _visitNode: (node) ->
    switch(node.type)
      when 'literal'
        return false
      when 'sequence'
        if(not node.optional)
          for child in node.parts
            if(@_visitNode(child))
              return true
        return false
      when 'field'
        return true
      else
        throw new Error("Unknown node type #{node.type}: " + node)



"""
 n  - [0-9] -   Digits
 d   - [0-9]+,[0-9]* problem with total length   -   Digits with decimal comma
 a   - [A-Z]  -   Uppercase letters
 c   - [0-9A-Z] -   Uppercase alphanumeric
 e   - [ ]   -   Space
 x   - [0-9a-zA-Z/\-\?:\(\)\.,&apos;\+ ]   -   SWIFT character set
 z   -  [0-9a-zA-Z!&quot;%&amp;\*;&lt;&gt; \.,\(\)/=&apos;\+:\?@#&#x0d;&#x0a;\{\-_]  -   SWIFT extended character set
 //h      -   Uppercase hexadecimal
 //y      -   Upper case level A ISO 9735 characters


specials:
ISIN
N
//
,
/

new line:
$

"""

module.exports.FieldRegexpFactory = FieldRegexpFactory
module.exports.FieldFinder = FieldFinder
module.exports.FieldNamesParser = FieldNamesParser
module.exports.FieldContentParser = FieldContentParser
module.exports.FieldParser = FieldParser
module.exports.FieldNames = FieldNames
