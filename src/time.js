(function() {
    
    if (typeof Array.prototype.indexOf === 'undefined') {
        
        // From MDN
        
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            "use strict";
            if (this === void 0 || this === null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (n !== n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
        
    }   
    
    if (typeof Array.prototype.includes === 'undefined') { 
        
        Array.prototype.includes = function(searched) {
            
            return this.indexOf(searched) !== -1;
            
        };
        
    }
    
    // Getting the Global Object 
    var global = this,
        cache = {
            periods: {},
            getPeriod: function(periodString) {
                if(periodString in this.periods) {
                    return this.periods[periodString];
                }
                return this.periods[periodString] = to.period(periodString);
            }
        },
        // Library Constants
        C = {
            PERIOD: ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond']
        },
        // TimeException constructor
        TimeException = function(message) {
            
            this.message = message;
            this.name = 'TimeException';
            
        },  
        // Utils
        u = {
            toString: Object.prototype.toString,
            slice: Array.prototype.slice,
            pad: function(n) {
                return n < 10 ? '0' + n : n;
            },
            clone: function(date) {
                
                return new Date(date);
                
            },
            shout: function(message) {
                
                throw new TimeException(message);
                
            }
        },
        // Searching Types
        guess = {},
        // Types
        is = {},
        // Casting
        to = {},
        from = {},        
        // Single Date Constructor
        Fecha = function(obj, index) { 
            
            var date = (is.date(obj)) ? obj : guess.date(obj),
                i = index || 0;

            return {
                isBefore: function(compared) {
                    
                    return is.before(date, compared.date());
                    
                },
                isAfter: function(compared) {
                    
                    return compared.isBefore(this);
                    
                },
                isBetween: function(from, to) {
                    
                    return this.isAfter(from) && this.isBefore(to);
                    
                },
                add: function(periodString) {
                    
                    var period = cache.getPeriod(periodString), 
                        totalMilliseconds = date.getTime(),
                        attr; 
                        
                    for(attr in period) if(period.hasOwnProperty(attr) && period[attr] != 0) {
                        totalMilliseconds += from[attr].toMilliseconds(period[attr]);
                    }   
                    
                    date = new Date(totalMilliseconds);
                    
                    return this;
                    
                },
                set: function(periodString) {
                    
                    var period = cache.getPeriod(periodString), 
                        totalMilliseconds = date.getTime(),
                        attr, value, exceptions = ['months', 'years'], month, monthSum, yearVariation = 0; 
                        
                    for(attr in period) if(period.hasOwnProperty(attr)) {
                        
                        value = period[attr];
                        
                        if(value != 0 && !exceptions.includes(attr)) {
                            totalMilliseconds += from[attr].toMilliseconds(period[attr]);
                        }
                        
                    }   
                    
                    date = new Date(totalMilliseconds);
                    
                    if(period.month != 0) {
                        
                        monthSum = date.getMonth() + period.months;
                        month = monthSum % 12;
                        month = (month < 0) ? 12 + month : month;
                        
                        if(monthSum > 11) {
                            yearVariation = 1;
                        } else if(monthSum < 0) {
                            yearVariation = -1;
                        }
                        
                        date.setMonth(month);
                        
                    }
                    
                    date.setFullYear(date.getFullYear() + yearVariation + period.years);
                    
                    return this;
                    
                },
                time: function() {
                    
                    return date.getTime();
                    
                },
                date: function() {
                    
                    return u.clone(date); 
                    
                },
                index: function() {
                    
                    return i; 
                    
                },
                toString: function(separator) {
                    
                    return [u.pad(date.getDate()), u.pad(date.getMonth() + 1), date.getFullYear()].join(separator || '/');         
                    
                }
            };
            
        },
        T = function(fechasArray) {
            
            this.t = fechasArray;
            
        },
        // TIME Constructor    
        TIME = function() {
            
            return new T( to.dateArray( is.array(arguments[0]) ? arguments[0] : u.slice.call(arguments) ) );
             
        };
        
    // T prototype    
        
    T.prototype.oldest = function() {
                    
        var oldest = this.t[0], current, i = this.t.length;

        while(i--) {
            current = this.t[i];
            if(current.isBefore(oldest)) {
                oldest = current; 
            }
        }

        return oldest; 

    };

    T.prototype.newest = function() {

        var newest = this.t[0], current, i = this.t.length;

        while(i--) {
            current = this.t[i];
            if(current.isAfter(newest)) {
                newest = current; 
            }
        }

        return newest; 

    };
    
    T.prototype.closestTo = function(date) {
        
        var reference = guess.date(date),
            closest = this.t[0], 
            closestDiff = Infinity, 
            diff, 
            current, 
            i = this.t.length;

        while(i--) {
            
            current = this.t[i];
            diff = Math.abs(current.time() - reference.getTime());
                      
            if(diff < closestDiff) {
                closest = current;
                closestDiff = diff;
            }
            
        }

        return closest; 

    };

    T.prototype.eq = function(index) {

        return this.t[index];

    };
    
    T.prototype.size = function() {

        return this.t.length;

    };

    T.prototype.slice = function(fromIndex, endIndex) {

        return new T( this.t.slice(fromIndex, ( endIndex || (fromIndex + 1) ) ) );

    };   
    
    T.prototype.each = function(callback) {

        var i = this.t.length;

        while(i--) {
            
            callback.call(this.t[i], i, this.t[i]);
            
        }

    };          
        
    // guess Module    
        
    guess.date = function(obj) {
        
        var matches = /(\d\d)\/(\d\d)\/(\d\d\d\d)(?:\s(\d\d)\:(\d\d))?/.exec(obj), year, month, day, hours, minutes;
        
        if(!!matches) {
            
            year = parseInt(matches[3], 10);
            month = parseInt(matches[2], 10) - 1;
            day = parseInt(matches[1], 10);
            hours = (matches[4]) ? parseInt(matches[4], 10) : 0;
            minutes = (matches[5]) ? parseInt(matches[5], 10) : 0;
            
            return new Date(year, month, day, hours, minutes, 0, 0);
            
        }
        
        u.shout('Bad Date Format');
        
    };  
    
    // is Module    
        
    is.date = function(obj) {
        
        return u.toString.call(obj) === '[object Date]';
        
    };
    
    is.array = function(obj) {
        
        return u.toString.call(obj) === '[object Array]';
        
    };
    
    is.number = function(obj) {
        
        return u.toString.call(obj) === '[object Number]';
        
    };  
    
    is.before = function(date, compared) {
        
        return date.getTime() < compared.getTime();
    
    };
    
    // to Module
    
    to.date = function(obj, index) {
        
        return Fecha(obj, index);
        
    };        
    
    to.dateArray = function(array) {
        
        var i = array.length, dates = [];

        while(i--) {
            dates[i] = to.date(array[i], i);
        }
        
        return dates;
        
    };
    
    to.period = function(periodString) {
        
        var period = {}, constants = C.PERIOD, matches, exp, i = constants.length, attr;
        
        while(i--) {
            attr = constants[i];
            exp = new RegExp('([+-]?\\d+)' + attr, 'i');
            matches = exp.exec(periodString);
            period[attr + 's'] = (matches) ? +matches[1] : 0;
        }
        
        return period;
        
    };
    
    // from Module
    
    from.years = {
        toMilliseconds: function(number) {
            return number * 365 * 24 * 60 * 60 * 1000;
        }
    };
    
    from.months = {
        toMilliseconds: function(number) {
            return number * 30 * 24 * 60 * 60 * 1000;
        }
    };
    
    from.days = {
        toMilliseconds: function(number) {
            return number * 24 * 60 * 60 * 1000;
        }
    };
    
    from.hours = {
        toMilliseconds: function(number) {
            return number * 60 * 60 * 1000;
        }
    };
    
    from.minutes = {
        toMilliseconds: function(number) {
            return number * 60 * 1000;
        }
    };
    
    from.seconds = {
        toMilliseconds: function(number) {
            return number * 1000;
        }
    };
    
    from.milliseconds = {
        toMilliseconds: function(number) {
            return number;
        }
    };
    
    // Exceptions module
    
    TimeException.prototype.toString = function (){
        return this.name + ': "' + this.message + '"';
    };
    
    // static Methods    
    
    TIME.date = function(obj) {
        
        return new Fecha(obj);
        
    };
    
    TIME.period = function(periodString) {
        
        return to.period(periodString);
        
    };
    
    TIME.guess = guess.date;
        
    // Publishing TIME Constructor
    global.TIME = TIME;
    
})()