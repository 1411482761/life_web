var weChatC;
weChatQrcodeControl = Class.create();
// define constructor
weChatQrcodeControl.prototype = {
		initialize: function() {
			//this methond will be called when class initialized

		},
		load:function(){
			jQuery('#qrcode').html("生成二维码中...");
			var request = {
					id:1,
					command: "com.agilecontrol.fair.FairCmd",
					params: {
						cmd: "WeChatQrcode"
					}
				};

			portalClient.sendOneRequest(request, function(response){
				jQuery('#qrcode').html("");
				var data=response.data[0];
				if(data.result.error!=undefined){
					jQuery('qrcodemain').hide();
				} else {
					jQuery('#rptSyncTime').html(data.result.time);
					jQuery('#qrcode').qrcode(utf16to8(data.result.url));
				}
				
			
			});
			
		}
};

function utf16to8(str) {  
    var out, i, len, c;  
    out = "";  
    len = str.length;  
    for(i = 0; i < len; i++) {  
    c = str.charCodeAt(i);  
    if ((c >= 0x0001) && (c <= 0x007F)) {  
        out += str.charAt(i);  
    } else if (c > 0x07FF) {  
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));  
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));  
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
    } else {  
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));  
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
    }  
    }  
    return out;  
}  

weChatQrcodeControl.main = function () {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	weChatC=new weChatQrcodeControl();
	weChatC.load();
};
jQuery(document).ready(weChatQrcodeControl.main);