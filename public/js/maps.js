//---
// The map page uses AngularJS due to the single page application
// nature of it. JQuery is a pain.
var app = angular.module('MapApp', []);

app.controller('MapController', function($scope, $http) {
  //---
  // Google Maps related
  var
    directionRenderer,
    map = new google.maps.Map(document.getElementById("map_canvas"), {
      center: new google.maps.LatLng(37.227774, -80.421919),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

  //---
  // Scope variables (Initial values)
  $scope.hasDirections = false; // do we have directions initially?
  // load in Building Information from an external data file:
  $scope.buildingInformation = []; // initially empty
  $http.get('/data/buildingInfo.json').success(function(data) {
    $scope.buildingInformation = data.buildings;
  });
  $scope.travelModes = ['walking', 'driving'];

  //---
  // Scope Functions
  // Clear the current direction renderer (if one was set)
  $scope.clearDirections = function() {
    if(typeof directionRenderer !== 'undefined') {
      directionRenderer.setMap(null);
    }
  };

  $scope.getDirections = function(startLocation, endLocation) {
    if(typeof startLocation === 'undefined' ||
       typeof endLocation === 'undefined') { return; }

    $scope.clearDirections();

    var directionsRequest  = {
      origin: new google.maps.LatLng(startLocation.lat, startLocation.long),
      destination: new google.maps.LatLng(endLocation.lat, endLocation.long),
      travelMode: "WALKING"
    };

    var dirServ = new google.maps.DirectionsService();
    dirServ.route(directionsRequest, function(result, status) {
      var renderOpts = {
        'directions': result,
        'map': map
      };
      directionRenderer = new google.maps.DirectionsRenderer(renderOpts);
    });

    $scope.hasDirections = true;
  };

});
