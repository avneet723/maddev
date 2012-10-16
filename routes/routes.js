
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'MADWEBDEV' });
};

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

/*
 * GET home page.
 */

exports.test = function(req, res) {
  res.render('test', { message: 'hello world' });
};