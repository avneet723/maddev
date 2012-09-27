var db       = require('./models.js').mongoose.createConnection('localhost', 'MADWEBDEV'),
	User     = db.model('User'),
	FoodItem = db.model('FoodItem');

var Charlie = new User(
	{
		firstname: 'Sloane',
	  	lastname: 'Neidig',
	  	pid     : '00000000',
	  	username: 'the only girl in cs'	
	});

Charlie.save();

db.close();

