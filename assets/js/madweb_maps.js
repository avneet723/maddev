function initialize() {

  var mapOptions = {
    center: new google.maps.LatLng(37.227774, -80.421919),
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  function mapBuses() {

    $.get('/bus/getcurrentbusinfo', function(xml) {

      var $xml = $(xml);
      var infos = $xml.find('RTFInfo');

      for(var i = 0, len = infos.length; i < len; ++i) {
        var lat   = $(infos[i]).find('Latitude').text();
        var longi = $(infos[i]).find('Longitude').text();

        var options = {
          center: new google.maps.LatLng(lat, longi),
          radius: 10,
          fillColor: "#00ff00"
        };

        var overlay = new google.maps.Circle(options);

        overlay.setMap(map);
      } // end for loop

    }); // end Ajax call
  } // end map Buses

  function getDirections() {
    var DirServ = new google.maps.DirectionsService();

    var DirReq  = {
      origin: new google.maps.LatLng(37.22978, -80.41997),
      destination: new google.maps.LatLng(37.2216, -80.424),
      travelMode: "WALKING"
    };

    DirServ.route(DirReq, function(result, status) {
      var renderOpts = {
        'directions': result,
        'map': map
      };
      var DirRend = new google.maps.DirectionsRenderer(renderOpts);
    });
  }

  document.getElementById("Make_Circle").onclick = getDirections;

}