/**

* CopyRright (c)2013: lifecycle

* Project: Report Configuration.

* Comments:  to config the rpt.

* Create Date 2013-11-14
	@version: 1.0
	@since: portal5.0 jQuery1.9.1 prototype1.5.1.2
	@author: chenrujia
*/

var rs;
var RptSetting = Class.create();
RptSetting.prototype = {
	initialize: function(){
	}
};



RptSetting.main = function(){
	rs = new RptSetting();
	
	function divSize() {
		jQuery("#pattern_div").height(jQuery("#main").height()-40);
		jQuery("#pattern_list").height(jQuery("#pattern_div").height()-50);
		jQuery("#view_div").height(jQuery("#main").height()-40);
		jQuery("#view_tab").height(jQuery("#view_div").height()-120);
		jQuery("#opt_div").height(jQuery("#main").height()-40);
	}
	divSize();
	jQuery(window).resize(divSize);
	
	jQuery(".pattern_item").draggable({
		revert: "invalid",
		appendTo: 'body',
		containment: '#main',
		scroll: false,
		helper: 'clone'
	});
	jQuery("#opt_title").buttonset();
	var cnt = 0;
	var tabTemplate = '<li><a href="#{href}">{tabName}</a><span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>';
	var viewTab = jQuery("#view_tab")
		.tabs()
		.disableSelection();
	viewTab.children("div").droppable({
		drop : function(event, ui) {
			jQuery(this).html(ui.draggable.clone());
		}
	});
	var newTabDialog = jQuery("#new_tab").dialog({
		autoOpen : false,
		buttons : {
			"取消": function(){
				jQuery(this).dialog("close");
			},
			"确定": function(){
				jQuery(tabTemplate.replace(/#\{href\}/g, "#tab"+cnt).replace(/\{tabName\}/g, jQuery("#name").val()))
					.appendTo("#view_tab ul")
					.children(".ui-icon-close")
					.click(function() {
						jQuery(jQuery(this).siblings("a").attr("href")).remove();
						jQuery(this).parent().remove();
					});
				// 这里再次设置了droppable
				jQuery("<div id='tab"+cnt+"'></div>").droppable({
					drop : function(event, ui) {
						jQuery(this).html(ui.draggable.clone());
					}
				}).appendTo(viewTab);
				cnt++;
				viewTab.tabs("refresh");
				jQuery(this).dialog("close");
			}
		},
		modal : true
	});
	jQuery("#view_tab .ui-icon-plus")
		.click(function() {
			newTabDialog.dialog("open");
		});
};
jQuery(document).ready(RptSetting.main);