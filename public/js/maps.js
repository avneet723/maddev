//---
// The map page uses AngularJS due to the single page application
// nature of it. JQuery is a pain.
var app = angular.module('MapApp', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

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
  $scope.showSideBar = false;
  // load in Building Information from an external data file:
  $scope.buildingInformation = []; // initially empty
  $http.get('/data/buildingInfo.txt').success(function(data) {
    $scope.buildingInformation = data.buildings;
  });

  // What route are we currently viewing?
  $scope.currentRoute = {
    distance: '',
    time: '',
    startAddr: '',
    endAddr: '',
    steps: []
  };

  //---
  // Scope Functions
  // Clear the current direction renderer (if one was set)
  $scope.clearDirections = function() {
    if(typeof directionRenderer !== 'undefined') {
      directionRenderer.setMap(null);
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), {
      center: new google.maps.LatLng(37.227774, -80.421919),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    $scope.hasDirections = false;
    $scope.showSideBar = false;
  };

  $scope.getDirections = function(startLocation, endLocation) {
    if(typeof startLocation === 'undefined' ||
       typeof endLocation === 'undefined') { return; }

    $scope.clearDirections();
    $scope.bottomMenuOpen = false;

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

      var legs = result.routes[0].legs[0];

      $scope.currentRoute = {
        distance: legs.distance.text,
        time: legs.duration.text,
        startAddr: legs.start_address,
        endAddr: legs.end_address,

        steps: (function() {
          var ret = [];
          for(var i = 0, len = legs.steps.length; i < len; ++i) {
            ret.push(legs.steps[i].instructions);
          }
          return ret;
        }())

      }; //

      console.log($scope.currentRoute);

      directionRenderer = new google.maps.DirectionsRenderer(renderOpts);
      directionRenderer.setMap(map);
      directionRenderer.setDirections(result);
    });

    $scope.hasDirections = true;
  };

  $scope.toggleWalkingDirections = function() {
    $scope.bottomMenuOpen = !$scope.bottomMenuOpen;
    if($scope.showSideBar) $scope.showSideBar = false;
  };

  $scope.toggleTurnByTurn = function() {
    $scope.showSideBar = !$scope.showSideBar;
    if($scope.bottomMenuOpen) $scope.bottomMenuOpen = false;
  };

});
