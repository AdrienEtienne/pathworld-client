var MODIFYEVENT = {
  idEvent : -1,
  idAddress : -1,
  address : "",
  place : "",

  init : function(idEvent){
    this.idEvent = idEvent;
    this.preFillForm();
  },

  preFillForm : function(){
    $.ajax({
      type : "GET",
      url : "http://pathworld.elasticbeanstalk.com/events/" + this.idEvent,
      success : function(data){
        $("#modify-event-date").val(data.date);
        $("#modify-event-entitled").val(data.intitule);
        if(data.typeEvent === "pro")
          $("#modify-event-type").val("pro");
        MODIFYEVENT.idAddress = data.idAdresse;
        MODIFYEVENT.getAddress();
      },
      error : function(msg){
      }
    });
  },

  getAddress : function(){
    $.ajax({
      type : "GET",
      url : "http://pathworld.elasticbeanstalk.com/addresses/" + this.idAddress,
      success : function(data){
        MODIFYEVENT.address = data.location;
        $("#modify-event-address").val(data.location);
        MODIFYEVENT.place = data.place;
        $("#modify-event-place").val(data.place);
      },
      error : function(msg){
      }
    });
  },

  modify : function(){
    var title = $('#modify-event-entitled').val();
    var date = $('#modify-event-date').val();
    var type = $('#modify-event-type').val();
    var details = $('#modify-event-details').val();

    $.ajax({
      type: "PUT",
      url: "http://pathworld.elasticbeanstalk.com/events/" + MODIFYEVENT.idEvent,
      contentType: 'application/json',
      data: JSON.stringify({
        "date": date,
        "idAdresse": MODIFYEVENT.idAddress,
        "idCreateur": LOGIN.id,
        "intitule": title,
        "typeEvent": type
      }),
      complete: function(data){
        if(data.status == 200){
          // Maj le nom de l'event
          $("#event-title").text(SHOWEVENT.event.eventName = $('#modify-event-entitled').val());

          var address = $('#modify-event-address').val();
          var place = $('#modify-event-place').val();
          if(MODIFYEVENT.address !== address || MODIFYEVENT.place !== place){
            MODIFYEVENT.address = address;
            MODIFYEVENT.place = place;
            MODIFYEVENT.updateAddress();
          }
          alert('Event changed');
          HISTORY.navigate('showevent');
        }else{
           alert('Event not changed');
           HISTORY.navigate('showevent');
        }
      }
    });
  },

  delete : function(){
    $.ajax({
      type: "DELETE",
      url: "http://pathworld.elasticbeanstalk.com/events/" + MODIFYEVENT.idEvent,
      contentType: 'application/json',
      complete: function(data){
        if(data.status == 200){
          alert('Event deleted');
          HISTORY.navigate('checkevent');
        }else{
          alert('Event not deleted');
          HISTORY.navigate('showevent');
        }
      }
    });
  },

  updateAddress : function(){
    var address = MODIFYEVENT.address;
    GOOGLE.getLatAndLongFromAddress(address, MODIFYEVENT.queryAddress);
  },

  queryAddress : function(lat, lng){
    $.ajax({
      type: "PUT",
      url: "http://pathworld.elasticbeanstalk.com/addresses/" + MODIFYEVENT.idAddress,
      contentType: 'application/json',
      data:JSON.stringify({
        "place": MODIFYEVENT.place,
        "location": MODIFYEVENT.address,
        "latitude": lat,
        "longitude": lng
      }),
      complete: function(data){
        if(data.status == 200){
        }else{
        }
      }
    });
  },

  addEventToDom : function(){
    $("#modify-event-next").click(function(){
      MODIFYEVENT.modify();
    });

    $("#modify-event-delete").click(function(){
      MODIFYEVENT.delete();
    });
  }
}

MODIFYEVENT.addEventToDom();
