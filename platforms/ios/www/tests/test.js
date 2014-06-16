/**
* Tests unitaires simples PATH WORLD
*
*/

var TESTS = {

  run : function(){
    this.MAIL.wrongPattern();
    this.MAIL.availableMail();
    this.MAIL.unavailableMail();
  },
  // Test concernant le mail lors du register
  MAIL : {
    // non-passant : pattern du mail incorrecte
    wrongPattern : function(){
      var wrongMail = "invalid#mail";
      HISTORY.navigate("register");
      $("#register-1-mail").focus();
      $("#register-1-mail").val(wrongMail);
      $("#register-1-mail").blur();
      if($("#register-1-mail-notify").css("display") === "block"){
        console.log("MAIL::wrongPattern : success");
      } else{
        console.log("MAIL::wrongPattern : fail");
      }
    },
    // passant : pas de notification lorsque le mail est disponible
    availableMail : function(){
      var availableMail = Date.now() + "@gmail.com";
      HISTORY.navigate("register");
      $("#register-1-mail").focus();
      $("#register-1-mail").val(availableMail);
      $("#register-1-mail").blur();
      if($("#register-1-mail-notify").css("display") === "block"){
        console.log("MAIL::availableMail : fail");
      } else{
        console.log("MAIL::availableMail : success");
      }
    },
    // non-passant : notifiation lorsque le mail est disponible
    unavailableMail : function(){
      var availableMail = Date.now() + "test@gmail.com";
      HISTORY.navigate("register");
      $("#register-1-mail").focus();
      $("#register-1-mail").val(availableMail);
      $("#register-1-mail").blur();
      if($("#register-1-mail-notify").css("display") === "block"){
        console.log("MAIL::unavailableMail : success");
      } else{
        console.log("MAIL::unavailableMail : fail");
      }
    }
  }

}
