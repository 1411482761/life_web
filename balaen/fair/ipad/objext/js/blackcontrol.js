var objectcontr;
var ObjectControl = Class.create();
ObjectControl.prototype = {
	initialize : function(){
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
	},
	adaptation: function(themeStyle){
		if(objectcontr.isNotPad && objectcontr.width <  768){
			jQuery("<link rel='stylesheet' href='/fair/ipad/objext/css/common/black_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("#container").css("width",objectcontr.width-80);
		}else{
			jQuery("<link rel='stylesheet' href='/fair/ipad/objext/css/common/black.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
		}
		jQuery("<link rel='stylesheet' href='/fair/ipad/objext/css/"+themeStyle+"/black.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
	}
};
ObjectControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	objectcontr = new ObjectControl();
};
jQuery(document).ready(ObjectControl.main);

