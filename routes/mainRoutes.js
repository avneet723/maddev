
/*
 * Get the main application routes
 */

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('index', {
      pageTitle: 'Home!'
    });
  });

  app.get('/maps', function(req, res){
    res.render('maps', {
      pageTitle: 'VT Maps!'
    });
  });

>>>>>>>>>>>>>>>>>>>> File 1
>>>>>>>>>>>>>>>>>>>> File 2
  app.get('/bus', function(req, res) {
    res.render('bus', {
      pageTitle: 'Bus Routes'
    });
  });

<<<<<<<<<<<<<<<<<<<<
};
