<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
  	String date = String.valueOf(new Date().getTime());
	String themeStyle = ConfigValues.get("fair.theme.style", "01");
  	String id = request.getParameter("id");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache"> 
<meta http-equiv="Expires" content= "0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="white" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0">

<link rel="apple-touch-icon" href="/fair/ipad/images/station.png?t=<%=date %>"/>
<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js"></script>

<script type="text/javascript" src="/fair/ipad/objext/js/objectcontrol.js?t=<%=date %>"></script>
</head>
<body>
	<div id="container">
		<table>
			<tr id="header">
				<td>规格名称</td>
				<td>规格参数</td>
			</tr>
		</table>
	</div>
<script type="text/javascript">
jQuery(document).ready(function(){
	objectcontr.draw('<%=id %>');
	objectcontr.adaptation(<%=themeStyle %>);
});
</script>
</body>
</html>