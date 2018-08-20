/**

* CopyRright (c)2013: lifecycle

* Project: Report Configuration.

* Comments:  to config the rpt.

* Create Date 2013-11-14
	@version: 1.0
	@since: portal5.0 jQuery1.9.1 prototype1.5.1.2
	@author: chenrujia
*/

var rscc;
var RptSourceCharts = Class.create();
RptSourceCharts.prototype = {
	initialize: function(){
	},
	loadTables: function(sessionkey){
		var params={cmd:"LoadRptConf", sessionkey: sessionkey, status : "loadTables"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, this.loadTablesCallback);
	},
	loadTablesCallback: function(response){
		var tables = null;
		if(response.data[0].code != 0){/* code == 0 正常的返回；其他则为出错了 */
			alert(response.data[0].message);
		}else{
			tables = response.data[0].result;
			for(var i = 0; i < tables.length; i++){
				jQuery("<option value=" + tables[i][0] + ">" + tables[i][2] + "</option>")
					.appendTo("#table_selector");
			}
		}
	},
	loadColumns: function(tableId){
		var params={cmd:"LoadRptConf", tableId: tableId, status : "loadColumns"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, this.loadColumnsCallback);
	},
	loadColumnsCallback: function(response){
		var columns = null;
		var zNodes = new Array();
		if(response.data[0].code != 0){/* code == 0 正常的返回；其他则为出错了 */
			alert(response.data[0].message);
		}else{
			columns = response.data[0].result;
			for(var i = 0; i < columns.length; i++){
				var column = {name : columns[i][2],isParent:columns[i][3]!=null, id : columns[i][0], tid: columns[i][4],description : columns[i][1]};
				zNodes.push(column);
			}
			var params={cmd:"LoadRptConf", tableId:"", status : "loadColumns"};
			var trans=[{id:1, command:"com.agilecontrol.fair.FairCmd",params:params}];
			var attr = {transactions: Object.toJSON(trans)};
			rscc.setting = {
				edit:{
					enable: true,
					showRemoveBtn: false,
					showRenameBtn: false,
					drag:{
						isMove:true
					}
				},
				async: {
					enable: true,
					url:"/servlets/binserv/Fair",
					autoParam:[],
					otherParam: attr,
					dataFilter: rscc.subNodes
				},
				callback:{
					beforeAsync: function(treeId, treeNode){
						trans[0]["params"]["tableId"] = treeNode.tid;
						attr = {transactions: Object.toJSON(trans)};
						rscc.setting["async"]["otherParam"] = attr;
						jQuery.fn.zTree.getZTreeObj(treeId).setting["async"] = rscc.setting["async"];
					},
					onDrop: function(e, treeId, treeNodes, targetNode, moveType){
						var target = e.target;
						if(target.className.indexOf("droppable_field")>=0){
							var node = rscc.wrapWithParentNode(treeNodes[0]);
							var width = node.name.length * 20 + "px";
							var div = jQuery("<div></div>")
								.css("background", "#2FA1D7")
								.css("width", width)
								.css("border-radius", "10px")
								.css("color", "white")
								.css("text-align", "center");
							jQuery(target).html(div.append(node.name))
								.attr("value", node.description)
								.attr("columnid",treeNodes[0].id);
						}
					}
				}
			};
			jQuery.fn.zTree.init(jQuery("#columns_ul"), rscc.setting,zNodes);
		}
	},
	subNodes: function(treeId, parentNode, childNodes) {
		var columns = childNodes[0].result;
		var nodes = new Array();
		for(var i = 0; i < columns.length; i++){
			var column = {name : columns[i][2],isParent:columns[i][3]!=null, id : columns[i][0], tid: columns[i][4],description : columns[i][1]};
			nodes.push(column);
		}
		return nodes;
	},
	/**
	 * 递归得出节点完整名称
	 * @param treeNode
	 * @returns
	 */
	wrapWithParentNode: function(treeNode){
		if(treeNode.getParentNode()!=null){
			treeNode.getParentNode().name = treeNode.getParentNode().name.split(".")[0] + "." + treeNode.name;
			treeNode.getParentNode().description = treeNode.getParentNode().description.split("|")[0] + "|" + treeNode.description;
			return rscc.wrapWithParentNode(treeNode.getParentNode());
		}else{
			return treeNode;
		}
	}
};



RptSourceCharts.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	rscc = new RptSourceCharts();
	function resizeDiv() {
		jQuery("#choice_div,#choice_div_main").height((jQuery("#main").height()-40-220));
		jQuery("#choice_div_columns").height((jQuery("#main").height()-40-220) - 30);
	}
	resizeDiv();
	jQuery(window).resize(resizeDiv);
	
	
	jQuery("#table_selector").change(function(){
		rscc.loadColumns(this.value);
	});
	jQuery("#add_column_element").click(function(){
		var column_div = jQuery("div.column_element:first").clone();
		column_div.find(".input_field").val("");
		column_div.find(".droppable_field").html("");
		jQuery("#choice_div_main").append(column_div);
	});
	jQuery("#preview").click(function(){
		var obj = {
			desc: jQuery("#desc").val(),
			dimension: jQuery("#dimension").attr("value"),
			measure: jQuery("#measure").attr("value"),
			fmt: '￥0.00'
		};
		var params={cmd:"LoadRptConf", status : "test", obj : obj};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			jQuery('#grid_div').highcharts({
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false
		        },
		        title: {
		            text: ''
		        },
		        tooltip: {
		    	    pointFormat: '{series.name}:{point.percentage:.1f}%|{point.y}'
		        },
		        plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                dataLabels: {
		                    enabled: true,
		                    color: '#000000',
		                    connectorColor: '#000000',
		                    format: '{point.name}: {point.percentage:.1f}%|{point.y}'
		                },
		                showInLegend: true
		            }
		        },
		        legend: {
		        	align: "left",
		        	layout: "vertical",
		        	verticalAlign: "middle",
		        	itemMarginBottom: 4,
		        	itemMarginTop: 4,
		        	x : 40
		        },
		        series: [{
		            type: 'pie',
		            name: '占比',
		            data: response.data[0].result
		        }]
		    });
		});
	});
};
jQuery(document).ready(RptSourceCharts.main);