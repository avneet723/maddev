//IMPORTS
var color = require('colors');

//EXPORTS
exports.customPrint = customPrint;

//DEFINITIONS
function stdPrintBase(err, data, func) {
  if(err){
    console.log(makeString(err).red);
  }
  else{
    console.log(makeString(data).cyan);
    if(func){
      func(data);
    }
  } 
}

function customPrint(func) {
  return function(err, data){
    stdPrintBase(err, data, func);
  }
}

function makeString(something){
  var type = typeof something;
  switch(type){
    case 'object':
      return JSON.stringify(something);
    default:
      return (something + '');
  }
}

