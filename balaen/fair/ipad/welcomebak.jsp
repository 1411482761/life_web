<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 <%@ page import="java.util.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<% String sessionkey = request.getParameter("sessionkey"); 
	String date = String.valueOf(new Date().getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache"> 
<meta http-equiv="Expires" content= "0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<link rel="stylesheet" href="/fair/ipad/css/common/welcome.css?t=<%=date %>" type="text/css" media="screen" title="no title" charset="utf-8">
<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/js/welcomecontrol.js?t=<%=date %>" charset='utf-8'></script>
<script language="javascript" src="/nea/core/js/rest.js"></script>
<title>Balanced Order - Lifecycle RCP</title>
</head>
<body>
	<div id="container">
    <div id="manual" onclick="window.location.replace('http://pdf.fair.app#')"></div>
	<div id="content"></div>
	</div>
	<div id="bg"></div>
	<div id="changePwd">
		<table align="center" border="0" cellpadding="1" cellspacing="1">
		<tr><td height="100" align="right" id="namedesc"></td>
		<td nowrap height="100" id="username">&nbsp;&nbsp;</td>
		</tr>
		<tr><td height="100" width="40%" nowrap align="right" id="pwd1"></td>
	    <td height="100" width="60%" align="left"><input type='password'  id='oldpassword' value=''></td>
	    </tr>
	    <tr><td height="100" width="40%" nowrap align="right" id="pwd2"></td>
	    <td height="100" width="60%" align="left"><input type='password'  id='password1' value=''></td>
	    </tr>
	    <tr><td height="100" width="40%" nowrap align="right" id="pwd3"></td>
	    <td height="100" width="60%" align="left"><input type='password' id='password2' value=''></td>
	    </tr>
	 </table>
	    
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			wc.onLoad('<%=sessionkey%>');
		});
	</script>
</body>
</html>