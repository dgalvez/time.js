(function() {
    
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
                isBeforeThan: function(compared) {
                    
                    return is.before(date, compared.date());
                    
                },
                isAfterThan: function(compared) {
                    
                    return compared.isBeforeThan(this);
                    
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
                    
                    
                    return this;
                    
                },
                date: function() {
                    
                    return u.clone(date); 
                    
                },
                index: function() {
                    
                    return i; 
                    
                }
            };
            
        },
        // TIME Constructor    
        TIME = function() {
            
            // t is our TIME object
            var t = (arguments.length === 0) ? [new Date()] : [];
            
            t = to.dateArray(u.slice.call(arguments));
            
            t.oldest = function() {
                    
                var oldest = this[0], current, i = this.length;

                while(i--) {
                    current = this[i];
                    if(current.isBeforeThan(oldest)) {
                        oldest = current; 
                    }
                }

                return oldest; 

            };
            
            t.newest = function() {
                    
                var newest = this[0], current, i = this.length;

                while(i--) {
                    current = this[i];
                    if(current.isAfterThan(newest)) {
                        newest = current; 
                    }
                }

                return newest; 

            };
            
            t.eq = function(index) {
                return this[index];
            };       
                
            return t;
             
        };
        
    // static Methods    
    
    TIME.date = function(obj) {
        
        return new Fecha(obj);
        
    };
    
    TIME.period = function(periodString) {
        
        return to.period(periodString);
        
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
        
    // Publishing TIME Constructor
    global.TIME = TIME;
    
})()