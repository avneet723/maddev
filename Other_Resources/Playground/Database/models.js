var mongoose = require('mongoose');

//Schemas
var user = mongoose.Schema({ 
	firstname: String, 
	lastname : String,	
	username : String,
	pid      : Number
});

var fooditem = mongoose.Schema({
	name       : String,
	servingsize: String,
	carbs      : Number,
	fats	   : Number,
	protein    : Number
});

//EXPORTS
mongoose.model('User', user, 'Trial');
mongoose.model('FoodItem', fooditem, 'Trial');
exports.mongoose = mongoose;

