var assert = require('assert');
var ns = require('../FieldRegexpFactory');
var FieldRegexpFactory = ns.FieldRegexpFactory;

describe('FieldRegexpFactory', function(){
    var factory = new FieldRegexpFactory();

    it('throws if there are more fields than patterns', function(){
        assert.throws(function(){
            factory.createRegexp("35x", "(Account)(xxx)");
        });
    });
    it('one field', function(){
        var r = factory.createRegexp("35x", "(Account)");
        assert.equal(r, "^(?<Account>.{1,35})$");
    });
    it('unnamed field', function(){
        var r = factory.createRegexp("35x", "");
        assert.equal(r, "^(?<Value>.{1,35})$");
    });
    it('one field optional', function(){
        var r = factory.createRegexp("[35x]", "(Account)");
        assert.equal(r, "^(?<Account>.{1,35})?$");
    });
    it('one field exact', function(){
        var r = factory.createRegexp("6!n", "(Date)");
        assert.equal(r, "^(?<Date>.{6})$");
    });
    it('one field exact optional', function(){
        var r = factory.createRegexp("[6!n]", "(Date)");
        assert.equal(r, "^(?<Date>.{6})?$");
    });
    it('two fields', function(){
       var r = factory.createRegexp("3!a15d", "(Type)(Quantity)");
        assert.equal(r, "^(?<Type>.{3})(?<Quantity>.{1,15})$");
    });
    it('two optional fields', function(){
       var r = factory.createRegexp("[3!a][15d]", "(Type)(Quantity)");
        assert.equal(r, "^(?<Type>.{3})?(?<Quantity>.{1,15})?$");
    });


    it('one multiline field', function(){
        var r = factory.createRegexp("5*35x", "(Narrative)");
        assert.equal(r, "^(?<Narrative>.{1,35}(\r\n.{1,35}){0,4})$");
    });
    it('more multiline field', function(){
        var r = factory.createRegexp("4!c//4*35x", "(Qualifier)(Narrative)");
        assert.equal(r, "^(?<Qualifier>.{4})//(?<Narrative>.{1,35}(\r\n.{1,35}){0,3})$");
    });


    it('two separated fields', function(){
        var r = factory.createRegexp("4!c//8!n", "(Qualifier)(Date)");
        assert.equal(r, "^(?<Qualifier>.{4})//(?<Date>.{8})$");
    });
    it('two separated optional fields', function(){
        var r = factory.createRegexp("5n[/2n]", "(PageNumber)(Indicator)");
        assert.equal(r, "^(?<PageNumber>.{1,5})(/(?<Indicator>.{1,2}))?$");
    });
    it('multiple separated fields', function(){
        var r = factory.createRegexp(":4!c//3!a/3!a/15d", "(Qualifier)(FirstCurrencyCode)(SecondCurrencyCode)(Rate)");
        assert.equal(r, "^:?(?<Qualifier>.{4})//(?<FirstCurrencyCode>.{3})/(?<SecondCurrencyCode>.{3})/(?<Rate>.{1,15})$");
    });

    it('leading colon', function(){
        var r = factory.createRegexp(":4!c//8!n", "(Qualifier)(Date)");
        assert.equal(r, "^:?(?<Qualifier>.{4})//(?<Date>.{8})$");
    });
    it('empty field names', function(){
        var r = factory.createRegexp("3!n", "");
        assert.equal(r, "^(?<Value>.{3})$");
    });

//field merging
    it('merged fields', function(){
        var r = factory.createRegexp(":4!c//4!a2!a2!c[3!c]", "(Qualifier)(IdentifierCode)");
        assert.equal(r, "^:?(?<Qualifier>.{4})//(?<IdentifierCode>.{4}.{2}.{2}(.{3})?)$");
    });
//sign
    it('named sign', function(){
        var r = factory.createRegexp("[N]3!n", "(Sign)(Number)");
        assert.equal(r, "^(?<Sign>N)?(?<Number>.{3})$");
    });
//isin
    it('ISIN', function(){
        var r = factory.createRegexp("[ISIN1!e12!c]", "(IdentificationOfSecurity)");
        assert.equal(r, "^(ISIN {1}(?<IdentificationOfSecurity>.{12}))?$");
    });

//multiline
    it('multiline pattern with mandatory parts', function(){
        var r = factory.createRegexp("3!a$5!a", "(First)$(Second)");
        assert.equal(r, "^(?<First>.{3})\r\n(?<Second>.{5})$");
    });
    it('multiline pattern with optional first part', function(){
        var r = factory.createRegexp("[3!a]$5!a", "(First)$(Second)");
        assert.equal(r, "^(?<First>.{3})?(\r\n)?(?<Second>.{5})$");
    });
    it('multiline pattern with optional second part', function(){
        var r = factory.createRegexp("3!a$[5!a]", "(First)$(Second)");
        assert.equal(r, "^(?<First>.{3})(\r\n)?(?<Second>.{5})?$");
    });
    it('multiline pattern with optional both parts', function(){
        var r = factory.createRegexp("[3!a]$[5!a]", "(First)$(Second)");
        assert.equal(r, "^(?<First>.{3})?(\r\n)?(?<Second>.{5})?$");
    });
    it('multiline pattern with multiple fields', function(){
        var r = factory.createRegexp("[/1!a][/34x]$4!a2!a2!c[3!c]", "(PartyIdentifier)$(IdentifierCode)");
        assert.equal(r, "^(?<PartyIdentifier>(/.{1})?(/.{1,34})?)(\r\n)?(?<IdentifierCode>.{4}.{2}.{2}(.{3})?)$");
    });
    it('multiline pattern with multiline field', function(){
        var r = factory.createRegexp("[/1!a][/34x]$4*35x", "(PartyIdentifier)$(NameAndAddress)");
        assert.equal(r, "^(?<PartyIdentifier>(/.{1})?(/.{1,34})?)(\r\n)?(?<NameAndAddress>.{1,35}(\r\n.{1,35}){0,3})$");
    });
    it('multiline pattern with three lines', function(){
        var r = factory.createRegexp("3!n$6!n$[4!n6!n]", "(MTNumber)$(Date)$(SessionNumber)(ISN)");
        assert.equal(r, "^(?<MTNumber>.{3})\r\n(?<Date>.{6})(\r\n)?((?<SessionNumber>.{4})(?<ISN>.{6}))?$");
    });

//narrative
    it('charset z', function(){
        var r = factory.createRegexp("8000z", "(Narrative)");
        assert.equal(r, "^(?<Narrative>[\\s\\S]{1,8000})$");
    });
});

