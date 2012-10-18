
/**
 * Module dependencies.
 */

var express = require('express')
  , app     = express()
  , routes  = require('./routes/routes.js')
  , http    = require('http')
  , path    = require('path')
  //, io      = require('socket.io').listen(app) 
  , db      = require('./Playground/Database/trialController.js')
  , std     = require('./modules/std.js')
  , User    = db.User;


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(express.favicon());
  //app.use(express.logger('dev'));
  app.use(express.bodyParser());
  //app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


console.log("Express server listening on port " + (process.env.port || 3000));


/*
 * RESTful API
 */

//routing
app.get('/', function(req, res){
  routes.index(req, res, (app.address().port));
});
app.get('/users', routes.list);
app.get('/test', routes.test);
app.post('/create/newuser', newUserRAPI);

//Implementation
function newUserRAPI(req, res){
  var user = req.body;
  console.log(user);
  db.save(new User(user), function(data){
    //figure out how to redirect this the right way so that
    //you can keep the data you get here
    res.render('index', { title: data.firstname});
  });
}

/*
 * Socket.IO Setup
 */
var server = app.listen(process.env.port || 3000)
  , io     = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
  socket.on('newUser', newUser);
  socket.on('getUser', getUser);
  socket.on('deleteUser', deleteUser);

  function deleteUser(queryObj) {
    db.remove(User, queryObj, function(message){
      socket.emit('log', message);
    });
  };

  function newUser(userObj) {
    console.log('Recieved new User.');
    console.log(JSON.stringify(userObj));
    var user = new User(userObj);
    db.save(user, function(){
      socket.emit('log', 'User Successfully Saved.')
    });
  };

  function getUser(queryObj) {
    db.find(User, queryObj, null, std.customPrint(function(data){
      socket.emit('foundUser', data)
    }));
  } 
});





