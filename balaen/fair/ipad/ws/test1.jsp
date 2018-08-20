<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>Hello World!</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Pragma" content="no-cache" />
<script language="javascript" src="/nea/core/js/prototype.js"></script>
<script language="javascript" src="/nea/core/js/jquery/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js"></script>

</head>
<body>
	<div id="main">
		<input id="genImg" type="button" value="GenImg"/>
		<p id="result"></p>
		<script type="text/javascript">
			jQuery(document).ready(function() {
				portalClient = new PortalClient();
				portalClient.init(null, null, "/servlets/binserv/Fair");
				jQuery("#genImg").click(function() {
					var req = {
						id : 1,
						command : "com.agilecontrol.fair.MiscCmd",
						params : {
							cmd : "Test2"
						}
					}
					portalClient.sendOneRequest(req, function(response) {
// 						jQuery("#result").html("表S_ORG_UNIT插入 "+response.data[0].result.unit+"数据<br>");
// 						jQuery("#result").append("表S_ORG_POSITION插入 "+response.data[0].result.position+"数据<br>");
// 						jQuery("#result").append("表S_ORG_STAFF插入 "+response.data[0].result.staff+"数据<br>");
// 						jQuery("#result").append("表S_STAFFBRIEF插入 "+response.data[0].result.staffbrief+"数据");
					})
				});
			});
		</script>
	</div>
</body>
</html>