var pcontr;
var PrintControl = Class.create();
var clicktimes = 0;
PrintControl.prototype = {
	initialize : function(){
	},
	validate : function(){
	},
	showPhone : function(){
		var params={
				cmd : "PrintFairOrderByPIN",
				type : "telephone"
		};
		var trans={
				id : 1,
				command : "com.agilecontrol.fair.FairCmd",
				params : params
		};
		portalClient.sendOneRequest(trans, function(response){
			if(response.data[0].code != 0){
				alert(response.data[0].message);
				return;
			}
			var javaData = response.data[0].result;
			jQuery("#show_phone").html(javaData.telephone);
		});
		
	},
	clicknumber : function(number){
		var pin = jQuery("#show_member").html();
		jQuery("#show_member").html(pin + number);
		clicktimes = clicktimes + 1;
		if(clicktimes > 6){
			clicktimes = 6;
		}
		var com_pin = jQuery("#show_member").html();
		if(clicktimes != 6){
			jQuery("#show_infor").html("");
		}else{
//			jQuery("#show_infor").html(VIEWS_LOCALE.printer.message);
			jQuery("#show_infor").html("处理中...");
			var params={
					cmd : "PrintFairOrderByPIN",
					pin : com_pin,
					token : "tyddfdsfqq23345fd44fdfda",
					type : "toprint"
			};
			var trans={
					id : 1,
					command : "com.agilecontrol.fair.FairCmd",
					params : params
			};
			portalClient.sendOneRequest(trans, function(response){
				if(response.data[0].code != 0){
					alert(response.data[0].message);
					return;
				}
				var javaData = response.data[0].result;
				var message = javaData.message;
				jQuery("#show_infor").html(message);
				jQuery("#show_member").html("");
				clicktimes = 0;
			});
		}
	},
	clearnumber : function(){
		var pre_pin = jQuery("#show_member").html();
		var pin = pre_pin.substring(0,pre_pin.length-1);
		jQuery("#show_member").html(pin);
		clicktimes = clicktimes - 1;
		jQuery("#show_infor").html("");
		if (clicktimes < 0) {
			return clicktimes = 0;
		}
	}
};
PrintControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	pcontr = new PrintControl();
};
jQuery(document).ready(PrintControl.main);

