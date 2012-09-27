var mongoose = require('mongoose');

//Schemas
var user = mongoose.Schema({ 
	firstname: String, 
	lastname : String,	
	username : String,
	pid      : Number
});

var fooditem = mongoose.Schema({
	servingsize: String,
	carbs      : Number,
	fats	   : Number,
	protein    : Number
});

//EXPORTS
mongoose.model('User', user);
mongoose.model('FoodItem', fooditem);
exports.mongoose = mongoose;

