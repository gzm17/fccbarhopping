var request = require("request");
var apiOptions = {
    server: "https://fccbarhopping.herokuapp.com/"
    //server: "http://localhost:3000" //when run in local host
};
if (process.env.NODE_ENV === "production")
    apiOptions.server = "https://fccbarhopping.herokuapp.com/";

global.cityInput; 
var tmp = 0;

var renderShopsView = function (req, res, data) {
    //console.log("Enter view-ctrl render:", body);
    res.render("../views/index", {bars: data.bars, barbito: data.barbito, city: data.city} );
}

var getDisplayInfo = function (req, res, city) {
    
    //get bars info
    var requestOptions, path = "/api/shops/search?city=" + city;
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {}
    };
    
    request(requestOptions, function(err, response, bars){
        if (err) console.log("err in view-ctrl api req: ", err);
        //console.log("bars api ok: ", bars);
        //renderShopsView(req, res, body);
        
            //get barbito info
            var requestOptions1, path1 = "/api/shops/barbito";
            requestOptions1 = {
                url: apiOptions.server + path1,
                method: 'GET',
                json: {}
            };

            request(requestOptions1, function(err, response, barbito){
                if (err) console.log("err in view-ctrl api req: ", err);
                console.log("barbito api ok: ", barbito);
                renderShopsView(req, res, {bars: bars, barbito: barbito, city: city});
            });
    });   
}

module.exports.index = function(req, res) { 
    var user = res.locals.currentUser;
    renderShopsView(req, res, {bars: [], barbito: []});
}

//after post get data from yelp-fusion
module.exports.getData = function(req, res) { 
    var user = res.locals.currentUser;
    var city = (typeof req.body.city != "undefined" ? req.body.city : req.params.city);
    tmp += 1;
    
    if (typeof city != "undefined") global.cityInput = city;
    console.log("view getData round=", tmp, " global.city=", global.cityInput, " city=", city);
    getDisplayInfo(req, res, global.cityInput);
}

//get barbito data 
module.exports.getBarbito = function(req, res) { 
    var user = res.locals.currentUser;
    var city = (typeof req.body.city != "undefined" ? req.body.city : req.params.city);
    
    if (typeof city != "undefined") global.cityInput = city;
    
    console.log("view getBarbito round=", tmp, " global.city=", global.cityInput, " city=", city);
    getDisplayInfo(req, res, global.cityInput);

}

// update changes
module.exports.updateBarbito = function(req, res, next) {
    var barId = req.query.bar;
    var go = req.query.go;
    var city = req.query.city;
    var user = req.user.username;
    console.log("view updateBarbito: ", barId, go, city, user);
    
    //get bars info
    var requestOptions, path = "/api/shops/go/search?go=" + go + "&city=" + city + "&bar=" + barId + "&user=" + user;
    requestOptions = {
        url: apiOptions.server + path,
        method: 'POST',
        json: {}
    };
    
    request(requestOptions, function(err, response, barbito){
        if (err) console.log("err in view-ctrl api req: ", err);
        console.log("view api barbito ok? city barbito", city, barbito);
        res.redirect("/city/"+city);
    });
}
        
