<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %> 
<%
  	String date = String.valueOf(new Date().getTime());
	String id = request.getParameter("id");
	String tbname = request.getParameter("tbname");
	String name = request.getParameter("name");
	String cmd=ConfigValues.get("report.cmd", "com.agilecontrol.fair.FairCmd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<title>表配置页面</title>
	<link type="text/css" href="css/share.css?t=<%=date %>" rel="StyleSheet"/>
	<link type="text/css" href="css/reportc2.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="js/prototype.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.min.js?t=<%=date %>"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery-ui.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.touch-punch.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.shapeshift.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/reportc2control.js?t=<%=date %>"></script>
</head>
<body>
	<div class="container">
		<!--纵轴-->
		<div class="colname">特殊字段定义 - <span><%=name %></span></div>
		<div class="fields">
			<span>字段</span>
		</div>
		<div class="sumfileds">
			<span>合计字段</span>
		</div>
		<div class="trash">
			
		</div>
	</div>
	<!--提交按钮-->
	<div class="submit">
		<button onclick="window.location.replace('rptconfig.jsp?name=<%=tbname%>')">返回</button><button onclick="rc2._saveRptSpecialColumnDef()">保存</button>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rc2._load(<%=id%>,'<%=cmd%>');
		});
	</script>
</body>
</html>