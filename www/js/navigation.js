//Gestion de l'historique (site web mono page)
var HISTORY = {
    tab : ["index"],
    show : function(id){
        $(".page").hide();
        $("#" + id).show();
        this.display(id);
    },
    navigate : function(id){
        this.tab.push(id);
        this.show(id);
    },
    back : function(){
        if(this.tab.length > 1){
            //this.hide(this.tab.pop());
            this.tab.pop();
            var id = this.tab[this.tab.length - 1];
            this.show(id);
        }
    },
    display: function(id){
        switch (id) {
            case "homepage":
            $(".bottom-bar").show();
            HOMEPAGE.getEventMetrics();
            break;
            case "modify-profil":
            $(".bottom-bar").show();
            break;
            case "invite-friend":
            $(".bottom-bar").show();
            break;
            case "todayevents":
            $(".bottom-bar").show();
            break;
            case "checkevent":
            $(".bottom-bar").show();
            CHECKEVENT.getListByUser(LOGIN.id);
            break;
            case "showevent":
            $(".bottom-bar").show();
            break;
            case "createevent":
            $(".bottom-bar").show();
            break;
            case "contacts":
            $(".bottom-bar").show();
            break;
            default:
            $(".bottom-bar").hide();
            break;
        }
    }
}
