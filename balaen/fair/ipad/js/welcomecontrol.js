var wc;
var WelcomeControl = Class.create();
WelcomeControl.prototype = {
	initialize : function() {
		this.trans = new Object();
		this.theme="01";
	},
	
	onLoad : function(sessionkey) {
		/*
		this.warning = false;
		this.trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			params: {
				cmd: "WelcomeInfo",
				sessionkey: sessionkey
			}
		};
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result;
			if(javaData.theme != undefined)
				wc.theme = javaData.theme;
			jQuery("#content").html(javaData.text);
			var showManul=javaData.showManul;
			if(showManul){
				jQuery("#manual").html(VIEWS_LOCALE.welcome.manual);
				jQuery("#manual").show();
			}else{
				jQuery("#manual").hide();
			}
			jQuery("#preface").html(VIEWS_LOCALE.welcome.preface);
		});
	}*/
};
WelcomeControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	wc = new WelcomeControl();
};
jQuery(document).ready(WelcomeControl.main);
