var CREATEVENT = {

	createEvent : function(){
		this.generateAddress();
	},

	generateAddress : function(){
		var address = $('#createevent-address').val();
		GOOGLE.getLatAndLongFromAddress(address, CREATEVENT.queryAddress);
	},

	queryAddress : function(lat, lng){
		var location = $('#createevent-address').val();
		var place = $('#createevent-place').val();
		$.ajax({
			type: "POST",
			url: "http://pathworld.elasticbeanstalk.com/addresses",
			contentType: 'application/json',
			data:JSON.stringify({
				"place": place,
				"location": location,
				"latitude": lat,
				"longitude": lng
			}),
			complete: function(data){
				if(data.status == 201){
					var location = data.getResponseHeader('Location').split("/");
					var idAddress = location[location.length -1];
					CREATEVENT.queryEvent(idAddress);
				}else{
				}
			}
		});
	},

	queryEvent : function(idAddress){
		var title = $('#createevent-entitled').val();
		var date = $('#createevent-date').val();
		var type = $('#createevent-type').val();
		var details = $('#createevent-details').val();

		$.ajax({
			type: "POST",
			url: "http://pathworld.elasticbeanstalk.com/events",
			contentType: 'application/json',
			data:JSON.stringify({
				"date": date,
				"idAdresse": idAddress,
				"idCreateur": LOGIN.id,
				"intitule": title,
				"typeEvent": type
			}),
			complete: function(data){
				if(data.status == 201){
					alert("Event created");

					// Vide le formulaire
					$('#createevent input').each(function( index ) {
  					$(this).val('');
					});
					$('#createevent textarea').val('');

					HISTORY.navigate('homepage');
				}else{
					alert("Erreur, code retour : "+data.status);
				}
			}
		});
	},

	addDomEvents : function(){
		$('#createevent .next').click(function(){
			if(clickButtonVerif(this)){
				CREATEVENT.createEvent();
			}
		});
	}
}

CREATEVENT.addDomEvents();
