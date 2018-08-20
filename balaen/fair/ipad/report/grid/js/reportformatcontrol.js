var rfc;
var ReportFormatControl= Class.create();
ReportFormatControl.prototype = {
		initialize : function() {
			this.id;
			this.tbname;
			this.name;
			this.command="";
		},
		
		_load : function(id,tbname,name,command){
			this.id=id;
			this.tbname=tbname;
			this.name=name;
			this.command=command;
			var trans = {
					id: 1,
					command: rfc.command,
					params: {
						cmd: "RptDef",
						type: "getRptmeasureColumnDef",
						id:id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					rfc._drawhtml(response.data[0].result);
				});
		},
		_drawhtml : function(result){
			if(result.def.fmt!=undefined){
				jQuery(".format select option[value='"+result.def.fmt+"']").attr("selected","selected");
			}
			if(result.def.pattern!=undefined){
				jQuery(".count select option[value='"+result.def.pattern+"']").attr("selected","selected");
			}
		},
		
		_saveRptmeasureColumnDef : function(){
			var trans = {
					id: 1,
					command: rfc.command,
					params: {
						cmd: "RptDef",
						type: "saveRptmeasureColumnDef",
						def:{
							fmt:jQuery(".format select").find("option:selected").val(),
							pattern:jQuery(".count select").find("option:selected").val()
					},
						id:rfc.id,
						name:rfc.name,
						tbname:rfc.tbname
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					rfc._load(rfc.id,rfc.tbname,rfc.name,rfc.command);
				});
		}
};
ReportFormatControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	rfc = new ReportFormatControl();
};
jQuery(document).ready(ReportFormatControl.main);