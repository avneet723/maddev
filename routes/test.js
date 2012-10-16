
/*
 * GET home page.
 */

exports.test = function(req, res) {
  res.render('test', { message: 'hello world' });
};