var imgs;
var Images = Class.create();
Images.prototype = {
	initialize : function(pdtId) {
		this.pdtId = pdtId;
	},
	list : function() {
		var req = {
			id : 1,
			command : "com.agilecontrol.fair.MiscCmd",
			params : {
				cmd : "ProductImagesB2B",
				method : "productImageList",
				param : {
					pdtId : this.pdtId
				}
			}
		};
		portalClient.sendOneRequest(req, function(response) {
			if (response.data[0].code == 0) {
				jQuery("#selectAll").attr("checked", false);
				jQuery(response.data[0].result).each(function() {
						jQuery("#list").append('<div class="item">' +
								'<a href="javascript:imgs.showImg(\'' + this.uuid + '.' + this.ext + '\');" class="pic">' +
								'<img src="/pdt/b2b/' + this.uuid + '.' + this.ext + '?tempid='+Math.random()+'"/></a>' +
								'<input name="checkbox" type="checkbox" value="' + this.id + '" class="checkbox"/>' +
								'<a class="name">' + this.uuid + '.' + this.ext + '</a></div>');

				});
			} else {
				alert("查询失败！\n错误信息：" + response.data[0].message);
			}
		});

	},
	add : function() {
		/*window.open("upload.jsp?pdtId=" + this.pdtId, "newwindow",
				"height=480,width=640,top=100,left=200,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no") */
		location="upload.jsp?pdtId=" + this.pdtId;
	},
	remove : function() {
		var arr = new Array();
		jQuery("#list .item input[type=checkbox]:checked").each(function() {
			arr.push(jQuery(this).val());
		});
		var req = {
			id : 1,
			command : "com.agilecontrol.fair.MiscCmd",
			params : {
				cmd : "ProductImagesB2B",
				method : "removeImages",
				param : {
					pdtId : this.pdtId,
					pdtImages : arr
				}
			}
		};
		portalClient.sendOneRequest(req, function(response) {
			jQuery(response.data[0].result).each(function() {
				jQuery(arr).each(function() {
					jQuery('#list .item input[value="' + this + '"]').parent().remove();
				});
			});
		});
	},
	move : function(direction) {
		if(direction == "left"){
			jQuery("#list .item input[type=checkbox]:checked").each(function() {
				var item = jQuery(this).parent();
				item.prev().before(item);		
			});
		} else {
			var len=jQuery("#list .item input[type=checkbox]:checked").length;
			for(var i=1;i<=len;i++){
				var item=jQuery("#list .item input[type=checkbox]:checked").eq(-i).parent();
				item.next().after(item);
			}
		}
		var arr = new Array();
		jQuery("#list .item input[type=checkbox]").each(function() {
			arr.push(jQuery(this).val());
		});
		var req = {
			id : 1,
			command : "com.agilecontrol.fair.MiscCmd",
			params : {
				cmd : "ProductImagesB2B",
				method : "sortImages",
				param : {
					pdtId : this.pdtId,
					pdtImages : arr
				}
			}
		};
		portalClient.sendOneRequest(req, function(response) {
			
		});
	},
	selectAll : function() {
		if (jQuery("#selectAll").attr("checked") == "checked") {
			jQuery("#list .item input[type='checkbox']").attr("checked", "checked");
		} else {
			jQuery("#list .item input[type='checkbox']").removeAttr("checked");
		}
	},
	back : function() {
		location='index.jsp';
	},
	showImg : function(img) {
		jQuery("#viewer").html("<img onclick='imgs.hideImg();'/>");
		jQuery("#viewer img").attr("src", "/pdt/l/"+img).load(function() {
			var imgW = this.width;
			var imgH = this.height;
			var ratioImg = imgW / imgH;
			var wndW = jQuery(window).width();
			var wndH = jQuery(window).height();
			var ratioWnd = wndW / wndH;
			if (ratioImg > ratioWnd) {
				this.width = wndW;
				this.height = this.width / ratioImg;
			} else {
				this.height = wndH;
				this.width = this.height * ratioImg;
			}
		});
		jQuery("#viewer").fadeIn(100);
		
	},
	hideImg : function(e) {
		jQuery("#viewer").fadeOut(200);
	}
}
Images.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
};
jQuery(document).ready(Images.main);
