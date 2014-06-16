EVENTMAPS = {
  timeout : {},
  count : 0,
  destination : {},
  idEventCurrent : "",
  event : {},
  partners : [],
  cailloux : [],
  reloadCount : 0,
  interval : "",
  reloadbool : false,

  createMarkerContent : function(title, content){
    var contentString = '<div id="content">'+
    '<h3>'+ title +'</h3>'+
    '<div id="bodyContent">'+
    '<p>' + "vu hier à 18h36" +'</p>'
    '</div>'+
    '</div>';
    return contentString;
  },
  createMarkerContentCaillou : function(title, content, date, nameCreator){
    var contentString = '<div id="content">'+
    '<h3>'+ title +'</h3>'+
    '<p style =\"color:gray;\" ><i>'+ date +'</i></p>'+
    '<div id="bodyContent">'+
    '<p>' + content +
    '<br/><i>' + "Déposé par : "+  nameCreator +'</i></p>'
    '</div>'+
    '</div>';
    return contentString;
  },
  markCaillou : function(cailloux){
    for(var i = 0; i < cailloux.length; i++){
       var caillouContent = EVENTMAPS.createMarkerContentCaillou(cailloux[i].name, cailloux[i].content, cailloux[i].date, cailloux[i].nameCreator);
       GOOGLE.addMarker(cailloux[i].lat, cailloux[i].lng, cailloux[i].name, 'blue', 'tips', caillouContent);

    }
  },

  calculItineraire : function(destination,event){
    GOOGLE.calculeRoute(destination, event);
  },
  markPartners : function(partners){
    for(var i = 0; i < partners.length; i++){
      var content = this.createMarkerContent(partners[i].nom, partners[i].date);
      GOOGLE.addMarker(partners[i].lat, partners[i].lng, partners[i].nom, 'blue', 'void', content);
    }
  },

  centerOnPositionAndZoom : function(destination){
    GOOGLE.fitbound(destination);
  },
  isMapInitialize : function(destination, event, partners,cailloux){
    if(GOOGLE.mapSetted){
      clearTimeout(timeout);
      // on mark la destination
     // EVENTMAPS.markDestination(destination, event);
     if(EVENTMAPS.reloadbool == false)
       EVENTMAPS.centerOnPositionAndZoom(destination);
     EVENTMAPS.calculItineraire(destination, event);
     EVENTMAPS.markPartners(partners);
     EVENTMAPS.markCaillou(cailloux);
     GOOGLE.mapSetted = false;
     EVENTMAPS.count = 0;
     setTimeout(EVENTMAPS.reload, 60000);
    } else{
      timeout = setTimeout(function(){
        EVENTMAPS.isMapInitialize(destination, event, partners, cailloux);
      }, 1000);
    }
  },
  init : function(idEvent){
    EVENTMAPS.idEventCurrent = idEvent;
    EVENTMAPS.loadInfo(idEvent);
  },
  initMap : function(destination, event, partners, cailloux){
  // var dest = {title:"Event google Maps",date:"2013-12-05",eventType:"pro",idAdress:11,idCreator:3};
    // on initialise la map centrée sur la localisation actuelle
    //console.log(destination, event, partners);
    if(EVENTMAPS.reloadbool == false)
      GOOGLE.geolocalisation(GOOGLE.initialize, alert);
    else{
      GOOGLE.geolocalisation(GOOGLE.setMyPosition, alert);
      //GOOGLE.mapSetted = true;
    }
    // on mark la destination
   // partners[0] = {nom : "Désirée", idAdress : 1, lat :48.906286 , lng : 2.270560 };
    //partners[1] = {nom : "Julie", idAdress : 2, lat : 48.901030, lng : 2.275050 };
    //cailloux[0] = {name:"Dream", content:"La maison des rois et bientôt la nôtre", address:"Versailles",idAddress:"7", lat :"48.804865", lng :"2.120355"};
    //cailloux[1] = {name:"Look", content:"Super ouf à regarder obligatoirement", address:"Bourges",idAddress:"7", lat :"48.3", lng :"3"};
    //cailloux[2] = {name:"Look", content:"Super ouf à regarder obligatoirement", address:"Bourges",idAddress:"7", lat :"48", lng :"2"};
    //cailloux[3] = {name:"Look", content:"Super ouf à regarder obligatoirement", address:"Bourges",idAddress:"7", lat :"47.9", lng :"5"};
    // cailloux[1] = {name:"", content:"", address:"",idAddress:"Bourges", lat :"49", lng :"3"};
    EVENTMAPS.isMapInitialize(destination, event, partners,cailloux);
  //  
  },
  loadInfo : function(idEvent){
    CAILLOU.idEvent = idEvent;
   // var event = {title : "Rendez-vous à la fac", date :"2014-06-02", eventType :"Perso" ,idAdress :3 , idCreator : 3 };
    //var destination = {place : "Université Parix X La défense", location :"Université Paris X " , lat : 48.904221, lng :2.213282};
    //var partners = [];
    //partners[0] = {nom : "Désirée", idAdress : 1, lat :48.906286 , lng : 2.270560 };
    //partners[1] = {nom : "Julie", idAdress : 2, lat : 48.901030, lng : 2.275050 };
    //var cailloux = [];
    //partners[0] = {nom : "Désirée", idAdress : 1, lat :48.906286 , lng : 2.270560 };
    //partners[1] = {nom : "Julie", idAdress : 2, lat : 48.901030, lng : 2.275050 };
    EVENTMAPS.getEvent(idEvent, EVENTMAPS.getDestination,EVENTMAPS.getPartners);
  },

  reload : function(){
    EVENTMAPS.reloadCount = 0;
    EVENTMAPS.reloadbool = true;
    EVENTMAPS.partners = [];
    EVENTMAPS.cailloux = [];
    EVENTMAPS.getPartners(EVENTMAPS.idEventCurrent, EVENTMAPS.initMap);
    EVENTMAPS.getCailloux(EVENTMAPS.idEventCurrent, EVENTMAPS.initMap);
    GOOGLE.setAllMap(null);
    GOOGLE.clearRoute(null);
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
            EVENTMAPS.event.idAdress  = data.idAdresse;
            EVENTMAPS.event.idCreator = data.idCreateur;
            getDestination(data.idAdresse,EVENTMAPS.initMap);
            getPartners(idEvent,EVENTMAPS.initMap);
            EVENTMAPS.getCailloux(idEvent, EVENTMAPS.initMap);
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
            if(EVENTMAPS.count == 3){
              callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners,EVENTMAPS.cailloux);
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
          initPartnersAdr : function(idAdress, i){
                $.ajax({
                 type: "GET",
                  url: "http://pathworld.elasticbeanstalk.com/addresses/"+idAdress,
                  data: {id : idAdress},
                  success: function(data){
                    EVENTMAPS.partners[i].lat  = data.latitude;
                    EVENTMAPS.partners[i].lng = data.longitude ;
                    EVENTMAPS.count++;
                    EVENTMAPS.reloadCount++;
                    if(EVENTMAPS.count == 3){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners, EVENTMAPS.cailloux);
                     }
                     if(EVENTMAPS.reloadCount == 2 ){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners, EVENTMAPS.cailloux);
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
              EVENTMAPS.partners[i].idAdress = data[i].idCurrentAddress;
              this.initPartnersAdr(data[i].idCurrentAddress, i);
            }
          },
          error: function(msg){
            alert("Impossible to get users of this event");
          }
        });
  },
    getCailloux: function(idEvent, callback){
        $.ajax({
          type: "GET",
          url: "http://pathworld.elasticbeanstalk.com/tips?idEvent="+idEvent,
        //  data: {id : idEvent},
          initCaillouAdr : function(idAdress, i){
                $.ajax({
                 type: "GET",
                  url: "http://pathworld.elasticbeanstalk.com/addresses/"+idAdress,
                  data: {id : idAdress},
                  success: function(data){
                    EVENTMAPS.cailloux[i].lat  = data.latitude;
                    EVENTMAPS.cailloux[i].lng = data.longitude;
                     EVENTMAPS.count++;
                     EVENTMAPS.reloadCount++;
                    if(EVENTMAPS.count == 3){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners,EVENTMAPS.cailloux);
                     }
                      if(EVENTMAPS.reloadCount == 2 ){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners, EVENTMAPS.cailloux);
                     }
                   
                    },
                  error: function(msg){
                     EVENTMAPS.count++;
                     EVENTMAPS.reloadCount++;
                    if(EVENTMAPS.count == 3){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners,EVENTMAPS.cailloux);
                     }
                      if(EVENTMAPS.reloadCount == 2 ){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners, EVENTMAPS.cailloux);
                     }
                      alert("Impossible to get Marker");
                    }
                  });
              },
            initCaillouCreateur : function(idCreateur, i){
                $.ajax({
                 type: "GET",
                  url: "http://pathworld.elasticbeanstalk.com/users/"+idCreateur,
                  data: {id : idCreateur},
                  success: function(data){
                    EVENTMAPS.cailloux[i].nameCreator  = data.firstName;
                     EVENTMAPS.count++;
                     EVENTMAPS.reloadCount++;
                    if(EVENTMAPS.count == 3){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners,EVENTMAPS.cailloux);
                     }
                      if(EVENTMAPS.reloadCount == 2 ){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners, EVENTMAPS.cailloux);
                     }
                   
                    },
                  error: function(msg){
                     EVENTMAPS.count++;
                     EVENTMAPS.reloadCount++;
                    if(EVENTMAPS.count == 3){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners,EVENTMAPS.cailloux);
                     }
                      if(EVENTMAPS.reloadCount == 2 ){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners, EVENTMAPS.cailloux);
                     }
                      alert("Impossible to get Marker");
                    }
                  });
              }, 
          complete: function(data){
            if(data.status == 200){
              var tabData = data.responseJSON;
              for(var i in tabData){
              EVENTMAPS.cailloux[i] = {};
              EVENTMAPS.cailloux[i].name = tabData[i].titre;
              EVENTMAPS.cailloux[i].content = tabData[i].details;
              EVENTMAPS.cailloux[i].date = tabData[i].date;
              EVENTMAPS.cailloux[i].idCreateur = tabData[i].idCreateur;
              //EVENTMAPS.cailloux[i].address = tabData[i].address;
              EVENTMAPS.cailloux[i].idAdresse = tabData[i].idAdresse;
              this.initCaillouAdr(tabData[i].idAdresse, i);
              this.initCaillouCreateur(tabData[i].idCreateur, i);

            }
          }else{
            if(data.status == 404){
              EVENTMAPS.cailloux = {};
               EVENTMAPS.count++;
               EVENTMAPS.reloadCount++;
                    if(EVENTMAPS.count == 3){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners,EVENTMAPS.cailloux);
                     }
                      if(EVENTMAPS.reloadCount == 2 ){
                      callback(EVENTMAPS.destination,EVENTMAPS.event,EVENTMAPS.partners, EVENTMAPS.cailloux);
                     }

            }
          }
            
          }
        });
  }

}
