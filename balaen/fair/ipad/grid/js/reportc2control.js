var rc2;
var ReportC2Control= Class.create();
ReportC2Control.prototype = {
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
					command: rc2.command,
					params: {
						cmd: "RptDef",
						type: "getRptSpecialColumnDef",
						id:id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					rc2._drawhtml(javaData);
				});
		},
		_drawhtml : function(result){
			jQuery(".fields").html("<span>字段</span>");
			jQuery(".sumfileds").html("<span>合计字段</span>");
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
			rc2._addDom(result.columns);
			rc2._draginit(".fields",paramClone);
			var param = {
					selector : "div",
					colWidth : 125,
					autoHeight:false,
					maxHeight:null,
					minHeight:null,
					align:'left',
					gutterX: 20,
					paddingX:20,
					paddingY:20
			};
			var coln=result.def.params;
			if(coln!=undefined&&coln.length>0){
				for(var i=0;i<coln.length;i++){
					rc2.dbnames.push(coln[i]);
					jQuery(".sumfileds").append("<div exist='Y'>"+ rc2.columns[coln[i].dbname].description +"<span style=display:none;>"+coln[i].dbname+"</span></div>");
				}
			}
			rc2._draginit(".sumfileds",param);
			rc2._draginit(".trash",param);
			if(!this.isloaded){
				this.isloaded=true;
			//给容器绑定ss-added事件
			jQuery(".sumfileds").bind("ss-added",function(e,selected){
				var dom=jQuery(selected);
				var key=dom.find("span").text();
					if(rc2.dbnames.indexOf(key) != -1){
						//证明该容器已经包含该字段
						//delCopy.push(i);
						dom.remove();
					}else{
						
						rc2.dbnames.push(key);
					}
				rc2._draginit(".sumfileds",param);
			});
			jQuery(".trash").bind("ss-added",function(e,selected){
				var dbname=jQuery(selected).find("span").text();
				var index=rc2.dbnames.indexOf(dbname);
				rc2.dbnames.splice(index,index+1);
				var exist=jQuery(selected).attr("exist");
				if(exist=="Y"){
					rc2._saveRptSpecialColumnDef();
				}else{
					
				}
			});
			}
		},
		_addDom : function(result){
			for(var i =0; i < result.length; i++){
				if(result[i].id==this.id) continue;
				var type=result[i].type;
				if(type=="measure"||type.indexOf( 'component')==0){
					e="fields";
				}else{
					continue;
				}
				rc2.columns[result[i].dbname]=result[i];
				var className = "." + e;
				jQuery(className).append("<div exist='N'>"+ result[i].description +"<span style=display:none;>"+result[i].dbname+"</span></div>");
			}
		},
		_saveRptSpecialColumnDef : function(){
			var params=new Array();
			jQuery(".sumfileds  div.ss-active-child").each(function(i){
				var dbname=jQuery(this).find("span").text();
				params.push(rc2.columns[dbname]);
				});
			var trans = {
					id: 1,
					command: rc2.command,
					params: {
						cmd: "RptDef",
						type: "saveRptSpecialColumnDef",
						def:{
							params:params
					},
						id:rc2.id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					rc2._load(rc2.id,rc2.command);
				});
		}
};
ReportC2Control.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	rc2 = new ReportC2Control();
};
jQuery(document).ready(ReportC2Control.main);