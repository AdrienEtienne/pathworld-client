var GUESTSLIST = {
  idEvent : -1,

  domPattern : '<div class="guest-list-user">{libel}</div>',

  init : function(idEvent){
    this.idEvent = idEvent;
    $('#guests-list-list *').remove();
    GUESTSLIST.getAndSetList();
  },

  getAndSetList : function(){
    $.ajax({
      type: "GET",
      url: "http://pathworld.elasticbeanstalk.com/events/" + SHOWEVENT.event.idEvent + "/users",
      success: function(data){
        for(var i in data){
          $('#guests-list-list').append(GUESTSLIST.domPattern.replace('{libel}', data[i].name + ' ' + data[i].firstName));
        }
       },
      error: function(msg){
      }
    });
  }
}
