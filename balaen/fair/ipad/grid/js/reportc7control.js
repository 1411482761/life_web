var rc7;
var ReportC7Control= Class.create();
ReportC7Control.prototype = {
		initialize : function() {
			this.id;
			this.tbname;
			this.name;
			this.command="";
			this.params=new Array();
		},
		
		_load : function(id,tbname,name,command){
			this.id=id;
			this.tbname=tbname;
			this.name=name;
			this.command=command;
			this.params=[{"id":id,"dbname":name}];
			var trans = {
					id: 1,
					command: rc7.command,
					params: {
						cmd: "RptDef",
						type: "getRptViews",
						id:id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					rc7._drawhtml(response.data[0].result);
				});
		},
		_drawhtml : function(result){
			jQuery(".format select").html("");
			if(result.rpt!=undefined){
				var arr=result.rpt.views,html="";
				for(var i=0;i<arr.length;i++){
					if(arr[i].referTo=='view900')
						html+="<option value='"+arr[i].name+"'>"+arr[i].desc+"</option>";
					else
						continue;
				}
			}
			jQuery(".format select").append(html);
			if(result.def.rptname!=undefined){
				jQuery(".format select option[value='"+result.def.rptname+"']").attr("selected","selected");
			}
		},
		
		_saveRptmeasureColumnDef : function(){
			var trans = {
					id: 1,
					command: rc7.command,
					params: {
						cmd: "RptDef",
						type: "saveRptSpecialColumnDef",
						def:{
							rptname:jQuery(".format select").find("option:selected").val(),
							params:rc7.params
					},
						id:rc7.id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					rc7._load(rc7.id,rc7.tbname,rc7.name,rc7.command);
				});
		}
};
ReportC7Control.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	rc7 = new ReportC7Control();
};
jQuery(document).ready(ReportC7Control.main);