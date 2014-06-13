starts = p:parts {return {type:"sequence", optional:false, parts:p}}

parts = part*

part = field 
     / '[' p:parts ']'      {return {type:"sequence", optional:true, parts:p}}
     / l:literal            {return {type:"literal", value:l};}

field = n:number s:set       {return {type:"field", count:n, set:s}}
      / n:number '!' s:set   {return {type:"field", count:n, set:s, exact:true}}
      / lines:number '*' n:number s:set      {return {type:"field", count:n, set:s, lines:lines}}

literal = [^\[\]]

number = $[0-9]+
set = [ndxcaze]