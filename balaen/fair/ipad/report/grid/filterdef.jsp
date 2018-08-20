<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %> 
<%
  	String date = String.valueOf(new Date().getTime());
	String tbname = request.getParameter("tbname");
	String cmd=ConfigValues.get("report.cmd", "com.agilecontrol.fair.FairCmd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<title>表配置页面</title>
	<link type="text/css" href="css/share.css?t=<%=date %>" rel="StyleSheet"/>
	<link type="text/css" href="css/reportfilter.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="js/prototype.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.min.js?t=<%=date %>"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/reportfiltercontrol.js?t=<%=date %>"></script>
</head>
<body>
	<div class="container">
		<div class="configure">
			<p class="authority ">买手过滤：</p>
			<textarea rows="2" cols="20" placeholder="可以通过输入SQL设定过滤条件" class='filter buyerfilter'></textarea>
			<p class="authority">商品过滤：</p>
			<textarea rows="2" cols="20" placeholder="可以通过输入SQL设定过滤条件" class='filter pdtfilter'></textarea>
		</div>
	</div>
	<div class="submit">
			<button onclick="window.location.replace('rptconfig.jsp?name=<%=tbname%>')">返回</button>
			<button onclick="rfc._savefilter()">保存</button>
			<button onclick="rfc._clearfilter()">重置</button>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rfc._load('<%=tbname%>','<%=cmd%>');
		});
	</script>
</body>
</html>