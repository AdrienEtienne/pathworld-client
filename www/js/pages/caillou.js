var CAILLOU = {
	 name : "",
	 address : "",
	 content : "",
	 idEvent : "",
	 idUser : "",
	 date : "",

	getInfoCaillou : function(idEvent){
		name = $('#createtips [placeholder="name"]').val();
		//address = $('#caillou [placeholder="address"]').val();
		content = $('#createtips [placeholder="content"]').val();
		var d = new Date();
		date = d.getFullYear()+"-" +d.getMonth()+ "-" +d.getDate();
		GOOGLE.geolocalisation(CAILLOU.createAddressCaillou);
	},

	createAddressCaillou : function(lat, lng){
			$.ajax({
				type: "POST",
				url: "http://pathworld.elasticbeanstalk.com/addresses",
				contentType: 'application/json',
				data:JSON.stringify({
					"place": "marker_" + name,
					"location": "marker_location",
					"latitude": lat,
					"longitude": lng
				}),
				complete: function(data){
					if(data.status == 201){
						var location = data.getResponseHeader('Location').split("/");
						var idAddressCaillou = location[location.length -1];
						CAILLOU.createCaillou(idAddressCaillou, CAILLOU.idEvent);
					}else{
						// POPUP retry with good adresse
					}
				}
			});
		},

		createCaillou : function(idAddressCaillou, idEvent){
			$.ajax({
				type: "POST",
				url: "http://pathworld.elasticbeanstalk.com/tips",
				contentType: 'application/json',
				data:JSON.stringify({
					"titre" : name ,
					"details": content,
					"idAdresse": idAddressCaillou,
					"idCreateur": CAILLOU.idUser,
					"idEvent": CAILLOU.idEvent,
					"date": date
				}),
				complete: function(data){
					if(data.status == 201){
						HISTORY.navigate('todayevents');
					}else{
						// Error Stay on createCaillou page
					}
				}
			});
		}
}

$('#createtips .next').click(function(){
	CAILLOU.getInfoCaillou();
});