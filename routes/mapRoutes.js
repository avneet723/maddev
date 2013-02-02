module.exports = function(app) {

  app.get('/maps', function(req, res){
    res.render('maps', {
      pageTitle: 'VT Maps!'
    });
  });

};