describe('FieldNamesParser', function(){
    it('parses empty string', function(){
        var result = ns.FieldNamesParser.parseFieldNames("");
        assert.deepEqual(result, []);
    });
    it('parses one field', function(){
        var result = ns.FieldNamesParser.parseFieldNames("(field)");
        assert.deepEqual(result, ["field"]);
    });
    it('parses multiple fields', function(){
        var result = ns.FieldNamesParser.parseFieldNames("(field1)(field2)(field 3 with space)");
        assert.deepEqual(result, ["field1", "field2", "field_3_with_space"]);
    });
    it('parses multiline fields', function(){
        var result = ns.FieldNamesParser.parseFieldNames("(field1)$(field2)(field3)");
        assert.deepEqual(result, ["field1", "field2", "field3"]);
    });
});

describe('FieldContentParser', function(){
    var factory = new FieldRegexpFactory();
    it('parses one field', function(){
        var r = factory.createRegexp("6!n", "(Date)");
        var fieldParser = new ns.FieldContentParser(r, new ns.FieldNames("(Date)"));
        var result = fieldParser.parse("123456");
        assert.deepEqual(result, {Date:"123456"});
    });
    it('parses complex field with colon', function(){
        var r = factory.createRegexp(":4!c//8!n6!n[,3n][/[N]2!n[2!n]]", "(Qualifier)(Date)(Time)(Decimals)(UTC Sign)(UTC Indicator)");
        var fieldParser = new ns.FieldContentParser(r, new ns.FieldNames("(Qualifier)(Date)(Time)(Decimals)(UTC Sign)(UTC Indicator)"));
        var result = fieldParser.parse(":QUAL//20140418010323,555/N9912");
        assert.deepEqual(result, {Qualifier:"QUAL", Date:"20140418", Time:"010323", Decimals:"555", 'UTC Sign': "N", 'UTC Indicator':"9912"});
    });
    it('parses complex field without colon', function(){
        var r = factory.createRegexp(":4!c//8!n6!n[,3n][/[N]2!n[2!n]]", "(Qualifier)(Date)(Time)(Decimals)(UTC Sign)(UTC Indicator)");
        var fieldParser = new ns.FieldContentParser(r, new ns.FieldNames("(Qualifier)(Date)(Time)(Decimals)(UTC Sign)(UTC Indicator)"));
        var result = fieldParser.parse("QUAL//20140418010323,555/N9912");
        assert.deepEqual(result, {Qualifier:"QUAL", Date:"20140418", Time:"010323", Decimals:"555", 'UTC Sign': "N", 'UTC Indicator':"9912"});
    });
});

