module.exports = (function(){
    var finGrammar = require("./finGrammar.js")

    function parse(input)
    {
        var result = finGrammar.parse(input)
        var map = {}
        result.forEach(function(block){map["block"+block.name] = block})
        return map
    }

    return {
        parse: parse
    }

})();