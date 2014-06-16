var HOMEPAGE = {
		domPattern : '<div class="{class}">{metrique}</div>',

		getEventMetrics : function(){
			$.ajax({
				type : "GET",
				url : "http://pathworld.elasticbeanstalk.com/users/"+LOGIN.id+"/events",
				success : function(data){
					var nbTodaysEvent = 0;
					var nbCreatedEvents = 0;
					var nbTotalEvents = 0;
					var tab = eval(data);
					var nbTodaysEvent = 0;
					var nbCreatedEvents = 0;
					var nbTotalEvents = tab.length;
					//a modifier
					var chaineDate = HOMEPAGE.getActualDate();
					for(var i = 0; i<tab.length; i++){
						if(chaineDate == tab[i].date){
							nbTodaysEvent++;
						}
						if(LOGIN.id == tab[i].idCreateur){
							nbCreatedEvents++;
						}
					}
					$('#eventMetrics .homepage-values').empty();
					$('#homepage-todaysEvent').append(HOMEPAGE.domPattern.replace("{class}", "homepage-values text-center").replace("{metrique}", nbTodaysEvent));
					$('#homepage-yourEvents').append(HOMEPAGE.domPattern.replace("{class}", "homepage-values text-center").replace("{metrique}", nbCreatedEvents));
					$('#homepage-totalEvents').append(HOMEPAGE.domPattern.replace("{class}", "homepage-values text-center").replace("{metrique}", nbTotalEvents));
				},
				error : function(){
					$('#eventMetrics .homepage-values').empty();
					$('#homepage-todaysEvent').append(HOMEPAGE.domPattern.replace("{class}", "homepage-values text-center").replace("{metrique}", 0));
					$('#homepage-yourEvents').append(HOMEPAGE.domPattern.replace("{class}", "homepage-values text-center").replace("{metrique}", 0));
					$('#homepage-totalEvents').append(HOMEPAGE.domPattern.replace("{class}", "homepage-values text-center").replace("{metrique}", 0));
				}
			});
		},

		getActualDate : function(){
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
			return y+"-"+m+"-"+d;
		}
}

$('#homepage-logout_index').click(function(){
	if(confirm("Vous allez etre deconnecte. Continuer ?")){
		LOGIN.mail = "";
		LOGIN.pwd = "";
		LOGIN.urlRegister ="";
		LOGIN.id = -1;
		HISTORY.navigate("index");
	}
});
