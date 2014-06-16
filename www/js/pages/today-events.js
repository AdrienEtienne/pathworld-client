var showevent = function(){
  EVENTMAPS.init(parseInt($(this).attr('idevent')));
  HISTORY.navigate('event-map');
};

var EVENTS = {

  domPattern : "<li idEvent='{idEvent}' class='showevent today'><div>{name}<img src='img/arrow.png' height='25' width='25'></div></li>",

  idUser : -1,

  eventList : {},

  listUpdated : false,

  getEventList : function(){
    $('#todayevents .error').hide();
    $('#todayevents #today').hide();

    $.ajax({
      type: "GET",
      url: "http://pathworld.elasticbeanstalk.com/users/"+EVENTS.id+"/events",
      success: function(data){
        EVENTS.listUpdated = true;
        EVENTS.eventList = data;
        EVENTS.addEvents();
        $('#todayevents .error').hide();
        $('#todayevents #today').show();
      },
      error: function(msg){
        EVENTS.listUpdated = false;
        $('#todayevents .error').text("No event to display");
        $('#todayevents .error').show();
        $('#todayevents #today').hide();
      }
    });
  },

  getEventTodayList : function(d, idUser){
    $.ajax({
      type: "GET",
      url: "http://pathworld.elasticbeanstalk.com/users/"+
        "?date="+d+
        "?idUser="+idUser,
      success: function(data){
        EVENTS.listUpdated = true;
        EVENTS.eventList = data;
        EVENTS.addEvents();
        $('#todayevents .error').hide();
      },
      error: function(msg){
        EVENTS.listUpdated = false;
        $('#todayevents .error').text("No event to display");
        $('#todayevents .error').show();
        $('#todayevents #today').hide();
      }
    });
  },

  addEvents : function(){
    $("#todayevents li.showevent").remove();

    var date = new Date();
    var d = date.getDate();
    if(d < 10){
      d = "0" + d;
    }
    var m = date.getMonth() + 1;
    if(m < 10){
      m = "0" + m;
    }
    var y = date.getFullYear();
    var Nowdate = y+"-"+m+"-"+d;

    for(var i=0; i<EVENTS.eventList.length; i++){
      var ev = EVENTS.eventList[i];
      if(Nowdate === ev.date){
        var dom = EVENTS.domPattern.replace("{idEvent}",ev.idEvent).replace("{name}", ev.intitule);
        $("#todayevents #today").append(dom);
      }
      /*
      else if(dEvent == d+1){
        var dom = EVENTS.domPattern2
        .replace("{idEvent}",ev.idEvent)
        .replace("{name}", ev.intitule);
        $("#todayevents #tomorrow")
        .append(dom);
      }else if(dEvent > d+1){
        var dom = EVENTS.domPattern3
        .replace("{idEvent}",ev.idEvent)
        .replace("{name}", ev.intitule);
        $("#todayevents #later")
        .append(dom);
      }*/
    }

    $('.showevent').click(showevent);
  },

  error: function(){

  }
}

$('#bb_todayevents').click(function(){
  EVENTS.id = LOGIN.id;

  EVENTS.getEventList();

  /*
  date = new Date();
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  EVENTS.getEventTodayList(y +'-'+m+'-'+d, 1);
  */
});
