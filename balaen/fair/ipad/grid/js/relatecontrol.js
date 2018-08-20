var relc;
var RelateControl= Class.create();
RelateControl.prototype = {
		initialize : function() {
			this.isloaded = false;
			this.command="";
			this.relations = new Hash();
			this.modify = new Hash();
			this.tbname="";
		},
		_load :function(tbname,command){
			this.relations = new Hash();
			this.modify = new Hash();
			this.command=command;
			this.tbname=tbname;
			jQuery("#relationcolumns ul").html("");
			var trans = {
					id: 1,
					command: relc.command,
					params: {
						cmd: "RptDef",
						type: "getRptMetaColumns"
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					relc._drawHtml(javaData);
				});
				var trans = {
						id: 1,
						command: relc.command,
						params: {
							cmd: "RptDef",
							type: "getRelationColumns",
							tbname:tbname
						}
					};
					portalClient.sendOneRequest(trans, function(response){
						var javaData= response.data[0].result;
						var columns=javaData.columns;
						for(var i=0;i<columns.length;i++){
							jQuery("#relationcolumns ul").append("<li onclick=relc._clickrelations(this)>" +
									"<span dbname='"+columns[i].col1_dbname+"' tbname='"+columns[i].col1_tbname+"'>"+columns[i].col1_desc+"</span>" +
											"<=>" +
											"<span dbname='"+columns[i].col2_dbname+"' tbname='"+columns[i].col2_tbname+"'>"+columns[i].col2_desc+"</span></li>");
							relc.relations[columns[i].col1_tbname+"+"+columns[i].col1_dbname+"+"+columns[i].col2_tbname+"+"+columns[i].col2_dbname]={
									col1_dbname:columns[i].col1_dbname,
									col1_tbname:columns[i].col1_tbname,
									col1_desc:columns[i].col1_desc,
									col2_dbname:columns[i].col2_dbname,
									col2_tbname:columns[i].col2_tbname,
									col2_desc:columns[i].col2_desc
							};
						}
					});
		},
		_drawHtml : function(result){
			var counts = 0;
			for(var i = 0;i < result.columns.basic.length; i++){
				spanElem = "<span class='config' onclick=relc._drawcolumns('basic',this)>"+ result.columns.basic[i].groupname +"</span>";
				jQuery("#tables").append(spanElem);
				jQuery("#tables span").eq(i).data("data",{columns:result.columns.basic[i].columns,name:result.columns.basic[i].name,groupname:result.columns.basic[i].groupname});
				counts++;
			}
			if(result.tables!=undefined&&result.tables.length>0){
				for(var i = 0;i < result.tables.length; i++){
					spanElem = "<span class='notconfig' tname="+result.tables[i].name+" onclick=relc._drawcolumns('Z_IDX',this)>"+ result.tables[i].description +"</span>";
					jQuery("#tables").append(spanElem);
					jQuery("#tables span").eq(counts+i).data("data",{name:result.tables[i].name,groupname:result.tables[i].description});
					counts++;
				}
			}
			jQuery("#tables span").eq(0).trigger("click");
		},
		_drawcolumns : function(type,dom){
			jQuery("#tables span").removeClass("on");
			jQuery(dom).addClass("on");
			jQuery("#columnstree").html("");
			if(type=="basic"){
				var column=jQuery(dom).data("data").columns;
				for(var i = 0; i < column.length; i++){
					var divElem = "";
					if("" != column[i].type && 'undefined' != column[i].type)
						type = column[i].type;
						divElem = "<span onclick=relc._selectcol(this)>"+ column[i].description +"</span>";
						jQuery("#columnstree").append(divElem);
						jQuery("#columnstree span").eq(i).data("data",{description:column[i].description,dbname:column[i].dbname.toUpperCase()});
				}
			}else if(type=="Z_IDX"){
				var table_name=jQuery(dom).attr("tname");
				var trans = {
						id: 1,
						command: relc.command,
						params: {
							cmd: "RptDef",
							type: "getTableDef",
							name:table_name
						}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					var column=javaData.columns;
					var j=0;
					for(var i = 0; i < column.length; i++){
						var divElem = "";
						if("" != column[i].type && 'undefined' != column[i].type)
							type = column[i].type;
							divElem = "<span onclick=relc._selectcol(this)>"+ column[i].description +"</span>";
							jQuery("#columnstree").append(divElem);
							jQuery("#columnstree span").eq(i).data("data",{description:column[i].description,dbname:column[i].dbname.toUpperCase()});
					}
				});
			}else{
				alert("Inner Error!");
			}
			jQuery("#columnstree span").eq(0).trigger("click");
		},
		_selectcol : function(dom){
			jQuery("#columnstree span").removeClass("on");
			jQuery(dom).addClass("on");
		},
		_addCol : function(type){
				jQuery(".col"+type).html("<span tbname='"+jQuery("#tables .on").data("data").name+"' dbname='"+jQuery("#columnstree .on").data("data").dbname+"'>"+jQuery("#columnstree .on").html()+"</span>");
		},
		_setMainTable:function(){
			var trans = {
					id: 1,
					command: relc.command,
					params: {
						cmd: "RptDef",
						type: "setMainTable",
						maintable:jQuery("#tables span.on").data("data").name,
						tbname:relc.tbname
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					alert(response.data[0].message);
				});
		},
		_buildrelation : function(){
			var col1=jQuery(".col1"),col2=jQuery(".col2");
			if(col1.find("span").attr("tbname")==undefined || col2.find("span").attr("tbname")==undefined || col1.find("span").attr("tbname")==col2.find("span").attr("tbname")){
				alert("请选择不同表的两个字段");
			}else{
				var key1=col1.find("span").attr("tbname")+"+"+col1.find("span").attr("dbname");
				var key2=col2.find("span").attr("tbname")+"+"+col2.find("span").attr("dbname");
				if((this.modify[key1+"+"+key2]==undefined || this.modify[key1+"+"+key2]=="") && (this.modify[key2+"+"+key1]==undefined || this.modify[key2+"+"+key1]=="")){
					this.modify[key1+"+"+key2]={
							col1_dbname:col1.find("span").attr("dbname"),
							col1_tbname:col1.find("span").attr("tbname"),
							col2_dbname:col2.find("span").attr("dbname"),
							col2_tbname:col2.find("span").attr("tbname")
					};
					jQuery("#relationcolumns ul").append("<li onclick=relc._clickrelations(this)>"+col1.html()+"<=>"+col2.html()+"</li>");
				}
			}
		},
		_removerelation : function(){
			var dom=jQuery("#relationcolumns ul li span.on").parent();
			var col1_dbname=dom.find("span:eq(0)").attr("dbname"),col1_tbname=dom.find("span:eq(0)").attr("tbname"),col1_desc=dom.find("span:eq(0)").html();
			var col2_dbname=dom.find("span:eq(1)").attr("dbname"),col2_tbname=dom.find("span:eq(1)").attr("tbname"),col2_desc=dom.find("span:eq(1)").html();
			var key1=col1_tbname+"+"+col1_dbname,key2=col2_tbname+"+"+col2_dbname;
			if(this.relations[key1+"+"+key2]==undefined&&this.relations[key2+"+"+key1]==undefined){
				this.modify[key1+"+"+key2]="";
			}else{
				this.modify[key1+"+"+key2]={
						isdelete:"Y",
						col1_dbname:col1_dbname,
						col1_tbname:col1_tbname,
						col2_dbname:col2_dbname,
						col2_tbname:col2_tbname,
				}
			}
			dom.remove();
		},
		_clickrelations : function(dom){
			jQuery("#relationcolumns ul li span").removeClass("on");
			jQuery(dom).find("span").addClass("on");
		},
		_saverelations : function(){
			var tojava = new Array(),iterator2 = this.modify,iterator = iterator2.keys();
			for ( var i = 0; i < iterator.length; i++) {
				if(iterator2[iterator[i]]!="")
				tojava.push(iterator2[iterator[i]]);
			}
			var trans = {
					id: 1,
					command: relc.command,
					params: {
						cmd: "RptDef",
						type: "saveRelationColumns",
						columns:tojava,
						tbname:relc.tbname
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					alert(response.data[0].message);
					relc._load(relc.tbname,relc.command);
				});
		}
};
RelateControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	relc = new RelateControl();
};
jQuery(document).ready(RelateControl.main);