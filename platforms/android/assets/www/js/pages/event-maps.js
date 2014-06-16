EVENTMAPS = {
  timeout : {},
  count : 0,
  destination : {},
  event : {},
  partners : [],


  createMarkerContent : function(title, content){
    var contentString = '<div id="content">'+
    '<h3>'+ title +'</h3>'+
    '<div id="bodyContent">'+
    '<p>' + content +'</p>'
    '</div>'+
    '</div>';
    return contentString;
  },
  markDestination : function(destination, event){
    var content = this.createMarkerContent(event.title, event.date);
    GOOGLE.addMarker(destination.lat, destination.lng, event.title, 'red', 'star', content);
  },

  calculItineraire : function(destination,event){
    GOOGLE.calculeRoute(destination, event);
  },
  markPartners : function(partners){
    for(var i in partners)
      var content = this.createMarkerContent(partners[i].nom, partners[i].date);
      GOOGLE.addMarker(partners[i].lat, partners[i].lng, partners[i].nom, 'blue', 'void', content);
  },

  centerOnPositionAndZoom : function(destination){
    GOOGLE.fitbound(destination);
  },
  isMapInitialize : function(destination, event, partners){
    if(GOOGLE.mapSetted){
      clearTimeout(timeout);
      // on mark la destination
     // EVENTMAPS.markDestination(destination, event);
     EVENTMAPS.centerOnPositionAndZoom(destination);
     EVENTMAPS.calculItineraire(destination, event);
     EVENTMAPS.markPartners(partners);
    } else{
      timeout = setTimeout(function(){
        EVENTMAPS.isMapInitialize(destination, event, partners);
      }, 200);
    }
  },
  init : function(idEvent){
    EVENTMAPS.loadInfo(idEvent);
  },
  initMap : function(destination, event, partners){
  // var dest = {title:"Event google Maps",date:"2013-12-05",eventType:"pro",idAdress:11,idCreator:3};
    // on initialise la map centrée sur la localisation actuelle
   //console.log(destination, event, partners);
    GOOGLE.geolocalisation(GOOGLE.initialize, alert);
    // on mark la destination
    EVENTMAPS.isMapInitialize(destination, event, partners);
  //  
  },
  loadInfo : function(idEvent){
    EVENTMAPS.getEvent(idEvent,EVENTMAPS.getDestination,EVENTMAPS.getPartners);
  },
  getEvent : function(idEvent, getDestination, getPartners){
        $.ajax({
          type: "GET",
          url: "http://pathworld.elasticbeanstalk.com/events/"+idEvent,
          data: {id : idEvent},
          success: function(data){
            EVENTMAPS.event.title = data.intitule;
            EVENTMAPS.event.date = data.date;
            EVENTMAPS.event.eventType = data.typeEvent;
            EVENTMAPS.event.idCurrentAddress  = data.idAdresse;
            EVENTMAPS.event.idCreator = data.idCreateur;
            getDestination(data.idAdresse,EVENTMAPS.initMap);
            getPartners(idEvent,EVENTMAPS.initMap);
          },
          error: function(msg){
            alert("Impossible to get information about this event" + idEvent);
          }
        });
  },
  getDestination : function(idAdress, callback){
      $.ajax({
          type: "GET",
          url: "http://pathworld.elasticbeanstalk.com/addresses/"+idAdress,
          data: {id : idAdress},
          success: function(data){
            EVENTMAPS.destination.place = data.place;
            EVENTMAPS.destination.location = data.location;
            EVENTMAPS.destination.lat = data.latitude;
            EVENTMAPS.destination.lng  = data.longitude;
            EVENTMAPS.count++;
            if(EVENTMAPS.count == 2){
              callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners);
            }
          },
          error: function(msg){
            alert("Impossible to get exact location of address" + idAdress);
          }
        });
  },
  getPartners : function(idEvent, callback){
        $.ajax({
          type: "GET",
          url: "http://pathworld.elasticbeanstalk.com/events/"+idEvent+"/users",
          data: {id : idEvent},
          initPartnersAdr : function(idCurrentAddress, i){
                $.ajax({
                 type: "GET",
                  url: "http://pathworld.elasticbeanstalk.com/addresses/"+idCurrentAddress,
                  data: {id : idCurrentAddress},
                  success: function(data){
                    EVENTMAPS.partners[i].lat  = data.latitude + 1;
                    EVENTMAPS.partners[i].lng = data.longitude ;
                    EVENTMAPS.count++;
                    if(EVENTMAPS.count == 2){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners);
                     }
                    },
                  error: function(msg){
                      alert("Impossible to get latitude & longitude of partner");
                    }
                  });
              },
          success: function(data){
            for(var i in data){
              EVENTMAPS.partners[i] = {};
              EVENTMAPS.partners[i].nom = data[i].firstName;
              EVENTMAPS.partners[i].idCurrentAddress = data[i].idCurrentAddress;
              this.initPartnersAdr(data[i].idCurrentAddress, i);
            }
          },
          error: function(msg){
            alert("Impossible to get users of this event");
          }
        });
  }

}
