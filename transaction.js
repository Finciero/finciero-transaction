'use strict';

var TRANSACTION_TYPES, VALID_KEYS, check, _, isValidDate, checkDues, checkKeys, isValidKind,
  isValidBalance, isValidCharge, isValidDeposit, isValidDescription, isValidExtendedDescription,
  isValidInterestRate, isValidSerial, isValidUsd;

check = require('validator').check;
_ = require('lodash');

TRANSACTION_TYPES = ['normal', 'due_cash', 'due_commerce', 'due_fixed', 'due_advance',
  'total_due'];
VALID_KEYS = ['date', 'kind', 'balance', 'charge', 'deposit', 'description', 'extendedDescription',
  'serial', 'dues', 'usd'];

// Private methods
/**
 * Validates that the input string is a valid date formatted as "mm/dd/yyyy"
 * @param  {String}  dateString String with date to check.
 * @return {Boolean}            checked date
 * Extrated from
 * @url http://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
 */
isValidDate = function (dateString) {
  var parts, day, month, year, monthLength;

  check(dateString, 'Date is not set').notNull().notEmpty();
  // First check for the pattern
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    throw new Error('Invalid date string');
  }

  // Parse the date parts to integers
  parts = dateString.split('/');
  day = parseInt(parts[0], 10);
  month = parseInt(parts[1], 10);
  year = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month === 0 || month > 12) {
    throw new Error('Invalid date string');
  }

  monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
};

checkDues = function (currentDue, totalDues) {
  check(currentDue, 'Current due is not a number').isNumeric();
  check(totalDues, 'Total dues is not a number').isNumeric();
  currentDue = parseInt(currentDue, 10);
  totalDues = parseInt(totalDues, 10);

  // Validations
  if (currentDue > totalDues || currentDue < 1) {
    throw new Error('Current dues can\'t be bigger than total dues or smaller than 1');
  }

  if (totalDues < 0) {
    throw new Error('Total dues can\'t be smaller than 1');
  }

  return true;
};

checkKeys = function (obj) {
  _.every(obj, function (value, key) {
    if (!_.includes(VALID_KEYS, key)) {
      throw new Error('Key \'' + key + '\' is not valid.');
    }

    return true;
  });
  return this;
};

isValidKind = function (kind) {
  var noType = _.includes(TRANSACTION_TYPES, kind);
  check(kind, 'Kind is not set').notNull().notEmpty();
  if (!noType) {
    throw new Error('Invalid account type.');
  }

  return this;
};

isValidBalance = function (balance) {
  check(balance, 'Balance is not set').notNull().notEmpty();
  check(balance, 'Balance is not a valid number').isFloat();
  return true;
};

isValidCharge = function (charge) {
  check(charge, 'Charge is not set').notNull().notEmpty();
  check(charge, 'Charge is not a valid number').isFloat();
  check(charge, 'Charge most be a positive number').min(0);
  return true;
};

isValidDeposit = function (deposit) {
  check(deposit, 'Deposit is not set').notNull().notEmpty();
  check(deposit, 'Deposit is not a number').isFloat();
  check(deposit, 'Deposit most be a positive number').min(0);
  return true;
};

isValidUsd = function (usd) {
  check(usd, 'USD is not set').notNull().notEmpty();
  check(usd, 'USD is not a valid float').isFloat();
  check(usd, 'USD most be a positive number').min(0);
  return true;
};

isValidDescription = function (description) {
  check(description, 'Description can\'t be empty').notNull().notEmpty();
  return true;
};

isValidExtendedDescription = function (extendedDescription) {
  return true;
};

isValidInterestRate = function (interestRate) {
  check(interestRate, 'Interest rate must be a positive number').isFloat().min(0);
  return true;
};

isValidSerial = function (isValidSerial) {
  return true;
};
/**
 * Module to check and build transactions object.
 * @param {Object} transactionObj Object with transaction values.
 *
 */
