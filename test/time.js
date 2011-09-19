
module('Core Module Tests');

test('Core API', function() {

       
       function checkObj(obj, compared) {
           var attr;
           for(attr in compared) if(compared.hasOwnProperty(attr)) { 
               equal(compared[attr], obj[attr]);  
           }
       }
       
       var today = new Date(),
           yesterday = new Date(),
           foo = {"years":"+1","months":"+2","days":"-3","hours":"+4","minutes":"+6","seconds":"+20","milliseconds":"+3"}, 
           bar = {"years":"+2","minutes":"+6"},
           time;
       
       yesterday.setDate(10);       
            
       time = TIME(today, yesterday);    
       
       ok('TIME' in window); 
       ok('oldest' in time); 
       
       equal(time.oldest().date().getDate(), 10);                 
       equal(time.oldest().index(), 1);                 
       equal(time.newest().index(), 0);      
       ok(time.eq(0) === time[0]);       
       ok(time.eq(1) === time[1]);       
       ok(time.newest() === time.eq(0));  
       
       checkObj(TIME.period('+1year +2months -3days +4hours 6minutes +20seconds +3milliseconds'), foo);  
       checkObj(TIME.period(' +1year +2months -3days    +4hours  +6minutes +20seconds +3milliseconds '), foo);    
       checkObj(TIME.period('+2years +6minutes'), bar);      
       checkObj(TIME.period(' +6minutes 2years '), bar);      
       
       
       console.log(time.eq(0).date());
       time.eq(0).add('+1month');
       console.log(time.eq(0).date());
       time.eq(0).add('+1month');
       console.log(time.eq(0).date());
       time.eq(0).add('+6month');
       console.log(time.eq(0).date());
       time.eq(0).add('-8month');
       console.log(time.eq(0).date());
       
          
}); 