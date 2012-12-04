var
  http = require('http'),
  queryString = require('querystring');


function getBtOperation(operation, req, res, post_data) {

  post_data = queryString.stringify(post_data);

  var post_options = {
      host: 'www.bt4u.org',
      path: '/BT4U_Webservice.asmx/' + operation,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
     }
  };

  var post_req = http.request(post_options, function(busResponse) {

    busResponse.setEncoding('utf8');

    busResponse.on('data', function (chunk) {
      res.write(chunk);
    });

    busResponse.on('end', function() {
      res.end();
    });

  });

  post_req.write(post_data);
  post_req.end();
}

module.exports = function(app) {

  // Gets all the Current Bus Information
  //
  // See: http://www.bt4u.org/BT4U_Webservice.asmx?op=GetCurrentBusInfo
  app.get('/bus/GetCurrentBusInfo', function(request, response) {
    getBtOperation('GetCurrentBusInfo', request, response);
  });

  // Gets all the Current Routes
  //
  // See: http://www.bt4u.org/BT4U_Webservice.asmx/GetCurrentRoutes
  app.get('/bus/GetCurrentRoutes', function(request, response) {
    getBtOperation('GetCurrentRoutes', request, response);
  });

  // Gets all the Scheduled Stop Names for a specific route short name
  //
  // e.g. invoke like www.t.com/bus/GetScheduledStopNames?stopCode=1334
  //
  // See: http://www.bt4u.org/BT4U_Webservice.asmx?op=GetScheduledStopNames
  app.get('/bus/GetScheduledRoutes', function(request, response) {

    if (typeof request.query.routeShortName === 'undefined') {
      response.send('Please provide a route short name, e.g. ' +
        ' www.url.com/bus/GetScheduledRoutes?stopCode=1334');
      return;
    }

    var post_data = {
      stopCode: request.query.stopCode
    };

    getBtOperation('GetScheduledRoutes', request, response, post_data);
  });

  // Gets all the Scheduled Stop Names for a specific route short name
  //
  // e.g. invoke like www.t.com/bus/GetScheduledStopNames?routeShortName=HWD
  //
  // See: http://www.bt4u.org/BT4U_Webservice.asmx?op=GetScheduledStopNames
  app.get('/bus/GetScheduledStopNames', function(request, response) {

    if (typeof request.query.routeShortName === 'undefined') {
      response.send('Please provide a route short name, e.g. ' +
        ' www.url.com/bus/GetScheduledStopNames?routeShortName=HWD');
      return;
    }

    var post_data = {
      routeShortName: request.query.routeShortName
    };

    getBtOperation('GetScheduledStopNames', request, response, post_data);
  });

  // Gets all the Scheduled Stop Codes for a specific route short name
  //
  // e.g. invoke like www.t.com/bus/GetScheduledStopCodes?routeShortName=HWD
  //
  // See: http://www.bt4u.org/BT4U_Webservice.asmx?op=GetScheduledStopCodes
  app.get('/bus/GetScheduledStopCodes', function(request, response) {

    if (typeof request.query.routeShortName === 'undefined') {
      response.send('Please provide a route short name, e.g. ' +
        ' www.url.com/bus/GetScheduledStopCodes?routeShortName=HWD');
      return;
    }

    var post_data = {
      routeShortName: request.query.routeShortName
    };

    getBtOperation('GetScheduledStopCodes', request, response, post_data);
  });

  // Gets all the Scheduled Stop Codes for a specific route short name
  //
  // e.g. invoke like www.t.com/bus/GetNextDepartures?routeShortName=HWD&stopCode=1124
  //
  // See: http://www.bt4u.org/BT4U_Webservice.asmx?op=GetScheduledStopNames
  app.get('/bus/GetNextDepartures', function(request, response) {

    if (typeof request.query.routeShortName === 'undefined' ||
        typeof request.query.stopCode === 'undefined') {
      response.send('Please provide a route short name, e.g. ' +
        ' www.url.com/bus/GetNextDepartures' +
        '?routeShortName=HWD' +
        '&stopCode=1124');
      return;
    }

    var post_data = {
      routeShortName: request.query.routeShortName,
      stopCode: request.query.stopCode
    };

    getBtOperation('GetNextDepartures', request, response, post_data);
  });

};
