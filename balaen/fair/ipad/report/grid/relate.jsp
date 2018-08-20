<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %> 
<%
	String tbname = request.getParameter("tbname");
  	String date = String.valueOf(new Date().getTime());
  	 String cmd=ConfigValues.get("report.cmd", "com.agilecontrol.fair.FairCmd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<title>表配置页面</title>
	<link type="text/css" href="css/relate.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="js/prototype.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.min.js?t=<%=date %>"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/relatecontrol.js?t=<%=date %>"></script>
</head>
<body>
	<div id="top" class="button">
		<button onclick="relc._setMainTable()">设为主表</button>
	</div>
	<div id="middle">
		<div id="tables" class=""></div>
		<div id="columnstree" class="ztree"></div>
		<div class="mdiv">
			<button onclick="relc._addCol(1)">></button>
			<div class="relatecols col1"><span>字段一</span></div>
			<button onclick="relc._addCol(2)">></button>
			<div class="relatecols col2"><span>字段二</span></div>
		</div>
		<div class="build">
			<button onclick="relc._buildrelation()">></button>
			<button onclick="relc._removerelation()"><</button>
		</div>
		<div id="relationcolumns">
			<ul></ul>
		</div>
	</div>
	<div id="bottom" class="button">
			<button onclick="window.location.replace('rptconfig.jsp?name=<%=tbname%>')">返回</button>
			<button onclick="relc._saverelations()">保存</button>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			relc._load('<%=tbname%>','<%=cmd%>');
		});
	</script>
</body>
</html>