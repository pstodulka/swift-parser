# SWIFT Parser
JavaScript parser of [ISO 15022](http://www.iso15022.org/) messages used for messaging in securities trading by the [SWIFT network](http://www.swift.com/).
 
## Features
* parses any FIN MT message defined by the [ISO 15022](http://www.iso15022.org/) standard
* parses the message fields
* non-validating - generously parses messages not 100% compliant with the ISO standard
* no checking of SWIFT network rules
* one-way parsing only - doesn't generate the MT messages

## Limitations
* cannot parse field `77E` - message _MT n98 Proprietary Message_ 
* cannot parse ACK/NAK messages 

## Installation
Installation from npm:
```Shell
$ npm install --save swift-parser
```

Installation from the git repository:
```Shell
$ npm install --save git://github.com/swiftlet/swift-parser.git
$ cd node_modules
$ cd swift-parser
$ npm install
$ grunt
```

## Usage
```JavaScript
var SwiftParser = require('swift-parser').SwiftParser;

var parser = new SwiftParser();
parser.parse(swift, function(err, ast) {
    ...
}
```

It is possible to run the `SWIFT parser` from the command line. The result is written to the standard output:

```
$ node swiftParser file.txt
```

## API

### new SwiftParser([metadata])
Initializes a new instance of `SWIFT Parser` using given metadata. If `metadata` is omitted, the default metadata is used.

### swiftParser.parse(swift, callback)
Parses the `swift` message. The line breaks of `swift` must be in Windows format (`\r\n`).

## Example
Parsing of this message:

```
{1:F01TESTBIC12XXX0360105154}{2:O5641057130214TESTBIC34XXX26264938281302141757N}{3:{108:2RDRQDHM3WO}}{4:
:16R:GENL
:20C::CORP//1234567890123456
:20C::SEME//9876543210987654
:23G:NEWM
:22F::CAEV//INTR
:22F::CAMV//MAND
:98C::PREP//20220202105733
:25D::PROC//ENTL
:16S:GENL
:16R:USECU
:35B:ISIN CH0101010101
/XS/232323232
FINANCIAL INSTRUMENT XYZPQR
:16R:FIA
:22F::MICO//A007
:16S:FIA
:16R:ACCTINFO
:97A::SAFE//99999
:94F::SAFE//NCSD/TESTBIC0ABC
:93B::ELIG//FAMT/500000,
:93B::SETT//FAMT/500000,
:16S:ACCTINFO
:16S:USECU
:16R:CADETL
:98A::ANOU//20220113
:98A::RDTE//20220113
:69A::INPE//20220214/20220214
:99A::DAAC//360
:92K::INTR//UKWN
:22F::ADDB//CAPA
:16S:CADETL
:16R:CAOPTN
:13A::CAON//001
:22F::CAOP//CASH
:11A::OPTN//USD
:17B::DFLT//Y
:16R:CASHMOVE
:22H::CRDB//CRED
:22H::CONT//ACTU
:97A::CASH//89898
:19B::ENTL//USD3333,
:19B::TXFR//USD3333,
:19B::NETT//USD3333,
:98A::PAYD//20220214
:98A::VALU//20220214
:98A::EARL//20220214
:92A::INTP//0,75
:92A::TAXR//0,
:16S:CASHMOVE
:16S:CAOPTN
:16R:ADDINFO
:70E::ADTX//PAYMENT UPON RECEIPT OF FUNDS - 
TIMELY PAYMENT EXPECTED
:16S:ADDINFO
-}{5:{CHK:C77F8E009597}}
```

results in the following ast:

```JSON
{
  "block1": {
    "blockId": 1,
    "content": "F01TESTBIC12XXX0360105154",
    "applicationId": "F",
    "serviceId": "01",
    "receivingLtId": "TESTBIC12XXX",
    "sessionNumber": "0360",
    "sequenceNumber": "105154"
  },
  "block2": {
    "content": "O5641057130214TESTBIC34XXX26264938281302141757N",
    "blockId": 2,
    "direction": "O",
    "msgType": "564",
    "inputTime": "1057",
    "inputDate": "130214",
    "bic": "TESTBIC34XXX",
    "sessionNumber": "2626",
    "sequenceNumber": "493828",
    "outputDate": "130214",
    "outputTime": "1757",
    "prio": "N"
  },
  "block3": {
    "name": "3",
    "content": [
      {
        "name": "108",
        "content": [
          "2RDRQDHM3WO"
        ]
      }
    ]
  },
  "block4": {
    "name": "4",
    "content": [
      "\r\n:16R:GENL\r\n:20C::CORP//1234567890123456\r\n:20C::SEME//9876543210987654\r\n:23G:NEWM\r\n:22F::CAEV//INTR\r\n:22F::CAMV//MAND\r\n:98C::PREP//20220202105733\r\n:25D::PROC//ENTL\r\n:16S:GENL\r\n:16R:USECU\r\n:35B:ISIN CH0101010101\r\n/XS/232323232\r\nFINANCIAL INSTRUMENT XYZPQR\r\n:16R:FIA\r\n:22F::MICO//A007\r\n:16S:FIA\r\n:16R:ACCTINFO\r\n:97A::SAFE//99999\r\n:94F::SAFE//NCSD/TESTBIC0ABC\r\n:93B::ELIG//FAMT/500000,\r\n:93B::SETT//FAMT/500000,\r\n:16S:ACCTINFO\r\n:16S:USECU\r\n:16R:CADETL\r\n:98A::ANOU//20220113\r\n:98A::RDTE//20220113\r\n:69A::INPE//20220214/20220214\r\n:99A::DAAC//360\r\n:92K::INTR//UKWN\r\n:22F::ADDB//CAPA\r\n:16S:CADETL\r\n:16R:CAOPTN\r\n:13A::CAON//001\r\n:22F::CAOP//CASH\r\n:11A::OPTN//USD\r\n:17B::DFLT//Y\r\n:16R:CASHMOVE\r\n:22H::CRDB//CRED\r\n:22H::CONT//ACTU\r\n:97A::CASH//89898\r\n:19B::ENTL//USD3333,\r\n:19B::TXFR//USD3333,\r\n:19B::NETT//USD3333,\r\n:98A::PAYD//20220214\r\n:98A::VALU//20220214\r\n:98A::EARL//20220214\r\n:92A::INTP//0,75\r\n:92A::TAXR//0,\r\n:16S:CASHMOVE\r\n:16S:CAOPTN\r\n:16R:ADDINFO\r\n:70E::ADTX//PAYMENT UPON RECEIPT OF FUNDS - \r\nTIMELY PAYMENT EXPECTED\r\n:16S:ADDINFO\r\n-"
    ],
    "fields": [
      {
        "type": "16",
        "option": "R",
        "fieldValue": "GENL",
        "content": ":16R:GENL",
        "ast": {
          "Value": "GENL"
        }
      },
      {
        "type": "20",
        "option": "C",
        "fieldValue": ":CORP//1234567890123456",
        "content": ":20C::CORP//1234567890123456",
        "ast": {
          "Qualifier": "CORP",
          "Reference": "1234567890123456"
        }
      },
      {
        "type": "20",
        "option": "C",
        "fieldValue": ":SEME//9876543210987654",
        "content": ":20C::SEME//9876543210987654",
        "ast": {
          "Qualifier": "SEME",
          "Reference": "9876543210987654"
        }
      },
      {
        "type": "23",
        "option": "G",
        "fieldValue": "NEWM",
        "content": ":23G:NEWM",
        "ast": {
          "Function": "NEWM"
        }
      },
      {
        "type": "22",
        "option": "F",
        "fieldValue": ":CAEV//INTR",
        "content": ":22F::CAEV//INTR",
        "ast": {
          "Qualifier": "CAEV",
          "Indicator": "INTR"
        }
      },
      {
        "type": "22",
        "option": "F",
        "fieldValue": ":CAMV//MAND",
        "content": ":22F::CAMV//MAND",
        "ast": {
          "Qualifier": "CAMV",
          "Indicator": "MAND"
        }
      },
      {
        "type": "98",
        "option": "C",
        "fieldValue": ":PREP//20220202105733",
        "content": ":98C::PREP//20220202105733",
        "ast": {
          "Qualifier": "PREP",
          "Date": "20220202",
          "Time": "105733"
        }
      },
      {
        "type": "25",
        "option": "D",
        "fieldValue": ":PROC//ENTL",
        "content": ":25D::PROC//ENTL",
        "ast": {
          "Qualifier": "PROC",
          "Status Code": "ENTL"
        }
      },
      {
        "type": "16",
        "option": "S",
        "fieldValue": "GENL",
        "content": ":16S:GENL",
        "ast": {
          "Value": "GENL"
        }
      },
      {
        "type": "16",
        "option": "R",
        "fieldValue": "USECU",
        "content": ":16R:USECU",
        "ast": {
          "Value": "USECU"
        }
      },
      {
        "type": "35",
        "option": "B",
        "fieldValue": "ISIN CH0101010101\r\n/XS/232323232\r\nFINANCIAL INSTRUMENT XYZPQR",
        "content": ":35B:ISIN CH0101010101\r\n/XS/232323232\r\nFINANCIAL INSTRUMENT XYZPQR",
        "ast": {
          "Identification of Security": "CH0101010101",
          "Description of Security": "/XS/232323232\r\nFINANCIAL INSTRUMENT XYZPQR"
        }
      },
      {
        "type": "16",
        "option": "R",
        "fieldValue": "FIA",
        "content": ":16R:FIA",
        "ast": {
          "Value": "FIA"
        }
      },
      {
        "type": "22",
        "option": "F",
        "fieldValue": ":MICO//A007",
        "content": ":22F::MICO//A007",
        "ast": {
          "Qualifier": "MICO",
          "Indicator": "A007"
        }
      },
      {
        "type": "16",
        "option": "S",
        "fieldValue": "FIA",
        "content": ":16S:FIA",
        "ast": {
          "Value": "FIA"
        }
      },
      {
        "type": "16",
        "option": "R",
        "fieldValue": "ACCTINFO",
        "content": ":16R:ACCTINFO",
        "ast": {
          "Value": "ACCTINFO"
        }
      },
      {
        "type": "97",
        "option": "A",
        "fieldValue": ":SAFE//99999",
        "content": ":97A::SAFE//99999",
        "ast": {
          "Qualifier": "SAFE",
          "Account Number": "99999"
        }
      },
      {
        "type": "94",
        "option": "F",
        "fieldValue": ":SAFE//NCSD/TESTBIC0ABC",
        "content": ":94F::SAFE//NCSD/TESTBIC0ABC",
        "ast": {
          "Qualifier": "SAFE",
          "Place Code": "NCSD",
          "Identifier Code": "TESTBIC0ABC"
        }
      },
      {
        "type": "93",
        "option": "B",
        "fieldValue": ":ELIG//FAMT/500000,",
        "content": ":93B::ELIG//FAMT/500000,",
        "ast": {
          "Qualifier": "ELIG",
          "Quantity Type Code": "FAMT",
          "Balance": "500000,"
        }
      },
      {
        "type": "93",
        "option": "B",
        "fieldValue": ":SETT//FAMT/500000,",
        "content": ":93B::SETT//FAMT/500000,",
        "ast": {
          "Qualifier": "SETT",
          "Quantity Type Code": "FAMT",
          "Balance": "500000,"
        }
      },
      {
        "type": "16",
        "option": "S",
        "fieldValue": "ACCTINFO",
        "content": ":16S:ACCTINFO",
        "ast": {
          "Value": "ACCTINFO"
        }
      },
      {
        "type": "16",
        "option": "S",
        "fieldValue": "USECU",
        "content": ":16S:USECU",
        "ast": {
          "Value": "USECU"
        }
      },
      {
        "type": "16",
        "option": "R",
        "fieldValue": "CADETL",
        "content": ":16R:CADETL",
        "ast": {
          "Value": "CADETL"
        }
      },
      {
        "type": "98",
        "option": "A",
        "fieldValue": ":ANOU//20220113",
        "content": ":98A::ANOU//20220113",
        "ast": {
          "Qualifier": "ANOU",
          "Date": "20220113"
        }
      },
      {
        "type": "98",
        "option": "A",
        "fieldValue": ":RDTE//20220113",
        "content": ":98A::RDTE//20220113",
        "ast": {
          "Qualifier": "RDTE",
          "Date": "20220113"
        }
      },
      {
        "type": "69",
        "option": "A",
        "fieldValue": ":INPE//20220214/20220214",
        "content": ":69A::INPE//20220214/20220214",
        "ast": {
          "Qualifier": "INPE",
          "Date": "20220214"
        }
      },
      {
        "type": "99",
        "option": "A",
        "fieldValue": ":DAAC//360",
        "content": ":99A::DAAC//360",
        "ast": {
          "Qualifier": "DAAC",
          "Number": "360"
        }
      },
      {
        "type": "92",
        "option": "K",
        "fieldValue": ":INTR//UKWN",
        "content": ":92K::INTR//UKWN",
        "ast": {
          "Qualifier": "INTR",
          "Rate Type Code": "UKWN"
        }
      },
      {
        "type": "22",
        "option": "F",
        "fieldValue": ":ADDB//CAPA",
        "content": ":22F::ADDB//CAPA",
        "ast": {
          "Qualifier": "ADDB",
          "Indicator": "CAPA"
        }
      },
      {
        "type": "16",
        "option": "S",
        "fieldValue": "CADETL",
        "content": ":16S:CADETL",
        "ast": {
          "Value": "CADETL"
        }
      },
      {
        "type": "16",
        "option": "R",
        "fieldValue": "CAOPTN",
        "content": ":16R:CAOPTN",
        "ast": {
          "Value": "CAOPTN"
        }
      },
      {
        "type": "13",
        "option": "A",
        "fieldValue": ":CAON//001",
        "content": ":13A::CAON//001",
        "ast": {
          "Qualifier": "CAON",
          "Number Identification": "001"
        }
      },
      {
        "type": "22",
        "option": "F",
        "fieldValue": ":CAOP//CASH",
        "content": ":22F::CAOP//CASH",
        "ast": {
          "Qualifier": "CAOP",
          "Indicator": "CASH"
        }
      },
      {
        "type": "11",
        "option": "A",
        "fieldValue": ":OPTN//USD",
        "content": ":11A::OPTN//USD",
        "ast": {
          "Qualifier": "OPTN",
          "Currency Code": "USD"
        }
      },
      {
        "type": "17",
        "option": "B",
        "fieldValue": ":DFLT//Y",
        "content": ":17B::DFLT//Y",
        "ast": {
          "Qualifier": "DFLT",
          "Flag": "Y"
        }
      },
      {
        "type": "16",
        "option": "R",
        "fieldValue": "CASHMOVE",
        "content": ":16R:CASHMOVE",
        "ast": {
          "Value": "CASHMOVE"
        }
      },
      {
        "type": "22",
        "option": "H",
        "fieldValue": ":CRDB//CRED",
        "content": ":22H::CRDB//CRED",
        "ast": {
          "Qualifier": "CRDB",
          "Indicator": "CRED"
        }
      },
      {
        "type": "22",
        "option": "H",
        "fieldValue": ":CONT//ACTU",
        "content": ":22H::CONT//ACTU",
        "ast": {
          "Qualifier": "CONT",
          "Indicator": "ACTU"
        }
      },
      {
        "type": "97",
        "option": "A",
        "fieldValue": ":CASH//89898",
        "content": ":97A::CASH//89898",
        "ast": {
          "Qualifier": "CASH",
          "Account Number": "89898"
        }
      },
      {
        "type": "19",
        "option": "B",
        "fieldValue": ":ENTL//USD3333,",
        "content": ":19B::ENTL//USD3333,",
        "ast": {
          "Qualifier": "ENTL",
          "Currency Code": "USD",
          "Amount": "3333,"
        }
      },
      {
        "type": "19",
        "option": "B",
        "fieldValue": ":TXFR//USD3333,",
        "content": ":19B::TXFR//USD3333,",
        "ast": {
          "Qualifier": "TXFR",
          "Currency Code": "USD",
          "Amount": "3333,"
        }
      },
      {
        "type": "19",
        "option": "B",
        "fieldValue": ":NETT//USD3333,",
        "content": ":19B::NETT//USD3333,",
        "ast": {
          "Qualifier": "NETT",
          "Currency Code": "USD",
          "Amount": "3333,"
        }
      },
      {
        "type": "98",
        "option": "A",
        "fieldValue": ":PAYD//20220214",
        "content": ":98A::PAYD//20220214",
        "ast": {
          "Qualifier": "PAYD",
          "Date": "20220214"
        }
      },
      {
        "type": "98",
        "option": "A",
        "fieldValue": ":VALU//20220214",
        "content": ":98A::VALU//20220214",
        "ast": {
          "Qualifier": "VALU",
          "Date": "20220214"
        }
      },
      {
        "type": "98",
        "option": "A",
        "fieldValue": ":EARL//20220214",
        "content": ":98A::EARL//20220214",
        "ast": {
          "Qualifier": "EARL",
          "Date": "20220214"
        }
      },
      {
        "type": "92",
        "option": "A",
        "fieldValue": ":INTP//0,75",
        "content": ":92A::INTP//0,75",
        "ast": {
          "Qualifier": "INTP",
          "Rate": "0,75"
        }
      },
      {
        "type": "92",
        "option": "A",
        "fieldValue": ":TAXR//0,",
        "content": ":92A::TAXR//0,",
        "ast": {
          "Qualifier": "TAXR",
          "Rate": "0,"
        }
      },
      {
        "type": "16",
        "option": "S",
        "fieldValue": "CASHMOVE",
        "content": ":16S:CASHMOVE",
        "ast": {
          "Value": "CASHMOVE"
        }
      },
      {
        "type": "16",
        "option": "S",
        "fieldValue": "CAOPTN",
        "content": ":16S:CAOPTN",
        "ast": {
          "Value": "CAOPTN"
        }
      },
      {
        "type": "16",
        "option": "R",
        "fieldValue": "ADDINFO",
        "content": ":16R:ADDINFO",
        "ast": {
          "Value": "ADDINFO"
        }
      },
      {
        "type": "70",
        "option": "E",
        "fieldValue": ":ADTX//PAYMENT UPON RECEIPT OF FUNDS - \r\nTIMELY PAYMENT EXPECTED",
        "content": ":70E::ADTX//PAYMENT UPON RECEIPT OF FUNDS - \r\nTIMELY PAYMENT EXPECTED",
        "ast": {
          "Qualifier": "ADTX",
          "Narrative": "PAYMENT UPON RECEIPT OF FUNDS - \r\nTIMELY PAYMENT EXPECTED"
        }
      },
      {
        "type": "16",
        "option": "S",
        "fieldValue": "ADDINFO",
        "content": ":16S:ADDINFO",
        "ast": {
          "Value": "ADDINFO"
        }
      }
    ]
  },
  "block5": {
    "name": "5",
    "content": [
      {
        "name": "CHK",
        "content": [
          "C77F8E009597"
        ]
      }
    ]
  }
} 
```
