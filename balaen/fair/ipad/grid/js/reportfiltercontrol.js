var rfc;
var ReportFilterControl= Class.create();
ReportFilterControl.prototype = {
		initialize : function() {
			this.init();
			this.command="";
		},
		init : function(){
			this.tname="";
		},
		_load : function(name,command){
			this.tname=name;
			this.command=command;
			var trans = {
					id: 1,
					command: rfc.command,
					params: {
						cmd: "RptDef",
						type: "GetRptFilter",
						name:rfc.tname
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData=response.data[0].result;
					rfc._drawHtml(javaData);
				});
		},
		_drawHtml : function(javaData){
			if(javaData.filter!=undefined&&javaData.filter.length>0){
				var filter=javaData.filter;
				for(var i=0;i<filter.length;i++){
					if(filter[i].table_name=="B_FUNIT"){
						jQuery(".buyerfilter").val(filter[i].table_filter);
					}else if(filter[i].table_name=="M_PRODUCT"){
						jQuery(".pdtfilter").val(filter[i].table_filter);
					}else{
						alert("过滤条件不支持"+filter[i].table_name);
					}
				}
			}
		},
		_savefilter : function(){
			var buyfilter=jQuery(".buyerfilter").val();
			var pdtfilter=jQuery(".pdtfilter").val();
			var trans = {
					id: 1,
					command: rfc.command,
					params: {
						cmd: "RptDef",
						type: "SaveRptFilter",
						buyfilter:buyfilter,
						pdtfilter:pdtfilter,
						name:rfc.tname
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
				});
		},
		_clearfilter : function(){
			jQuery(".filter").val("");
		}
};
ReportFilterControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	rfc = new ReportFilterControl();
};
jQuery(document).ready(ReportFilterControl.main);