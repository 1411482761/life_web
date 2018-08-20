var gcc;
var comperesControl = Class.create();

comperesControl.prototype = {
   initialize :function() {
	   
   },
   
	load : function() {
		var trans = {
			id : 1,
			command : "com.agilecontrol.fair.FairCmd",
			params : {
				cmd : "getComperes",
			}
		};
		portalClient.sendOneRequest(trans, function(response)
		{
			var data = response.data[0].result;
			var comperes = data.comperes;
			var follow_id = data.follow_id;
			for (var c=0;c<comperes.length;c++) {
		       	var html="";
				if (comperes[c].id == follow_id)
				     html = "<tr><td style='display:none'>"+ comperes[c].id+ "</td><td height='100' width='40%' nowrap align='right'>"+ comperes[c].name+ "</td><td height='100' width='50%' align='left'><input type='checkbox'  checked='checked' ></td></tr>";
				else
				     html = "<tr><td style='display:none'>"+ comperes[c].id+ "</td><td height='100' width='40%' nowrap align='right'>"+ comperes[c].name+ "</td><td height='100' width='50%' align='left'><input type='checkbox'  ></td></tr>";
				jQuery("#tb").append(html);

			};
		});

	},

	setCompere : function() {
		var follow;
		var cnt = 0;
		jQuery("table tr").each(function(i) {
			var checked = jQuery(this).children("td:eq(2)").find("input").prop('checked');
			console.log(jQuery(this).children("td:eq(2) ").find("input"));
			console.log(checked);
			if (checked == true) {
				follow = jQuery(this).children("td:eq(0)").text();
				cnt = parseInt(cnt)+1;
				
			}
		});
		if (cnt == 0){
			alert('请选择一个主讲人');
			return;
		}
		else if(cnt>1){
			alert('只能选择一个主讲人');
			return;
		}
		else {
			var trans = {
				id : 1,
				command : "com.agilecontrol.fair.FairCmd",
				params : {
					cmd : "setCompere",
					follow : follow
				}
			};
			portalClient.sendOneRequest(trans, function(response)
			{
				var message = response.data[0].message;
				alert(message);

			});
		}

	}

};

comperesControl.main = function() {
	portalClient = new PortalClient();
	portalClient.setLoadingDiv("loadingZone");
	portalClient.init(null, null, "/servlets/binserv/Request");
	gcc = new comperesControl();
	//gcc.adaptation();
};
jQuery(document).ready(comperesControl.main);