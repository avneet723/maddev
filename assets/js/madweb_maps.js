

$(document).ready(function () {

  //-----------------------------
  // page variables
  //
  var
  directionRenderer,
  startLocation,
  endLocation,
  markerArray = [],
  mapOptions = {
    center: new google.maps.LatLng(37.227774, -80.421919),
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  },
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  //-----------------------------
  // Make these calls on page load
  //
  getBuildingInfo();

  //-----------------------------
  // Listeners
  //
  $("#getDirections").click(function() {
    getDirections(startLocation, endLocation);
  });

  $('#startLocation').change(function() {
    var building = JSON.parse($('#startLocation').val());
    startLocation = {
      lat: building.lat,
      long: building.long
    };
  });

  $('#endLocation').change(function() {
    var building = JSON.parse($('#endLocation').val());
    endLocation = {
      lat: building.lat,
      long: building.long
    };
  });

  function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
  }

  // Gets all the building information on apge load
  function getBuildingInfo() {
    $.get('/assets/data/buildingInfo.json', function(data) {

      var buildingInfo = data.buildings;
      var selectOptions = '';
      for(var k = 0, len = buildingInfo.length; k < len; ++k) {
        var building = buildingInfo[k];
        selectOptions += '<option value=\'' + JSON.stringify(building) + '\'>' +
          building.name + '</option>';
      }

      $('#startLocation').html(selectOptions);
      $('#endLocation').html(selectOptions);
    }); // end Ajax call
  }

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

  function getDirections(startLocation, endLocation) {

    if(typeof startLocation === 'undefined' ||
       typeof endLocation === 'undefined') {
      return;
    }

    if(typeof directionRenderer !== 'undefined') {
      directionRenderer.setMap(null);
    }

    var DirServ = new google.maps.DirectionsService();

    var DirReq  = {
      origin: new google.maps.LatLng(startLocation.lat, startLocation.long),
      destination: new google.maps.LatLng(endLocation.lat, endLocation.long),
      travelMode: "WALKING"
    };

    DirServ.route(DirReq, function(result, status) {
      var renderOpts = {
        'directions': result,
        'map': map
      };
      directionRenderer = new google.maps.DirectionsRenderer(renderOpts);
    });
  }

});