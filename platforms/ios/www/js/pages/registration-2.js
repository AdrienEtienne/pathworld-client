var REGISTRATION2 = {		
		createAddressAndUpdateUser : function(){
			var address = $('#register-2 [placeholder="Address"]').val();
			GOOGLE.getLatAndLongFromAddress(address, REGISTRATION2.queryAddress);
			//GOOGLE.geolocalisation(REGISTRATION2.queryAddress, REGISTRATION2.handleError);
		},
		
		queryAddress : function(lat, lng){
			var location = $('#register-2 [placeholder="Address"]').val();
			var place = "Home";
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
						REGISTRATION2.updateUser(idAddress);
					}else{
					}
				}
			});
		},
		updateUser : function(idAddress){
			var name = $('#register-2 [placeholder="Last name"]').val();
			var firstName = $('#register-2 [placeholder="First name"]').val();
			var phone = $('#register-2 [placeholder="Phone"]').val();
			
			LOGIN.complete_registration(name, firstName, idAddress, phone, function(status){
				if(status == 200){
					avoidForm('register-1');
					avoidForm('register-2');
					$('.error').hide();
					HISTORY.navigate('homepage');
				}else{
					if(status == '')
						$('#register-2 .ajax').text('Erreur de consultation de la base');
					else
						$('#register-2 .ajax').text(status);
					$('#register-2 .ajax').show();
				}

			});
		},
		handleError : function(error){
			
		}
}

$('#register-2 .next').click(function(){
	if(clickButtonVerif(this)){		
		REGISTRATION2.createAddressAndUpdateUser();
	}
});