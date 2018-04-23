var User = require("../models/user");
var Bar = require("../models/bar");
var Barbito = require("../models/barbito");
var fs = require('fs');
const yelp = require('yelp-fusion');
var apiKey = "AxR7GHwydNopgOG1RxrwAGoBD7cLTP72ll8rKw1mn2oEdl0T6nueop_etcZOiry9pwzwRQbGeLZ0SHmYoQT0K85m35T0pUB1eqS1mtzzfS7T0-rsFB8nGMmaR428WnYx"; //apiKey gotten from yelp-fusion account: gzm17 gzm.nyc mail
const client = yelp.client(apiKey);

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

//function call to get and return shops data via api call
//after post get data from yelp-fusion
module.exports.getData = function(req, res, next) { 
    var city = req.query.city;
    console.log("api-req.query.city: ", city);
    
    const searchRequest = {
        term:'bars bar',
        location: city
        //limit: 5
    };

    const client = yelp.client(apiKey);

    var result = client.search(searchRequest).then(response => {
      const firstResult = response.jsonBody.businesses;
      const prettyJson = JSON.stringify(firstResult, null, 4);
      fs.writeFile("datafile", prettyJson, function(err) {
        if(err) {
            return console.log(err);
            }
      }); 
    
    //save unsaved records using phone number as key
      for (let i = 0; i < firstResult.length; i++) {
          //let savedRecord = false;
          Bar.update({phone: firstResult[i].phone}, 
                     {
                      name: firstResult[i].name,
                      rating: firstResult[i].rating,
                      price: firstResult[i].price,
                      url: firstResult[i].url,
                      image_url: firstResult[i].image_url,
                      phone: firstResult[i].phone,
                      location: firstResult[i].location, 
                      review_count: firstResult[i].review_count,
                      categories: firstResult[i].categories,
                      coordinates: firstResult[i].coordinates
                    },
                     {upsert: true}, function(err, doc){
                        if (err) console.log(err);}
              );
          //if(i === firstResult.length-1) console.log("for loop complete");
          //if (i===0) console.log("full record: ", firstResult[0]);
      }
        
      //get data from db and send to render
      Bar.find({"location.city": city}).sort({rating: 'descending'}).exec(function(err, bars) {
          if (err) return next(err);
          //console.log("within find: city=", city, " Bars = ", bars);
          sendJSONresponse(res, 200, bars);
      });
        
      
    }).catch(e => {
      console.log(e);
    });
}

module.exports.updateBarbito = function(req, res, next) {
    var barId = req.query.bar;
    var go = req.query.go;
    var city = req.query.city;
    var user = req.query.user;
    console.log("api updateBarbito: ", barId, go, city, user);
    
    Barbito.findOne({bar: barId}, function(err, barbito){
        if(err) {
            return next(err);
        } else if (barbito) { // bar is found, update record
            //check if user is already in the go list
            let inList = false, index = 0;
            for (let i = 0; i < barbito.visit.goers.length; i++) 
                if (barbito.visit.goers[i] === user) {
                    inList = true; 
                    index = i;
                }
                
            if(go === "yes" && !inList) { //if the user is going and not in the list
                barbito.visit.count += 1;
                barbito.visit.goers.push(user);
                }
            
            if (go === "no" && inList) { //if not going and is in the list
                barbito.visit.count -= 1;
                barbito.visit.goers.splice(index, 1);
            }
            barbito.save();
            
        } else { // bar is not found, insert record
            if(go === "yes") {
            var newbarbito = new Barbito({
                bar: barId,
                visit: {
                    count: 1,
                    goers: [user]
                }
            });
            console.log("update record: ", barId);
            newbarbito.save();
            }
        }
    });
    
    next();
}

module.exports.getBarbito = function(req, res, next) {
    console.log("api getBarbito: ");
    Barbito.find().exec(function(err, barbito) {
        if (err) return next(err);
        sendJSONresponse(res, 200, barbito);
    });
    
    //next();
}