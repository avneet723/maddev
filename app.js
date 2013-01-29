/**
 * Module dependencies.
 */
var
  // ExpressJS modules
  express = require('express'),
  app = express(),
  http = require('http'),
  path = require('path'),
  // Swig Templates:
  // http://paularmstrong.github.com/swig/
  cons = require('consolidate'),
  swig = require('swig'),
  // Setup Dynamic routing, see:
  // http://stackoverflow.com/questions/6059246/
  routes = require('./routes')(app), // Look in the "routes" directory
  // LESS Middelware
  // https://github.com/emberfeather/less.js-middleware
  lessMiddleware = require('less-middleware');

/**
 * Configuration
 */
// Swig templates
swig.init({ root: __dirname + '/views', allowErrors: true });

// Express JS
app.configure(function() {
  app.set('port', process.env.PORT || 3000); // port to listen on
  app.set('views', __dirname + '/views');
  app.engine('.html', cons.swig); // use Swig templates
  app.set('view engine', 'html');

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  // LESS middleware
  // https://npmjs.org/package/less-middleware
  app.use(lessMiddleware({
    src: __dirname + '/public',
    compress: true
  }));

  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * Start The server(s)
 */
var server = http.createServer(app);

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
