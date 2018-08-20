/**

* CopyRright (c)2013: lifecycle

* Project: Report Configuration.

* Comments:  to config the rpt.

* Create Date 2013-11-14
	@version: 1.0
	@since: portal5.0 jQuery1.9.1 prototype1.5.1.2
	@author: chenrujia
*/

var rscg;
var RptSourceGrid = Class.create();
RptSourceGrid.prototype = {
	initialize: function(){
	},
	drawTh: function(num){
		var pattern1 = jQuery('<div class = "th"><div style="width: 90px;height: 42px;"></div></div>');
		var pattern2 = jQuery('<div class = "th"><div style="width: 88px;height: 20px;"></div><div style="width:43px;height:20px;"></div><div style="width:43px;height:20px;"></div></div>');
		var pattern3 = jQuery('<div class = "th"><div style="width: 88px;height: 20px;"></div><div style="width:28px;height:20px;"></div><div style="width:28px;height:20px;"></div><div style="width:28px;height:20px;"></div></div>');
		var pattern4 = jQuery('<div class = "th"><div style="width: 86px;height: 20px;"></div><div style="width:20px;height:20px;"></div><div style="width:20px;height:20px;"></div><div style="width:20px;height:20px;"></div><div style="width:20px;height:20px;"></div></div>');
		jQuery("#table").append(eval("pattern"+num));
	}
};



RptSourceGrid.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	rscg = new RptSourceGrid();
	function resizeDiv() {
		jQuery("#choice_div,#choice_div_main").height((jQuery("#main").height()-40-220));
		jQuery("#choice_div_columns").height((jQuery("#main").height()-40-220) - 30);
	}
	resizeDiv();
	jQuery(window).resize(resizeDiv);
	jQuery("#add_column_element").click(function(){
		var column_div = jQuery("div.column_element:first").clone();
		column_div.find(".input_field").val("");
		column_div.find(".droppable_field").html("");
		jQuery("#choice_div_main").append(column_div);
	});
	
	jQuery(".pattern").draggable({
		appendTo: 'body',
		containment: '#main',
		revert: true,
		helper: "original",
		distance: 20,
		start:function(){
			jQuery(this).attr("src",jQuery(this).attr("src").replace(".png", "_selected.png"));
		},
		stop:function(){
			jQuery(this).attr("src",jQuery(this).attr("src").replace("_selected", ""));
		}
	});
	
	jQuery("#grid_div").droppable({
		drop: function(event, ui){
			rscg.drawTh(jQuery(ui.draggable).attr("num"));
		}
	});
};
jQuery(document).ready(RptSourceGrid.main);