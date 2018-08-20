/**

* CopyRright (c)2013: lifecycle

* Project: Report Configuration.

* Comments:  to config the rpt.

* Create Date 2013-11-14
	@version: 1.0
	@since: portal5.0 jQuery1.9.1 prototype1.5.1.2
	@author: chenrujia
*/

var table_dropdown;
var TableDropdown = Class.create();
TableDropdown.prototype = {
	initialize: function(){
		this.currentTables;
	},
	loadTableResources: function(sessionkey){
		var params={cmd:"LoadRptConf", sessionkey: sessionkey, status : "loadTableResources"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, table_dropdown.loadTableResourcesCallback);
	},
	loadTables: function(tables){
		var params={cmd:"LoadRptConf",tables: tables, status : "loadTables"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, table_dropdown.loadTablesCallback);
	},
	loadTablesCallback: function(response){
		var tables = null;
		if(response.data[0].code != 0){/* code == 0 正常的返回；其他则为出错了 */
			alert(response.data[0].message);
		}else{
			tables = response.data[0].result;
			jQuery("#table_selector").html("<option value='-1'>----------请选择------------</option>");
			for(var i = 0; i < tables.length; i++){
				jQuery("<option value=" + tables[i][0] + ">" + tables[i][2] + "</option>")
					.appendTo("#table_selector");
			}
		}
	},
	loadTableResourcesCallback: function(response){
		if(response.data[0].code != 0){/* code == 0 正常的返回；其他则为出错了 */
			alert(response.data[0].message);
		}else{
			var result = response.data[0].result;
			for(var i = 0; i< result.length; i++){
				table_dropdown.currentTables = result[i];
				var div = jQuery("<div>"+result[i].description+"</div>")
					.css("background-color","#2D80AF")
					.css("color","white")
					.css("display","inline-block")
					.css("border-radius","4px")
					.css("margin","2px")
					.css("padding","4px 4px")
					.css("cursor","pointer")
					.css("border","1px gray solid")
					.click(result[i],function(obj){
						table_dropdown.currentTables = obj.data;
						jQuery("#table_main > div > div").css("border","1px gray solid");
						jQuery(this).css("border","1px black solid");
						table_dropdown.loadTables();
					});
				jQuery("#table_main > div").append(div);
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
			table_dropdown.setting = {
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
					dataFilter: table_dropdown.subNodes
				},
				callback:{
					beforeAsync: function(treeId, treeNode){
						trans[0]["params"]["tableId"] = treeNode.tid;
						attr = {transactions: Object.toJSON(trans)};
						table_dropdown.setting["async"]["otherParam"] = attr;
						jQuery.fn.zTree.getZTreeObj(treeId).setting["async"] = table_dropdown.setting["async"];
					},
					onDrop: function(e, treeId, treeNodes, targetNode, moveType){
						var target = e.target;
						var node = table_dropdown.wrapWithParentNode(treeNodes[0]);
						var width = node.name.length * 20 + "px";
						var div = jQuery("<div></div>")
							.css("background", "#2FA1D7")
							.css("width", width)
							.css("border-radius", "10px")
							.css("color", "white")
							.css("text-align", "center");
						
						if(target.className.indexOf("droppable_field")>=0){
							if(target.parentNode.className.indexOf("droppable_field")>=0){
								target = target.parentNode;
							}
							jQuery(target).html(div.append(node.name))
								.attr("val", node.description)
								.attr("columnid",treeNodes[0].id);
						}
					}
				}
			};
			jQuery.fn.zTree.init(jQuery("#columns_ul"), table_dropdown.setting,zNodes);
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
			return table_dropdown.wrapWithParentNode(treeNode.getParentNode());
		}else{
			return treeNode;
		}
	}
};



TableDropdown.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	table_dropdown = new TableDropdown();
	jQuery("#table_selector").change(function(){
		table_dropdown.loadColumns(this.value);
	});
};
jQuery(document).ready(TableDropdown.main);