var view005c;
var View005Control = Class.create();
View005Control.prototype = {
	/**
	 * Description : to define parameters.
	 * 
	 * @type private
	 * */
	initialize : function() {
		this.trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			"nds.control.ejb.UserTransaction": "N",
			params:{
				cmd: "LoadRpt",
				"nds.control.ejb.UserTransaction": "N",
				sessionkey: rc.sessionkey,
				view: "view005",
				viewchain: null
			}
		};
	},
	
	/**
	 * Description : to activate the report.
	 * 
	 * @type public
	 * 
	 * @param report -String
	 * 	the name of the report.
	 * */
	getActived : function(report,index){
		jQuery("#views").show();
		jQuery("#views-loading").show();
		var template="";
		if(rc.rptviews[index].template!=undefined) template=rc.rptviews[index].template;
		if(template!="") this.trans.params.template = template;
		this.trans.params.viewchain = [report];
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result.data;
//			var javaData = {
//					title: "马克华菲 - HTML报表",
//					pdfurl: "/develop/d....."
//			};
			if(javaData.pdfurl != undefined && javaData.pdfurl != null){
				jQuery("#views").hide();
				jQuery("#views-loading").hide();
				window.location = "http://pdf.fair.app/#"+javaData.pdfurl;
			}
			else
				alert("缺少 response.data[0].result.pdfurl");
		});
	}
};
View005Control.main = function(){
	view005c=new View005Control();
};
jQuery(document).ready(View005Control.main);