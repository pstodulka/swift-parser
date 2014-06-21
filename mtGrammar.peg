start = eol fields:(complexField/simpleField)* {return fields}

simpleField = header:fieldHeader fieldText:content {
                      return {
                        type: header.type,
                        option: header.option,
                        fieldValue: fieldText,
                        content: header.text+fieldText
                      };
                    }

complexField = header:fieldHeader ":" qualifier:$(!"/" .)+ "//" fieldText:content {
                      var fieldValue = ":"+qualifier+"//"+fieldText;
                      return {
                        type: header.type,
                        option: header.option,
                        fieldValue: fieldValue,
                        content: header.text+fieldValue
                      };
                    }


fieldHeader = ":" type:$(digit digit) option:letter ":" {return {type: type, option: option, text: text()}}

content = text:$(!((eol ":")/(eol "-")) .)* ((eol &":")/(eol "-")) {return text}

eol = "\r\n"

digit = [0-9]

letter = [a-zA-Z]

