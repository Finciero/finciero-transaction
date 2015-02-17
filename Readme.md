Note: This repository requires a big rework for maintainability

Transaction
===========

This class handles validation and formatting of bank transactions
to be used in Scrappy scripts

Requiring
=========

    Transaction = require('./transaction');
    t = new Transaction() // Instance new transaction

Setters & getters
-----------------
Setters and getters are pattern matched functions that behave depending on wether an
argument was passed or not.

**Description**
Description cannot be empty
Set:

    t.description("Description text");

Get:

    t.description();

**Charge and Deposit**
Only positive numbers are allowed
Set:

    t.charge(10);
    t.deposit(100);

Get:

    t.charge();
    t.deposit();

**Date**
Date can be passed as an object or a formatted string
in format *dd/mm/yyyy* or *dd-mm-yyyy* where day and month are allowed to be prefixed by a *0*
Set:

    t.date('12/11/2004'); // Valid
    t.date('2-11-2004'); // Valid
    t.date('12132012'); // Invalid
    t.date('32/12/2013'); // Invalid, day out of range
    t.date({day: 12, month: 11, year: 2011}); // Valid
    t.date({day: '12', month: '11', year: '2011'}); // Valid

Get:

    t.date(); // Returns a string formatted as *dd/mm/yyyy* and prefixes day and month with a *0* when necessary

**Type**
Type must be a string and must be in the list of valid types (default is "normal")
Set:

    t.type("normal"); // Valid
    t.type("due"); // Valid
    t.type("snoop dog") // Invalid

**Dues**
Dues receives an object with `current` and `total` fields. Where both must be integers bigger than *0* and current
cannot be bigger than total
Set:

    t.dues({current: 1, total: 12}); // Valid
    t.dues({current: 3, total: 2}); // Invalid
    t.dues({current: 3}); // Invalid

Get:

    t.dues(); // Returns: {current: ..., total: ...}


Building the transaction
------------------------

Once all attributes have been set, you can retrieve a final transaction object
with the `build` method.

    t.build(); // Returns {description: 'Foo', 'date': '01/01/2001' ... }

This method will throw an exception if an attribute has not been set.
