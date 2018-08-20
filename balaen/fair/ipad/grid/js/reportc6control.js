var rc6;
var ReportC6Control= Class.create();
ReportC6Control.prototype = {
		initialize : function() {
			this.id;
			this.columns=new Hash();
			this.isloaded = false;
			this.dbnames=new Array();
			this.command="";
		},
		_draginit : function(id,params){
			jQuery(id).shapeshift(params);
		},
		_load : function(id,command){
			this.id=id;
			this.command=command;
			var trans = {
					id: 1,
					command: rc6.command,
					params: {
						cmd: "RptDef",
						type: "getRptSpecialColumnDef",
						id:id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					rc6._drawhtml(javaData);
				});
		},
		_drawhtml : function(result){
			jQuery(".dim").html("<span>字段</span>");
			var paramClone = {
					selector : "div",
					colWidth : 125,
					autoHeight:false,
					maxHeight:null,
					minHeight:null,
					align:'left',
					gutterX: 20,
					paddingX:20,
					paddingY:20,
					dragClone:true,
					enableTrash: false,
					enableCrossDrop:false
				};
			rc6._addDom(result.columns);
			rc6._draginit(".dim",paramClone);
			var param = {
					selector : "div",
					colWidth : 125,
					autoHeight:false,
					maxHeight:'38px',
					minHeight:'38px',
					align:'center',
					gutterX: 0,
					gutterY: 10,
					paddingX:0,
					paddingY:1,
					columns:1
				};
			var coln=result.def.params;
			if(coln!=undefined&&coln.length>0){
				    if(coln[0]!=undefined)
				    	jQuery(".coln-a").append("<div>"+ rc6.columns[coln[0].dbname].description +"<span style=display:none;>"+coln[0].dbname+"</span></div>");
			}
			rc6._draginit(".coln-a",param);
			if(result.def.formula!=undefined){
				jQuery(".define input").val(result.def.formula);
			}
			if(result.def.fmt!=undefined){
				jQuery(".layout select option[value='"+result.def.fmt+"']").attr("selected","selected");
			}
			if(!this.isloaded){
				this.isloaded=true;
			//给容器绑定ss-added事件
				jQuery(".coln-a").bind("ss-added",function(e,selected){
					var select=jQuery(selected);
						jQuery(".coln-a").html("");
						jQuery(".coln-a").append(select);
						rc6._draginit(".coln-a",param);
				});
			}
		},
		_addDom : function(result){
			for(var i =0; i < result.length; i++){
				if(result[i].id==this.id) continue;
				var type=result[i].type;
				if(type=="col"){
					e="dim";
				}else{
					continue;
				}
				rc6.columns[result[i].dbname]=result[i];
				var className = "." + e;
				jQuery(className).append("<div exist='N'>"+ result[i].description +"<span style=display:none;>"+result[i].dbname+"</span></div>");
			}
		},
		_saveRptSpecialColumnDef : function(){
			var params=new Array();
			var key1=jQuery(".coln-a div span").text();
			params.push(this.columns[key1]);
			var formula=jQuery(".define input").val();
			var trans = {
					id: 1,
					command: rc6.command,
					params: {
						cmd: "RptDef",
						type: "saveRptSpecialColumnDef",
						def:{
							params:params,
							formula:formula,
							fmt:jQuery(".layout select").find("option:selected").val(),
					},
						id:rc6.id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					rc6._load(rc6.id,rc6.command);
				});
		}
};
ReportC6Control.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	rc6 = new ReportC6Control();
};
jQuery(document).ready(ReportC6Control.main);