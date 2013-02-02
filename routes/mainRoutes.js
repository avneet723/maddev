
/*
 * Get the main application routes
 */

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('index.html', {
      pageTitle: 'Home!'
    });
  });

  app.get('/bus', function(req, res) {
    res.render('bus', {
      pageTitle: 'Bus Routes'
    });
  });

  app.get('/dining', function(req, res) {
    res.render('dining', {
      pageTitle: 'VT Dining'
    });
  });
};
