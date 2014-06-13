module.exports = (function(){
    var mtGrammar = require("./mtGrammar.js")

    function parse(input)
    {
        var result = mtGrammar.parse(input)
        return result
    }

    return {
        parse: parse
    }

})();