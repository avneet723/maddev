/**
 * Module dependencies.
 */
var
  express  = require('express'),
  app      = express(),
  routes   = require('./routes')(app), // Look in the "routes" directory
  lessMW   = require('less-middleware'),
  http     = require('http'),
  path     = require('path');

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(lessMW({ src: __dirname + '/assets/css' }));
  app.use("/assets", express.static(path.join(__dirname, 'assets')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app);

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