describe('FieldParser', function() {
    var parser;
    before(function(){
        parser = new ns.FieldParser(patterns);
    });

    it('unnamed field', function(){
        var result = parser.parse('12', 'ABC');
        assert.deepEqual(result, {Value:"ABC"});
    });
    it('named field', function(){
        var result = parser.parse('19', '123456789');
        assert.deepEqual(result, {Amount:"123456789"});
    });
    it('optional part present', function(){
        var result = parser.parse('28', '1234/56');
        assert.deepEqual(result, {'Page Number':"1234", Indicator:"56"});
    });
    it('optional part missing', function(){
        var result = parser.parse('28', '1234');
        assert.deepEqual(result, {'Page Number':"1234"});
    });
    it('multiple fields with separator', function(){
        var result = parser.parse('92B', 'ABCD//CZK/USD/,0123456789');
        assert.deepEqual(result, {Qualifier:"ABCD", 'First Currency Code':"CZK","Second Currency Code":"USD", Rate:",0123456789"});
    });
    it('leading colon', function(){
        var result = parser.parse('92B', ':ABCD//CZK/USD/,0123456789');
        assert.deepEqual(result, {Qualifier:"ABCD", 'First Currency Code':"CZK","Second Currency Code":"USD", Rate:",0123456789"});
    });
    it('merged fields with optional present', function(){
        var result = parser.parse('95P', ':MERE//CRESCHZZEEO');
        assert.deepEqual(result, {Qualifier:"MERE", 'Identifier Code':"CRESCHZZEEO"});
    });
    it('merged fields with optional missing', function(){
        var result = parser.parse('95P', ':MERE//CRESCHZZ');
        assert.deepEqual(result, {Qualifier:"MERE", 'Identifier Code':"CRESCHZZ"});
    });
    it('sign missing', function(){
        var result = parser.parse('19A', 'ABCD//CZK123,456');
        assert.deepEqual(result, {Qualifier:"ABCD", 'Currency Code':"CZK", Amount:"123,456"});
    });
    it('sign present', function(){
        var result = parser.parse('19A', 'ABCD//NCZK123,456');
        assert.deepEqual(result, {Qualifier:"ABCD", Sign:"N", 'Currency Code':"CZK", Amount:"123,456"});
    });

    it('handling of 98E - mandatory only', function(){
        var result = parser.parse('98E', 'ABCD//20140427133200');
        assert.deepEqual(result, {Qualifier:"ABCD", Date:"20140427", Time:"133200"});
    });
    it('handling of 98E - with decimals', function(){
        var result = parser.parse('98E', 'ABCD//20140427133200,123');
        assert.deepEqual(result, {Qualifier:"ABCD", Date:"20140427", Time:"133200", Decimals:"123"});
    });
    it('handling of 98E - with sign', function(){
        var result = parser.parse('98E', 'ABCD//20140427133200/N0102');
        assert.deepEqual(result, {Qualifier:"ABCD", Date:"20140427", Time:"133200", "UTC Sign":"N", "UTC Indicator":"0102"});
    });

    it('narrative single line', function(){
        var narrative = '++ ADDITIONAL INFORMATION ++SHS DEL';
        var result = parser.parse('70G', "ADTX//" + narrative);
        assert.deepEqual(result, {Qualifier:"ADTX", Narrative:narrative});
    });
    it('narrative multiline', function(){
        var narrative = '++ ADDITIONAL INFORMATION ++SHS DEL\r\nTO YOU UPON RECEIPT PLUS\r\nHKD80.64';
        var result = parser.parse('70G', "ADTX//" + narrative);
        assert.deepEqual(result, {Qualifier:"ADTX", Narrative:narrative});
    });
    it('narrative charset z', function(){
        var narrative = "+------------- REPURCHASE OFFER / -------------+\r\n+------------ CONSENT SOLICITATION ------------+\r\n.\r\nCONTINUATION OF SWIFT MT564/568 SENT WITH CORP.\r\nREF. 294166.\r\n.\r\nPROCEEDS:\r\n.\r\n1/(A) TOTAL CONSIDERATION:\r\nHOLDERS WHO VALIDLY TENDER THEIR NOTES BEFORE\r\nTHE EARLY TENDER DEADLINE AND WHOSE NOTES ARE\r\nACCEPTED FOR PURCHASE WILL RECEIVE USD 1'170.87\r\nFOR EACH USD 1'000 PRINCIPAL AMOUNT.\r\n(THE TOTAL CONSIDERATION INCLUDES A CONSENT\r\nPAYMENT OF USD 30.00 PER USD 1'000 PRINCIPAL\r\nAMOUNT)\r\n.\r\n1/(B) OFFER CONSIDERATION:\r\nHOLDERS WHO VALIDLY TENDER THEIR NOTES AFTER THE\r\nEARLY TENDER DEADLINE AND WHOSE NOTES ARE\r\nACCEPTED FOR PURCHASE WILL RECEIVE USD 1'140.87\r\nFOR EACH USD 1'000 PRINCIPAL AMOUNT.\r\n.\r\n2/ IN ADDITION, AN AMOUNT IN CASH FOR ACCRUED\r\nAND UNPAID INTEREST WILL BE PAID, WHICH WILL BE\r\nHANDLED BY OUR INCOME DEPARTMENT.\r\n.\r\nTHE CONSENT PAYMENT IS N-O-T IRS REPORTABLE WITH\r\nINCOME CODE 50.\r\n.\r\nPOSSIBLE EFFECTS ON UNTENDERED NOTES:\r\nAS SOON AS REASONABLY PRACTICABLE FOLLOWING THE\r\nFINANCING, THE COMPANY CURRENTLY INTENDS, BUT IS\r\nNOT OBLIGATED, TO CALL FOR REDEMPTION ALL OF THE\r\nNOTES THAT REMAIN OUTSTANDING FOLLOWING THE\r\nCONSUMMATION OF THE FINANCING IN ACCORDANCE WITH\r\nTHE PROVISIONS OF THE INDENTURE, AND AT THAT\r\nTIME TO SATISFY AND DISCHARGE THE INDENTURE IN\r\nACCORDANCE WITH ITS TERMS. PLEASE FIND FURTHER\r\nINFORMATION TO UNTENDERED NOTES ON PAGES 6, 10\r\nAND 20-21 IN THE 'PROSPECTUS'.\r\n.\r\nCONDITIONS OF THE OFFER:\r\nTHE OFFER IS NOT CONDITIONED UPON ANY MINIMUM\r\nAMOUNT OF NOTES BEING TENDERED OR ANY OF THE\r\nPROPOSED AMENDMENTS BECOMING OPERATIVE. THE\r\nOFFER IS HOWEVER SUBJECT TO THE SATISFACITON OF\r\nTHE FINANCING CONDITION AND THE GENERAL\r\nCONDITIONS.\r\n.\r\nADOPTION OF THE PROPOSED AMENDMENTS ARE SUBJECT\r\nTO COMPANY'S RECEIPT OF THE RELEVANT REQUISITE\r\nCONSENTS, SATISFACTION OF THE FINANCING\r\nCONDITION AND CONSUMMATION OF THE OFFER.\r\n.\r\nPLEASE FIND FULL DESCRIPTION OF THE OFFER\r\nCONDITIONS ON PAGES III AND 11-13 IN THE\r\n'PROSPECTUS'.\r\n.\r\nTIMETABLE:\r\nWITHDRAWAL DEADLINE: PLEASE FULLY REFER TO PAGE\r\nIV IN THE 'PROSPECTUS'\r\n.\r\nRESTRICTIONS: NONE\r\nINVESTORS MUST VERIFY THAT THEY ARE NOT ACTING\r\nAGAINST THEIR COUNTRY'S REGULATIONS.\r\n.\r\nWITH YOUR INSTRUCTION YOU CONFIRM YOUR\r\nELIGIBILITY TO PARTICIPATE IN THE OFFER.\r\n.\r\nTHE 'PROSPECTUS' IS AVAILABLE IN CAES OR AT SIX\r\nSIS UPON REQUEST.\r\n.\r\n+++++++++ EARLY RESULTS AND SETTLEMENT +++++++++\r\n.\r\nAS OF THE EARLY TENDER DEADLINE USD 598'620'000\r\nAGGREGATE PRINCIPAL AMOUNT, OR APPROXIMATELY\r\n99.8 PCT OF THE NOTES HAVE BEEN VALIDLY TENDERED\r\nAND THE RELATED CONSENTS HAVE BEEN VALIDLY\r\nDELIVERED.\r\n.\r\nWITH THE RECEIPT OF THE REQUISITE CONSENTS, THE\r\nCOMPANY HAS EXECUTED A SUPPLEMENTAL INDENTURE\r\nGOVERNING THE NOTES, WHICH WILL AMEND THE\r\nINDENTURE UNDER WHICH THE NOTES WERE ISSUED TO\r\nELIMINATE SUBSTANTIALLY ALL OF THE RESTRICTIVE\r\nCOVENANTS AND EVENTS OF DEFAULT AND RELATED\r\nPROVISIONS IN THE INDENTURE. THE AMENDMENTS TO\r\nTHE INDENTURE WILL BECOME OPERATIVE UPON PAYMENT\r\nFOR NOTES VALIDLY TENDERED PRIOR TO THE EARLY\r\nTENDER DEADLINE MADE BY THE COMPANY.\r\n.\r\nHOLDERS WHO PARTICIPATED IN THE OFFER AND WHOSE\r\nNOTES HAVE BEEN ACCEPTED WILL BE CREDITED TODAY,\r\nWITH VALUE DATE 08.02.2013, WITH THE FOLLOWING\r\nCASH AMOUNT (FOR EACH USD 1'000 P.A.):\r\n.\r\nPURCHASE PRICE: USD 1'140.87\r\nCONSENT PAYMENT: USD 30.00\r\nACCRUED INTEREST: USD 23.631944\r\n(RATE: 10.25 PCT / DAYS: 83/360)\r\n.\r\nTHE 'EARLY RESULTS ANNOUNCEMENT' IS AVAILABLE IN\r\nCAES OR AT SIX SIS UPON REQUEST.\r\n.\r\nSTATUS: COMPLETE\r\n.\r\nFOR ANY QUERIES PLEASE CONTACT:\r\nCABO.GROUP(AT)ISIS.SISCLEAR.COM";
        var result = parser.parse('70F', "ADTX//" + narrative);
        assert.deepEqual(result, {Qualifier:"ADTX", Narrative:narrative});

    });

    it('identification of security with ISIN and description', function(){
        var result = parser.parse('35B', "ISIN US8175651046\r\n/CH/969683\r\nSERVICE CORP INTL SHS");
        assert.deepEqual(result, {'Identification of Security':"US8175651046", 'Description of Security':"/CH/969683\r\nSERVICE CORP INTL SHS"});
    });
    it('identification of security without ISIN', function(){
        var content = "/CH/969683\r\nSERVICE CORP INTL SHS";
        var result = parser.parse('35B', content);
        assert.deepEqual(result, {'Description of Security':content});
    });
    it('identification of security with ISIN only', function(){
        var result = parser.parse('35B', "ISIN US8175651046");
        assert.deepEqual(result, {'Identification of Security':"US8175651046"});
    });
    it('multiline pattern - first line present', function(){
        var result = parser.parse('53D', '/X/123456\r\nname\r\naddres\r\naddress2');
        assert.deepEqual(result, {"Party Identifier":"/X/123456", "Name and Address":"name\r\naddres\r\naddress2"});
    });
    it('multiline pattern - first line missing', function(){
        var result = parser.parse('53D', 'name\r\naddres\r\naddress2');
        assert.deepEqual(result, {"Name and Address":"name\r\naddres\r\naddress2", 'Party Identifier':""}); //the fully optional party matches an empty string
    });


    it('handling of 77E not supported', function(){
        assert.throws(function(){
            parser.parse('77E', 'ABCD//20140427133200');
        });
    });
});