function Transaction (transactionObj) {
  if (typeof transactionObj === 'undefined') {
    return this;
  }

  checkKeys(transactionObj);
  this.date(transactionObj.date);
  this.kind(transactionObj.kind || 'normal');
  this.balance(transactionObj.balance);
  this.charge(transactionObj.charge);
  this.deposit(transactionObj.deposit);
  this.description(transactionObj.description);
  this.extendedDescription(transactionObj.extendedDescription || '');
  if (typeof transactionObj.dues === 'undefined') {
    this.dues({'current': 1, 'total': 1});
  } else {
    this.dues({'current': transactionObj.dues.current, 'total': transactionObj.dues.total});
  }

  this.interestRate(transactionObj.interestRate || 0);
  this.serial(transactionObj.serial || '');
  this.usd(transactionObj.usd || 0);
}

Transaction.prototype.date = function (date) {
  if (typeof date !== 'undefined') {
    isValidDate(date);
    this._date = date;
  }
  return this._date;
};

Transaction.prototype.kind = function (kind) {
  if (typeof kind !== 'undefined') {
    isValidKind(kind);
    this._kind = kind;
  }
  return this._kind;
};

Transaction.prototype.balance = function (balance) {
  if (typeof balance !== 'undefined') {
    isValidBalance(balance);
    this._balance = balance;
  }
  return this._balance;
};

Transaction.prototype.charge = function (charge) {
  if (typeof charge !== 'undefined') {
    isValidCharge(charge);
    this._charge = charge;
  }
  return this._charge;
};

Transaction.prototype.deposit = function (deposit) {
  if (typeof deposit !== 'undefined') {
    isValidDeposit(deposit);
    this._deposit = deposit;
  }
  return this._deposit;
};

Transaction.prototype.description = function (description) {
  if (typeof description !== 'undefined') {
    isValidDescription(description);
    this._description = description;
  }
  return this._description;
};

Transaction.prototype.extendedDescription = function (extendedDescription) {
  if (typeof extendedDescription !== 'undefined') {
    isValidExtendedDescription(extendedDescription);
    this._extendedDescription = extendedDescription;
  }
  return this._extendedDescription;
};

Transaction.prototype.dues = function (objectDues) {
  if (typeof objectDues !== 'undefined') {
    checkDues(objectDues.current, objectDues.total);
    this._currentDue = objectDues.current;
    this._totalDues = objectDues.total;
  }
  return {
    'current': this._currentDue,
    'total': this._totalDues
  };
};

Transaction.prototype.interestRate = function (interestRate) {
  if (typeof interestRate !== 'undefined') {
    isValidInterestRate(interestRate);
    this._interestRate = interestRate;
  }
  return this._interestRate;
};

Transaction.prototype.serial = function (serial) {
  if (typeof serial !== 'undefined') {
    isValidSerial(serial);
    this._serial = serial;
  }
  return this._serial;
};

Transaction.prototype.usd = function (usd) {
  if (typeof usd !== 'undefined') {
    isValidUsd(usd);
    this._usd = parseFloat(usd);
  }
  return parseFloat(this._usd);
};

Transaction.prototype.build = function () {
  var date, kind, balance, charge, deposit, description, extendedDescription, dues, currentDue,
    totalDues, interestRate, serial, usd;

  date = this.date();
  kind = this.kind();
  balance = this.balance();
  charge = this.charge();
  deposit = this.deposit();
  description = this.description();
  extendedDescription = this.extendedDescription();
  dues = this.dues();
  currentDue = dues.current;
  totalDues = dues.total;
  interestRate = this.interestRate();
  serial = this.serial();
  usd = this.usd();

  return {
    'date': date,
    'kind': kind,
    'balance': balance,
    'charge': charge,
    'deposit': deposit,
    'description': description,
    'extended_description': extendedDescription,
    'dues': {
      'current': currentDue,
      'total': totalDues
    },
    'interest_rate': interestRate,
    'serial': serial,
    'usd': usd
  };
};

module.exports = Transaction;
