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
  },
  'usd': {
    'date': '01/06/2014',
    'kind': 'normal',
    'balance': 0,
    'charge': 15000,
    'deposit': 0,
    'description': 'Giro cajero automatico',
    'usd': 25.0
  },
  'decimal': {
    'date': '01/06/2014',
    'kind': 'normal',
    'balance': -1240,
    'charge': 15000.5,
    'deposit': 0,
    'description': 'Giro cajero automatico',
    'usd': 25.0
  },
  'noKind': {
    'date': '01/06/2014',
    'balance': -1240,
    'charge': 15000.5,
    'deposit': 0,
    'description': 'Giro cajero automatico',
    'usd': 25.0
  }
};

describe('Module Transaction', function () {
  describe('Set object', function () {
    it ('Should have valid keys.', function () {
      var trans = new Transaction(MOCKUP.good);
    });

    it ('Should be built.', function () {
      var trans = new Transaction(MOCKUP.good);
      trans.build();
    });

    it ('Should validate all values and keys', function () {
      var trans = new Transaction(MOCKUP.usd);
      trans.build();
    });

    it ('Should validate all keys and decimal values', function () {
      var trans = new Transaction(MOCKUP.decimal);
      trans.build();
    });

    it ('Should throw if kind is not set.', function () {
      var fn = function () {
        var trans = new Transaction(MOCKUP.noKind);
        trans.build();
      };
      assert.throws(fn, Error, 'Kind is not set');
    });

    it ('should set all property of a new instance and does not throw', function () {
      var t = new Transaction();

      t.date('01/06/2014');
      t.kind('normal');
      t.balance(0);
      t.charge(15000);
      t.deposit(0);
      t.description('Giro cajero automatico');

      t.build();
    });
  });
});