var patterns = {
    "12": {
        "pattern": "3!n",
        "fieldNames": ""
    },
    "19": {
        "pattern": "17d",
        "fieldNames": "(Amount)"
    },
    "28": {
        "pattern": "5n[/2n]",
        "fieldNames": "(Page Number)(Indicator)"
    },
    "92B": {
        "pattern": ":4!c//3!a/3!a/15d",
        "fieldNames": "(Qualifier)(First Currency Code)(Second Currency Code)(Rate)"
    },
    "95P": {
        "pattern": ":4!c//4!a2!a2!c[3!c]",
        "fieldNames": "(Qualifier)(Identifier Code)"
    },
    "19A": {
        "pattern": ":4!c//[N]3!a15d",
        "fieldNames": "(Qualifier)(Sign)(Currency Code)(Amount)"
    },
    "98E": {
        "pattern": ":4!c//8!n6!n[,3n][/[N]2!n[2!n]]",
        "fieldNames": "(Qualifier)(Date)(Time)(Decimals)(UTC Sign)(UTC Indicator)"
    },
    "70G": {
        "pattern": ":4!c//10*35z",
        "fieldNames": "(Qualifier)(Narrative)"
    },
    "70F": {
        "pattern": ":4!c//8000z",
        "fieldNames": "(Qualifier)(Narrative)"
    },
    "35B": {
        "pattern": "[ISIN1!e12!c]$[4*35x]",
        "fieldNames": "(Identification of Security)$(Description of Security)"
    },
    "53D": {
        "pattern": "[/1!a][/34x]$4*35x",
        "fieldNames": "(Party Identifier)$(Name and Address)"
    },
    "77E": {
        "pattern": "73x$[n*78x]",
        "fieldNames": "(Text)$(Text)"
    }
};
