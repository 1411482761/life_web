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
	<link type="text/css" href="/fair/ipad/grid/css/share.css?t=<%=date %>" rel="StyleSheet"/>
	<link type="text/css" href="/fair/ipad/grid/css/reportc6.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="/fair/ipad/js/prototype.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/jquery.min.js?t=<%=date %>"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="/nea/core/js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/jquery-ui.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/jquery.touch-punch.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/jquery.shapeshift.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/reportc6control.js?t=<%=date %>"></script>
</head>
<body>
	<div class="container">
		<!--纵轴-->
		<div class="colname">图片设置 - <span><%=name %></span></div>
		<div class="dim">
			<span>字段</span>
		</div>
		<div class="formula">
			<div class="header">图片定义</div>
			<div class="content">
				<div class="param-a">参数a：<span class="coln-a"></span></div>
				<!--提交按钮-->
				<div class="submit">
					<button onclick="window.location.replace('/fair/ipad/grid/rptconfig.jsp?name=<%=tbname%>')">返回</button><button onclick="rc6._saveRptSpecialColumnDef()">保存</button>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rc6._load(<%=id%>,'<%=cmd%>');
		});
	</script>
</body>
</html>