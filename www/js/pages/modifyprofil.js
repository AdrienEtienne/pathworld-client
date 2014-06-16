

var MODIFYPROFIL = {

	idCurrentAddress : -1,
	modifyProfil: function(){
 		if(clickButtonVerif(this)){

		
		  var address = $('#modify-profil-address').val();


	 	 //récupération de l'idHomeAddress et modification
		//fonction d'update de l'adresse
		MODIFYPROFIL.updateAddress(address);
		
		}
	},

	updateAddress : function(address){
		GOOGLE.getLatAndLongFromAddress(address, MODIFYPROFIL.queryAddress);
		//GOOGLE.geolocalisation(queryAddress, handleError);
	},
	
	queryAddress : function(lat, lng){
		$.ajax({
			type: "PUT",
			url: "http://pathworld.elasticbeanstalk.com/addresses/"+MODIFYPROFIL.idCurrentAddress,
			contentType: 'application/json',
			data:JSON.stringify({
				"location": $('#modify-profil-address').val(),
				"latitude": lat,
				"longitude": lng,
				"place": "Home"
			}),
			complete: function(data){
				if(data.status == 201){
					var location = data.getResponseHeader('Location').split("/");
					var idAddress = location[location.length -1];
					//MODIFYPROFIL.updateUser(idAddress);
				}else{
				}
				MODIFYPROFIL.modifyInfoProfil();
			}
		});
	},
		
	modifyInfoProfil : function(){
	 	 //maj du rest du user
	 	  var lastName = $('#modify-profil-lastName').val();
		  var firstName = $('#modify-profil-firstName').val();
		  var phone = $('#modify-profil-phone').val();
		  var password = $('#modify-profil-password').val();
		  

	  	$.ajax({
			type: "PUT",
			url: "http://pathworld.elasticbeanstalk.com/users/"+LOGIN.id,
			contentType: 'application/json',
			data:JSON.stringify({
				"mail": LOGIN.mail,
				"pwd": password,
				"name":lastName,
				"firstName":firstName,
				//à modifier
				"phone":phone,
				"idHomeAddress" : MODIFYPROFIL.idCurrentAddress,
				"idCurrentAddress": MODIFYPROFIL.idCurrentLocation
			}),
			complete: function(data){
				if(data.status == 200){
					HISTORY.navigate('homepage');
				}else{
					alert("Une erreur est survenue!");
					HISTORY.navigate('homepage');
				}
			}
		});
  	},

// récupération des données de profil user

	getProfil: function(){
	$.ajax({
			type: "GET",
			url: "http://pathworld.elasticbeanstalk.com/users/"+LOGIN.id,
			success: function(data){
				MODIFYPROFIL.idCurrentAddress = data.idHomeAddress;
				MODIFYPROFIL.idCurrentLocation = data.idCurrentAddress;
				$.ajax({
					type: "GET",
					url: "http://pathworld.elasticbeanstalk.com/addresses/"+MODIFYPROFIL.idCurrentAddress,
					success: function(data){
						$('#modify-profil [placeholder="Address"]').val(data.location);
						
					},
					error: function(msg){
						alert("unknown address");
					}
				}),

				$('#modify-profil [placeholder="Password"]').val(data.pwd);
				$('#modify-profil [placeholder="Last name"]').val(data.name);
				$('#modify-profil [placeholder="First name"]').val(data.firstName);
				$('#modify-profil [placeholder="Phone"]').val(data.phone);

				HISTORY.navigate('modify-profil');
			},
			error: function(msg){
				$('#login .ajax').text('Identification error');
				$('#login .ajax').show();
			}
		});
	}
};
$('#modify-profil .next').click(MODIFYPROFIL.modifyProfil);
$('#homepage #hp_modify-profil').click(MODIFYPROFIL.getProfil);