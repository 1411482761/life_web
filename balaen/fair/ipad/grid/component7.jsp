<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %>  
<%
   String date = String.valueOf(new Date().getTime());
	String id = request.getParameter("id");
	String tbname = request.getParameter("tbname");
	String name = request.getParameter("dbname");
	String cmd=ConfigValues.get("report.cmd", "com.agilecontrol.fair.FairCmd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<title>表配置页面</title>
	<link type="text/css" href="/fair/ipad/grid/css/share.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="/fair/ipad/js/prototype.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/jquery.min.js?t=<%=date %>"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="/nea/core/js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/reportc7control.js?t=<%=date %>"></script>
	<link type="text/css" href="/fair/ipad/grid/css/reportc7.css?t=<%=date %>" rel="StyleSheet"/>
</head>
<body>
	<!--度量定义-->
	<div class="colname">跳转报表定义</span></div>
	<div class="metric">
		<span>选择跳转报表</span>
		<div class="format" style="top:90px;">报表名字：<select></select></div>
	</div>
	<!--提交按钮-->
	<div class="submit">
		<button onclick="window.location.replace('/fair/ipad/grid/rptconfig.jsp?name=<%=tbname%>')">返回</button><button onclick="rc7._saveRptmeasureColumnDef()">保存</button>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rc7._load(<%=id%>,'<%=tbname%>','<%=name%>','<%=cmd%>');
		});
	</script>
</body>
</html>