time.js
========

Simple Javascript Date Object Wrapper. 

How to use it
-------------

The current API:

* The `TIME` global variable is the constructor:
 
`  var foo = new Date(), 
   bar = new Date(), 
   time;

   bar.setFullYear(1982); 
   
   time = TIME('30/02/2011 14:30', foo, bar);`
   
* `Object.prototype.toString.call(time) === '[object Array]'` // false

* But `time.eq(0)` is returning an object with these methods:
    
    - isBefore(dateToBeCompared)
    - isAfter(dateToBeCompared)
    - isBetween(dateToBeCompared1, dateToBeCompared2)
    - add(periodString)
    - set(periodString) 
    - time()
    - date()
    - index()

* And `time` lets you do things like these

`test('Oldest Method', function() { 
    
    var time = TIME('01/09/2011', '02/09/2011', '03/09/2011');
    
    equal(time.oldest().date().getDate(), 1);                 
    equal(time.oldest().index(), 0);   
    
});

test('Newest Method', function() { 
    
    var time = TIME('01/09/2011', '02/09/2011', '03/09/2011');
    
    equal(time.newest().date().getDate(), 3);                 
    equal(time.newest().index(), 2);   
    
});

test('Slice Method', function() { 
    
    var time = TIME('01/09/2011', '02/09/2011', '03/09/2011');
    
    ok(time.slice(0, 1).size() === 1);
    ok(time.slice(0, 2).size() === 2);
    ok(time.slice(0, 3).size() === 3);
    ok(time.slice(0, 4).size() === 3);
    
    ok(time.slice(1, 2).eq(0) === time.slice(1).t[0]); 
    
});

test('Closest Method', function() { 
    
    var time = TIME('01/09/2011', '05/09/2011', '10/09/2011');
    
    ok(time.closestTo('06/09/2011') === time.eq(1));
    ok(time.closestTo('11/09/2011') === time.eq(2));
    ok(time.closestTo('11/08/2011') === time.eq(0));
    
});

test('Each Method', function() { 
    
    var time = TIME('01/09/2011', '05/09/2011', '10/09/2011');
    
    time.each(function(index, date) {
        
        ok(date === time.eq(index));
        ok(this === time.eq(index));
        
    });
    
});

test('Set Method', function() { 
    
    var time = TIME('01/09/2011', '05/09/2011', '10/09/2011', '01/09/2011', '28/12/2010');
    
    time.eq(0).set('+1month');
    equal(time.eq(0).toString(), '01/10/2011');
    
    time.eq(1).set('2month -3days 1year');
    equal(time.eq(1).toString(), '02/11/2012');
    
    time.eq(3).set('4months -4days -1years');
    equal(time.eq(3).toString(), '28/12/2010');
    
    time.eq(3).set('+1day +2months');
    equal(time.eq(3).toString(), '01/03/2011');
    
    time.eq(4).set('+1day +2months');
    equal(time.eq(4).toString(), '01/03/2011');
    
    time.eq(4).set('-1millisecond');
    equal(time.eq(4).toString(), '28/02/2011');
    
    time.eq(4).set('+1millisecond');
    equal(time.eq(4).toString(), '01/03/2011');
    
});`