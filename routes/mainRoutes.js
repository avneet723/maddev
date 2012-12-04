
/*
 * Get the main application routes
 */

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('indexA');
  });

  app.get('/users', function(req, res) {
    res.send("respond with a resource");
  });

  app.get('/test', function(req, res) {
    res.render('test', {
      message: 'hello world'
    });
  });

  app.get('/maps', function(req, res){
    res.render('maps');
  });

};
