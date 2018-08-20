portalClient = new PortalClient();
portalClient.init(null,null,"/servlets/binserv/Fair");	
var sql = "";
var exp = "";
function selectFunit(){
		var toggle_url = "";
		//updateCondition is global function
		var table_id = "B_FUNIT";
		toggle_url="/nea/core/query/search.jsp?table="+table_id+"&return_type=a&accepter_id=updateCondition";

		oq.toggle_m(toggle_url,"updateCondition");
	}
	function updateCondition(filter){
		jQuery("#funitId").attr('value',filter.description);
		jQuery("#funitId").attr('readonly',true);

		jQuery("#funit_exp").attr('value',filter.expression);
		jQuery("#funit_sql").attr('value',filter.sql);
		sql = filter.sql;
		exp = filter.expression;
	}
	function getSessionKey(){
		var req = {
				id : 1,
				command : "com.agilecontrol.fair.MiscCmd",
				params : {
					cmd : "TestRptView",
					funit_sql : sql
				}
			};
			portalClient.sendOneRequest(req, function(response) {
				console.log(response);
				var session_ = response.data[0].result;
				window.location.href="/fair/ipad/kpi.jsp?sessionkey=" + session_;
			
			});
	}


