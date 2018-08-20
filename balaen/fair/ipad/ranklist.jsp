<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page import="com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %>
<%@ taglib uri="http://java.fckeditor.net" prefix="FCK" %>
<%@ page import="java.util.*" %>
<%
UserWebImpl userWeb =null;
Locale locale=null;
int userId=0;
try{
	userWeb= ((UserWebImpl)WebUtils.getSessionContextManager(session).getActor(WebKeys.USER));
	userId=userWeb.getUserId();
}catch(Throwable userWebException){
}
 String date = String.valueOf(new Date().getTime());
 int time = ConfigValues.get("fair.ranklist.refresh.interval", 1);
 int exchange_time = ConfigValues.get("fair.ranklist.exchange.interval", 1);
 int fairid = Integer.parseInt(request.getParameter("fairid"));
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache"> 
<meta http-equiv="Expires" content= "0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<link rel="stylesheet" href="/fair/ipad/css/common/ranklist.css?=<%=date%>" type="text/css" media="screen" title="no title" charset="utf-8">
<script type="text/javascript" src="/fair/ipad/js/prototype.js?t=<%=date%>"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js?t=<%=date%>"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js?t=<%=date%>"></script>
<script type="text/javascript" src="/fair/ipad/js/runsql.js?t=<%=date%>"></script>
<script type="text/javascript" src="/fair/ipad/js/rlistcontrol.js?t=<%=date%>"></script>
<title>Balanced Order - Lifecycle RCP</title>
</head>
<body>

	<div class="container">
		<div id="select" >
			<label>当前排行：</label>
			<select id='select_option' onchange="rlist.rank_change()" style="width:100px;">
			</select>
			<input type="checkbox" name="change_ischeck" id="change_ischeck"  checked="checked" onclick="rlist.ischeck()"/>自动切换<br>
		</div>
		<div id="listdiv">
			<ul>
			</ul>
		</div>
	</div>
</body>
<script type="text/javascript">
		jQuery(document).ready(function(){
			jQuery(".container").height(window.screen.availHeight);
			rlist.load(<%=userId%>,<%=time%>,<%=exchange_time%>,<%=fairid%>,0);
		});
	</script>
</html>