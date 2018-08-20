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
	<link type="text/css" href="css/reportc5.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="js/prototype.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.min.js?t=<%=date %>"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery-ui.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.touch-punch.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.shapeshift.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/reportc5control.js?t=<%=date %>"></script>
</head>
<body>
	<div class="container">
		<!--纵轴-->
		<div class="colname">累进特殊字段定义 - <span><%=name %></span></div>
		<div class="dim">
			<span>维度</span>
		</div>
		<!--度量-->
		<div class="metric" style="margin-top:22px;">
			<span>度量</span>
		</div>
		<div class="formula">
			<div class="header">累进定义</div>
			<div class="content">
				<div class="param-a">字段：<span class="coln-a"></span></div>
				<div class="param-b">层级：<span class="coln-b"></span></div>
				<div class="layout">格式显示：<select><option value="no">请选择</option><option value="$0,0.00">$0,000.00</option><option value="￥0,0.00">￥0,000.00</option><option value="0,000">0,000</option><option value="￥0.00/10000">万元</option><option value="0.0%">0.00%</option></select></div>
				<!--提交按钮-->
				<div class="submit">
					<button onclick="window.location.replace('rptconfig.jsp?name=<%=tbname%>')">返回</button><button onclick="rc5._saveRptSpecialColumnDef()">保存</button>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rc5._load(<%=id%>,'<%=cmd%>');
		});
	</script>
</body>
</html>