<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page import="com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %>
<%@ taglib uri="http://java.fckeditor.net" prefix="FCK" %>
<%@ page import="java.util.*" %>
<%
 String date = String.valueOf(new Date().getTime());
%>
<% 
	String from = request.getParameter("from");
	if(Validator.isNull(from)){
		from="local";
	}
	System.out.println(from);
	int style = ConfigValues.get("fair.about.style", 1);
   if(style==2){
	 request.getRequestDispatcher("/fair/ipad/about02.jsp").forward(request,response);;
	 return;
	 }else if(style==3){
		 request.getRequestDispatcher("/fair/ipad/changepassword.jsp").forward(request,response);;
		 return;
	 }
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
<script type="text/javascript" src="/fair/ipad/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/js/noticecontrol.js?t=<%=date%>"></script>
<title>Balanced Order - Lifecycle RCP</title>
</head>
<body>
	<!-- <div  id='back'  onclick="window.location.replace('/fair/ipad/suggest.jsp')" style="display:none;padding-top:20px;">返回</div> -->
	<div id="container">
		<div id="title">NEWS</div>
		<div id="message"></div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			nc.onLoad('<%=from%>');
			nc.adaptation();
		});
	</script>
</body>
</html>