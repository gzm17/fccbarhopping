var mongoose = require("mongoose");
var User = require("../models/user");
var Bar = require("../models/bar");

//This defines the user schema for mongoose
var barbitoSchema = mongoose.Schema({
    bar: {type: mongoose.Schema.Types.ObjectId, ref: 'Bar'},
    visit: {
        count: {type: Number, default: 0},
        goDate: {type: Number, default: 1},
        goMonth: {type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], default: "Fri"},
        goYear: {type: Number},
        goers: []
    }
});

//adding a method to get user name to the schema
barbitoSchema.methods.getBarbito = function (){
    return this; 
};

var Barbito = mongoose.model("Barbito", barbitoSchema);

module.exports = Barbito;


