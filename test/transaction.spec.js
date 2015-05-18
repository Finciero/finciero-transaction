var MOCKUP, assert, Transaction;

assert = require('chai').assert;
Transaction = require('../transaction');

MOCKUP = {
  'good': {
    'date': '01/06/2014',
    'kind': 'normal',
    'balance': 0,
    'charge': 15000,
    'deposit': 0,
    'description': 'Giro cajero automatico'
  }
};

describe('Module Transaction', function () {
  describe('Set object', function () {
    it ('Should have valid keys.', function () {
      var fn = function () {
        var trans = new Transaction(MOCKUP.good);
      };
      assert.doesNotThrow(fn, Error);
    });

    it ('Should be built.', function () {
      var fn = function () {
        var trans = new Transaction(MOCKUP.good);
        trans.build();
      };
      assert.doesNotThrow(fn, Error);
    });
  });
});