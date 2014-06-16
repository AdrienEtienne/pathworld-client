//Google API
var GOOGLE = {
    map : {},
    mapSetted : false,
    myPosition : {},
    markers : [],
    directionsDisplay : "", 
    // Les configurations statiques pour Google Maps
    setConfig : function(){
        google.maps.visualRefresh = true;
    },
    fitbound : function(destination){
      var bounds = GOOGLE.map.getBounds();
      bounds.extend(new google.maps.LatLng(destination.lat,destination.lng,false));
      GOOGLE.map.fitBounds(bounds);
      var zoom = GOOGLE.map.getZoom() -1;
      GOOGLE.map.setZoom(zoom);
    },
    setMapDivSize : function(){
      var width = $(window).width(),
          height = $(window).height();
      $('#map-canvas').css('width', width);
      $('#map-canvas').css('height', height);
    },
    // Injecte latitude et longitude dans la fonction de callback. Prend l'adresse en texte en entrée
    getLatAndLongFromAddress : function(address, callback, title, color, icon){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                callback(latitude, longitude, title, color, icon);
            }
        });
    },
    // Fonction d'initialisation de la Map, centre sur le lat/lng
    initialize : function(lat, lng) {
      GOOGLE.setMapDivSize();
      var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(lat, lng)
    };
        GOOGLE.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        GOOGLE.mapSetted = true;
        var homeControlDiv = document.createElement('div');
        var caillouControDiv = document.createElement('div');
        var showPosition = document.createElement('div');
        var homeControl = new HomeControl(homeControlDiv, GOOGLE.map);
        var caillouControl = new CaillouControl(caillouControDiv, GOOGLE.map);
        var showPositionControl = new ShowPositionControl(showPosition, GOOGLE.map);
        homeControlDiv.index = 1;
        caillouControDiv.index = 1;
        showPosition.index = 1;
        GOOGLE.map.controls[google.maps.ControlPosition.TOP_CENTER].push(caillouControDiv);
        GOOGLE.map.controls[google.maps.ControlPosition.TOP_LEFT].push(homeControlDiv);
        GOOGLE.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(showPosition);
    },

    setMyPosition : function(lat,lng){
        GOOGLE.mapSetted = true;
    },
    // Ajoute un marker en fonction de lat/lng color.
    addMarker : function(lat, lng, title, color, icon, windowInfo){
        var myLatlng = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: GOOGLE.map,
            animation: google.maps.Animation.DROP,
            title: title,
            cursor: 'pointer',
            icon : 'img/'+ color + '/' + icon + '.png'
        });
        var infowindow = new google.maps.InfoWindow({
          content: windowInfo
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(GOOGLE.map,marker);
        });
        GOOGLE.markers.push(marker);

    },
    setAllMap : function(map) {
      for (var i = 0; i < GOOGLE.markers.length; i++) {
        GOOGLE.markers[i].setMap(map);
      }
    },
    clearRoute : function(map) {
        directionsDisplay.setMap(map);
    },
    // Calcule itineraire
    calculeRoute : function(destination, event){
      var origin = new google.maps.LatLng(GOOGLE.myPosition.lat, GOOGLE.myPosition.lng);
    // var origin = new google.maps.LatLng(48.948474, 2.352029);
      var destination = new google.maps.LatLng(destination.lat, destination.lng);
      directionsDisplay = new google.maps.DirectionsRenderer({preserveViewport : true, suppressMarkers: true});
      var directionsService = new google.maps.DirectionsService();
      directionsDisplay.setMap(GOOGLE.map);
      var request = {
          origin : origin,
          destination : destination,
          travelMode  : google.maps.TravelMode.WALKING
       };
      directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
             directionsDisplay.setDirections(result);
              var myRoute = result.routes[0].legs[0];
              var contentString = '<div id="content">'+
                    '<p>'+ event.title +'</p>'+
                    '<p>'+ "Prévu le : " + event.date +'</p>'+
                    '<div id="bodyContent">'+
                    '<p>' + myRoute.end_address +'</p>'+
                    '<p>' + "Info trajet : " + myRoute.duration.text + ' - ' + myRoute.distance.text +'</p>'+
                    '</div>'+
                    '</div>';
              GOOGLE.addMarker(myRoute.start_location.k,myRoute.start_location.A,"you","blue",'loc-mini');
              GOOGLE.addMarker(myRoute.end_location.k,myRoute.end_location.A,event.title,"red",'star', contentString);
          }
       });
    },
    // Centre la Map sur la position donée
    centerOnPosition : function(lat, lng){
        var pos = new google.maps.LatLng(lat, lng);
        GOOGLE.map.setCenter(pos);
    },

    //Creation boutton application


    // Géolocalise l'utilisateur, params : success, error
    geolocalisation : function(callback, error, title, color, icon){
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                GOOGLE.myPosition = {lat: position.coords.latitude, lng : position.coords.longitude};
                callback(position.coords.latitude, position.coords.longitude, title, color, icon);
            }, function (e){
                error(e);                                   
            });
        } else {
            error();
        }
    }
}
    function HomeControl(controlDiv, map){

        // Set CSS styles for the DIV containing the control
        // Setting padding to 5 px will offset the control
        // from the edge of the map.
        controlDiv.style.padding = '5px';

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderStyle = 'solid';
        controlUI.style.borderWidth = '2px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to set the map to Home';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '4px';
        controlText.style.paddingRight = '4px';
        controlText.innerHTML = '<strong>< Back </strong>';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: 
        google.maps.event.addDomListener(controlUI, 'click', function() {
            GOOGLE.setAllMap(null);
            GOOGLE.clearRoute(null);
         HISTORY.navigate('todayevents');
        });
}
 function ShowPositionControl(controlDiv, map){

        // Set CSS styles for the DIV containing the control
        // Setting padding to 5 px will offset the control
        // from the edge of the map.
        controlDiv.style.padding = '5px';

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderStyle = 'solid';
        controlUI.style.borderWidth = '2px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Show my position for this event';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '4px';
        controlText.style.paddingRight = '4px';
        controlText.innerHTML = '<input type=\"checkbox\" name=\"show\" value=\"Show\">Show me';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: 
        google.maps.event.addDomListener(controlUI, 'click', function() {
            
        });
}

function CaillouControl(controlDiv, map){

        // Set CSS styles for the DIV containing the control
        // Setting padding to 5 px will offset the control
        // from the edge of the map.
        controlDiv.style.padding = '5px';

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderStyle = 'solid';
        controlUI.style.borderWidth = '2px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Déposer caillou';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '4px';
        controlText.style.paddingRight = '4px';
        controlText.innerHTML = '<strong> + </strong>';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: 
        google.maps.event.addDomListener(controlUI, 'click', function() {
          GOOGLE.setAllMap(null);
          GOOGLE.clearRoute(null);
          HISTORY.navigate('createtips');
        });
}
