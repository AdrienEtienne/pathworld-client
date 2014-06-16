//Google API
var GOOGLE = {
    map : {},
    mapSetted : false,
    myPosition : {},
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

    },
    // Calcule itineraire
    calculeRoute : function(destination, event){
      var origin = new google.maps.LatLng(GOOGLE.myPosition.lat, GOOGLE.myPosition.lng);
      var destination = new google.maps.LatLng(destination.lat, destination.lng);
      var  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
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
                    '<div id="bodyContent">'+
                    '<p>' + myRoute.end_address +'</p>'+
                    '<p>' + myRoute.duration.text + ' - ' + myRoute.distance.text +'</p>'+
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
