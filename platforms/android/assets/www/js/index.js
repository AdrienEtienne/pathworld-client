// Variable app, Cordova init
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    }
};

//Global init
var INIT = {
    postLoad : function(){
        $("#index").show();
        $(".bottom-bar").hide();
    },
    navigation : function(){
        $('.navigation').click(function(){
            HISTORY.navigate($(this).attr('id').split('_')[1]);
        });
    },
    init : function(){
        this.navigation();
        this.postLoad();
      },
}

//DOM ready function
$(function() {
    INIT.init();
  /*
  GOOGLE.setConfig();
  GOOGLE.initialize(48, 2);
  GOOGLE.geolocalisation(GOOGLE.centerOnPosition);
  */
});
