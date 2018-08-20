var bcl;
var BasicrptcolumnsControl= Class.create();
BasicrptcolumnsControl.prototype = {
		initialize : function() {
			this.command="";
			this.reftables=new Object();
			this.index=0;
			this.tbname="";
			this.columns = new Hash();
		},
		load : function(command,index,tbname){
			jQuery(".colslist").html("");
			this.command=command;
			this.index=index;
			this.tbname=tbname;
			var trans = {
					id: 1,
					command: bcl.command,
					params: {
						cmd: "RptDef",
						type: "loadBasicRpt"
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					bcl._getTreeColumns(javaData);
				});
		},
		_getTreeColumns : function(result){
		bcl.reftables=result;
		var setting = {
					async: {
						enable: true,
						contentType: "application/json",
						url:"/servlets/binserv/Request",
						autoParam:[{"id": 1, "command": "com.agilecontrol.phone.MiscCmd", "params": {"cmd": "GetColumnsTree","table":bcl.tbname}}],
						otherParam:["rftTable","c"],
						dataFilter: filter
					},
					data:{
						key:{
							title:"id"
						}
					}
				};
			jQuery.fn.zTree.init(jQuery("#columnstree"), setting);
			bcl._drawHtml(result);
		},
		_addCol : function(){
			var dom=jQuery(".curSelectedNode"),html="";
			if(dom.find("span:eq(1)").html()!=undefined){
				html+="<span title='"+dom.attr("title")+"' onclick='bcl._selectcol(this)';>"+dom.find("span:eq(1)").html()+"</span>"
			}else{
				alert("请选择字段");
			}
			if(this.columns[dom.attr("title")]==undefined||this.columns[dom.attr("title")]==""){
				this.columns[dom.attr("title")]=dom.find("span:eq(1)").html();
				jQuery(html).appendTo(".colslist");
				jQuery(".colslist span").removeClass("on");
				jQuery(".colslist span:last").addClass("on");
				jQuery(".colslist span:last").data("data",{can_be_row:"Y",description:dom.find("span:eq(1)").html(),dbname:dom.attr("title"),type:"dimension",tablename:bcl.tbname});
				jQuery(".coldesc").val(dom.find("span:eq(1)").html());
				jQuery(".canberow").find("option[value='Y']").prop("selected","selected");
			}
			
		},
		_removeCol : function(){
			this.columns[jQuery(".on").attr("title")]="";
			jQuery(".on").remove();
			jQuery(".colslist span").eq(0).trigger("click");
		},
		_drawHtml : function(result){
			var arr=result.columns.basic[this.index].columns
			for(var i=0;i<arr.length;i++){
				jQuery("<span title='"+arr[i].dbname+"' onclick='bcl._selectcol(this)';>"+arr[i].description+"</span>").appendTo(".colslist");
				jQuery(".colslist span:last").data("data",{can_be_row:arr[i].can_be_row,description:arr[i].description,dbname:arr[i].dbname,type:arr[i].type,tablename:bcl.tbname});
			}
			jQuery(".colslist span").eq(0).trigger("click");
			jQuery(".coldesc").blur(function(){
				bcl._updatecoldetails();
			});
			jQuery('select').change(function(){
				bcl._updatecoldetails();
			});
		},
		_updatecoldetails : function(){
			jQuery(".on").html(jQuery(".coldesc").val());
			jQuery(".on").data("data").can_be_row=jQuery(".canberow").find("option:selected").val();
			jQuery(".on").data("data").description=jQuery(".coldesc").val();
			jQuery(".on").data("data").type=jQuery(".coltype").val();
		},
		moveup : function(){
			var onthis=jQuery(".on");
			var prev=onthis.prev();
			onthis.insertBefore(prev);
		},
		movedown : function(){
			var onthis=jQuery(".on");
			var after=onthis.next();
			onthis.insertAfter(after);
		},
		_selectcol : function(dom){
			jQuery(".canberow").find("option:selected").prop("selected",false);
			if(jQuery(dom).hasClass("on")){
				return;
			}else{
				jQuery(dom).parent().children().removeClass("on");
				jQuery(dom).addClass("on");
				var data=jQuery(dom).data("data");
				jQuery(".coldesc").val(data.description);
				jQuery(".canberow").find("option[value='"+data.can_be_row+"']").prop("selected","selected");
				jQuery(".coltype").find("option[value='"+data.type+"']").prop("selected","selected");
			}
		},
		_savetablecols : function(){
			var dom=jQuery(".colslist");
			var len=dom.find("span").length;
			var columns=new Array();
			for(var i=0;i<len;i++){
				columns.push(dom.find("span:eq("+i+")").data("data"));
			}
			bcl.reftables.columns.basic[this.index].columns=columns;
				var trans = {
						id: 1,
						command: bcl.command,
						params: {
							cmd: "RptDef",
							type: "saveRefTable",
							data:bcl.reftables,
							table:bcl.reftables.columns.basic[bcl.index]
						}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					bcl.load(bcl.command,bcl.index,bcl.tbname);
				});
			
		},
		_deletetableconfig : function(){
			var index=jQuery(".on").index();
			bcl.reftables.columns.basic.splice(index,1);
			bcl._savetableconfig(true);
		}
};
BasicrptcolumnsControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	bcl = new BasicrptcolumnsControl();
};
jQuery(document).ready(BasicrptcolumnsControl.main);
function filter(treeId, parentNode, childNodes) {
if (!childNodes) return null;
var nodes=childNodes[0].result.conditions;
for (var i=0, l=nodes.length; i<l; i++) {
	nodes[i].name = nodes[i].d;
	nodes[i].id = nodes[i].c;
}
return nodes;
} 