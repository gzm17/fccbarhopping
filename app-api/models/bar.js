var mongoose = require("mongoose");
var User = require("../models/user");

//This defines the user schema for mongoose
var barSchema = mongoose.Schema({
    name: {type: String, required: false},
    review_count: {type: Number, required: false},
    rating: {type: Number, required: false},
    phone: {type: String, required: false},
    price: {type: String, required: false},
    location: {
        city: {type: String, requried: false},
        country: {type: String, required: false},
        state: {type: String},
        address1: {type: String},
        address2: {type: String},
        address3: {type: String}
    },
    url: {type: String, required: false},
    image_url: {type: String, required: false},
    downloadedAt: {type: Date, default: Date.now},
    coordinates: {
        latitude: {type: Number},
        longtitude: {type: Number}
    },
    "categories": [
        {
          alias: {type: String},
          title: {type: String}
        }
      ]
});

/*
//adding a method to userSchema to check user pwd
barSchema.methods.getPollSummary = function(){
    var summary = {
        name: this.name,
        category: this.question,
        votes: this.votes,
        status: this.status
    };
    return summary;
};
*/

//adding a method to get user name to the schema
barSchema.methods.getBar = function (){
    return this; 
};

var Bar = mongoose.model("Bar", barSchema);


module.exports = Bar;


