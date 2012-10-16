
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'MADWEBDEV', scripts: ['../public/Index.js'] });
};