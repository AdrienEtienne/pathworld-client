var CHECKEVENT = {

	domPattern : '<div id="check-event-{idevent}" class="check-event-events">{eventname}<img src="img/arrow.png" height="25" width="25"></div>',
	events : [],
	requestCount : 0,

	getListByUser : function(idUser){
		$.ajax({
			type : "GET",
			url : "http://pathworld.elasticbeanstalk.com/invitations",
			data : { idUser : idUser },
			success : function(data){
				CHECKEVENT.events = [];
				var tab = eval(data);
				for (var i = 0; i < tab.length; i++){
					CHECKEVENT.events.push({
						idEvent : tab[i].idEvent,
						response : tab[i].response,
						role : tab[i].role
					});
				}
				CHECKEVENT.getEventName();
			},
			error : function(msg){
				alert("error while loading event list");
			}
		});
	},

	getEventName: function(){
		for(var i = 0; i < CHECKEVENT.events.length; i++){
			$.ajax({
				type : "GET",
				url : "http://pathworld.elasticbeanstalk.com/events/" + CHECKEVENT.events[i].idEvent,
				success : function(data){
					for(var i = 0; i<CHECKEVENT.events.length; i++){
						if(CHECKEVENT.events[i].idEvent === data.idEvent){
							CHECKEVENT.events[i].eventName = data.intitule;
							CHECKEVENT.events[i].date = data.date;
							CHECKEVENT.events[i].type = data.typeEvent;
							CHECKEVENT.events[i].idAddress = data.idAdresse;
						}
					}
					
					CHECKEVENT.events.sort(CHECKEVENT.sortByDate);
					CHECKEVENT.insertTabInDom();
				},
				error : function(msg){
					alert("error while loading event list");
				}
			});
		}
	},

	insertTabInDom : function(){
		$("#events *").remove();
		for(var i = 0; i < CHECKEVENT.events.length; i++){
			CHECKEVENT.addEventToDom(CHECKEVENT.events[i]);
		}
	},

	addEventToDom : function(event){
		$("#events").append(CHECKEVENT.domPattern.replace("{eventname}", event.eventName).replace("{idevent}", event.idEvent));
	},


	sortByDate : function(a, b){
		return (( a.date < b.date) ? -1 : ((a.date > b.date) ? 1 : 0));
	},

	sortByResponse : function(a, b){
		return (( a.response < b.response) ? -1 : ((a.response > b.response) ? 1 : 0));
	},

	sortByRole : function(a, b){
		var roleA = CHECKEVENT.roleValue(a.role);
		var roleB = CHECKEVENT.roleValue(b.role);
		return(( roleA < roleB) ? -1 : ((roleA > roleB) ? 1 : 0 )) ;
	},

	roleValue : function(role){
		if(role == "owner") return 0;
		if(role == "organizer") return 1;
		if(role == "guest") return 2;
		if(role == "protected guest") return 3;
	},

	setSortEvent : function(){
		$("#check-event-date").click(function(){
			$("#checkevent dd").removeClass("active");
			$("#check-event-date").parent().addClass("active");
			CHECKEVENT.events.sort(CHECKEVENT.sortByDate);
			CHECKEVENT.insertTabInDom();
		});
		$("#check-event-status").click(function(){
			$("#checkevent dd").removeClass("active");
			$("#check-event-status").parent().addClass("active");
			CHECKEVENT.events.sort(CHECKEVENT.sortByResponse);
			CHECKEVENT.insertTabInDom();
		});
		$("#check-event-role").click(function(){
			$("#checkevent dd").removeClass("active");
			$("#check-event-role").parent().addClass("active");
			CHECKEVENT.events.sort(CHECKEVENT.sortByRole);
			CHECKEVENT.insertTabInDom();
		});
	},

	setClickEvent : function(){
		$("#events").on("click", ".check-event-events", function(){
			var id = this.id.split("-")[2];
			for(var i = 0;i<CHECKEVENT.events.length; i++){
				if(CHECKEVENT.events[i].idEvent == id){
					SHOWEVENT.init(CHECKEVENT.events[i]);
					HISTORY.navigate("showevent");
				}
			}
		});
	}
};

CHECKEVENT.setSortEvent();
CHECKEVENT.setClickEvent();
