/**

* CopyRright (c)2013: lifecycle

* Project: Report Configuration.

* Comments:  to config the rpt.

* Create Date 2013-11-14
	@version: 1.0
	@since: portal5.0 jQuery1.9.1 prototype1.5.1.2
	@author: chenrujia
*/

var rc;
var RptCenter = Class.create();
RptCenter.prototype = {
	initialize: function(){
	},
	
	iteratorRpts: function(sessionkey){
		var params={cmd:"LoadRptConf", sessionkey: sessionkey, status : "loadRpt"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, this.iteratorRptsCallback);
	},
	iteratorRptsCallback: function(response){
		var target = null;
		var t = null;
		if(response.data[0].code != 0){/* code == 0 正常的返回；其他则为出错了 */
			alert(response.data[0].message);
		}else{
			var views = response.data[0].result.views;
			var delConfirm = jQuery("#del_confirm").dialog({
				autoOpen: false,
				modal: true,
				resizable: false,
				draggable: false,
				buttons: {
					"取消": function(){
						jQuery(this).dialog("close");
					},
					"确定": function(){
						target.remove();
						jQuery(this).dialog("close");
					}
				}
			});
			var newRptForm = jQuery("#new_rpt_form").dialog({
				autoOpen: false,
				modal: true,
				resizable: false,
				draggable: false,
				width: 240,
				height: 300,
				buttons: {
					"取消": function(){
						jQuery(this).dialog("close");
					},
					"确定": function(){
						jQuery('<div class="rpt_item">'+
								'<img src="images/del.png" style="position: relative;left: 110px;top: -2px;cursor: pointer;float: left;display: none"/>'+
								'<div class="rpt_frame"></div><div style="color: #308ABF">'+jQuery("#name").val()+
								'</div><div style="color: gray">'+jQuery("#id").val()+'</div></div>')
								.appendTo(jQuery('#rpt_list'))
								.click(function() {
									t = {name: jQuery("#name").val(), id: jQuery("#id").val()};
									jQuery("#rpt_conf_title").text("报表信息("+t.name+")");
									jQuery(".rpt_item").children("img").hide();
									jQuery(this).children("img").show();
								})
								.children('img')
								.click(function() {
									target = jQuery(this).parent();
									delConfirm.dialog("open");
								});
						views.push(t);
						jQuery(this).dialog("close");
					}
				},
				open : function() {
					jQuery(this).bind("keypress.ui-dialog",function(event) {
						if(event.keyCode == jQuery.ui.keyCode.ENTER) {
							//console.log(jQuery(this).parent().find("button").last().click());
						}
					});
				}
			});
			jQuery(views).each(function(index) {
				//
				jQuery('<div class="rpt_item">'+
						'<img src="images/del.png"/>'+
						'<div class="rpt_frame"><img src="'+this.img+'"/></div><div style="color: #308ABF">'+this.desc+
						'</div><div style="color: gray">'+this.name+'</div></div>')
						.appendTo(jQuery('#rpt_list'))
						//点击报表
						.click(function() {
							t = views[index];
							jQuery("#rpt_conf_title").text("报表信息("+t.referTo+")");
							jQuery(".rpt_item").children("img").hide();
							jQuery(this).children("img").show();
						})
						.children('img')
						.click(function() {
							target = jQuery(this).parent();
							delConfirm.dialog("open");
						});
			});
			jQuery("#new_rpt").click(function(){
				newRptForm.dialog("open");
			});
		}
	}
};



RptCenter.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	rc = new RptCenter();
	function divSize() {
		jQuery("#rpt_container").height(jQuery("#main").height()-40);
		jQuery("#rpt_conf").height(jQuery("#main").height()-40);
		jQuery("#rpt_list").height(jQuery("#rpt_container").height()-30);
		jQuery("#rpt_conf_list").height(jQuery("#rpt_conf").height()-jQuery("#rpt_conf_title").height()-jQuery("#rpt_conf_tail").height());
	}
	divSize();
	jQuery(window).resize(divSize);
	jQuery("#rpt_list").sortable({
		revert: true,
		scrollx: false,
        helper: "clone"
	});
	jQuery("#rpt_conf_tail button").click(function() {
		window.location = "/fair/ipad/rptdef/rpt_settings.jsp";
	});
};
jQuery(document).ready(RptCenter.main);