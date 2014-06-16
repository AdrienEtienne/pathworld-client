var SHOWEVENT = {
	event : {},

  init : function(event){
    SHOWEVENT.event = event;
    $("#event-title").text(SHOWEVENT.event.eventName);
    SHOWEVENT.setStatus();
    SHOWEVENT.setButtonVisibility();
    SHOWEVENT.setInfo();
  },

  setStatus : function(){
      $("#showevent dd").removeClass("active");
      if(SHOWEVENT.event.response == "0"){
        $("#perhaps").addClass("active");
      }
      else if(SHOWEVENT.event.response == "1"){
        $("#accept").addClass("active");
      }
      else{
        $("#refuse").addClass("active");
      }
  },

  setInfo : function(){
    $("#showevent-date").text(SHOWEVENT.event.date);
    $("#showevent-role").text("Role: "+SHOWEVENT.event.role);
    SHOWEVENT.getGuestNumber();
    SHOWEVENT.getAddress();
  },

  getAddress : function(){
    $.ajax({
      type : "GET",
      url : "http://pathworld.elasticbeanstalk.com/addresses/" + SHOWEVENT.event.idAddress,
      success : function(data){
        $("#showevent-address").text(data.location);
      },
      error : function(msg){
      }
    });
  },

  getGuestNumber : function(){
    $.ajax({
      type: "GET",
      url: "http://pathworld.elasticbeanstalk.com/events/" + SHOWEVENT.event.idEvent + "/users",
      success: function(data){
        $("#showevent-nb-guest").text("Guests count: "+data.length);
       },
      error: function(msg){
      }
    });
  },

  setButtonVisibility : function(){
		$("#showevent-modify-event").show();
		$("#showevent-invite").show();
		$("#showevent-guest-list").show();
    if(SHOWEVENT.event.role == "guest" || SHOWEVENT.event.role == "Guest"){
      $("#showevent-modify-event").hide();
      $("#showevent-invite").hide();
    }
      if(SHOWEVENT.event.role == "protected guest" || SHOWEVENT.event.role == "Protected guest"){
      $("#showevent-modify-event").hide();
      $("#showevent-invite").hide();
      $("#showevent-guest-list").hide();
    }
  },

  addTrigger : function(){
      $('#showevent .sub-nav dd.select').click(function(){
        $('#showevent .sub-nav dd.select').removeClass("active");
        $(this).addClass('active');
        SHOWEVENT.updateResponse(this.id);
      });
  },

	addClicksEvents : function(){
		$("#showevent-invite").click(function(){
			INVITE_FRIENDS.init(SHOWEVENT.event.idEvent);
			HISTORY.navigate("invite-friend");
		});

		$("#showevent-guest-list").click(function(){
			GUESTSLIST.init(SHOWEVENT.event.idEvent);
			HISTORY.navigate("guests-list");
		});

		$("#showevent-modify-event").click(function(){
			MODIFYEVENT.init(SHOWEVENT.event.idEvent);
			HISTORY.navigate("modify-event");
		});
	},

  updateResponse : function(response){
		alert(response);
		var resp = 2;
    if (response == "accept") resp = 1;
    else if (response == "perhaps") resp = 0;

		var obj = {
			role : SHOWEVENT.event.role,
			response : resp
		}

		if(SHOWEVENT.event.role === "owner"){
			alert("As the owner, you must accept the invitation.");
			$("#showevent dd").removeClass("active");
			$("#accept").addClass("active");
		} else {
			$.ajax({
				type: "PUT",
				contentType : 'application/json',
				url: "http://pathworld.elasticbeanstalk.com/invitations/events/"+ SHOWEVENT.event.idEvent +"/users/" + LOGIN.id ,
				data : JSON.stringify(obj)
			});
		}
  }


};

SHOWEVENT.addTrigger();
SHOWEVENT.addClicksEvents();
