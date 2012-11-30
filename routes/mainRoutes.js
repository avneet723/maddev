
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

  /*


  app.post('/create/newuser', newUserRAPI);

  //Implementation
  function newUserRAPI(req, res){
    var user = req.body;
    console.log(user);
    db.save(new User(user), function(data){
      //figure out how to redirect this the right way so that
      //you can keep the data you get here

      res.render('index', { title: data.firstname});
      // res.render('indexA.html');
    });
  }


  */


};
