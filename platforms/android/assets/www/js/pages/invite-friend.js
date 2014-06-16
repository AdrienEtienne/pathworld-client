var INVITE_FRIENDS = {

  // pattern used to insert a new user
  domPattern : "<div id='{na}_{fo}_{id}' class='{invited}'>{user} <span class='invite-f-shadowed text-right'>{inv}</span></div>",

  idEvent : -1,

  // user already invited in the beggining
  invitedList : {},

  listUpdated : false,

  init : function(idEvent){
    this.invitedList = {};
    this.listUpdated = false;
    this.idEvent = idEvent;
    this.getInvitedList();
    this.setEvents();
  },

  // user : name_forename
  invite : function(user){
    var id = user.split("_")[2];
    var role = $("#invite-role").val();
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var stringDate =  year + "-" + month + "-" + day ;
    var invitation  = {
      idEvent : this.idEvent,
      idUser : id,
      role : role,
      date : stringDate
    };
    $.ajax({
        url: 'http://pathworld.elasticbeanstalk.com/invitations',
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(invitation),
    });
  },

  // user : name_forename
  uninvite : function(user){
    var id = user.split("_")[2];
    $.ajax({
        url: 'http://pathworld.elasticbeanstalk.com/invitations/events/' + this.idEvent + '/users/' + id,
        type: 'DELETE',
        contentType : 'application/json',
    });
  },

  // set the invited list
  getInvitedList : function(){
    $.ajax({
      type: "GET",
      url: "http://pathworld.elasticbeanstalk.com/events/" + this.idEvent + "/users",
      success: function(data){
        INVITE_FRIENDS.listUpdated = true;
        INVITE_FRIENDS.invitedList = data;
      },
      error: function(msg){
        INVITE_FRIENDS.listUpdated = false;
      }
    });
  },

  // get users request (keywords : key1 key2 ...)
  getMembersList : function(keyWords){
    $("#invite-friend-search *").remove();
    var keys = keyWords.split(" ");
    var keysString = "?";
    for(var i = 0; i < keys.length; i++){
      if(keys[i] != "")
        keysString += "unknown=" + keys[i] + "&";
    }
    this.addListFromKey(keysString.substring(0, keysString.length - 1));
  },

  addListFromKey : function(key){
    $.ajax({
      type: "GET",
      url: "http://pathworld.elasticbeanstalk.com/users" + key,
      success: function(data){
        for(var user in data){
          if(data[user].idUser!=LOGIN.id){
          INVITE_FRIENDS.addUserToDom(data[user]);
          $('#invite-friend .error').hide();
          }
        }
      },
      error: function(msg)
      	{
      		$('#invite-friend .error').text("No friends found");
	        $('#invite-friend .error').show();
      	}
    });
  },

  // dom insertion
  addUserToDom : function(user){
    var isInvited = this.isIvinted(user);
    if(isInvited.awn)
      $("#invite-friend-search").append(INVITE_FRIENDS.domPattern.replace("{user}", user.name + " " + user.firstName).replace('{id}', user.idUser).replace('{invited}', 'user-invited').replace("{na}", user.name).replace("{fo}", user.firstName).replace("{inv}", "invited"));
    else{
      $("#invite-friend-search").append(INVITE_FRIENDS.domPattern.replace("{user}", user.name + " " + user.firstName).replace('{id}', user.idUser).replace('{invited}', 'user-not-invited').replace("{na}", user.name).replace("{fo}", user.firstName).replace("{inv}", "not-invited"));
    }
  },

  // test if the user is invited
  isIvinted : function(user){
    for(var i in this.invitedList){
      if(this.invitedList[i].name === user.name && this.invitedList[i].firstName === user.firstName){
        return {awn : true, role :this.invitedList[i].role};
      }
    }
    return {awn : false, role :this.invitedList[i].role};
  },

  // events
  setEvents : function(){
    $("#invite-friend-search").on( "click", ".user-invited", function() {
      $(this).removeClass('user-invited').addClass('user-not-invited');
      $("#" + this.id + " span").text("not-invited");
      INVITE_FRIENDS.uninvite(this.id);
    });
    $("#invite-friend-search").on( "click", ".user-not-invited", function() {
      $(this).removeClass('user-not-invited').addClass('user-invited');
      $("#" + this.id + " span").text("invited");
      INVITE_FRIENDS.invite(this.id);
    })
  }
}

$("#button_invite_friend_search").click(function(){
  var keys = $("#search-friend").val();
  if(keys != "")
    INVITE_FRIENDS.getMembersList(keys);
});
