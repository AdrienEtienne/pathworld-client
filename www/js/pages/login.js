var LOGIN = {
	mail : "",
	pwd : "",
	urlRegister: "",
	id : -1,
	success : false,
	authentification : function(mail, pwd){
		$.ajax({
			type: "GET",
			url: "http://pathworld.elasticbeanstalk.com/users",
			data: { login: mail, password: pwd },
			success: function(data){
				LOGIN.mail = data.mail;
				LOGIN.pwd = data.pwd;
				LOGIN.success = true;
				LOGIN.id = data.idUser;
				HISTORY.navigate('homepage');
			},
			error: function(msg){
				$('#login .ajax').text('Identification error');
				$('#login .ajax').show();
			}
		});
	},
	registration : function(mail, pwd, callback){
		$.ajax({
			type: "POST",
			url: "http://pathworld.elasticbeanstalk.com/users",
			contentType: 'application/json',
			data:
			JSON.stringify({
				'mail': mail,
				'pwd': pwd
			}),
			complete: function(data, status){
				if(data.status == 201){
					LOGIN.mail = mail;
					LOGIN.pwd = pwd;
					LOGIN.success = false;
					callback(data.status, data.getResponseHeader('Location'));
				}else{
					callback(data.status);
				}
			}
		});
	},
	complete_registration : function(name, firstName, address, phone, callback){
		$.ajax({
			type: "PUT",
			url: LOGIN.urlRegister,
			contentType: 'application/json',
			data:JSON.stringify({
				"name":name,
				"firstName":firstName,
				"phone":phone,
				'idHomeAddress':address,
				'idCurrentAddress':address
			}),
			complete: function(data){
				if(data.status == 200){
					LOGIN.success = true;
					callback(data.status);
				}else{
					callback(data.responseText);
				}
			}
		});
	},

	checkUsedMail : function(mail){
		/*.ajax({
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
	*/}
}

$('#login #login-mail').blur(function(){
	verifMail(this.value, 'login');
	LOGIN.checkUsedMail(this.value);
});

$('#login .next').click(function(){
	if(verifMail($('#login-mail').val(), 'login')){
		var login = $('#login-mail').val();
		var pwd = $('#login-pwd').val();
		LOGIN.authentification(login, pwd);
	}
});
