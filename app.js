/**
 * Module dependencies.
 */
var
  express  = require('express'),
  app      = express(),
  routes   = require('./routes')(app), // Look in the "routes" directory

  http     = require('http'),
  path     = require('path'),
  socketIO = require('socket.io'),
  db       = require('./Playground/Database/trialController.js'),
  std      = require('./modules/std.js'),
  User     = db.User;

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use("/public", express.static(path.join(__dirname, 'public')));
  app.use("/assets", express.static(path.join(__dirname, 'assets')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app);
var io = socketIO.listen(server);

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});



/*
 *       Socket.IO Setup
 * ----------------------------
 *     @TODO Move / Delete?
 * ----------------------------
 */

io.sockets.on('connection', function(socket) {
  socket.on('newUser', newUser);
  socket.on('getUser', getUser);
  socket.on('deleteUser', deleteUser);

  function deleteUser(queryObj) {
    db.remove(User, queryObj, function(message){
      socket.emit('log', message);
    });
  }

  function newUser(userObj) {
    console.log('Recieved new User.');
    console.log(JSON.stringify(userObj));
    var user = new User(userObj);
    db.save(user, function(){
      socket.emit('log', 'User Successfully Saved.');
    });
  }

  function getUser(queryObj) {
    db.find(User, queryObj, null, std.customPrint(function(data){
      socket.emit('foundUser', data);
    }));
  }
});
