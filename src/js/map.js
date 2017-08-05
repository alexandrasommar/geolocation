'use strict';

// Create Google Map and return the google map init function
// in order to not pollute the global namespace
var googleMap = (function() {

  // Create neccessary variables to be used throughout the map
  var map,
      infoWindow,
      currentPos,
      lat = 59.346027,
      lng = 18.058272,
      service,
      directionsService,
      directionsDisplay,
      legend,
      div,
      container = document.getElementById('main-container'),
      rightPanel = document.getElementById('right-panel');

  //Initiate a new google map with custom styling
  function initMap() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer ({
      suppressMarkers: true,
      preserveViewport: true
    });

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: lat, lng: lng},
      gestureHandling: 'cooperative',
      scrollwheel: false,
      mapTypeControl: false,
      zoom: 12,
      styles: [
              {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
              {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
              },
              {
                 featureType: 'poi',
                 stylers: [{ visibility: 'off'}]
               },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#38414e'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{color: '#212a37'}]
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{color: '#9ca5b3'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#746855'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#1f2835'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{color: '#f3d19c'}]
              },
              {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{color: '#2f3948'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#17263c'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#515c6d'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#17263c'}]
              }
            ]
          });
          directionsDisplay.setMap(map);
          directionsDisplay.setPanel(rightPanel);
          infoWindow = new google.maps.InfoWindow();

    // If the browser supports geolocation and the user accepts it,
    // display markers and zombie zones based on current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

      // Create marker based on current position
      var marker = new google.maps.Marker({
          map: map,
          position: pos,
          animation: google.maps.Animation.DROP,
          icon: 'icons/cross.svg',

      });

      infoWindow.setPosition(pos);
      infoWindow.setContent('Starting point');
      infoWindow.open(map);
      map.setCenter(pos);
      currentPos = pos;

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setPosition(pos);
        infoWindow.setContent('Starting point');
        infoWindow.open(map);
      });

      var request = {
          location: map.getCenter(),
          rankBy: google.maps.places.RankBy.DISTANCE,
          types: ['cemetery', 'funeral_home']
        };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, showAllPlaces);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
    // Display legend with icon explanation
    legend = document.getElementById('legend');
    div = document.createElement('div');
    div.innerHTML = '<img src="icons/cross.svg"> Starting point';
    div.innerHTML += '<img src="icons/hand.svg"> Zombie zone';
    legend.appendChild(div);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(legend);
  } // End of initmap function

  // If the browser/device doesn't support geolocation
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed. Make sure you have enabled geolocation/location services on your device.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  // Run the calculateAndDisplayRoute function when user clicks on Lead me here
  function onChangeHandler() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };

  /**
  * Calculate route from current location to zombie zone
  * @param directionsService
  * @param directionsDisplay
  * @return Set diredctions and open the right panel
  */

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: currentPos,
      destination: document.getElementById('find').value,
      travelMode: 'WALKING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        container.className = 'minimize';
        rightPanel.className = 'visible';
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  rightPanel.addEventListener('click', function() {
    rightPanel.className = 'right-panel';
    container.className = '';
  });

  /**
  * Display places nearby based on current location
  * @param results
  * @param status
  * @return add marker with the results
  */

  function showAllPlaces(results, status) {
    if(status !== google.maps.places.PlacesServiceStatus.OK) {
      console.error(status);
      return;
    } else {
      for (var i = 0; i < results.length; i++) {
        addMarker(results[i]);
      }
    }
  }

  /**
  * Add markers
  * @param place
  * @param status
  * @return add marker with the results
  */

  function addMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: 'icons/hand.svg'
    });

    google.maps.event.addListener(marker, 'click', function() {
      var txt = '<h3>' + place.name + '</h3>';
      txt += '<p>' + place.vicinity + '</p>';
      txt += '<button id="find" value="' + place.vicinity + '">Lead me here</button>';
      infoWindow.setContent(txt);
      infoWindow.open(map, this);
      document.getElementById('find').addEventListener('click', onChangeHandler);
    });
  }

  // If everything is successful, run the initMap function
  return {
    init: function() {
      return initMap();
    }
  };
})();
