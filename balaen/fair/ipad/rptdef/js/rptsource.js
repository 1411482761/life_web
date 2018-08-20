/**

* CopyRright (c)2013: lifecycle

* Project: Report Configuration.

* Comments:  to config the rpt.

* Create Date 2013-11-14
	@version: 1.0
	@since: portal5.0 jQuery1.9.1 prototype1.5.1.2
	@author: chenrujia
*/

var rsc;
var RptSource = Class.create();
RptSource.prototype = {
	initialize: function(){
	}
};

RptSource.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	rsc = new RptSource();
	function resizeDiv() {
		jQuery("#choice_div,#choice_div_main").height((jQuery("#main").height()-40-220));
		jQuery("#choice_div_columns").height((jQuery("#main").height()-40-220) - 60);
	}
	resizeDiv();
	jQuery(window).resize(resizeDiv);
	
	jQuery("#add_column_element").click(function(){
		var column_div = jQuery("div.column_element:first").clone();
		column_div.find(".input_field").val("");
		column_div.find(".input_field").attr("val","");
		column_div.find(".droppable_field").html("");
		jQuery("#choice_div_main").append(column_div);
	});
	jQuery("#preview").click(function(){
		var measures = new Array();
		var tables = new Array();
		jQuery("div[name=measure]").each(function(){
			measures.push(jQuery(this).attr("val"));
		});
		var obj = {
			desc: jQuery("#desc").val(),
			dimension: jQuery("#dimension").attr("val"),
			measure: measures,
			fmt: '￥0.00',
			currentTables: table_dropdown.currentTables
		};
		jQuery(".droppable_field").each(function(){
			tables.push(jQuery(this).attr("val").split(".")[0]);
		});
		var multi = tables.unique().length>1;
		var column_desc = jQuery("input[name=column_desc]");
		var params={cmd:"LoadRptConf", status : multi?"test3":"test2", obj : obj};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			var result = response.data[0].result;
			var series = [];
			var categories = [];
			for(var i = 0; i < result.length; i++){
				series[i] = {
					name: jQuery(column_desc[i]).val(),
					data: result[i],
					type: jQuery("select[name=show_type]:eq("+i+")").val()
				};
			}
			for(var i = 0; i <result[0].length; i++){
				categories[i] = result[0][i][0];
			}
			jQuery('#grid_div').highcharts({
		        chart: {
		        	type: 'column',
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false
		        },
		        title:{
		        	text:''
		        },
		        xAxis: {
		        	categories: categories
		        },
		        series: series
		    });
		});
	});
};
jQuery(document).ready(RptSource.main);