
/*
 * Setup Dynamic routing, see:
 * http://stackoverflow.com/questions/6059246/
 */
var fs = require('fs');

// Basically loops through all the files in the "routes" directory,
// and includes them
module.exports = function(app) {
  fs.readdirSync(__dirname).forEach(function(file) {

    // console.log('file: ' + file);

    if (file === "index.js" ||
        file.substr(file.lastIndexOf('.') + 1) !== 'js')
    {
      // console.log('invalid file!\n');
      return;
    }

    var name = file.substr(0, file.indexOf('.'));
    // console.log('name: ' + name);
    require('./' + name)(app);
  });
};