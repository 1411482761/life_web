
var objcforandroid;
var ObjControls = Class.create();
ObjControls.prototype = {
	initialize : function() {
		this.theme = "01";
	},
	
	
	load : function(flag,theme) {
	if(!flag){
		var params={cmd:"getOldMessages"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans,function(response) {
			var data = response.data[0].result;
			if(data.themeid != undefined)
				objcforandroid.theme = data.themeid;
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+objcforandroid.theme+"/object.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo("head");
			jQuery("#obj-body").show();
		});
	}else{
		jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/object.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo("head");
		jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+theme+"/object.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo("head");
		jQuery("#obj-body").show();
	}
	}
};
ObjControls.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	objcforandroid = new ObjControls();
};
jQuery(document).ready(ObjControls.main);
