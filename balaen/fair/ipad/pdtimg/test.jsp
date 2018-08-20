<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>Hello World!</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Pragma" content="no-cache" />
<script type="text/javascript" src="/nea/core/js/prototype.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery-1.3.2.min.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script type="text/javascript" src="/nea/core/js/rest.js"></script>
</head>
<body>
	<div id="main">
		<input id="genImg" type="button" value="GenImg"/>
		<input id="impImg" type="button" value="ImpImg"/>
		<input id="check" type="button" value="Check"/>
		<input id="parse" type="button" value="ParseImages"/>
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
							cmd : "Test"
						}
					}
					portalClient.sendOneRequest(req, function(response) {
						alert("Complete");
					})
				});
				jQuery("#impImg").click(function() {
					var req = {
						id : 1,
						command : "com.agilecontrol.fair.MiscCmd",
						params : {
							cmd : "ProductImageGens",
							method : "impTestImages",
							param : {}
						}
					}
					portalClient.sendOneRequest(req, function(response) {
						alert("Complete");
					})
				});
				jQuery("#check").click(function() {
					var req = {
						id : 1,
						command : "com.agilecontrol.fair.MiscCmd",
						params : {
							cmd : "ProductImageGens",
							method : "checkProgress",
							param : {}
						}
					}
					portalClient.sendOneRequest(req, function(response) {
						jQuery("#result").html(response.data[0].result);
					})
				});
				jQuery("#parse").click(function() {
					var req = {
						id : 1,
						command : "com.agilecontrol.fair.MiscCmd",
						params : {
							cmd : "ProductImageGens",
							method : "parseImages",
							param : {
								fileName: "",
								modified: 0,
								isUpperCase: true
							}
						}
					}
					portalClient.sendOneRequest(req, function(response) {
						jQuery("#result").html(response.data[0].result);
					})
				});
			});
		</script>
	</div>
</body>
</html>