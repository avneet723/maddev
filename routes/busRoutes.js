var http = require('http');

module.exports = function(app) {

  // Gets all the Current Bus Information
  //
  // See: http://www.bt4u.org/BT4U_Webservice.asmx?op=GetCurrentBusInfo
  app.get('/bus/GetCurrentBusInfo', function(request, response) {

    var options = {
        host: 'www.bt4u.org',
        path: '/BT4U_Webservice.asmx/GetCurrentBusInfo',
        method: 'POST'
    };

    http.request(options, function(busResponse) {
      console.log('STATUS: ' + busResponse.statusCode);
      console.log('HEADERS: ' + JSON.stringify(busResponse.headers));

      busResponse.setEncoding('utf8');

      busResponse.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        response.write(chunk);
      });

      busResponse.on('end', function() {
        response.end();
      });

    }).end();

  });

  //

};
