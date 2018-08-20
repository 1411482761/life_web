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
		<input type="text" id="name" value="Kitty"/>
		<a id="hello" href="#">sayHello</a>
		<div id="out"></div>
		<script type="text/javascript">
			jQuery(document).ready(function() {
				jQuery("#hello").click(function() {
					portalClient = new PortalClient();
					portalClient.init(null, null, "/servlets/binserv/Fair");
					var req = {
						id : 1,
						command : "com.agilecontrol.fair.MiscCmd",
						params : {
							cmd : "ProductImages",
							method : "sayHello",
							param : {
								name : jQuery("#name").val()
							}
						}
					}
					portalClient.sendOneRequest(req, function(response) {
						jQuery("#out").html(response.data[0].result.msg);
					})
				});
			});
		</script>
	</div>
</body>
</html>