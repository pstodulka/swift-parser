start
  = blocks:blocks [\r\n]* {return blocks}

blocks = block*

block = "{" name:$[^:]+ ":" content:content "}" {return {name:name, content:content}}

content = (block / text)+

text = chars:$[^{}]+

