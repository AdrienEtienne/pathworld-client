$('#register-1 .next').click(function(){
	if(clickButtonVerif(this)){

    var mail = $('#register-1 [placeholder="Mail"]').val();
    var pwd = $('#register-1 [placeholder="Password"]').val();

    LOGIN.registration(mail, pwd, function(status, url){
      if( typeof url != 'undefined'){
        LOGIN.urlRegister=url;
        LOGIN.id = url.split("/")[url.split("/").length-1];
        $('.error').hide();
        HISTORY.navigate('register-2');
      }else{
        if(status == '409')
          $('#register-1 .ajax').text('Mail déjà utilisé');
        else
          $('#register-1 .ajax').text('Problème de connexion');
        $('#register-1 .ajax').show();
      }
    });
  }
});
