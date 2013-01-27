module.exports = function(app) {

  app.get('/dining', function(req, res) {
    res.render('dining', {
      pageTitle: 'VT Dining'
    });
  });

};