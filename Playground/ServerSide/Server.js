var http         = require('http'),
	fs           = require('fs'),
	server       = http.createServer(reqHandler).listen(8000),
	url          = require('url'),
	io           = require('socket.io').listen(server),
	services;

function reqHandler(req, res) {
    var request = url.parse(req.url, true),
        action  = request.pathname,
        output  = processAction(action);
    if (output) {
    	res.writeHead(200, 
    		{
    	    'Content-Type'                : output.mimeType,
    		'Access-Control-Allow-Origin' : '*',
    		'Access-Control-Allow-Methods': 'POST' 
    		}
    	);
    	res.end(output.data);
    }
    else{
    	res.writeHead(500);
    	res.end('Something went wrong...');
    }    
}

function processAction(action){
	console.log('Processing action...')
	for (var i = 0; i < services.length; i++) {	
		var tester = new RegExp('.*' + services[i].identifier);
		if (action.match(tester)) {
	        var data = services[i].service(),
	        type     = services[i].mimeType;
	        return {'data': data, 'mimeType': type};
	    }
	}
	return false;
}

services = [
	{'identifier': '/'                              ,'service': index    ,'mimeType': 'text/html'       }
];

function wordladder() {
	var output = fs.readFileSync(__dirname + '/../index.html');
	return output;
}
