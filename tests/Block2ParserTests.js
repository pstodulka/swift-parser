var assert = require("assert");
var block2Parser = require('../block2Parser');

describe('Block2 Parser', function(){
    it('parses the correct ouput block', function(){
        var text = 'O5681558130214INSECHZZBXXX31204722651302141558N';
        var result = block2Parser.parse(text);
        assert.equal(result.content, text);
        assert.equal(result.blockId, 2);
        assert.equal(result.direction, 'O');
        assert.equal(result.msgType, '568');
        assert.equal(result.inputTime, '1558');
        assert.equal(result.inputDate, '130214');
        assert.equal(result.bic, 'INSECHZZBXXX');
        assert.equal(result.sessionNumber, '3120');
        assert.equal(result.sequenceNumber, '472265');
        assert.equal(result.outputDate, '130214');
        assert.equal(result.outputTime, '1558');
        assert.equal(result.prio, 'N');
    })
    it('parses the full input block ', function(){
        var text = 'I564SWHQGB2L0XXXN3003';
        var result = block2Parser.parse(text);
        assert.equal(result.content, text);
        assert.equal(result.blockId, 2);
        assert.equal(result.direction, 'I');
        assert.equal(result.msgType, '564');
        assert.equal(result.bic, 'SWHQGB2L0XXX');
        assert.equal(result.prio, 'N');
        assert.equal(result.monitoringField, '3');
        assert.equal(result.obsolescence, '003');
    })
    it('parses the shortened input block ', function(){
        var text = 'I564SWHQGB2L0XXXN';
        var result = block2Parser.parse(text);
        assert.equal(result.content, text);
        assert.equal(result.blockId, 2);
        assert.equal(result.direction, 'I');
        assert.equal(result.msgType, '564');
        assert.equal(result.bic, 'SWHQGB2L0XXX');
        assert.equal(result.prio, 'N');
        assert.equal(result.monitoringField, undefined);
        assert.equal(result.obsolescence, undefined);
    })
})

