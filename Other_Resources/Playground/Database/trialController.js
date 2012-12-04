var mongoose   = require('./models.js').mongoose,
	User       = mongoose.model('User'),
	FoodItem   = mongoose.model('FoodItem'),
	connection = mongoose.connect('mongodb://Admin:MADAdmin@ds035787.mongolab.com:35787/madwebmongo'),
	std        = require('../../modules/std.js'),
	models     = [User, FoodItem];

//EXPORTS
exports.save     = save;
exports.remove   = remove;
exports.find     = find;
exports.User     = User;
exports.FoodItem = FoodItem;

//DEFINITIONS
function remove(model, queryObj, callback) {
	/*if(!isModel(model)){
		console.error('Only known models can be removed.');
		return;
	}*/
	model.remove(queryObj, std.customPrint(function(data){
		if(data == 0){
			callback('Could not find document');
			console.log('Could not find document');
		}
		else{
			console.log('Document Successfully Deleted');
			callback('Document Successfully Deleted');
		}
	}));
};

function save(model, callback) {
	if(!isModel(model)){
		console.error('Only known models can be saved.');
		return;
	}
	model.save(std.customPrint(function(data){
		console.log('Document Successfully Saved.');
		callback(data);
	}));
};

function find(model, queryObj, fieldsArr, callback) {
	/*if(!isModel(model)){
		//model in this case will never be an INSTANCE OF
		console.error('Only known models can be searched for.');
		return;
	}*/
	var fields = null;
	if(fieldsArr){
		fields = '';
		for(field in fieldsArr){
			fields += (' ' + fieldsArr[field]);
		}
	}
	model.find(queryObj, fields, null, callback);
};

//HELPERS

function isModel(obj){
	for(model in models){
		if(obj instanceof models[model]){
			return true;
		}
	}
	return false;
}









