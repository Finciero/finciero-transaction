
// Transaction 0.1.0
// This class handles transactions formatting and validation
//
// Author: Rafael Vidaurre
// TODO: Re-write this module
'use strict';

// Import utilities
var check = require('validator').check;

// Transaction Class
// =================
var Transaction = function (transactionObj) {
  // Private properties
  // ------------------

  // Constants
  var TRANSACTION_TYPES = ['normal', 'due_cash', 'due_commerce', 'due_fixed', 'due_advance', 'total_due'];

  // Properties
  var _balance, _charge, _deposit, _description, _extendedDescription, _serial;
  var _date = {};
  var _dues = {'total': 0, 'current': 0};
  var _interestRate = 0.0;
  var _type = 'normal';

  // Private methods
  // ---------------
  var _isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  // Calls a setter or getter if argument is passed or not
  var _patternMatch = function (setter, getter, arg) {
    if (typeof(arg) === 'undefined') {
      return getter();
    }
    return setter(arg);
  };

  var _setBalance = function (b) {
    check(b, 'Balance is not a number').isNumeric();
    _balance = b;
  };
  var _getBalance = function () {
    return _balance;
  };

  var _setDescription = function (d) {
    if (typeof(d) !== 'string') {
      throw 'Description is not a string';
    }
    check(d, 'Description can\'t be empty').notEmpty();
    _description = d;
  };
  var _getDescription = function () {
    return _description;
  };

  var _setExtendedDescription = function (e) {
    if (typeof(e) !== 'string') {
      throw 'Extended description must be a string';
    }
    _extendedDescription = e;
  };
  var _getExtendedDescription = function () {
    return _extendedDescription;
  };

  var _setCharge = function (c) {
    if (!_isNumber(c)) {
      throw new Error('Charge must be a number');
    }
    check(c, 'Charge cannot be negative').min(0);
    _charge = parseFloat(c);
  };
  var _getCharge = function () {
    return _charge;
  };

  var _setDeposit = function (d) {
    if (!_isNumber(d)) {
      throw new Error('Deposit must be a number');
    }
    check(d, 'Deposit cannot be negative').min(0);
    _deposit = parseFloat(d);
  };
  var _getDeposit = function () {
    return _deposit;
  };

  var _setDate = function (d) {
    var day, month, year;
    // Match input pattern
    if (typeof(d) === 'string') {
      // Extract d/m/y from string
      var splitted = d.replace(/\-/g, '/').split('/');
      check(splitted.length, 'Invalid date string').equals(3);

      day = splitted[0];
      month = splitted[1];
      year = splitted[2];

    } else if (typeof(d) === 'object') {
      // Extract d/m/y from hash
      day = d.day;
      month = d.month;
      year = d.year;
      check(day, 'Day not set').notNull().isNumeric();
      check(month, 'Day not set').notNull().isNumeric();
      check(year, 'Day not set').notNull().isNumeric();

    } else {
      // Throw an exception if no pattern matches
      throw 'Invalid date argument';
    }

    // Format data
    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);

    // Validate input
    check(day, 'Day out of range').min(1).max(31);
    check(month, 'Month out of range').min(1).max(12);
    check(year, 'Year out of range').min(1990).max(2100);

    // Set date properties
    _date.day = day;
    _date.month = month;
    _date.year = year;
  };
  // Returns formatted date in dd/mm/yyyy
  var _getDate = function () {
    var day, month, year;

    if (typeof(_date.day) === 'undefined' || typeof(_date.month) === 'undefined' ||
      typeof(_date.day) === 'undefined') {
      return undefined;
    }
    if (_date.day < 10) {
      day = '0' + _date.day;
    } else {
      day = _date.day;
    }
    if (_date.month < 10) {
      month = '0' + _date.month;
    } else {
      month = _date.month.toString();
    }

    year = _date.year.toString();

    return day + '/' + month + '/' + year;
  };

  var _setType = function (t) {
    check(t, 'Invalid transaction type').isIn(TRANSACTION_TYPES);
    _type = t;
  };
  var _getType = function () {
    return _type;
  };

  var _setDues = function (obj) {
    var currentDue = parseInt(obj.current, 10);
    var totalDues = parseInt(obj.total, 10);

    // Validations
    check(typeof(obj), 'Argument has to be an object').equals('object');
    if (currentDue > totalDues || currentDue < 1) {
      throw 'Current dues can\'t be bigger than total dues or smaller than 1';
    }
    if (totalDues < 0) {
      throw 'Total dues can\'t be smaller than 1';
    }

    _dues.current = currentDue;
    _dues.total = totalDues;
  };
  var _getDues = function () {
    return _dues;
  };

  var _setInterestRate = function (ir) {
    var interestRate = parseFloat(ir);

    // Validations
    check(interestRate, 'Interest rate must be a positive number').isFloat().min(0);

    _interestRate = interestRate;
  };
  var _getInterestRate = function () {
    return _interestRate;
  };

  var _setSerial = function (s) {
    _serial = s;
  };
  var _getSerial = function () {
    return _serial;
  };

  // Public methods
  // --------------

  // These methods behave as getters or setters depending on wether there was an input or not
  this.balance = function (arg) {
    return _patternMatch(_setBalance, _getBalance, arg);
  };
  this.deposit = function (arg) {
    return _patternMatch(_setDeposit, _getDeposit, arg);
  };
  this.charge = function (arg) {
    return _patternMatch(_setCharge, _getCharge, arg);
  };
  this.description = function (arg) {
    return _patternMatch(_setDescription, _getDescription, arg);
  };
  this.date = function (arg) {
    return _patternMatch(_setDate, _getDate, arg);
  };
  this.type = function (arg) {
    return _patternMatch(_setType, _getType, arg);
  };
  this.dues = function (arg) {
    return _patternMatch(_setDues, _getDues, arg);
  };
  this.interestRate = function (arg) {
    return _patternMatch(_setInterestRate, _getInterestRate, arg);
  };
  this.extendedDescription = function (arg) {
    return _patternMatch(_setExtendedDescription, _getExtendedDescription, arg);
  };
  this.serial = function (arg) {
    return _patternMatch(_setSerial, _getSerial, arg);
  };
  // Receievs an object and runs setters depending on the values passed
  this.set = function (obj) {
    if (typeof(obj.type) !== 'undefined') {
      _setType(obj.type);
    }
    if (typeof(obj.balance) !== 'undefined') {
      _setBalance(obj.balance);
    }
    if (typeof(obj.deposit) !== 'undefined') {
      _setDeposit(obj.deposit);
    }
    if (typeof(obj.charge) !== 'undefined') {
      _setCharge(obj.charge);
    }
    if (typeof(obj.description) !== 'undefined') {
      _setDescription(obj.description);
    }
    if (typeof(obj.extendedDescription) !== 'undefined') {
      _setExtendedDescription(obj.extendedDescription);
    }
    if (typeof(obj.extended_description) !== 'undefined') {
      _setExtendedDescription(obj.extended_description);
    }
    if (typeof(obj.date) !== 'undefined') {
      _setDate(obj.date);
    }
    if (typeof(obj.dues) !== 'undefined') {
      _setDues(obj.dues);
    }
    if (typeof(obj.interestRate) !== 'undefined') {
      _setInterestRate(obj.interestRate);
    }
    if (typeof(obj.serial) !== 'undefined') {
      _setSerial(obj.serial);
    }
  };

  // Checks if all fields have been set successfully and returns a formatted object
  this.build = function () {
    var balance = _getBalance();
    var description = _getDescription();
    var deposit = _getDeposit();
    var charge = _getCharge();
    var date = _getDate();
    var type = _getType();
    var dues = _getDues();
    var interestRate = _getInterestRate();
    var extendedDescription = _getExtendedDescription() || '';
    var serial = _getSerial() || '';

    // Validate data
    check(balance, 'Balance is not set').notNull().notEmpty();
    check(description, 'Description is not set').notNull().notEmpty();
    check(deposit, 'Deposit is not set').notNull().notEmpty();
    check(charge, 'Charge is not set').notNull().notEmpty();
    check(date, 'Date is not set').notNull().notEmpty();
    check(type, 'Type is not set').notNull().notEmpty();
    check(dues.current, 'Current due is not set').notNull().notEmpty();
    check(dues.total, 'Total dues is not set').notNull().notEmpty();
    check(interestRate, 'Interest rate is not set').notNull().notEmpty();

    return {
      'balance': balance,
      'description': description,
      'deposit': deposit,
      'charge': charge,
      'date': date,
      'type': type,
      'current_due': dues.current,
      'total_dues': dues.total,
      'interest_rate': interestRate,
      'extended_description': extendedDescription,
      'serial': serial
    };
  };

  // Initialize transaction
  if (typeof(transactionObj) !== 'undefined') {
    this.set(transactionObj);
  }
};

module.exports = Transaction;
