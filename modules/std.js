//EXPORTS
exports.customPrint = customPrint;

//DEFINITIONS
function stdPrintBase(err, data, func) {
  if(err){
    console.log(err);
  }
  else{
    console.log(data);
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

